import { atom } from 'jotai';
import type { PriceData } from '@/entities/price';

export const btcPriceAtom = atom<PriceData>({
  price: 0,
  bid: 0,
  ask: 0,
  volume24h: 0,
  timestamp: Date.now(),
});

export const isWebSocketConnectedAtom = atom<boolean>(false);
export const lastUpdateTimeAtom = atom<number>(Date.now());
export const priceChangePercentAtom = atom<number>(0);
export const previousPriceAtom = atom<number>(0);

export const priceTrendAtom = atom(get => {
  const currentPrice = get(btcPriceAtom).price;
  const previousPrice = get(previousPriceAtom);

  if (previousPrice === 0) return 'neutral';
  if (currentPrice > previousPrice) return 'up';
  if (currentPrice < previousPrice) return 'down';
  return 'neutral';
});
