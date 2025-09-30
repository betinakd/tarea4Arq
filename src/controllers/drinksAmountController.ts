import { Router, Request, Response, NextFunction } from 'express';
import {  incrementByDrinkTotal } from '../services/drinkTotalService.js';

const router = Router();

// PUT /beverages/:drinkType/increment - Incrementar total de una bebida
export const incrementDrinkTotalController = async (req: Request, res: Response, next: NextFunction) => {
    const { drinkType } = req.params;
    const { amount } = req.body;
    
    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'Amount debe ser un número' });
    }   
    await incrementByDrinkTotal(drinkType, amount);
    res.status(200).json({ 
      success: true, 
      message: `Total de ${drinkType} incrementado en ${amount}` 
    });
}

export default router;