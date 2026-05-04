import { Router } from 'express';
import { classifyIdea, generateTags, generateSummary, expandIdea, processIdea } from '../controllers/ai.controller';
import { chatWithAI } from '../controllers/ai-chat.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(authMiddleware);

router.post('/classify', classifyIdea);
router.post('/tags', generateTags);
router.post('/summary', generateSummary);
router.post('/expand', expandIdea);
router.post('/process', processIdea);
router.post('/chat', chatWithAI);

export default router;
