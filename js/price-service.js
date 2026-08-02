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

  // Known symbol aliases & renames for Indian Equities
  const SYMBOL_ALIASES = {
    'INDIABULLS': 'IBULLSLTD',
    'GET&D': 'GVT&D',
    'GETD': 'GVT&D',
    'GE T&D': 'GVT&D',
    'GE T&D INDIA': 'GVT&D',
    'OLA': 'OLAELEC',
    'IBULHSGFIN': 'SAMMAANCAP',
    'L&TFH': 'LTF',
    'MCDOWELL-N': 'UNITDSPR',
    'CADILAHC': 'ZYDUSLIFE',
    'STRTECH': 'STLTECH',
    'HEXAWARE': 'HEXT',
    'MINDTREE': 'LTIM',
    'LTI': 'LTIM',
    'ADANITRANS': 'ADANIENSOL',
    'TATAMTRDVR': 'TATAMOTORS',
    'TATASTEELBSL': 'TATASTEEL',
    'BAJAJ-AUTO': 'BAJAJ-AUTO',
    'BAJAJ_AUTO': 'BAJAJ-AUTO',
    'M&M': 'M&M'
  };

  function cleanSymbol(symbol) {
    return String(symbol || '')
      .trim()
      .toUpperCase()
      .replace(/\.(NS|BO)$/i, '')
      .replace(NSE_STRIP, '');
  }

  function getAliasSymbol(symbol) {
    const clean = cleanSymbol(symbol);
    return SYMBOL_ALIASES[clean] || clean;
  }

  function yahooTicker(symbol, exchange) {
    const clean = getAliasSymbol(symbol);
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
    const list = [];
    // Prioritize Netlify proxy redirect if hosted online
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      list.push({ name: 'netlify-query1', url: '/api/yahoo/', type: 'relative' });
      list.push({ name: 'netlify-query2', url: '/api/yahoo2/', type: 'relative' });
    }
    if (window.Config && window.Config.CORS_PROXIES && window.Config.CORS_PROXIES.length) {
      list.push(...window.Config.CORS_PROXIES);
    } else {
      list.push(
        { name: 'corsproxy.io', url: 'https://corsproxy.io/?url=', type: 'direct' },
        { name: 'allorigins',   url: 'https://api.allorigins.win/get?url=', type: 'allorigins' },
        { name: 'codetabs',     url: 'https://api.codetabs.com/v1/proxy?quest=', type: 'direct' }
      );
    }
    return list;
  }

  function buildProxyUrl(proxy, targetUrl) {
    if (proxy.type === 'relative') {
      try {
        const u = new URL(targetUrl);
        return proxy.url + u.pathname.replace(/^\//, '') + u.search;
      } catch (_) {
        const cleanPath = targetUrl.replace(/^https?:\/\/[^/]+\//, '');
        return proxy.url + cleanPath;
      }
    }
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

  /* ---- SEARCH YAHOO FOR MATCHING TICKER FALLBACK ---- */
  async function searchYahooTicker(query, exchange) {
    const proxies = getProxies();
    const cleanQ = cleanSymbol(query);
    const targetUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(cleanQ)}&quotesCount=8&newsCount=0`;

    for (const proxy of proxies) {
      const proxyUrl = buildProxyUrl(proxy, targetUrl);
      try {
        const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        if (!resp.ok) continue;
        const rawData = await resp.json();
        const data = parseProxyResponse(rawData, proxy.type);
        const quotes = data && data.quotes;
        if (Array.isArray(quotes) && quotes.length > 0) {
          const suffix = (exchange === 'BSE') ? '.BO' : '.NS';
          const match = quotes.find(q => (q.symbol || '').toUpperCase().endsWith(suffix)) ||
                        quotes.find(q => (q.symbol || '').toUpperCase().endsWith('.NS') || (q.symbol || '').toUpperCase().endsWith('.BO'));
          if (match && match.symbol) {
            return match.symbol.toUpperCase();
          }
        }
      } catch (_) {
        // try next proxy
      }
    }
    return null;
  }

  /* ---- FETCH BATCH QUOTES ---- */
  async function fetchQuotesBatch(tickerList) {
    if (!tickerList || tickerList.length === 0) return {};
    const symbolsParam = tickerList.map(t => encodeURIComponent(t)).join(',');
    const proxies = getProxies();
    const servers = (window.Config && window.Config.YAHOO_SERVERS) || ['query1', 'query2'];

    for (const proxy of proxies) {
      for (const server of servers) {
        const targetUrl = `https://${server}.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`;
        const proxyUrl = buildProxyUrl(proxy, targetUrl);

        try {
          const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(9000) });
          if (!resp.ok) continue;

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
        } catch (_) {
          // continue to next server/proxy
        }
      }
    }

    return {};
  }

  /* ---- FETCH SINGLE CHART QUERY ---- */
  async function queryChartEndpoint(ticker) {
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

            return {
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
          }
        } catch (_) {
          // try next
        }
      }
    }
    return null;
  }

  /* ---- FETCH SINGLE WITH MULTI-STEP ALIAS & SEARCH FALLBACK ---- */
  async function fetchSingleChart(symbol, exchange) {
    const origClean = cleanSymbol(symbol);
    const exch = exchange || 'NSE';

    // 1. Try standard ticker
    const primaryTicker = origClean + (exch === 'BSE' ? '.BO' : '.NS');
    let priceObj = await queryChartEndpoint(primaryTicker);

    // 2. Try alias ticker if primary failed
    if (!priceObj) {
      const alias = SYMBOL_ALIASES[origClean];
      if (alias && alias !== origClean) {
        const aliasTicker = alias + (exch === 'BSE' ? '.BO' : '.NS');
        priceObj = await queryChartEndpoint(aliasTicker);
      }
    }

    // 3. Try dynamic Yahoo Search if still failed
    if (!priceObj) {
      const discoveredTicker = await searchYahooTicker(origClean, exch);
      if (discoveredTicker) {
        priceObj = await queryChartEndpoint(discoveredTicker);
      }
    }

    if (priceObj) {
      Storage.setPrice(origClean, priceObj);
      if (SYMBOL_ALIASES[origClean]) {
        Storage.setPrice(SYMBOL_ALIASES[origClean], priceObj);
      }
      return priceObj;
    }

    return null;
  }

  /* ---- PUBLIC: FETCH ONE ---- */
  async function fetchOne(symbol, exchange) {
    const sym = cleanSymbol(symbol);
    const exch = exchange || 'NSE';

    // Try chart endpoint with alias & search fallback
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

      // Try batch query
      const batchResult = await fetchQuotesBatch(tickerList);

      // Check which symbols succeeded in batch
      for (const sym of chunk) {
        const mappedSym = getAliasSymbol(sym);
        const pObj = batchResult[sym] || batchResult[mappedSym];

        if (pObj) {
          Storage.setPrice(sym, pObj);
          if (mappedSym !== sym) Storage.setPrice(mappedSym, pObj);
          succeeded++;
        } else {
          // Fallback to single multi-step chart query
          const singleRes = await fetchSingleChart(sym, uniqueMap[sym]);
          if (singleRes) {
            succeeded++;
          } else {
            failed.push(sym);
          }
          await sleep(80);
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
    yahooTicker,
    SYMBOL_ALIASES
  };
})();
