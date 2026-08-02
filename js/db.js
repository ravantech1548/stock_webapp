(function () {
  'use strict';

  const SYNC_KEYS = ['holdings', 'funds', 'plans', 'settings', 'watchlist', 'prices'];
  const DB_URL_STORAGE_KEY = 'spp_db_url';
  let dbRef = null;
  let enabled = false;
  let isSyncing = false;
  let syncCoolDownTimer = null;
  let debounceTimer = null;
  let lastLocalWriteAt = 0;
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
    if (!isConfigured()) return Promise.resolve();
    lastLocalWriteAt = Date.now();
    isSyncing = true;
    updateSyncUI('syncing');

    clearTimeout(debounceTimer);
    return new Promise((resolve, reject) => {
      debounceTimer = setTimeout(async () => {
        try {
          if (!dbRef) {
            await init();
          }
          if (!dbRef) {
            isSyncing = false;
            return resolve();
          }

          // Ensure arrays (like plans, holdings) are sent as pure clean arrays
          let cleanValue = value;
          if ((key === 'plans' || key === 'holdings') && Array.isArray(value)) {
            cleanValue = value.map(item => ({ ...item }));
          }

          await dbRef.child(key).set(cleanValue);
          updateSyncUI('connected');
          
          clearTimeout(syncCoolDownTimer);
          syncCoolDownTimer = setTimeout(() => {
            isSyncing = false;
          }, 800);
          resolve();
        } catch (e) {
          isSyncing = false;
          console.warn('DB push failed for key:', key, e);
          updateSyncUI('error', 'Write failed: ' + (e.message || e));
          reject(e);
        }
      }, 50);
    });
  }

  /* Upload all current localStorage data to Firebase (migration or manual sync) */
  async function pushAll() {
    if (!dbRef) {
      const ok = await init();
      if (!ok) throw new Error(lastError || 'Cannot connect to database');
    }
    lastLocalWriteAt = Date.now();
    isSyncing = true;
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
    setTimeout(() => { isSyncing = false; }, 800);
  }

  /* Pull all Firebase data into localStorage */
  async function pull(remote) {
    if (!remote) return;
    const P = getPrefix();
    SYNC_KEYS.forEach(k => {
      if (remote[k] !== undefined && remote[k] !== null) {
        let val = remote[k];
        // Normalize arrays stored as object maps by Firebase
        if ((k === 'holdings' || k === 'plans') && !Array.isArray(val) && typeof val === 'object') {
          val = Object.values(val).filter(Boolean);
        }
        localStorage.setItem(P + k, JSON.stringify(val));
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
      }

      dbRef = firebase.database().ref('portfolio');
      enabled = true;

      // Fetch current remote data to populate or sync
      try {
        const snap = await dbRef.once('value');
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
      } catch (fetchErr) {
        console.warn('Initial Firebase snapshot warning:', fetchErr);
      }

      // Realtime listener for cross-tab or remote device sync
      dbRef.on('value', snapshot => {
        const data = snapshot.val();
        // Ignore echo events if we just wrote locally
        if (data && !isSyncing && (Date.now() - lastLocalWriteAt > 1000)) {
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

      updateSyncUI('connected');
      return true;
    } catch (e) {
      console.error('Firebase init failed:', e);
      enabled = false;
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
