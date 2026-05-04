import { Response } from 'express';
import { AuthRequest } from '../types';
import aiService from '../services/ai.service';
import { prisma } from '../config/database';

// Definir limites por plano
const PLAN_LIMITS = {
  free: {
    tokensLimit: 100000
  },
  pro: {
    tokensLimit: 3000000 // 3 milhões
  },
  max: {
    tokensLimit: 20000000 // 20 milhões
  },
  enterprise: {
    tokensLimit: -1 // ilimitado
  }
};

// Função auxiliar para verificar limite de tokens
async function checkTokenLimit(userId: string): Promise<{ allowed: boolean; message?: string; remaining?: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      aiTokensUsed: true,
      aiTokensLimit: true
    }
  });

  if (!user) {
    return { allowed: false, message: 'User not found' };
  }

  // Pegar limite do plano atual
  const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
  const planTokensLimit = planLimits.tokensLimit;

  // Se usuário comprou créditos extras, usar o maior valor
  const effectiveLimit = user.aiTokensLimit > planTokensLimit ? user.aiTokensLimit : planTokensLimit;

  // Se o limite for -1 (ilimitado), sempre permitir
  if (effectiveLimit === -1) {
    return { allowed: true, remaining: -1 };
  }

  // Verificar se atingiu o limite
  if (user.aiTokensUsed >= effectiveLimit) {
    return { 
      allowed: false, 
      message: `Limite de tokens atingido! Você usou ${user.aiTokensUsed.toLocaleString()} de ${effectiveLimit.toLocaleString()} tokens. Faça upgrade do seu plano ou compre mais créditos.`,
      remaining: 0
    };
  }

  const remaining = effectiveLimit - user.aiTokensUsed;
  return { allowed: true, remaining };
}

// Função auxiliar para rastrear uso de tokens
async function trackTokenUsage(userId: string, tokensUsed: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      aiTokensUsed: { increment: tokensUsed },
      aiRequestsCount: { increment: 1 }
    }
  });

  console.log(`📊 Tokens rastreados: ${tokensUsed} tokens para usuário ${userId}`);
}

// Função para estimar tokens (aproximadamente 1 token = 4 caracteres)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export const classifyIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verificar limite de tokens
    const limitCheck = await checkTokenLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(429).json({ 
        error: 'Token limit exceeded',
        message: limitCheck.message,
        remaining: 0
      });
    }

    // Processar com IA
    const result = await aiService.classifyIdea({ content });

    // Estimar tokens usados (input + output)
    const inputTokens = estimateTokens(content);
    const outputTokens = estimateTokens(JSON.stringify(result));
    const totalTokens = inputTokens + outputTokens;

    // Rastrear uso
    await trackTokenUsage(userId, totalTokens);

    // Retornar resultado com informações de uso
    res.json({
      ...result,
      _usage: {
        tokensUsed: totalTokens,
        remaining: limitCheck.remaining === -1 ? -1 : limitCheck.remaining - totalTokens
      }
    });
  } catch (error) {
    console.error('Error in classifyIdea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const generateTags = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verificar limite de tokens
    const limitCheck = await checkTokenLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(429).json({ 
        error: 'Token limit exceeded',
        message: limitCheck.message,
        remaining: 0
      });
    }

    // Processar com IA
    const result = await aiService.generateTags({ content });

    // Estimar tokens usados (input + output)
    const inputTokens = estimateTokens(content);
    const outputTokens = estimateTokens(JSON.stringify(result));
    const totalTokens = inputTokens + outputTokens;

    // Rastrear uso
    await trackTokenUsage(userId, totalTokens);

    // Retornar resultado com informações de uso
    res.json({
      ...result,
      _usage: {
        tokensUsed: totalTokens,
        remaining: limitCheck.remaining === -1 ? -1 : limitCheck.remaining - totalTokens
      }
    });
  } catch (error) {
    console.error('Error in generateTags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const generateSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verificar limite de tokens
    const limitCheck = await checkTokenLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(429).json({ 
        error: 'Token limit exceeded',
        message: limitCheck.message,
        remaining: 0
      });
    }

    // Processar com IA
    const result = await aiService.generateSummary({ content });

    // Estimar tokens usados (input + output)
    const inputTokens = estimateTokens(content);
    const outputTokens = estimateTokens(JSON.stringify(result));
    const totalTokens = inputTokens + outputTokens;

    // Rastrear uso
    await trackTokenUsage(userId, totalTokens);

    // Retornar resultado com informações de uso
    res.json({
      ...result,
      _usage: {
        tokensUsed: totalTokens,
        remaining: limitCheck.remaining === -1 ? -1 : limitCheck.remaining - totalTokens
      }
    });
  } catch (error) {
    console.error('Error in generateSummary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const expandIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verificar limite de tokens
    const limitCheck = await checkTokenLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(429).json({ 
        error: 'Token limit exceeded',
        message: limitCheck.message,
        remaining: 0
      });
    }

    // Processar com IA
    const result = await aiService.expandIdea({ content });

    // Estimar tokens usados (input + output)
    const inputTokens = estimateTokens(content);
    const outputTokens = estimateTokens(JSON.stringify(result));
    const totalTokens = inputTokens + outputTokens;

    // Rastrear uso
    await trackTokenUsage(userId, totalTokens);

    // Retornar resultado com informações de uso
    res.json({
      ...result,
      _usage: {
        tokensUsed: totalTokens,
        remaining: limitCheck.remaining === -1 ? -1 : limitCheck.remaining - totalTokens
      }
    });
  } catch (error) {
    console.error('Error in expandIdea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const processIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verificar limite de tokens
    const limitCheck = await checkTokenLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(429).json({ 
        error: 'Token limit exceeded',
        message: limitCheck.message,
        remaining: 0
      });
    }

    // Processar com IA
    const result = await aiService.processIdea(content);

    // Estimar tokens usados (input + output)
    const inputTokens = estimateTokens(content);
    const outputTokens = estimateTokens(JSON.stringify(result));
    const totalTokens = inputTokens + outputTokens;

    // Rastrear uso
    await trackTokenUsage(userId, totalTokens);

    // Retornar resultado com informações de uso
    res.json({
      ...result,
      _usage: {
        tokensUsed: totalTokens,
        remaining: limitCheck.remaining === -1 ? -1 : limitCheck.remaining - totalTokens
      }
    });
  } catch (error) {
    console.error('Error in processIdea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
