import { useEffect, useCallback, useRef, useMemo } from 'react';
import { ReadyState } from 'react-use-websocket';
import { useAtom, useSetAtom } from 'jotai';
import {
  btcPriceAtom,
  isWebSocketConnectedAtom,
  lastUpdateTimeAtom,
  previousPriceAtom,
  priceChangePercentAtom,
} from '@/entities/price';
import { getCurrentMarketData } from '@/shared/api/get-market-data';
import { useCoinbaseWS } from '@/shared/api/use-coinbase-ws';
import { TRADING_CONSTANTS, WEBSOCKET_CONFIG } from '@/shared/constants/trading';

interface CoinbaseTickerMessage {
  type: string;
  product_id: string;
  price: string;
  best_bid: string;
  best_ask: string;
  volume_24h: string;
  sequence: number;
}

export function useTradingWebSocketSubscription() {
  const [priceData, setPriceData] = useAtom(btcPriceAtom);
  const setPreviousPrice = useSetAtom(previousPriceAtom);
  const [isConnected, setIsConnected] = useAtom(isWebSocketConnectedAtom);
  const setLastUpdateTime = useSetAtom(lastUpdateTimeAtom);
  const setPriceChangePercent = useSetAtom(priceChangePercentAtom);

  const messageBuffer = useRef<CoinbaseTickerMessage[]>([]);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const batchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPriceRef = useRef<number>(0);

  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useCoinbaseWS({
    onOpen: () => {
      setIsConnected(true);

      const subscription = {
        type: 'subscribe',
        product_ids: [WEBSOCKET_CONFIG.PRODUCT_ID],
        channels: [WEBSOCKET_CONFIG.CHANNEL],
      };
      sendJsonMessage(subscription);

      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
      }
    },
    onClose: () => {
      setIsConnected(false);

      startFallbackPolling();
    },
    onError: () => {
      setIsConnected(false);
    }
  });

  const processBatchedMessages = useCallback(() => {
    if (messageBuffer.current.length > 0) {
      const latestMessage =
        messageBuffer.current[messageBuffer.current.length - 1];

      if (
        latestMessage &&
        latestMessage.type === WEBSOCKET_CONFIG.CHANNEL &&
        latestMessage.product_id === WEBSOCKET_CONFIG.PRODUCT_ID
      ) {
        const price = parseFloat(latestMessage.price);
        const bid = parseFloat(latestMessage.best_bid);
        const ask = parseFloat(latestMessage.best_ask);
        const volume24h = parseFloat(latestMessage.volume_24h);

        const priceChange =
          lastPriceRef.current > 0
            ? ((price - lastPriceRef.current) / lastPriceRef.current) * 100
            : 0;

        setPreviousPrice(priceData.price);
        setPriceData({
          price,
          bid,
          ask,
          volume24h,
          timestamp: Date.now(),
          sequence: latestMessage.sequence,
        });
        setPriceChangePercent(priceChange);
        setLastUpdateTime(Date.now());

        lastPriceRef.current = price;
      }

      messageBuffer.current = [];
    }
  }, [
    priceData.price,
    setPriceData,
    setPreviousPrice,
    setPriceChangePercent,
    setLastUpdateTime,
  ]);

  useEffect(() => {
    batchIntervalRef.current = setInterval(
      processBatchedMessages,
      TRADING_CONSTANTS.BATCH_INTERVAL
    );

    return () => {
      if (batchIntervalRef.current) {
        clearInterval(batchIntervalRef.current);
      }
    };
  }, [processBatchedMessages]);

  useEffect(() => {
    if (lastJsonMessage && typeof lastJsonMessage === 'object') {
      // Type guard to ensure the message has the expected structure
      const message = lastJsonMessage as Record<string, unknown>;
      if (
        typeof message.type === 'string' &&
        typeof message.product_id === 'string' &&
        typeof message.price === 'string' &&
        typeof message.best_bid === 'string' &&
        typeof message.best_ask === 'string' &&
        typeof message.volume_24h === 'string'
      ) {
        messageBuffer.current.push(message as unknown as CoinbaseTickerMessage);
      }
    }
  }, [lastJsonMessage]);

  const startFallbackPolling = useCallback(() => {
    if (fallbackIntervalRef.current) return;

    const pollMarketData = async () => {
      try {
        const data = await getCurrentMarketData();

        const priceChange =
          lastPriceRef.current > 0
            ? ((data.price - lastPriceRef.current) / lastPriceRef.current) * 100
            : 0;

        setPreviousPrice(priceData.price);
        setPriceData({
          price: data.price,
          bid: data.bid,
          ask: data.ask,
          volume24h: data.volume24h,
          timestamp: data.timestamp,
        });
        setPriceChangePercent(priceChange);
        setLastUpdateTime(Date.now());

        lastPriceRef.current = data.price;
      } catch (error) {
        console.error('Fallback market data fetch failed:', error);
      }
    };

    pollMarketData();
    fallbackIntervalRef.current = setInterval(
      pollMarketData,
      TRADING_CONSTANTS.FALLBACK_POLL_INTERVAL
    );
  }, [
    priceData.price,
    setPriceData,
    setPreviousPrice,
    setPriceChangePercent,
    setLastUpdateTime,
  ]);

  useEffect(() => {
    return () => {
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
      }
      if (batchIntervalRef.current) {
        clearInterval(batchIntervalRef.current);
      }
    };
  }, []);

  const connectionStatus = useMemo(() => {
    return {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Connected',
      [ReadyState.CLOSING]: 'Disconnecting',
      [ReadyState.CLOSED]: 'Disconnected',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
  }, [readyState]);

  return {
    priceData,
    isConnected,
    connectionStatus,
    readyState,
  };
}
