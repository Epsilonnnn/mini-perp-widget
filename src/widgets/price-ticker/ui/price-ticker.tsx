
import { useAtom } from 'jotai';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import {
  btcPriceAtom,
  priceTrendAtom,
  priceChangePercentAtom,
  isWebSocketConnectedAtom,
  lastUpdateTimeAtom,
} from '@/entities/price';
import {
  formatBTCPrice,
  formatPercentage,
  formatTime,
  getValueColorClass,
} from '@/shared/lib/formatters';
import { useTradingWebSocketSubscription } from '../hooks/use-trading-websocket';

function getTrendColorClass(trend: string, baseColorClass: string) {
  if (trend === 'up') {
    return 'text-green-400';
  }

  if (trend === 'down') {
    return 'text-red-400';
  }

  return baseColorClass;
}

export function PriceTicker() {
  const [priceData] = useAtom(btcPriceAtom);
  const [trend] = useAtom(priceTrendAtom);
  const [priceChangePercent] = useAtom(priceChangePercentAtom);
  const [isConnected] = useAtom(isWebSocketConnectedAtom);
  const [lastUpdate] = useAtom(lastUpdateTimeAtom);

  const { connectionStatus } = useTradingWebSocketSubscription();

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  const trendIconColorClass = getTrendColorClass(trend, 'text-gray-400');
  const trendPriceColorClass = getTrendColorClass(trend, 'text-white');

  const priceColorClass = getValueColorClass(priceChangePercent);

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-lg">
            ₿
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">BTC-PERP</h1>
            <p className="text-gray-400 text-sm">Bitcoin Perpetual</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">
                {connectionStatus}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-4xl md:text-5xl font-bold tracking-tight ${trendPriceColorClass}`}>
              {formatBTCPrice(priceData.price)}
            </span>
            {trend !== 'neutral' && <TrendIcon className={`w-8 h-8 ${trendIconColorClass}`} />}
          </div>

          <div className="flex items-center gap-4">
            <span className={`text-lg font-semibold ${priceColorClass}`}>
              {formatPercentage(priceChangePercent)}
            </span>
            <span className="text-gray-400 text-sm">
              Last update: {formatTime(lastUpdate)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-400 font-medium">Bid</span>
              <span className="text-white font-mono">
                {formatBTCPrice(priceData.bid)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-400 font-medium">Ask</span>
              <span className="text-white font-mono">
                {formatBTCPrice(priceData.ask)}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Spread</span>
                <span className="text-gray-300 text-sm font-mono">
                  ${(priceData.ask - priceData.bid).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">24h Volume</p>
            <p className="text-white font-semibold">
              {priceData.volume24h.toLocaleString()} BTC
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Mark Price</p>
            <p className="text-white font-semibold">
              {formatBTCPrice(priceData.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
