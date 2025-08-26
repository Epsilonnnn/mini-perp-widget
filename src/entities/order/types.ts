export interface OrderForm {
  side: 'long' | 'short';
  size: number;
  symbol: string;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  entryPrice: number;
  timestamp: number;
  error?: string;
}


