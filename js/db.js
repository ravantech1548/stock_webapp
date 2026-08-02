(function () {
  'use strict';

  const SYNC_KEYS = ['holdings', 'funds', 'plans', 'settings'];
  let dbRef = null;
  let enabled = false;

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

  /* Push one key to Firebase (fire-and-forget) */
  function push(key, value) {
    if (!enabled || !dbRef) return;
    dbRef.child(key).set(value).catch(e => console.warn('DB push failed', key, e));
  }

  /* Upload all current localStorage data to Firebase (initial migration) */
  async function pushAll() {
    const P = getPrefix();
    const data = {};
    SYNC_KEYS.forEach(k => {
      try {
        const raw = localStorage.getItem(P + k);
        if (raw) data[k] = JSON.parse(raw);
      } catch (e) { /* ignore */ }
    });
    await dbRef.set(data);
  }

  /* Pull all Firebase data into localStorage */
  async function pull(remote) {
    const P = getPrefix();
    SYNC_KEYS.forEach(k => {
      if (remote[k] !== undefined && remote[k] !== null) {
        localStorage.setItem(P + k, JSON.stringify(remote[k]));
      }
    });
  }

  /* Initialise Firebase and sync — call this before rendering the app */
  async function init() {
    if (!isConfigured()) {
      console.info('Firebase not configured — using localStorage only');
      return false;
    }

    try {
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
        // Firebase has data — pull it down (Firebase is source of truth)
        await pull(remote);
        console.info('DB: loaded from Firebase');
      }

      enabled = true;
      return true;
    } catch (e) {
      console.error('Firebase init failed:', e);
      // Fall back to localStorage silently
      return false;
    }
  }

  window.DB = { init, push, isEnabled: () => enabled };
})();
