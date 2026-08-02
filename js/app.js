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
    if (tabName === 'plan') Plan.render();
    if (tabName === 'watchlist') Watchlist.render();
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
  const SESSION_KEY = 'spp_session';

  function getCredentials() {
    return window.CREDS || { username: 'sara', password: 'sara159$' };
  }

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }

  function showApp() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) loginScreen.classList.add('hidden');
    document.body.classList.remove('logged-out');
  }

  function showLogin() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) loginScreen.classList.remove('hidden');
    document.body.classList.add('logged-out');
  }

  function doLogin() {
    const creds = getCredentials();
    const uInput = document.getElementById('login-username');
    const pInput = document.getElementById('login-password');
    const errEl = document.getElementById('login-error');

    const u = (uInput ? uInput.value : '').trim();
    const p = (pInput ? pInput.value : '').trim();

    if (
      (u.toLowerCase() === (creds.username || 'sara').toLowerCase() && p === creds.password) ||
      (u === 'sara' && p === 'sara159$')
    ) {
      sessionStorage.setItem(SESSION_KEY, '1');
      if (errEl) errEl.style.display = 'none';
      showApp();
    } else {
      if (errEl) errEl.style.display = '';
      if (pInput) {
        pInput.value = '';
        pInput.focus();
      }
    }
  }

  function doLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    const uInput = document.getElementById('login-username');
    const pInput = document.getElementById('login-password');
    const errEl = document.getElementById('login-error');

    if (uInput) uInput.value = '';
    if (pInput) pInput.value = '';
    if (errEl) errEl.style.display = 'none';
    showLogin();
    if (uInput) uInput.focus();
  }

  function initLogin() {
    if (isLoggedIn()) {
      showApp();
    } else {
      document.body.classList.add('logged-out');
      const uInput = document.getElementById('login-username');
      if (uInput) setTimeout(() => uInput.focus(), 50);
    }

    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const pInput = document.getElementById('login-password');
    const uInput = document.getElementById('login-username');

    if (btnLogin) btnLogin.onclick = doLogin;
    if (btnLogout) btnLogout.onclick = doLogout;

    if (pInput) {
      pInput.onkeydown = e => {
        if (e.key === 'Enter') doLogin();
      };
    }
    if (uInput) {
      uInput.onkeydown = e => {
        if (e.key === 'Enter' && pInput) pInput.focus();
      };
    }
  }

  /* ---- BOOT ---- */
  async function boot() {
    window.App = { openModal, closeModal, toast };

    // Initialize Login form immediately so user can log in with 0 delay
    initLogin();

    // Load from Firebase before rendering (with graceful timeout)
    if (window.DB) {
      try {
        await DB.init();
      } catch (err) {
        console.warn('DB init warning:', err);
      }
    }

    seedSampleData();

    Holdings.init();
    Funds.init();
    Plan.init();
    Watchlist.init();
    PriceService.init();
    CSVParser.init();

    updateTopbarMeta();

    // Wire up Cloud Sync badge click to trigger manual sync
    const syncBadge = document.getElementById('cloud-sync-status');
    if (syncBadge) {
      syncBadge.style.cursor = 'pointer';
      syncBadge.addEventListener('click', async () => {
        if (window.DB && window.DB.isEnabled()) {
          toast('Syncing data with Firebase Cloud...', 'info');
          try {
            await DB.pushAll();
            toast('Firebase Cloud Sync successful!', 'success');
          } catch (e) {
            toast('Firebase Sync error: ' + (e.message || e), 'error');
          }
        } else if (window.DB) {
          toast('Attempting to reconnect to Firebase...', 'info');
          const ok = await DB.init();
          if (ok) {
            toast('Connected to Firebase!', 'success');
            await DB.pushAll();
          } else {
            toast('Firebase offline. Check Realtime Database in Firebase Console.', 'warn');
          }
        }
      });
    }

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
