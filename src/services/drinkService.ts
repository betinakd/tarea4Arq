import client from "../config/redis.js";
import { DrinkType } from "../models/drinkType.js";
import { Order } from "../models/order.js";
import { ApiError } from "../../utils/ApiError.js";
import { recipes } from "./ingredientService.js";

// =============================================
// Usando JSON.SET redis para guardar el objeto completo
// =============================================

export async function postDrinkOrderJSON(orderData: Order) {

  await validateOrderData(orderData);

  const orderKey = `s_order:${orderData.orderId}`;
  const exists = await client.exists(orderKey);
  if (exists) {
    throw new ApiError('Order con ese ID ya existe', 409);
  }

  const orderToSave = {
    ...orderData,
    status: orderData.status || 'pending',
    createdAt: new Date().toISOString()
  };

  await client.json.set(`s_order:${orderData.orderId}`, "$", orderToSave);

  await client.expire(`s_order:${orderData.orderId}`, 3600);

  return {
    success: true,
    orderId: orderData.orderId,
    message: 'Order guardada exitosamente'
  };
}

export async function enoughIngredients(orderData: Order) {
    const qty = Number(orderData.quantity);

    const ingredientes = recipes[orderData.drinkType];
    for (const [ingrediente, cantidadPorUnidad] of Object.entries(ingredientes))
    {
        const cantidadNecesaria =cantidadPorUnidad * qty;
        const cantidadDisponible = await client.zScore("ingredient_inventory", ingrediente) || 0;
        console.log(`Ingrediente: ${ingrediente}, Necesario: ${cantidadNecesaria}, Disponible: ${cantidadDisponible}`);
        if (cantidadDisponible < cantidadNecesaria) {
            throw new ApiError(`No hay suficiente ${ingrediente}. Necesario: ${cantidadNecesaria}, Disponible: ${cantidadDisponible}`, 400);
        }
    }
}

export async function createDrinkByOrder(order: Order) {
    const ingredientes = recipes[order.drinkType];
    for (const [ingrediente, cantidadPorUnidad] of Object.entries(ingredientes))
    {
        const cantidadNecesaria = cantidadPorUnidad * order.quantity;
        await client.zIncrBy("ingredient_inventory", -cantidadNecesaria, ingrediente);
    }

    await client.json.set(`s_order:${order.orderId}`, "$.status", "completed");
}

async function validateOrderData(orderData: Order) {
  if (orderData == null) {
    throw new ApiError('Json invalido', 400);
  }
  if (!orderData.orderId) {
    throw new ApiError('orderId es requerido', 400);
  }
  if (!orderData.drinkType) {
    throw new ApiError('drinkType es requerido', 400);
  }
  if (!orderData.quantity || orderData.quantity <= 0) {
    throw new ApiError('quantity debe ser mayor que 0', 400);
  }
  if (!orderData.status) {
    throw new ApiError('status es requerido', 400);
  }

  // Validar que drinkType sea uno de los valores permitidos
  const validDrinkTypes = ['cosmic_punch', 'lunar_berry', 'solar_blast'];
  if (!validDrinkTypes.includes(orderData.drinkType)) {
    throw new ApiError(`drinkType debe ser uno de: ${validDrinkTypes.join(', ')}`, 400);
  }

  if (typeof orderData.quantity !== 'number' || orderData.quantity <= 0) {
    throw new ApiError('quantity debe ser un número mayor que 0', 400);
  }

  if (orderData.status) {
    const validStatuses = ['pending', 'in_production', 'completed', 'rejected'];
    if (!validStatuses.includes(orderData.status)) {
      throw new ApiError(`status debe ser uno de: ${validStatuses.join(', ')}`, 400);
    }
  }

  const allowedFields = ['orderId', 'drinkType', 'quantity', 'status'];
  const providedFields = Object.keys(orderData);
  const extraFields = providedFields.filter(field => !allowedFields.includes(field));
  
  if (extraFields.length > 0) {
    throw new ApiError(`Campos no permitidos: ${extraFields.join(', ')}`, 400);
  }
}
