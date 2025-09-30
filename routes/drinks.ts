import { Router } from 'express';
import { postDrinkOrderController } from '../../controllers/drinksController.js';
import { incrementDrinkTotalController} from '../../controllers/drinksAmountController.js';

const router = Router();

router.post('/order-drink', postDrinkOrderController);
router.put('/beverages/:drinkType/increment', incrementDrinkTotalController);

export default router;