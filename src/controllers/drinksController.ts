import { Request, Response } from "express";
import { enoughIngredients, postDrinkOrderJSON } from "../services/drinkService.js";
import { productionQueue } from "../config/redis.js";

export const postDrinkOrderController = async (req: Request, res: Response) => {
  const orderData = req.body;
  await enoughIngredients(orderData);
  await postDrinkOrderJSON(orderData);
  await productionQueue.add('process_order', orderData);
  res.status(200).json({ message: 'Pedido de bebida procesado correctamente' });
};