import useWebSocket from 'react-use-websocket';
import { WEBSOCKET_CONFIG, TRADING_CONSTANTS } from '@/shared/constants/trading';

export function useCoinbaseWS({ onOpen, onError, onClose }:{
  onOpen: () => void;
  onClose: () => void;
  onError: () => void;
}) {
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
    getWebSocket
  } = useWebSocket(WEBSOCKET_CONFIG.COINBASE_WEBSOCKET_URL, {
    share: true,
    shouldReconnect: () => true,
    reconnectInterval: TRADING_CONSTANTS.WEBSOCKET_RECONNECT_INTERVAL,
    reconnectAttempts: TRADING_CONSTANTS.WEBSOCKET_MAX_RECONNECT_ATTEMPTS,
    onOpen: onOpen,
    onClose: onClose,
    onError: event => {
      console.error('WebSocket error:', event);
      onError();
    },
  });

  return {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
    getWebSocket
  };
}