import { API_ENDPOINTS } from '@/shared/constants/trading';

export async function getCurrentMarketData(): Promise<{
  price: number;
  bid: number;
  ask: number;
  volume24h: number;
  timestamp: number;
}> {
  try {
    const response = await fetch(API_ENDPOINTS.COINBASE_TICKER);
    const data = await response.json();

    return {
      price: parseFloat(data.price),
      bid: parseFloat(data.bid),
      ask: parseFloat(data.ask),
      volume24h: parseFloat(data.volume),
      timestamp: Date.now(),
    };
  } catch (error) {
    console.warn('Market data API failed, using mock data:', error);

    const basePrice = 110000;
    const variation = (Math.random() - 0.5) * 2000;
    const price = basePrice + variation;

    return {
      price: Number(price.toFixed(2)),
      bid: Number((price - 0.5).toFixed(2)),
      ask: Number((price + 0.5).toFixed(2)),
      volume24h: Math.random() * 10000 + 5000,
      timestamp: Date.now(),
    };
  }
}
