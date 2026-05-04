import { Router } from 'express';
import {
  requestPasswordReset,
  verifyResetToken,
  resetPassword
} from '../controllers/password-reset.controller';

const router = Router();

// POST /api/password-reset/request - Solicitar reset de senha
router.post('/request', requestPasswordReset);

// GET /api/password-reset/verify/:token - Verificar se token é válido
router.get('/verify/:token', verifyResetToken);

// POST /api/password-reset/reset - Resetar senha
router.post('/reset', resetPassword);

export default router;
