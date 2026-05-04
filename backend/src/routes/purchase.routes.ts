import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  processCheckout,
  getPurchaseHistory,
  getPurchaseDetails
} from '../controllers/purchase.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// POST /api/purchase/checkout - Processar compra
router.post('/checkout', processCheckout);

// GET /api/purchase/history - Histórico de compras
router.get('/history', getPurchaseHistory);

// GET /api/purchase/:transactionId - Detalhes de uma compra
router.get('/:transactionId', getPurchaseDetails);

export default router;
