import { Router } from 'express';
import authRoutes from './auth.routes';
import aiRoutes from './ai.routes';
import userRoutes from './user.routes';
import receiptRoutes from './receipt.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/user', userRoutes);
router.use('/receipt', receiptRoutes);

export default router;
