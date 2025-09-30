// Utiliza Redis Strings para llevar la cuenta de la 
// cantidad total de cada tipo de bebida.
import client from "../config/redis.js";
import { ApiError } from "../../utils/ApiError.js";

export async function incrementByDrinkTotal(drinkType: string, amount: number) {
    if (!drinkType) {
      throw new ApiError('Tipo de bebida inválido', 400);
    }
    await client.incrBy(drinkType, amount);
}
