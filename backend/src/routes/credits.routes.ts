import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  purchaseCredits,
  getCreditPackages
} from '../controllers/credits.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /api/credits/packages - Listar pacotes disponíveis
router.get('/packages', getCreditPackages);

// POST /api/credits/purchase - Comprar créditos
router.post('/purchase', purchaseCredits);

export default router;
