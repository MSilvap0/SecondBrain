import { Router } from 'express';
import * as tagController from '../controllers/tag.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(authMiddleware);

router.post('/', tagController.createTag);
router.get('/', tagController.getTags);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

export default router;
