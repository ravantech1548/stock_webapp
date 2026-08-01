(function () {
  'use strict';

  /* ---- MODAL HELPERS ---- */
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  // Close on backdrop click or [data-close] button
  document.addEventListener('click', e => {
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) { closeModal(closeBtn.dataset.close); return; }
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal(e.target.id);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => closeModal(m.id));
    }
  });

  /* ---- TOAST ---- */
  function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warn' ? 'warn' : '');
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'toast-out .2s ease forwards';
      setTimeout(() => el.remove(), 200);
    }, 3200);
  }

  /* ---- TAB ROUTING ---- */
  function setActiveTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'tab-' + tabName);
    });
    if (tabName === 'funds') Funds.render();
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  /* ---- TOP BAR META ---- */
  function updateTopbarMeta() {
    const count = Storage.getHoldings().length;
    const priceCount = Object.keys(Storage.getPrices()).length;
    document.getElementById('topbar-meta').textContent =
      `${count} holding${count !== 1 ? 's' : ''} · ${priceCount} with prices`;
  }

  /* ---- SAMPLE DATA (first run only) ---- */
  function seedSampleData() {
    const existing = Storage.getHoldings();
    if (existing.length > 0) return;

    const samples = [
      { id: Utils.generateId(), symbol: 'RELIANCE', name: 'Reliance Industries Ltd', qty: 5, avgBuyPrice: 2480.00, exchange: 'NSE', notes: '' },
      { id: Utils.generateId(), symbol: 'TCS', name: 'Tata Consultancy Services', qty: 3, avgBuyPrice: 3680.00, exchange: 'NSE', notes: '' },
      { id: Utils.generateId(), symbol: 'INFY', name: 'Infosys Ltd', qty: 8, avgBuyPrice: 1760.00, exchange: 'NSE', notes: '' },
      { id: Utils.generateId(), symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', qty: 10, avgBuyPrice: 1620.00, exchange: 'NSE', notes: '' },
    ];
    const now = new Date().toISOString();
    samples.forEach(s => {
      Storage.upsertHolding({ ...s, addedAt: now, updatedAt: now });
    });

    const fundsData = Storage.getFunds();
    if (fundsData.transactions.length === 0) {
      const months = [
        { date: '2025-01-01', amount: 25000, note: 'January 2025' },
        { date: '2025-02-01', amount: 25000, note: 'February 2025' },
        { date: '2025-03-01', amount: 25000, note: 'March 2025' },
        { date: '2025-04-01', amount: 25000, note: 'April 2025' },
      ];
      months.reverse().forEach(m => {
        Storage.addFundTransaction({ id: Utils.generateId(), ...m });
      });
    }
  }

  /* ---- LOGIN ---- */
  const CREDENTIALS = window.CREDS || { username: '', password: '' };
  const SESSION_KEY = 'spp_session';

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }

  function showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.body.classList.remove('logged-out');
  }

  function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.body.classList.add('logged-out');
  }

  function doLogin() {
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');

    if (u === CREDENTIALS.username && p === CREDENTIALS.password) {
      sessionStorage.setItem(SESSION_KEY, '1');
      errEl.style.display = 'none';
      showApp();
    } else {
      errEl.style.display = '';
      document.getElementById('login-password').value = '';
      document.getElementById('login-password').focus();
    }
  }

  function doLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').style.display = 'none';
    showLogin();
    document.getElementById('login-username').focus();
  }

  function initLogin() {
    document.body.classList.add('logged-out');

    document.getElementById('btn-login').addEventListener('click', doLogin);
    document.getElementById('btn-logout').addEventListener('click', doLogout);

    document.getElementById('login-password').addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
    document.getElementById('login-username').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('login-password').focus();
    });

    if (isLoggedIn()) {
      showApp();
    } else {
      setTimeout(() => document.getElementById('login-username').focus(), 50);
    }
  }

  /* ---- BOOT ---- */
  function boot() {
    window.App = { openModal, closeModal, toast };

    initLogin();
    seedSampleData();

    Holdings.init();
    Funds.init();
    PriceService.init();
    CSVParser.init();

    updateTopbarMeta();

    // Patch render functions to also update topbar meta
    const origHRender = Holdings.render;
    Holdings.render = function () { origHRender(); updateTopbarMeta(); };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
