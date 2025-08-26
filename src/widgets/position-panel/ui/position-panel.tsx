import { useAtom } from 'jotai';
import { X, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
  positionsAtom,
  totalPnLAtom,
  totalPnLPercentageAtom,
  positionCountAtom,
} from '@/entities/position';
import { btcPriceAtom } from '@/entities/price';
import { usePositionManagement } from '../hooks/use-position-management';
import {
  formatBTCPrice,
  formatCurrency,
  formatPercentage,
  formatTime,
  formatSide,
  getValueColorClass,
  getValueBgColorClass,
} from '@/shared/lib/formatters';
import {
  calculatePnL,
  calculatePnLPercentage,
} from '@/entities/position';

export function PositionPanel() {
  const [positions] = useAtom(positionsAtom);
  const [totalPnL] = useAtom(totalPnLAtom);
  const [totalPnLPercentage] = useAtom(totalPnLPercentageAtom);
  const [positionCount] = useAtom(positionCountAtom);
  const [priceData] = useAtom(btcPriceAtom);

  const { closePosition, closeAllPositions, isSubmitting } = usePositionManagement();

  if (positions.length === 0) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Positions</h2>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No open positions</p>
          <p className="text-gray-500 text-sm mt-1">
            Place an order to start trading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Positions</h2>
          <p className="text-gray-400 text-sm">
            {positionCount} active position{positionCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="text-right">
          <div className={`text-2xl font-bold ${getValueColorClass(totalPnL)}`}>
            {formatCurrency(totalPnL)}
          </div>
          <div
            className={`text-sm font-medium ${getValueColorClass(totalPnLPercentage)}`}
          >
            {formatPercentage(totalPnLPercentage)}
          </div>
        </div>
      </div>

      {positions.length > 1 && (
        <div className="mb-4">
          <button
            onClick={closeAllPositions}
            disabled={isSubmitting}
            className="
              bg-gray-800 hover:bg-gray-700 border border-gray-600 
              text-gray-300 hover:text-white px-4 py-2 rounded-lg
              text-sm font-medium transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Close All Positions
          </button>
        </div>
      )}

      <div className="space-y-4">
        {positions.map(position => {
          const pnl = calculatePnL(position, priceData.price);
          const pnlPercentage = calculatePnLPercentage(position, priceData.price);
          const isProfit = pnl >= 0;

          return (
            <div
              key={position.id}
              className={`
                relative rounded-lg border-2 p-5 transition-all duration-200
                ${getValueBgColorClass(pnl)}
                hover:scale-[1.02] hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold
                    ${
                      position.side === 'long'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }
                  `}
                  >
                    {position.side === 'long' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {formatSide(position.side)}
                  </div>

                  <span className="text-white font-semibold">
                    {position.symbol}
                  </span>
                </div>

                <button
                  onClick={() => closePosition(position.id)}
                  disabled={isSubmitting}
                  className="
                    p-2 rounded-lg bg-gray-800 hover:bg-gray-700 
                    text-gray-400 hover:text-white border border-gray-600
                    transition-colors duration-200 group
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  title="Close Position"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Size</p>
                  <p className="text-white font-semibold">
                    {position.size} vUSDC
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Entry Price</p>
                  <p className="text-white font-mono">
                    {formatBTCPrice(position.entryPrice)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Current Price</p>
                  <p className="text-white font-mono">
                    {formatBTCPrice(priceData.price)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Opened</p>
                  <p className="text-gray-300 text-sm">
                    {formatTime(position.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div>
                  <p className="text-gray-400 text-sm">Unrealized P&L</p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getValueColorClass(pnl)}`}>
                    {formatCurrency(pnl)}
                  </div>
                  <div className={`text-sm font-medium ${getValueColorClass(pnlPercentage)}`}>
                    {formatPercentage(pnlPercentage)}
                  </div>
                </div>
              </div>

              <div
                className={`
                absolute left-0 top-0 w-1 h-full rounded-l-lg
                ${isProfit ? 'bg-green-500' : 'bg-red-500'}
              `}
              />

              {Math.abs(pnlPercentage) > 5 && (
                <div
                  className={`
                  absolute inset-0 rounded-lg opacity-10 animate-pulse
                  ${isProfit ? 'bg-green-500' : 'bg-red-500'} pointer-events-none
                `}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Total Positions</p>
            <p className="text-white font-bold text-lg">{positionCount}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total P&L</p>
            <p className={`font-bold text-lg ${getValueColorClass(totalPnL)}`}>
              {formatCurrency(totalPnL)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">P&L %</p>
            <p
              className={`font-bold text-lg ${getValueColorClass(totalPnLPercentage)}`}
            >
              {formatPercentage(totalPnLPercentage)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Mark Price</p>
            <p className="text-white font-mono text-lg">
              {formatBTCPrice(priceData.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
