import { atom } from 'jotai';
import type { Position } from '@/entities/position';
import { btcPriceAtom } from '../price/model';
import { calculatePnL, calculatePnLPercentage } from '@/entities/position';

export const positionsAtom = atom<Position[]>([]);

export const totalPnLAtom = atom(get => {
  const positions = get(positionsAtom);
  const currentPrice = get(btcPriceAtom).price;

  return positions.reduce((total, position) => {
    return total + calculatePnL(position, currentPrice);
  }, 0);
});

export const totalPnLPercentageAtom = atom(get => {
  const positions = get(positionsAtom);
  const currentPrice = get(btcPriceAtom).price;

  if (positions.length === 0) return 0;

  let totalWeightedPnLPercentage = 0;
  let totalInvestment = 0;

  positions.forEach(position => {
    const investment = position.size * position.entryPrice;
    const pnlPercentage = calculatePnLPercentage(position, currentPrice);
    
    totalWeightedPnLPercentage += pnlPercentage * investment;
    totalInvestment += investment;
  });

  if (totalInvestment === 0) return 0;

  return totalWeightedPnLPercentage / totalInvestment;
});

export const positionCountAtom = atom(get => {
  const positions = get(positionsAtom);
  return positions.length;
});
