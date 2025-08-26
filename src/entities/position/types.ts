export interface Position {
  id: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  timestamp: number;
  symbol: string;
}