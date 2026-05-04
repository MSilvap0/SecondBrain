import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Debug API - verificar status sem autenticação
router.get('/debug/status', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.json({
        authenticated: false,
        message: 'No token provided',
        hint: 'Add Authorization header with Bearer token'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          planExpiresAt: true,
          ideasLimit: true,
          ideasCount: true,
          hasCompletedOnboarding: true,
          emailVerified: true,
        },
      });

      if (!user) {
        return res.json({
          authenticated: true,
          userFound: false,
          message: 'Token valid but user not found',
          userId: decoded.userId
        });
      }

      return res.json({
        authenticated: true,
        userFound: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          planExpiresAt: user.planExpiresAt,
          ideasLimit: user.ideasLimit,
          ideasCount: user.ideasCount,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          emailVerified: user.emailVerified,
        }
      });
    } catch (jwtError) {
      return res.json({
        authenticated: false,
        message: 'Invalid token',
        error: jwtError.message
      });
    }
  } catch (error) {
    console.error('Erro no debug status:', error);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

// Get user plan information
router.get('/plan', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        planExpiresAt: true,
        ideasLimit: true,
        ideasCount: true,
        hasCompletedOnboarding: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    res.status(500).json({ error: 'Erro ao buscar informações do plano' });
  }
});

// Update user plan (admin only - implementar autenticação admin depois)
router.post('/plan/update', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { plan, planExpiresAt } = req.body;

    console.log('POST /api/user/plan/update - userId:', userId, 'plan:', plan);

    // Definir limites baseado no plano
    let ideasLimit = 10; // free
    if (plan === 'pro') ideasLimit = 999999; // ilimitado
    if (plan === 'enterprise') ideasLimit = 999999; // ilimitado

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        planExpiresAt: planExpiresAt ? new Date(planExpiresAt) : null,
        ideasLimit,
        hasCompletedOnboarding: true, // Marca que completou o onboarding
      },
      select: {
        plan: true,
        planExpiresAt: true,
        ideasLimit: true,
        hasCompletedOnboarding: true,
      },
    });

    console.log('Plano atualizado com sucesso:', user);

    // Determinar para onde redirecionar
    let redirectPath = '/dashboard';
    if (plan === 'pro') {
      redirectPath = '/pricing?selected=pro';
    } else if (plan === 'enterprise') {
      redirectPath = '/pricing?selected=enterprise';
    }

    res.json({
      user,
      redirectPath,
      message: `Plano ${plan} selecionado com sucesso`
    });
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ error: 'Erro ao atualizar plano' });
  }
});

export default router;
