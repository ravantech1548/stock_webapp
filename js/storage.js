(function () {
  'use strict';

  const P = window.Config.STORAGE_PREFIX;
  const KEYS = {
    holdings:  P + 'holdings',
    prices:    P + 'prices',
    funds:     P + 'funds',
    settings:  P + 'settings',
    plans:     P + 'plans',
    watchlist: P + 'watchlist'
  };

  function read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Storage read error', key, e);
      return null;
    }
  }

  const SYNC_KEY_MAP = {
    [P + 'holdings']:  'holdings',
    [P + 'funds']:     'funds',
    [P + 'plans']:     'plans',
    [P + 'settings']:  'settings',
    [P + 'watchlist']: 'watchlist'
  };

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Sync to Firebase if enabled (fire-and-forget; prices are not synced)
      const syncKey = SYNC_KEY_MAP[key];
      if (syncKey && window.DB && window.DB.isEnabled()) {
        window.DB.push(syncKey, value);
      }
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        localStorage.removeItem(KEYS.prices);
        try {
          localStorage.setItem(key, JSON.stringify(value));
          window.App && window.App.toast('Storage was full — price cache cleared.', 'warn');
          return true;
        } catch (_) {}
      }
      console.error('Storage write error', key, e);
      return false;
    }
  }

  /* ---- HOLDINGS ---- */
  function getHoldings() {
    return read(KEYS.holdings) || [];
  }

  function saveHoldings(holdings) {
    return write(KEYS.holdings, holdings);
  }

  function upsertHolding(holding) {
    const list = getHoldings();
    const idx = list.findIndex(h => h.id === holding.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...holding, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...holding, addedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    return write(KEYS.holdings, list);
  }

  function deleteHolding(id) {
    const list = getHoldings().filter(h => h.id !== id);
    return write(KEYS.holdings, list);
  }

  /* ---- PRICES ---- */
  function getPrices() {
    return read(KEYS.prices) || {};
  }

  function setPrice(symbol, priceData) {
    const prices = getPrices();
    prices[symbol] = { ...priceData, fetchedAt: new Date().toISOString() };
    return write(KEYS.prices, prices);
  }

  function setPrices(priceMap) {
    return write(KEYS.prices, priceMap);
  }

  function getPrice(symbol) {
    return (getPrices())[symbol] || null;
  }

  /* ---- FUNDS ---- */
  function getFunds() {
    return read(KEYS.funds) || { monthlyTarget: window.Config.MONTHLY_TARGET, transactions: [] };
  }

  function saveFunds(funds) {
    return write(KEYS.funds, funds);
  }

  function addFundTransaction(tx) {
    const funds = getFunds();
    funds.transactions.unshift({ ...tx, createdAt: new Date().toISOString() });
    return write(KEYS.funds, funds);
  }

  function deleteFundTransaction(id) {
    const funds = getFunds();
    funds.transactions = funds.transactions.filter(t => t.id !== id);
    return write(KEYS.funds, funds);
  }

  function setMonthlyTarget(amount) {
    const funds = getFunds();
    funds.monthlyTarget = amount;
    return write(KEYS.funds, funds);
  }

  /* ---- PLANS ---- */
  function getPlans() {
    return read(KEYS.plans) || [];
  }

  function savePlans(plans) {
    return write(KEYS.plans, plans);
  }

  function upsertPlan(plan) {
    const list = getPlans();
    const idx = list.findIndex(p => p.id === plan.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...plan, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...plan, addedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    return write(KEYS.plans, list);
  }

  function deletePlan(id) {
    const list = getPlans().filter(p => p.id !== id);
    return write(KEYS.plans, list);
  }

  /* ---- WATCHLIST ---- */
  function getWatchlist() {
    return read(KEYS.watchlist) || {};
  }

  function saveWatchlist(obj) {
    return write(KEYS.watchlist, obj);
  }

  function upsertWatchlistCategory(cat) {
    const wl = getWatchlist();
    wl[cat.id] = { ...cat };
    return write(KEYS.watchlist, wl);
  }

  function deleteWatchlistCategory(id) {
    const wl = getWatchlist();
    delete wl[id];
    return write(KEYS.watchlist, wl);
  }

  /* ---- SETTINGS ---- */
  function getSettings() {
    return read(KEYS.settings) || {
      currency: 'INR',
      yahooExchangeSuffix: '.NS',
      priceRefreshIntervalMinutes: 0
    };
  }

  function saveSettings(settings) {
    return write(KEYS.settings, settings);
  }

  window.Storage = {
    getHoldings, saveHoldings, upsertHolding, deleteHolding,
    getPrices, getPrice, setPrice, setPrices,
    getFunds, saveFunds, addFundTransaction, deleteFundTransaction, setMonthlyTarget,
    getPlans, savePlans, upsertPlan, deletePlan,
    getWatchlist, saveWatchlist, upsertWatchlistCategory, deleteWatchlistCategory,
    getSettings, saveSettings
  };
})();
