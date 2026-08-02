(function () {
  'use strict';

  const SYNC_KEYS = ['holdings', 'funds', 'plans', 'settings', 'watchlist'];
  let dbRef = null;
  let enabled = false;
  let isSyncing = false;
  let debounceTimer = null;

  function isConfigured() {
    const cfg = window.FIREBASE_CONFIG;
    return cfg &&
      cfg.databaseURL &&
      cfg.databaseURL !== 'https://YOUR-PROJECT-default-rtdb.firebaseio.com' &&
      cfg.apiKey !== 'YOUR-API-KEY';
  }

  function getPrefix() {
    return window.Config ? window.Config.STORAGE_PREFIX : 'spp_';
  }

  function updateSyncUI(status, label) {
    const statusEl = document.getElementById('cloud-sync-status');
    if (!statusEl) return;

    if (status === 'connected') {
      statusEl.innerHTML = '<span class="sync-dot connected"></span> <span class="sync-text">Cloud Synced</span>';
      statusEl.title = 'Real-time Firebase Cloud connection active';
    } else if (status === 'syncing') {
      statusEl.innerHTML = '<span class="sync-dot syncing"></span> <span class="sync-text">Syncing...</span>';
      statusEl.title = 'Syncing updates with Firebase Cloud...';
    } else if (status === 'error') {
      statusEl.innerHTML = '<span class="sync-dot error"></span> <span class="sync-text">Sync Error</span>';
      statusEl.title = label || 'Firebase Cloud connection error';
    } else {
      statusEl.innerHTML = '<span class="sync-dot offline"></span> <span class="sync-text">Local Only</span>';
      statusEl.title = 'Using localStorage only';
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
          updateSyncUI('error', 'Push failed');
        });
    }, 400);
  }

  /* Upload all current localStorage data to Firebase (migration or manual sync) */
  async function pushAll() {
    if (!dbRef) return;
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
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      dbRef = firebase.database().ref('portfolio');

      const snap = await dbRef.once('value');
      const remote = snap.val();

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
      });

      enabled = true;
      updateSyncUI('connected');
      return true;
    } catch (e) {
      console.error('Firebase init failed:', e);
      updateSyncUI('offline');
      return false;
    }
  }

  window.DB = {
    init,
    push,
    pushAll,
    isEnabled: () => enabled,
    updateSyncUI
  };
})();
