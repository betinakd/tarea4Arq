import { Router, Request, Response, NextFunction } from 'express';
import { addIngredient, setRandomIngredient } from '../services/ingredientService.js';
import { Ingredient } from '../models/ingredient.js';

const router = Router();

export const addIngredientController = async (req: Request, res: Response, next: NextFunction) => {
    const ingredient: Ingredient = req.body;
    await addIngredient(ingredient);
    res.status(201).json({ 
      success: true, 
      message: 'Ingrediente agregado exitosamente' 
    });
}

export const setRandomIngredientController = async (req: Request, res: Response, next: NextFunction) => {
    await setRandomIngredient();
    res.status(200).json({ 
      success: true, 
      message: 'Ingredientes por defecto configurados' 
    });
}

export default router;