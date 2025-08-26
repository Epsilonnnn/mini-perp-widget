import { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { positionsAtom } from '@/entities/position';
import { btcPriceAtom } from '@/entities/price';
import { isSubmittingOrderAtom, orderErrorAtom } from '@/entities/order';
import { submitOrder } from '@/widgets/order-form/api/orders';

export function usePositionManagement() {
  const [positions, setPositions] = useAtom(positionsAtom);
  const priceData = useAtomValue(btcPriceAtom);
  const isSubmitting = useAtomValue(isSubmittingOrderAtom);
  const setIsSubmitting = useSetAtom(isSubmittingOrderAtom);
  const setOrderError = useSetAtom(orderErrorAtom);

  const closePosition = useCallback(
    async (positionId: string) => {
      const position = positions.find(p => p.id === positionId);
      if (!position) return;

      const closeOrderForm = {
        side: position.side === 'long' ? ('short' as const) : ('long' as const),
        size: position.size,
        symbol: position.symbol,
      };

      setIsSubmitting(true);
      setOrderError('');

      try {
        const response = await submitOrder(closeOrderForm, priceData.price);

        if (response.success) {
          setPositions(prev => prev.filter(p => p.id !== positionId));
        } else {
          throw new Error(response.error || 'Position close failed');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setOrderError(errorMessage);
        console.error('Position close failed:', errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [positions, priceData.price, setPositions, setIsSubmitting, setOrderError]
  );

  const closeAllPositions = useCallback(async () => {
    if (positions.length === 0) return;

    setIsSubmitting(true);
    setOrderError('');

    try {
      const closePromises = positions.map(position => {
        const closeOrderForm = {
          side:
            position.side === 'long' ? ('short' as const) : ('long' as const),
          size: position.size,
          symbol: position.symbol,
        };
        return submitOrder(closeOrderForm, priceData.price);
      });

      const responses = await Promise.all(closePromises);
      const successfulCloses = responses.filter(r => r.success);

      if (successfulCloses.length === positions.length) {
        setPositions([]);
      } else {
        const failedCount = positions.length - successfulCloses.length;
        throw new Error(`Failed to close ${failedCount} position(s)`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOrderError(errorMessage);
      console.error('Close all positions failed:', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    positions,
    priceData.price,
    setPositions,
    setIsSubmitting,
    setOrderError,
  ]);

  return {
    closePosition,
    closeAllPositions,
    isSubmitting,
  };
}
