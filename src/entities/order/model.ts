import { atom } from 'jotai';
import type { OrderForm, OrderResponse } from '@/entities/order';

export const orderFormAtom = atom<OrderForm>({
  side: 'long',
  size: 100,
  symbol: 'BTC-PERP',
});

export const isSubmittingOrderAtom = atom<boolean>(false);
export const lastOrderResponseAtom = atom<OrderResponse>({
  success: false,
  orderId: '',
  entryPrice: 0,
  timestamp: 0,
});
export const orderErrorAtom = atom<string>('');
