window.Config = {
  MONTHLY_TARGET: 25000,
  CURRENCY_SYMBOL: '₹',
  LOCALE: 'en-IN',
  STORAGE_PREFIX: 'spp_',
  CORS_PROXIES: [
    { name: 'corsproxy.io', url: 'https://corsproxy.io/?url=', type: 'direct' },
    { name: 'allorigins',   url: 'https://api.allorigins.win/get?url=', type: 'allorigins' },
    { name: 'codetabs',     url: 'https://api.codetabs.com/v1/proxy?quest=', type: 'direct' }
  ],
  YAHOO_SERVERS: ['query1', 'query2'],
  DEFAULT_EXCHANGE_SUFFIX: '.NS',
  BSE_SUFFIX: '.BO',
  PRICE_STALE_MINUTES: 30,
  PRICE_VERY_STALE_HOURS: 24,
  BATCH_SIZE: 15,
  BATCH_FETCH_DELAY_MS: 250,
  VERSION: '2.0.0'
};
