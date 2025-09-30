import client from "../config/redis.js";
import { Ingredient } from "../models/ingredient.js";
import { ApiError } from "../../utils/ApiError.js";

export async function addIngredient(ingredient: Ingredient) {
  if (!ingredient || !ingredient.name || ingredient.amount == null) {
    throw new ApiError('Ingrediente inválido', 400);
  }
  const exists = await client.zAdd("ingredient_inventory", { score: ingredient.amount, value: ingredient.name });
}

export async function setRandomIngredient() {
    await client.zAdd("ingredient_inventory", [
        { score: 100, value: "azucar" },
        { score: 50, value: "cafeina" },
        { score: 30, value: "saborizantes" },
    ]);
}

export const recipes: { [key: string]: { [ingredient: string]: number } } = {
  "cosmic_punch": { "saborizantes": 2, "azucar": 3 },
  "lunar_berry": { "cafeina": 5, "saborizantes": 5 },
  "solar_blast": { "cafeina": 1, "saborizantes": 3, "azucar": 1 },
};