import { Router } from 'express';
import PointController from './app/controllers/PointController';
import ItemController from './app/controllers/ItemController';

const router = Router();

router.get('/points', PointController.index);
router.get('/points/:id', PointController.show);
router.post('/points', PointController.store);

router.get('/items', ItemController.index);
router.get('/items/:id', ItemController.show);
router.post('/items', ItemController.store);

export default router;
