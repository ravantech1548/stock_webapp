(function () {
  'use strict';

  const { LOCALE, CURRENCY_SYMBOL } = window.Config;

  const inrFmt = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const numFmt = new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function formatCurrency(amount) {
    if (amount == null || isNaN(amount)) return '—';
    return inrFmt.format(amount);
  }

  function formatNumber(n, decimals) {
    if (n == null || isNaN(n)) return '—';
    if (decimals !== undefined) {
      return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
    }
    return numFmt.format(n);
  }

  function formatPercent(value, showSign) {
    if (value == null || isNaN(value)) return '—';
    const sign = showSign !== false ? (value >= 0 ? '+' : '') : '';
    return sign + new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) + '%';
  }

  function formatDate(isoOrDateStr) {
    if (!isoOrDateStr) return '—';
    const d = new Date(isoOrDateStr);
    if (isNaN(d)) return isoOrDateStr;
    return d.toLocaleDateString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getMonthKey(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function currentMonthKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function monthLabel(key) {
    if (!key) return '';
    const [y, m] = key.split('-');
    const d = new Date(+y, +m - 1, 1);
    return d.toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' });
  }

  function generateId() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  window.Utils = {
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
    todayISO,
    getMonthKey,
    currentMonthKey,
    monthLabel,
    generateId,
    debounce,
    escHtml,
    clamp
  };
})();
