import { Router } from 'express';
import { addIngredientController, setRandomIngredientController } from '../controllers/ingredientsController.js';

const router = Router();

// POST /ingredients - Agregar un ingrediente
router.post('/ingredients', addIngredientController);

// POST /ingredients/setup - Configurar ingredientes por defecto
router.post('/ingredients-setup', setRandomIngredientController);

export default router;