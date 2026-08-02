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
    [P + 'watchlist']: 'watchlist',
    [P + 'prices']:    'prices'
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
    const raw = read(KEYS.holdings);
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') return Object.values(raw).filter(Boolean);
    return [];
  }

  function saveHoldings(holdings) {
    return write(KEYS.holdings, Array.isArray(holdings) ? holdings : []);
  }

  function upsertHolding(holding) {
    const list = getHoldings();
    const idx = list.findIndex(h => String(h.id) === String(holding.id));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...holding, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...holding, addedAt: holding.addedAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    return write(KEYS.holdings, list);
  }

  function deleteHolding(id) {
    const list = getHoldings().filter(h => String(h.id) !== String(id));
    return write(KEYS.holdings, list);
  }

  /* ---- PRICES ---- */
  function getPrices() {
    const raw = read(KEYS.prices);
    return (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
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
    const raw = read(KEYS.funds);
    const defaultTarget = (window.Config && window.Config.MONTHLY_TARGET) || 25000;
    if (!raw) return { monthlyTarget: defaultTarget, transactions: [] };
    return {
      monthlyTarget: (typeof raw.monthlyTarget === 'number' && !isNaN(raw.monthlyTarget))
        ? raw.monthlyTarget
        : (parseFloat(raw.monthlyTarget) || defaultTarget),
      transactions: Array.isArray(raw.transactions)
        ? raw.transactions
        : (raw.transactions && typeof raw.transactions === 'object' ? Object.values(raw.transactions).filter(Boolean) : [])
    };
  }

  function saveFunds(funds) {
    const defaultTarget = (window.Config && window.Config.MONTHLY_TARGET) || 25000;
    const normalized = {
      monthlyTarget: (funds && typeof funds.monthlyTarget === 'number') ? funds.monthlyTarget : defaultTarget,
      transactions: (funds && Array.isArray(funds.transactions)) ? funds.transactions : []
    };
    return write(KEYS.funds, normalized);
  }

  function addFundTransaction(tx) {
    const funds = getFunds();
    funds.transactions.unshift({ ...tx, createdAt: new Date().toISOString() });
    return write(KEYS.funds, funds);
  }

  function deleteFundTransaction(id) {
    const funds = getFunds();
    funds.transactions = funds.transactions.filter(t => String(t.id) !== String(id));
    return write(KEYS.funds, funds);
  }

  function setMonthlyTarget(amount) {
    const funds = getFunds();
    funds.monthlyTarget = Number(amount) || 25000;
    return write(KEYS.funds, funds);
  }

  /* ---- PLANS ---- */
  function getPlans() {
    const raw = read(KEYS.plans);
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') return Object.values(raw).filter(Boolean);
    return [];
  }

  function savePlans(plans) {
    return write(KEYS.plans, Array.isArray(plans) ? plans : []);
  }

  function upsertPlan(plan) {
    const list = getPlans();
    const idx = list.findIndex(p => String(p.id) === String(plan.id));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...plan, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...plan, addedAt: plan.addedAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    return write(KEYS.plans, list);
  }

  function deletePlan(id) {
    const list = getPlans().filter(p => String(p.id) !== String(id));
    return write(KEYS.plans, list);
  }

  /* ---- WATCHLIST ---- */
  function getWatchlist() {
    const raw = read(KEYS.watchlist);
    if (!raw) return {};
    if (typeof raw === 'object' && !Array.isArray(raw)) return raw;
    if (Array.isArray(raw)) {
      const map = {};
      raw.forEach(item => { if (item && item.id) map[item.id] = item; });
      return map;
    }
    return {};
  }

  function saveWatchlist(obj) {
    return write(KEYS.watchlist, (obj && typeof obj === 'object') ? obj : {});
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
