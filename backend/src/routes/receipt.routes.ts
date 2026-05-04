import { Router } from 'express';
import { sendReceiptEmail } from '../controllers/receipt.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Enviar comprovante de compra por email
router.post('/send', authMiddleware, sendReceiptEmail);

export default router;
