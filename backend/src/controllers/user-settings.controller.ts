import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';

// Definir limites por plano
const PLAN_LIMITS = {
  free: {
    ideasLimit: 10,
    tokensLimit: 100000,
    chatMessagesLimit: 50,
    name: 'Free',
    price: 0
  },
  pro: {
    ideasLimit: -1, // -1 = unlimited
    tokensLimit: 3000000, // 3 milhões
    chatMessagesLimit: -1, // unlimited
    name: 'Pro',
    price: 29
  },
  max: {
    ideasLimit: -1, // unlimited
    tokensLimit: 20000000, // 20 milhões
    chatMessagesLimit: -1, // unlimited
    name: 'Max',
    price: 70
  },
  enterprise: {
    ideasLimit: -1,
    tokensLimit: -1, // unlimited
    chatMessagesLimit: -1,
    name: 'Enterprise',
    price: 99
  }
};

// GET /api/user/settings - Retorna todas as configurações e uso do usuário
export const getUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Buscar usuário com todas as informações
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        planExpiresAt: true,
        ideasLimit: true,
        ideasCount: true,
        aiRequestsCount: true,
        aiTokensUsed: true,
        aiTokensLimit: true,
        chatMessagesCount: true,
        usageResetAt: true,
        createdAt: true,
        hasCompletedOnboarding: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar se precisa resetar o uso mensal
    const now = new Date();
    const resetDate = new Date(user.usageResetAt);
    const daysSinceReset = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24));

    // Se passou 30 dias, resetar contadores
    if (daysSinceReset >= 30) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          aiRequestsCount: 0,
          aiTokensUsed: 0,
          chatMessagesCount: 0,
          ideasCount: 0,
          usageResetAt: now
        }
      });

      // Atualizar objeto user
      user.aiRequestsCount = 0;
      user.aiTokensUsed = 0;
      user.chatMessagesCount = 0;
      user.ideasCount = 0;
      user.usageResetAt = now;
    }

    // Calcular próximo reset (30 dias após o último reset)
    const nextReset = new Date(user.usageResetAt);
    nextReset.setDate(nextReset.getDate() + 30);

    // Pegar limites do plano atual
    const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

    // Se usuário comprou créditos extras, usar o maior valor
    const tokensLimit = user.aiTokensLimit > planLimits.tokensLimit ? user.aiTokensLimit : planLimits.tokensLimit;

    // Contar ideias expandidas (que usaram IA)
    const ideasExpanded = await prisma.idea.count({
      where: {
        userId: userId,
        expandedContent: { not: null }
      }
    });

    // Preparar resposta
    const response = {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      },
      plan: {
        currentPlan: user.plan,
        planName: planLimits.name,
        planExpiresAt: user.planExpiresAt,
        ideasLimit: planLimits.ideasLimit,
        ideasCount: user.ideasCount,
        tokensLimit: tokensLimit // Usar o limite efetivo (com créditos extras ou anual)
      },
      aiUsage: {
        totalRequests: user.aiRequestsCount,
        tokensUsed: user.aiTokensUsed,
        tokensLimit: tokensLimit,
        ideasExpanded: ideasExpanded,
        chatMessages: user.chatMessagesCount,
        chatMessagesLimit: planLimits.chatMessagesLimit,
        lastReset: user.usageResetAt,
        nextReset: nextReset
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get user settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/user/settings - Atualiza configurações do usuário
export const updateUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validações
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(email && { email: email.toLowerCase().trim() })
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    res.json({
      message: 'Settings updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/user/track-ai-usage - Incrementa contadores de uso da IA
export const trackAIUsage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { type, tokens } = req.body; // type: 'request' | 'chat' | 'idea'

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        aiTokensUsed: true,
        aiTokensLimit: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar limite de tokens (se não for unlimited)
    const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
    
    if (planLimits.tokensLimit !== -1) {
      if (user.aiTokensUsed >= planLimits.tokensLimit) {
        return res.status(429).json({ 
          error: 'Token limit reached',
          message: 'Você atingiu o limite de tokens do seu plano. Faça upgrade para continuar.'
        });
      }
    }

    // Incrementar contadores
    const updateData: any = {
      aiRequestsCount: { increment: 1 }
    };

    if (tokens) {
      updateData.aiTokensUsed = { increment: tokens };
    }

    if (type === 'chat') {
      updateData.chatMessagesCount = { increment: 1 };
    }

    if (type === 'idea') {
      updateData.ideasCount = { increment: 1 };
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    res.json({ message: 'Usage tracked successfully' });
  } catch (error) {
    console.error('Track AI usage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
