(function () {
  'use strict';

  /* ---- CSV PARSING ---- */
  function parseNum(str) {
    return parseFloat(String(str || '').replace(/,/g, '')) || 0;
  }

  function parseCSVFile(file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (result) { processRows(result.data, file.name); },
      error: function (err) { App.toast('CSV error: ' + err.message, 'error'); }
    });
  }

  function processRows(rows, filename) {
    if (!rows || rows.length < 2) {
      App.toast('CSV appears empty or invalid', 'error');
      return;
    }

    // Row 0 is the index row (e.g. "NIFTY AUTO") — derive category name from it
    const indexRow = rows[0];
    const rawName  = (indexRow['SYMBOL'] || '').replace(/"/g, '').trim();

    if (!rawName) {
      App.toast('Could not detect category name from CSV', 'error');
      return;
    }

    const id = rawName.replace(/\s+/g, '-').toUpperCase(); // "NIFTY-AUTO"

    const stocks = rows.slice(1).map(function (r) {
      return {
        symbol:    (r['SYMBOL'] || '').replace(/"/g, '').trim(),
        ltp:       parseNum(r['LTP']),
        changePct: parseNum(r['% CHANGE']),
        high52w:   parseNum(r['52W H']),
        low52w:    parseNum(r['52W L'])
      };
    }).filter(function (s) { return s.symbol.length > 0; });

    Storage.upsertWatchlistCategory({
      id:         id,
      name:       rawName,
      stocks:     stocks,
      importedAt: new Date().toISOString()
    });

    renderWatchlist();
    App.toast('Imported ' + stocks.length + ' stocks — ' + rawName, 'success');
  }

  /* ---- RENDER CATEGORY GRID ---- */
  function renderWatchlist() {
    const wl   = Storage.getWatchlist();
    const cats  = Object.values(wl);
    const grid  = document.getElementById('watchlist-categories-grid');

    document.getElementById('wl-card-cats').textContent   = cats.length;
    document.getElementById('wl-card-stocks').textContent =
      cats.reduce(function (s, c) { return s + c.stocks.length; }, 0);

    if (cats.length === 0) {
      grid.innerHTML =
        '<p style="color:var(--text-muted);margin-top:1rem">No watchlists yet. Click “+ Import NIFTY CSV” to add a category.</p>';
      return;
    }

    grid.innerHTML = cats.map(function (cat) {
      var dateStr = cat.importedAt ? Utils.formatDate(cat.importedAt) : '';
      return '<div class="wl-card">' +
        '<div class="wl-card-name">' + Utils.escHtml(cat.name) + '</div>' +
        '<div class="wl-card-meta">' + cat.stocks.length + ' stocks' +
          (dateStr ? ' &middot; ' + dateStr : '') + '</div>' +
        '<div class="btn-group">' +
          '<button class="btn btn-secondary btn-sm" data-view-cat="' + cat.id + '">View</button>' +
          '<button class="btn btn-danger btn-sm" data-delete-cat="' + cat.id + '">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ---- VIEW MODAL ---- */
  function openViewModal(id) {
    const wl  = Storage.getWatchlist();
    const cat = wl[id];
    if (!cat) return;

    document.getElementById('wl-view-title').textContent = cat.name;

    const tbody = document.getElementById('wl-stocks-tbody');
    tbody.innerHTML = cat.stocks.map(function (s) {
      var pctClass = s.changePct >= 0 ? 'gain' : 'loss';
      var pctSign  = s.changePct >= 0 ? '+' : '';
      return '<tr>' +
        '<td><strong>' + Utils.escHtml(s.symbol) + '</strong></td>' +
        '<td>' + Utils.formatCurrency(s.ltp) + '</td>' +
        '<td class="' + pctClass + '">' + pctSign + s.changePct.toFixed(2) + '%</td>' +
        '<td>' + Utils.formatCurrency(s.high52w) + '</td>' +
        '<td>' + Utils.formatCurrency(s.low52w) + '</td>' +
      '</tr>';
    }).join('');

    App.openModal('modal-watchlist-view');
  }

  /* ---- DELETE CATEGORY ---- */
  function deleteCategory(id) {
    const wl  = Storage.getWatchlist();
    const cat = wl[id];
    if (!cat) return;

    const confirmText = document.getElementById('confirm-text');
    const confirmBtn  = document.getElementById('btn-confirm-ok');

    confirmText.textContent = 'Delete watchlist "' + cat.name + '" (' + cat.stocks.length + ' stocks)?';

    function handler() {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');
      Storage.deleteWatchlistCategory(id);
      renderWatchlist();
      App.toast(cat.name + ' watchlist deleted', 'success');
    }

    confirmBtn.addEventListener('click', handler);
    App.openModal('modal-confirm');
  }

  /* ---- INIT ---- */
  function init() {
    const importBtn  = document.getElementById('btn-import-watchlist');
    const fileInput  = document.getElementById('watchlist-file-input');

    importBtn.addEventListener('click', function () { fileInput.click(); });

    fileInput.addEventListener('change', function () {
      var files = Array.from(this.files);
      files.forEach(function (f) { parseCSVFile(f); });
      this.value = '';
    });

    document.getElementById('watchlist-categories-grid').addEventListener('click', function (e) {
      var viewBtn   = e.target.closest('[data-view-cat]');
      var deleteBtn = e.target.closest('[data-delete-cat]');
      if (viewBtn)   openViewModal(viewBtn.dataset.viewCat);
      if (deleteBtn) deleteCategory(deleteBtn.dataset.deleteCat);
    });

    renderWatchlist();
  }

  window.Watchlist = { init: init, render: renderWatchlist };
})();
