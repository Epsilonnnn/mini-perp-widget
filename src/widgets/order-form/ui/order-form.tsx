import React from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useOrderForm } from '../hooks/use-order-form';
import { formatBTCPrice } from '@/shared/lib/formatters';
import { TRADING_CONSTANTS } from '@/shared/constants/trading';

export function OrderForm() {
  const {
    orderForm,
    isSubmitting,
    orderError,
    currentPrice,
    updateOrderForm,
    handleSubmitOrder,
    resetOrderState,
  } = useOrderForm();

  const handleSideChange = (side: 'long' | 'short') => {
    updateOrderForm({ side });
    if (orderError) {
      resetOrderState();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitOrder();
  };

  const estimatedFee = orderForm.size * TRADING_CONSTANTS.FEE_PERCENTAGE;
  const totalCost = orderForm.size + estimatedFee;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Place Order</h2>
        <p className="text-gray-400 text-sm">
          Market order • {formatBTCPrice(currentPrice)}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Position Side
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSideChange('long')}
              className={`
                flex items-center justify-center gap-2 p-4 rounded-lg border font-semibold transition-all
                ${
                orderForm.side === 'long'
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-green-500/50'
              }
              `}
            >
              <TrendingUp className="w-4 h-4"/>
              Long
            </button>
            <button
              type="button"
              onClick={() => handleSideChange('short')}
              className={`
                flex items-center justify-center gap-2 p-4 rounded-lg border font-semibold transition-all
                ${
                orderForm.side === 'short'
                  ? 'bg-red-500/20 border-red-500 text-red-400'
                  : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-red-500/50'
              }
              `}
            >
              <TrendingDown className="w-4 h-4"/>
              Short
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Symbol
          </label>
          <input
            type="text"
            value={orderForm.symbol}
            onChange={e => updateOrderForm({symbol: e.target.value})}
            className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="BTC-PERP"
            required
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Size (vUSDC)
          </label>
          <input
            type="number"
            value={orderForm.size}
            onChange={e => updateOrderForm({size: Number(e.target.value)})}
            min={TRADING_CONSTANTS.MIN_ORDER_SIZE}
            max={TRADING_CONSTANTS.MAX_ORDER_SIZE}
            step="1"
            className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Enter amount in vUSDC"
            required
          />
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-400">Min: {TRADING_CONSTANTS.MIN_ORDER_SIZE}</span>
            <span className="text-gray-400">Max: {TRADING_CONSTANTS.MAX_ORDER_SIZE.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Order Value:</span>
            <span className="text-white">
              ${orderForm.size.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated Fee (0.1%):</span>
            <span className="text-white">${estimatedFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-gray-700 pt-2">
            <span className="text-gray-300">Total Cost:</span>
            <span className="text-white">${totalCost.toFixed(2)}</span>
          </div>
        </div>

        {orderError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{orderError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || currentPrice === 0}
          className={`
            w-full p-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
            ${
            orderForm.side === 'long'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin"/>
              Submitting...
            </>
          ) : (
            <>
              {orderForm.side === 'long' ? (
                <>
                  <TrendingUp className="w-4 h-4"/>
                  Place {orderForm.symbol} long
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4"/>
                  Place {orderForm.symbol} short
                </>
              )}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
