import { Router } from 'express';
import {
  checkEmail,
  sendVerificationCode,
  verifyCode,
  resendCode,
} from '../controllers/email-verification.controller';

const router = Router();

// Verificar se email é válido
router.post('/check-email', checkEmail);

// Enviar código de verificação
router.post('/send-code', sendVerificationCode);

// Verificar código
router.post('/verify-code', verifyCode);

// Reenviar código
router.post('/resend-code', resendCode);

export default router;
