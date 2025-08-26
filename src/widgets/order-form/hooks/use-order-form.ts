import { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  orderFormAtom,
  isSubmittingOrderAtom,
  lastOrderResponseAtom,
  orderErrorAtom,
} from '@/entities/order';
import { positionsAtom } from '@/entities/position';
import { btcPriceAtom } from '@/entities/price';
import { submitOrder } from '@/widgets/order-form/api/orders';
import type { OrderForm } from '@/entities/order';
import type { Position } from '@/entities/position';

export function useOrderForm() {
  const [orderForm, setOrderForm] = useAtom(orderFormAtom);
  const isSubmitting = useAtomValue(isSubmittingOrderAtom);
  const setIsSubmitting = useSetAtom(isSubmittingOrderAtom);
  const [lastOrderResponse, setLastOrderResponse] = useAtom(
    lastOrderResponseAtom
  );
  const [orderError, setOrderError] = useAtom(orderErrorAtom);
  const setPositions = useSetAtom(positionsAtom);
  const priceData = useAtomValue(btcPriceAtom);

  const handleSubmitOrder = useCallback(async () => {
    if (isSubmitting || priceData.price === 0) return;

    setIsSubmitting(true);
    setOrderError('');

    try {
      const response = await submitOrder(orderForm, priceData.price);

      if (response.success) {
        const newPosition: Position = {
          id: response.orderId,
          side: orderForm.side,
          size: orderForm.size,
          entryPrice: response.entryPrice,
          timestamp: response.timestamp,
          symbol: orderForm.symbol,
        };

        setPositions(prev => [...prev, newPosition]);
        setLastOrderResponse(response);
      } else {
        throw new Error(response.error || 'Order submission failed');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setOrderError(errorMessage);
      console.error('Order submission failed:', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    orderForm,
    priceData.price,
    setIsSubmitting,
    setOrderError,
    setLastOrderResponse,
    setPositions,
  ]);

  const updateOrderForm = useCallback(
    (updates: Partial<OrderForm>) => {
      setOrderForm(prev => ({ ...prev, ...updates }));
    },
    [setOrderForm]
  );

  const resetOrderState = useCallback(() => {
    setIsSubmitting(false);
    setLastOrderResponse({
      success: false,
      orderId: '',
      entryPrice: 0,
      timestamp: 0,
    });
    setOrderError('');
  }, [setIsSubmitting, setLastOrderResponse, setOrderError]);

  return {
    orderForm,
    updateOrderForm,
    isSubmitting,
    handleSubmitOrder,
    lastOrderResponse,
    orderError,
    resetOrderState,
    currentPrice: priceData.price,
  };
}
