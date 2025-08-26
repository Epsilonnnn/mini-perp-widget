import { v4 as uuidv4 } from 'uuid';
import type { OrderForm, OrderResponse } from '@/entities/order';

export async function submitOrder(
  _orderForm: OrderForm,
  currentPrice: number
): Promise<OrderResponse> {
  const delay = Math.random() * 400 + 100;

  // fetch POST /api/order
  return new Promise((resolve) => {
    setTimeout(() => {
      const slippagePercent = (Math.random() - 0.5) * 0.1;
      const slippageAmount = currentPrice * (slippagePercent / 100);
      const executionPrice = currentPrice + slippageAmount;

      const response: OrderResponse = {
        success: true,
        orderId: uuidv4(),
        entryPrice: Number(executionPrice.toFixed(2)),
        timestamp: Date.now(),
      };

      resolve(response);
    }, delay);
  });
}
