import { Router } from 'express';
import { register, login, me, verifyEmail } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.get('/me', authMiddleware, me);

export default router;
