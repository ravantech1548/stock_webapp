(function () {
  'use strict';

  const { formatCurrency } = window.Utils;
  const DELAY = Config.BATCH_FETCH_DELAY_MS;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const CORS_PROXY = 'https://api.allorigins.win/get?url=';

  // NSE segment suffixes that Yahoo Finance doesn't use
  const NSE_STRIP = /-(BE|SM|IL|BZ|GB|SG|BL|MF|GS|RL|MT|PP)$/i;

  function yahooTicker(symbol, exchange) {
    const clean = symbol.replace(NSE_STRIP, '');
    const suffix = exchange === 'BSE' ? Config.BSE_SUFFIX : Config.DEFAULT_EXCHANGE_SUFFIX;
    return clean + suffix;
  }

  function yahooChartUrl(symbol, exchange, server) {
    const ticker = yahooTicker(symbol, exchange);
    const api = `https://${server}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    return CORS_PROXY + encodeURIComponent(api);
  }

  function yahooQuoteUrl(symbol, exchange, server) {
    const ticker = yahooTicker(symbol, exchange);
    const api = `https://${server}.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(ticker)}`;
    return CORS_PROXY + encodeURIComponent(api);
  }

  function parseProxyResponse(outer) {
    // allorigins.win wraps response in { contents: "json-string" }
    const raw = (outer && typeof outer.contents === 'string') ? JSON.parse(outer.contents) : outer;
    return raw;
  }

  async function tryFetchChart(symbol, exchange, server) {
    const resp = await fetch(yahooChartUrl(symbol, exchange, server), { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = parseProxyResponse(await resp.json());
    const meta = data.chart && data.chart.result && data.chart.result[0] && data.chart.result[0].meta;
    if (!meta || !meta.regularMarketPrice) throw new Error('No chart data');
    return { regularMarketPrice: meta.regularMarketPrice, previousClose: meta.previousClose || meta.chartPreviousClose || meta.regularMarketPrice, currency: meta.currency || 'INR' };
  }

  async function tryFetchQuote(symbol, exchange, server) {
    const resp = await fetch(yahooQuoteUrl(symbol, exchange, server), { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = parseProxyResponse(await resp.json());
    const result = data.quoteResponse && data.quoteResponse.result && data.quoteResponse.result[0];
    if (!result || !result.regularMarketPrice) throw new Error('No quote data');
    return { regularMarketPrice: result.regularMarketPrice, previousClose: result.regularMarketPreviousClose || result.regularMarketPrice, currency: result.currency || 'INR' };
  }

  async function fetchOne(symbol, exchange) {
    const exch = exchange || 'NSE';
    // Try query1 + query2 servers, each with chart then quote endpoint
    for (const server of ['query1', 'query2']) {
      for (const tryFn of [tryFetchChart, tryFetchQuote]) {
        try {
          const meta = await tryFn(symbol, exch, server);
          const price = meta.regularMarketPrice;
          const prev = meta.previousClose || price;
          Storage.setPrice(symbol, { price, dayChange: price - prev, dayChangePct: prev ? ((price - prev) / prev) * 100 : 0, source: 'yahoo', currency: meta.currency });
          return price;
        } catch (_) {
          // try next combination
        }
      }
    }
    console.warn('All fetch attempts failed for', symbol);
    return null;
  }

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
    refreshBtn.disabled = true;

    let done = 0, succeeded = 0, failed = [];
    const total = holdings.length;

    function setStatus(text) {
      statusEl.innerHTML = `<span class="spinner"></span> ${text}`;
    }

    setStatus(`Fetching prices… (0/${total})`);

    for (const h of holdings) {
      const price = await fetchOne(h.symbol, h.exchange);
      done++;
      if (price !== null) succeeded++; else failed.push(h.symbol);
      setStatus(`Fetching prices… (${done}/${total})`);
      Holdings.render();
      if (done < total) await sleep(DELAY);
    }

    statusEl.innerHTML = '';
    refreshBtn.disabled = false;
    isFetching = false;
    Holdings.render();

    if (failed.length === 0) {
      App.toast(`All ${succeeded} prices updated.`, 'success');
    } else {
      App.toast(`${succeeded} updated. Failed: ${failed.join(', ')} — click their price cell to enter manually.`, 'warn');
    }
  }

  function init() {
    document.getElementById('btn-refresh-prices').addEventListener('click', fetchAll);
  }

  window.PriceService = { init, fetchOne, fetchAll };
})();
