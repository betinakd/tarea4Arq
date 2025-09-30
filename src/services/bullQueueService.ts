import { Job } from "bullmq";
import { Order } from "../models/order.js";
import client from "../config/redis.js";
import { createDrinkByOrder } from "./drinkService.js";
import { incrementByDrinkTotal } from "./drinkTotalService.js";

export async function productionOrderJob(job : Job<Order>) {
    const orderData = job.data;
    console.log("Worker started, order:" + orderData.orderId + "  " + orderData.drinkType + "  " + orderData.quantity +  " " + orderData.status);

    // Actualizar estado a 'in_production'
    await client.json.set(`s_order:${orderData.orderId}`, "$.status", "in_production");

    // Simular tiempo de produccion 3 segundos
    await new Promise(resolve => setTimeout(resolve, 3000));

    // decrementar el inventario de ingredientes en Redis
    await createDrinkByOrder(orderData);

    // Incrementar el contador de producción para el drinkType correspondiente
    await incrementByDrinkTotal(orderData.drinkType, orderData.quantity);

    const result = await client.json.get(`s_order:${orderData.orderId}`);
    
    console.log("Worker finished, order:" + result?.toString());
}
