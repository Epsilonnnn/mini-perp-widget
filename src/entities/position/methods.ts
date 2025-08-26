import { Position } from "@/entities/position/types";

export function calculatePnL(position: Position, currentPrice: number): number {
  if (currentPrice === 0) return 0;

  const priceDiff = currentPrice - position.entryPrice;

  if (position.side === 'long') {
    return (priceDiff / position.entryPrice) * position.size;
  } else {
    return (-priceDiff / position.entryPrice) * position.size;
  }
}

export function calculatePnLPercentage(
  position: Position,
  currentPrice: number
): number {
  if (currentPrice === 0) return 0;

  const priceDiff = currentPrice - position.entryPrice;

  if (position.side === 'long') {
    return (priceDiff / position.entryPrice) * 100;
  } else {
    return (-priceDiff / position.entryPrice) * 100;
  }
}