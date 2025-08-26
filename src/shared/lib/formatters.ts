export function formatCurrency(
  value: number,
  currency: string = 'USD',
  precision: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

export function formatBTCPrice(price: number): string {
  if (price === 0) return '$0.00';

  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(price);
}

export function formatPercentage(
  percentage: number,
  precision: number = 2
): string {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(precision)}%`;
}

export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(timestamp));
}

export function getValueColorClass(value: number): string {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-gray-300';
}

export function formatSide(side: 'long' | 'short'): string {
  return side.charAt(0).toUpperCase() + side.slice(1);
}

export function getValueBgColorClass(value: number): string {
  if (value > 0) return 'bg-green-500/10 border-green-500/20';
  if (value < 0) return 'bg-red-500/10 border-red-500/20';
  return 'bg-gray-500/10 border-gray-500/20';
}
