export const TRADING_CONSTANTS = {
  MIN_ORDER_SIZE: 1,
  MAX_ORDER_SIZE: 10000,
  FEE_PERCENTAGE: 0.001,
  PRICE_PRECISION: 2,
  WEBSOCKET_RECONNECT_INTERVAL: 1000,
  WEBSOCKET_MAX_RECONNECT_ATTEMPTS: 10,
  FALLBACK_POLL_INTERVAL: 10000,
  BATCH_INTERVAL: 50,
} as const;

export const WEBSOCKET_CONFIG = {
  COINBASE_WEBSOCKET_URL: 'wss://ws-feed.exchange.coinbase.com',
  PRODUCT_ID: 'BTC-USD',
  CHANNEL: 'ticker',
} as const;

export const API_ENDPOINTS = {
  COINBASE_TICKER: 'https://api.exchange.coinbase.com/products/BTC-USD/ticker',
} as const;
