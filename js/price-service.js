(function () {
  'use strict';

  const { formatCurrency } = window.Utils;
  const DELAY = (window.Config && window.Config.BATCH_FETCH_DELAY_MS) || 250;
  const BATCH_SIZE = (window.Config && window.Config.BATCH_SIZE) || 15;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // NSE segment suffixes that Yahoo Finance doesn't use
  const NSE_STRIP = /-(BE|SM|IL|BZ|GB|SG|BL|MF|GS|RL|MT|PP|EQ)$/i;

  function cleanSymbol(symbol) {
    return String(symbol || '')
      .trim()
      .toUpperCase()
      .replace(/\.(NS|BO)$/i, '')
      .replace(NSE_STRIP, '');
  }

  function yahooTicker(symbol, exchange) {
    const clean = cleanSymbol(symbol);
    const suffix = (exchange === 'BSE') ? (window.Config.BSE_SUFFIX || '.BO') : (window.Config.DEFAULT_EXCHANGE_SUFFIX || '.NS');
    return clean + suffix;
  }

  // Reverse lookup: Map 'RELIANCE.NS' back to 'RELIANCE'
  function tickerToSymbol(ticker) {
    return String(ticker || '')
      .toUpperCase()
      .replace(/\.(NS|BO)$/i, '');
  }

  function getProxies() {
    if (window.Config && window.Config.CORS_PROXIES && window.Config.CORS_PROXIES.length) {
      return window.Config.CORS_PROXIES;
    }
    return [
      { name: 'corsproxy.io', url: 'https://corsproxy.io/?url=', type: 'direct' },
      { name: 'allorigins',   url: 'https://api.allorigins.win/get?url=', type: 'allorigins' },
      { name: 'codetabs',     url: 'https://api.codetabs.com/v1/proxy?quest=', type: 'direct' }
    ];
  }

  function buildProxyUrl(proxy, targetUrl) {
    if (proxy.type === 'allorigins') {
      return proxy.url + encodeURIComponent(targetUrl) + '&cache=' + Date.now();
    }
    return proxy.url + encodeURIComponent(targetUrl);
  }

  function parseProxyResponse(raw, proxyType) {
    if (proxyType === 'allorigins') {
      if (raw && typeof raw.contents === 'string') {
        try {
          return JSON.parse(raw.contents);
        } catch (e) {
          throw new Error('Failed to parse allorigins inner JSON');
        }
      }
      return raw;
    }
    return raw;
  }

  /* ---- FETCH BATCH QUOTES ---- */
  async function fetchQuotesBatch(tickerList) {
    if (!tickerList || tickerList.length === 0) return {};
    const symbolsParam = encodeURIComponent(tickerList.join(','));
    const proxies = getProxies();
    const servers = (window.Config && window.Config.YAHOO_SERVERS) || ['query1', 'query2'];

    let lastError = null;

    for (const proxy of proxies) {
      for (const server of servers) {
        const targetUrl = `https://${server}.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`;
        const proxyUrl = buildProxyUrl(proxy, targetUrl);

        try {
          const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(9000) });
          if (!resp.ok) throw new Error(`HTTP ${resp.status} on ${proxy.name}`);

          const rawData = await resp.json();
          const data = parseProxyResponse(rawData, proxy.type);

          const quotes = data && data.quoteResponse && data.quoteResponse.result;
          if (Array.isArray(quotes) && quotes.length > 0) {
            const resultMap = {};
            quotes.forEach(q => {
              const sym = tickerToSymbol(q.symbol);
              const price = q.regularMarketPrice ?? q.currentPrice ?? q.postMarketPrice;
              if (price != null) {
                const prev = q.regularMarketPreviousClose || price;
                const change = q.regularMarketChange ?? (price - prev);
                const changePct = q.regularMarketChangePercent ?? (prev ? (change / prev) * 100 : 0);

                resultMap[sym] = {
                  price: parseFloat(price),
                  dayChange: parseFloat(change),
                  dayChangePct: parseFloat(changePct),
                  high52w: q.fiftyTwoWeekHigh != null ? parseFloat(q.fiftyTwoWeekHigh) : null,
                  low52w: q.fiftyTwoWeekLow != null ? parseFloat(q.fiftyTwoWeekLow) : null,
                  dayHigh: q.regularMarketDayHigh != null ? parseFloat(q.regularMarketDayHigh) : null,
                  dayLow: q.regularMarketDayLow != null ? parseFloat(q.regularMarketDayLow) : null,
                  currency: q.currency || 'INR',
                  source: 'yahoo',
                  fetchedAt: new Date().toISOString()
                };
              }
            });
            return resultMap;
          }
        } catch (err) {
          lastError = err;
          // continue to next server/proxy
        }
      }
    }

    // If batch quote failed, try single chart fallback for each symbol
    return {};
  }

  /* ---- FETCH SINGLE CHART FALLBACK ---- */
  async function fetchSingleChart(symbol, exchange) {
    const ticker = yahooTicker(symbol, exchange);
    const proxies = getProxies();
    const servers = (window.Config && window.Config.YAHOO_SERVERS) || ['query1', 'query2'];

    for (const proxy of proxies) {
      for (const server of servers) {
        const targetUrl = `https://${server}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
        const proxyUrl = buildProxyUrl(proxy, targetUrl);

        try {
          const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
          if (!resp.ok) continue;

          const rawData = await resp.json();
          const data = parseProxyResponse(rawData, proxy.type);
          const meta = data && data.chart && data.chart.result && data.chart.result[0] && data.chart.result[0].meta;

          if (meta && meta.regularMarketPrice != null) {
            const price = parseFloat(meta.regularMarketPrice);
            const prev = parseFloat(meta.previousClose || meta.chartPreviousClose || price);
            const change = price - prev;
            const changePct = prev ? (change / prev) * 100 : 0;

            const priceObj = {
              price,
              dayChange: change,
              dayChangePct: changePct,
              high52w: meta.fiftyTwoWeekHigh != null ? parseFloat(meta.fiftyTwoWeekHigh) : null,
              low52w: meta.fiftyTwoWeekLow != null ? parseFloat(meta.fiftyTwoWeekLow) : null,
              dayHigh: meta.regularMarketDayHigh != null ? parseFloat(meta.regularMarketDayHigh) : null,
              dayLow: meta.regularMarketDayLow != null ? parseFloat(meta.regularMarketDayLow) : null,
              currency: meta.currency || 'INR',
              source: 'yahoo',
              fetchedAt: new Date().toISOString()
            };

            Storage.setPrice(cleanSymbol(symbol), priceObj);
            return priceObj;
          }
        } catch (_) {
          // try next
        }
      }
    }
    return null;
  }

  /* ---- PUBLIC: FETCH ONE ---- */
  async function fetchOne(symbol, exchange) {
    const sym = cleanSymbol(symbol);
    const exch = exchange || 'NSE';
    const ticker = yahooTicker(sym, exch);

    // Try batch endpoint for single ticker first
    const batchRes = await fetchQuotesBatch([ticker]);
    if (batchRes[sym]) {
      Storage.setPrice(sym, batchRes[sym]);
      return batchRes[sym].price;
    }

    // Try chart endpoint fallback
    const chartRes = await fetchSingleChart(sym, exch);
    return chartRes ? chartRes.price : null;
  }

  /* ---- PUBLIC: FETCH MULTIPLE SYMBOLS (BATCHED) ---- */
  async function fetchMultiple(items, onProgress) {
    // items: [{ symbol: 'RELIANCE', exchange: 'NSE' }, ...]
    if (!items || items.length === 0) return { succeeded: 0, failed: [] };

    // Group into unique tickers
    const uniqueMap = {};
    items.forEach(it => {
      const sym = cleanSymbol(it.symbol);
      if (sym) {
        uniqueMap[sym] = it.exchange || 'NSE';
      }
    });

    const symbols = Object.keys(uniqueMap);
    const total = symbols.length;
    let succeeded = 0;
    const failed = [];

    // Chunk into batches
    const chunks = [];
    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      chunks.push(symbols.slice(i, i + BATCH_SIZE));
    }

    for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
      const chunk = chunks[cIdx];
      const tickerList = chunk.map(s => yahooTicker(s, uniqueMap[s]));

      if (onProgress) {
        onProgress(Math.min(cIdx * BATCH_SIZE, total), total);
      }

      // Batch query
      const batchResult = await fetchQuotesBatch(tickerList);

      // Check which symbols succeeded in batch
      for (const sym of chunk) {
        if (batchResult[sym]) {
          Storage.setPrice(sym, batchResult[sym]);
          succeeded++;
        } else {
          // Fallback to single chart query
          const singleRes = await fetchSingleChart(sym, uniqueMap[sym]);
          if (singleRes) {
            succeeded++;
          } else {
            failed.push(sym);
          }
          await sleep(100);
        }
      }

      if (onProgress) {
        onProgress(Math.min((cIdx + 1) * BATCH_SIZE, total), total);
      }

      if (cIdx < chunks.length - 1) {
        await sleep(DELAY);
      }
    }

    return { succeeded, failed, total };
  }

  /* ---- PUBLIC: REFRESH ALL HOLDINGS ---- */
  let isFetching = false;

  async function fetchAll() {
    if (isFetching) return;
    isFetching = true;

    const holdings = Storage.getHoldings();
    if (holdings.length === 0) {
      App.toast('No holdings to refresh.', 'warn');
      isFetching = false;
      return;
    }

    const statusEl = document.getElementById('refresh-status');
    const refreshBtn = document.getElementById('btn-refresh-prices');
    if (refreshBtn) refreshBtn.disabled = true;

    function setStatus(text) {
      if (statusEl) statusEl.innerHTML = `<span class="spinner"></span> ${text}`;
    }

    setStatus(`Updating prices… (0/${holdings.length})`);

    const result = await fetchMultiple(holdings, (current, total) => {
      setStatus(`Updating prices… (${current}/${total})`);
      if (window.Holdings) Holdings.render();
    });

    if (statusEl) statusEl.innerHTML = '';
    if (refreshBtn) refreshBtn.disabled = false;
    isFetching = false;

    if (window.Holdings) Holdings.render();
    if (window.Plan) Plan.render();

    if (result.failed.length === 0) {
      App.toast(`Successfully updated ${result.succeeded} live stock price(s).`, 'success');
    } else {
      App.toast(`${result.succeeded} updated. Failed: ${result.failed.join(', ')} — click price cell to enter manually.`, 'warn');
    }
  }

  function init() {
    const btn = document.getElementById('btn-refresh-prices');
    if (btn) btn.addEventListener('click', fetchAll);
  }

  window.PriceService = {
    init,
    fetchOne,
    fetchMultiple,
    fetchAll,
    cleanSymbol,
    yahooTicker
  };
})();
