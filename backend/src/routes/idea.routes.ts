import { Router } from 'express';
import * as ideaController from '../controllers/idea.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(authMiddleware);

// CRUD básico
router.post('/', ideaController.createIdea);
router.get('/', ideaController.getIdeas);
router.get('/favorites', ideaController.getFavorites);
router.get('/:id', ideaController.getIdeaById);
router.put('/:id', ideaController.updateIdea);
router.delete('/:id', ideaController.deleteIdea);

// Ações específicas
router.post('/:id/favorite', ideaController.toggleFavorite);
router.post('/:id/expand', ideaController.expandIdea);

export default router;
