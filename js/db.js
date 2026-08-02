(function () {
  'use strict';

  const SYNC_KEYS = ['holdings', 'funds', 'plans', 'settings', 'watchlist', 'prices'];
  const DB_URL_STORAGE_KEY = 'spp_db_url';
  let dbRef = null;
  let enabled = false;
  let isSyncing = false;
  let debounceTimer = null;
  let lastError = null;

  function getDatabaseURL() {
    return localStorage.getItem(DB_URL_STORAGE_KEY) || (window.FIREBASE_CONFIG ? window.FIREBASE_CONFIG.databaseURL : '');
  }

  function setDatabaseURL(url) {
    if (url) {
      localStorage.setItem(DB_URL_STORAGE_KEY, url.trim());
      if (window.FIREBASE_CONFIG) window.FIREBASE_CONFIG.databaseURL = url.trim();
    } else {
      localStorage.removeItem(DB_URL_STORAGE_KEY);
    }
  }

  function isConfigured() {
    const cfg = window.FIREBASE_CONFIG;
    const url = getDatabaseURL();
    return cfg &&
      url &&
      url !== 'https://YOUR-PROJECT-default-rtdb.firebaseio.com' &&
      cfg.apiKey !== 'YOUR-API-KEY';
  }

  function getPrefix() {
    return window.Config ? window.Config.STORAGE_PREFIX : 'spp_';
  }

  function updateSyncUI(status, label) {
    const statusEl = document.getElementById('cloud-sync-status');
    const diagStatus = document.getElementById('cloud-diag-status');
    const diagDetail = document.getElementById('cloud-diag-detail');

    if (status === 'connected') {
      if (statusEl) {
        statusEl.innerHTML = '<span class="sync-dot connected"></span> <span class="sync-text">Cloud Synced</span>';
        statusEl.title = 'Real-time Firebase Cloud connection active (click to configure)';
      }
      if (diagStatus) diagStatus.innerHTML = '<span class="sync-dot connected"></span> Connected & Synced';
      if (diagDetail) diagDetail.textContent = 'Active database: ' + getDatabaseURL();
      lastError = null;
    } else if (status === 'syncing') {
      if (statusEl) {
        statusEl.innerHTML = '<span class="sync-dot syncing"></span> <span class="sync-text">Syncing...</span>';
        statusEl.title = 'Syncing updates with Firebase Cloud...';
      }
      if (diagStatus) diagStatus.innerHTML = '<span class="sync-dot syncing"></span> Syncing...';
    } else if (status === 'error') {
      lastError = label || 'Firebase Cloud connection error';
      if (statusEl) {
        statusEl.innerHTML = '<span class="sync-dot error"></span> <span class="sync-text">Sync Error</span>';
        statusEl.title = 'Cloud Error: ' + lastError + ' (click to fix database URL)';
      }
      if (diagStatus) diagStatus.innerHTML = '<span class="sync-dot error"></span> Disconnected / Setup Needed';
      if (diagDetail) diagDetail.innerHTML = '<span style="color:#ef4444">' + (label || 'Database not found or permission denied. Check URL in Firebase Console.') + '</span>';
    } else {
      if (statusEl) {
        statusEl.innerHTML = '<span class="sync-dot offline"></span> <span class="sync-text">Local Only</span>';
        statusEl.title = 'Using localStorage only (click to connect Firebase)';
      }
      if (diagStatus) diagStatus.innerHTML = '<span class="sync-dot offline"></span> Local Mode (Not Connected)';
      if (diagDetail) diagDetail.textContent = 'Configure Realtime Database to enable multi-device sync.';
    }
  }

  /* Push one key to Firebase with debouncing */
  function push(key, value) {
    if (!enabled || !dbRef) return;
    updateSyncUI('syncing');

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      dbRef.child(key).set(value)
        .then(() => {
          updateSyncUI('connected');
        })
        .catch(e => {
          console.warn('DB push failed for key:', key, e);
          updateSyncUI('error', 'Write failed: ' + (e.message || e));
        });
    }, 400);
  }

  /* Upload all current localStorage data to Firebase (migration or manual sync) */
  async function pushAll() {
    if (!dbRef) {
      const ok = await init();
      if (!ok) throw new Error(lastError || 'Cannot connect to database');
    }
    updateSyncUI('syncing');
    const P = getPrefix();
    const data = {};
    SYNC_KEYS.forEach(k => {
      try {
        const raw = localStorage.getItem(P + k);
        if (raw) data[k] = JSON.parse(raw);
      } catch (e) { /* ignore */ }
    });
    data.lastSyncAt = new Date().toISOString();
    await dbRef.set(data);
    updateSyncUI('connected');
  }

  /* Pull all Firebase data into localStorage */
  async function pull(remote) {
    if (!remote) return;
    const P = getPrefix();
    SYNC_KEYS.forEach(k => {
      if (remote[k] !== undefined && remote[k] !== null) {
        localStorage.setItem(P + k, JSON.stringify(remote[k]));
      }
    });
  }

  /* Initialise Firebase and start real-time listener */
  async function init() {
    if (!isConfigured()) {
      console.info('Firebase not configured — using localStorage only');
      updateSyncUI('offline');
      return false;
    }

    try {
      updateSyncUI('syncing');
      const activeURL = getDatabaseURL();
      const config = { ...window.FIREBASE_CONFIG, databaseURL: activeURL };

      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      } else {
        // Re-init with new databaseURL if needed
        try {
          firebase.app().delete();
          firebase.initializeApp(config);
        } catch (_) {}
      }

      dbRef = firebase.database().ref('portfolio');

      // Timeout promise to prevent blocking boot if Firebase RTDB is slow/offline
      const fetchPromise = dbRef.once('value');
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout. Please check your Realtime Database URL in Firebase Console.')), 3500));
      const snap = await Promise.race([fetchPromise, timeoutPromise]);
      const remote = snap ? snap.val() : null;

      if (!remote) {
        // Firebase empty — push local data up (first-time migration)
        await pushAll();
        console.info('DB: local data migrated to Firebase');
      } else {
        // Firebase has data — pull it down
        await pull(remote);
        console.info('DB: loaded from Firebase');
      }

      // Realtime listener for cross-tab or remote device sync
      dbRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data && !isSyncing) {
          pull(data);
          // Trigger re-render of active UI components if available
          if (window.Holdings && window.Holdings.render) Holdings.render();
          if (window.Funds && window.Funds.render) Funds.render();
          if (window.Plan && window.Plan.render) Plan.render();
          if (window.Watchlist && window.Watchlist.render) Watchlist.render();
        }
      }, err => {
        console.warn('DB Realtime listener error:', err);
        updateSyncUI('error', err.message);
      });

      enabled = true;
      updateSyncUI('connected');
      return true;
    } catch (e) {
      console.error('Firebase init failed:', e);
      enabled = false;
      dbRef = null;
      updateSyncUI('error', e.message);
      return false;
    }
  }

  window.DB = {
    init,
    push,
    pushAll,
    pull,
    getDatabaseURL,
    setDatabaseURL,
    isEnabled: () => enabled,
    updateSyncUI
  };
})();
