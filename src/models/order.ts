import { DrinkType } from "./drinkType.js";

export interface Order {
  orderId: string;
  drinkType: DrinkType;
  quantity: number;
  status: 'pending' | 'in_production' | 'completed' | 'rejected';
}