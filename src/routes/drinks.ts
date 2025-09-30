import { Router } from 'express';
import { postDrinkOrderController } from '../controllers/drinksController.js';

const router = Router();

router.post('/order-drink', postDrinkOrderController);

export default router;