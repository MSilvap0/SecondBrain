import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getUserSettings,
  updateUserSettings,
  trackAIUsage
} from '../controllers/user-settings.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /api/user/settings - Retorna todas as configurações e uso
router.get('/settings', getUserSettings);

// PUT /api/user/settings - Atualiza configurações
router.put('/settings', updateUserSettings);

// POST /api/user/track-ai-usage - Incrementa contadores de uso
router.post('/track-ai-usage', trackAIUsage);

export default router;
