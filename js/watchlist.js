(function () {
  'use strict';

  /* ---- BUILT-IN NIFTY PRESETS ---- */
  const NIFTY_PRESETS = {
    'NIFTY-50': {
      id: 'NIFTY-50',
      name: 'NIFTY 50',
      description: 'Top 50 large-cap companies listed on NSE',
      stocks: [
        { symbol: 'RELIANCE', ltp: 2950.00, changePct: 0.85, high52w: 3217.90, low52w: 2220.30 },
        { symbol: 'TCS', ltp: 4180.00, changePct: -0.45, high52w: 4585.90, low52w: 3313.00 },
        { symbol: 'HDFCBANK', ltp: 1650.00, changePct: 1.15, high52w: 1794.00, low52w: 1363.55 },
        { symbol: 'ICICIBANK', ltp: 1220.00, changePct: 0.65, high52w: 1300.00, low52w: 910.00 },
        { symbol: 'INFY', ltp: 1880.00, changePct: -0.20, high52w: 1991.45, low52w: 1355.00 },
        { symbol: 'BHARTIARTL', ltp: 1590.00, changePct: 1.45, high52w: 1712.00, low52w: 865.00 },
        { symbol: 'ITC', ltp: 490.00, changePct: 0.35, high52w: 528.55, low52w: 399.30 },
        { symbol: 'SBIN', ltp: 815.00, changePct: -0.80, high52w: 912.00, low52w: 555.00 },
        { symbol: 'LT', ltp: 3620.00, changePct: 0.90, high52w: 3919.90, low52w: 2855.00 },
        { symbol: 'HINDUNILVR', ltp: 2750.00, changePct: 0.10, high52w: 3035.00, low52w: 2170.25 },
        { symbol: 'TATAMOTORS', ltp: 980.00, changePct: -1.25, high52w: 1179.05, low52w: 593.50 },
        { symbol: 'BAJFINANCE', ltp: 7100.00, changePct: 0.40, high52w: 8192.00, low52w: 6150.00 },
        { symbol: 'MARUTI', ltp: 12400.00, changePct: 0.75, high52w: 13680.00, low52w: 9250.00 },
        { symbol: 'SUNPHARMA', ltp: 1780.00, changePct: 1.10, high52w: 1960.00, low52w: 1070.00 },
        { symbol: 'NTPC', ltp: 410.00, changePct: 0.50, high52w: 448.45, low52w: 210.00 },
        { symbol: 'TITAN', ltp: 3450.00, changePct: -0.30, high52w: 3886.95, low52w: 3055.00 },
        { symbol: 'POWERGRID', ltp: 330.00, changePct: 0.20, high52w: 366.25, low52w: 195.00 },
        { symbol: 'AXISBANK', ltp: 1190.00, changePct: -0.65, high52w: 1339.65, low52w: 935.00 },
        { symbol: 'KOTAKBANK', ltp: 1810.00, changePct: 0.30, high52w: 1932.00, low52w: 1544.00 },
        { symbol: 'ADANIENT', ltp: 3050.00, changePct: 1.80, high52w: 3743.00, low52w: 2050.00 }
      ]
    },
    'NIFTY-BANK': {
      id: 'NIFTY-BANK',
      name: 'NIFTY Bank',
      description: 'Premier banking sector index of NSE',
      stocks: [
        { symbol: 'HDFCBANK', ltp: 1650.00, changePct: 1.15, high52w: 1794.00, low52w: 1363.55 },
        { symbol: 'ICICIBANK', ltp: 1220.00, changePct: 0.65, high52w: 1300.00, low52w: 910.00 },
        { symbol: 'SBIN', ltp: 815.00, changePct: -0.80, high52w: 912.00, low52w: 555.00 },
        { symbol: 'AXISBANK', ltp: 1190.00, changePct: -0.65, high52w: 1339.65, low52w: 935.00 },
        { symbol: 'KOTAKBANK', ltp: 1810.00, changePct: 0.30, high52w: 1932.00, low52w: 1544.00 },
        { symbol: 'INDUSINDBK', ltp: 1420.00, changePct: -1.10, high52w: 1694.00, low52w: 1260.00 },
        { symbol: 'BANKBARODA', ltp: 245.00, changePct: 0.45, high52w: 298.45, low52w: 185.00 },
        { symbol: 'PNB', ltp: 108.00, changePct: -0.90, high52w: 142.90, low52w: 68.50 },
        { symbol: 'FEDERALBNK', ltp: 192.00, changePct: 0.80, high52w: 210.45, low52w: 132.00 },
        { symbol: 'IDFCFIRSTB', ltp: 74.50, changePct: -0.40, high52w: 93.40, low52w: 69.20 },
        { symbol: 'AUBANK', ltp: 630.00, changePct: 0.15, high52w: 813.00, low52w: 550.00 },
        { symbol: 'BANDHANBNK', ltp: 185.00, changePct: -1.50, high52w: 263.00, low52w: 165.00 }
      ]
    },
    'NIFTY-IT': {
      id: 'NIFTY-IT',
      name: 'NIFTY IT',
      description: 'Leading Information Technology enterprises',
      stocks: [
        { symbol: 'TCS', ltp: 4180.00, changePct: -0.45, high52w: 4585.90, low52w: 3313.00 },
        { symbol: 'INFY', ltp: 1880.00, changePct: -0.20, high52w: 1991.45, low52w: 1355.00 },
        { symbol: 'HCLTECH', ltp: 1790.00, changePct: 0.85, high52w: 1880.00, low52w: 1180.00 },
        { symbol: 'WIPRO', ltp: 535.00, changePct: -0.30, high52w: 580.00, low52w: 375.00 },
        { symbol: 'TECHM', ltp: 1620.00, changePct: 1.10, high52w: 1710.00, low52w: 1080.00 },
        { symbol: 'LTIM', ltp: 5950.00, changePct: -0.75, high52w: 6440.00, low52w: 4500.00 },
        { symbol: 'PERSISTENT', ltp: 5120.00, changePct: 1.40, high52w: 5490.00, low52w: 3400.00 },
        { symbol: 'COFORGE', ltp: 7200.00, changePct: 0.95, high52w: 7850.00, low52w: 4300.00 },
        { symbol: 'LTTS', ltp: 5200.00, changePct: -0.50, high52w: 5900.00, low52w: 4100.00 },
        { symbol: 'MPHASIS', ltp: 2850.00, changePct: 0.60, high52w: 3180.00, low52w: 2150.00 }
      ]
    },
    'NIFTY-AUTO': {
      id: 'NIFTY-AUTO',
      name: 'NIFTY Auto',
      description: 'Automobile manufacturers and component makers',
      stocks: [
        { symbol: 'TATAMOTORS', ltp: 980.00, changePct: -1.25, high52w: 1179.05, low52w: 593.50 },
        { symbol: 'MARUTI', ltp: 12400.00, changePct: 0.75, high52w: 13680.00, low52w: 9250.00 },
        { symbol: 'M&M', ltp: 2980.00, changePct: 1.50, high52w: 3220.00, low52w: 1450.00 },
        { symbol: 'BAJAJ-AUTO', ltp: 10400.00, changePct: 0.80, high52w: 12774.00, low52w: 4900.00 },
        { symbol: 'EICHERMOT', ltp: 4750.00, changePct: -0.40, high52w: 5100.00, low52w: 3300.00 },
        { symbol: 'HEROMOTOCO', ltp: 5100.00, changePct: 0.30, high52w: 5890.00, low52w: 2900.00 },
        { symbol: 'TVSMOTOR', ltp: 2450.00, changePct: 1.20, high52w: 2950.00, low52w: 1500.00 },
        { symbol: 'BHARATFORG', ltp: 1520.00, changePct: -0.60, high52w: 1720.00, low52w: 980.00 },
        { symbol: 'ASHOKLEY', ltp: 220.00, changePct: 0.50, high52w: 250.00, low52w: 160.00 }
      ]
    },
    'NIFTY-PHARMA': {
      id: 'NIFTY-PHARMA',
      name: 'NIFTY Pharma',
      description: 'Pharmaceutical, healthcare and biotech companies',
      stocks: [
        { symbol: 'SUNPHARMA', ltp: 1780.00, changePct: 1.10, high52w: 1960.00, low52w: 1070.00 },
        { symbol: 'CIPLA', ltp: 1560.00, changePct: 0.40, high52w: 1702.00, low52w: 1130.00 },
        { symbol: 'DRREDDY', ltp: 6600.00, changePct: -0.80, high52w: 7100.00, low52w: 5200.00 },
        { symbol: 'DIVISLAB', ltp: 5600.00, changePct: 1.30, high52w: 6150.00, low52w: 3350.00 },
        { symbol: 'LUPIN', ltp: 2150.00, changePct: 0.70, high52w: 2300.00, low52w: 1050.00 },
        { symbol: 'ZYDUSLIFE', ltp: 1080.00, changePct: -0.50, high52w: 1320.00, low52w: 570.00 },
        { symbol: 'TORNTPHARM', ltp: 3300.00, changePct: 0.90, high52w: 3600.00, low52w: 1800.00 },
        { symbol: 'AUROPHARMA', ltp: 1450.00, changePct: 0.20, high52w: 1580.00, low52w: 800.00 }
      ]
    },
    'NIFTY-FMCG': {
      id: 'NIFTY-FMCG',
      name: 'NIFTY FMCG',
      description: 'Fast-Moving Consumer Goods manufacturers',
      stocks: [
        { symbol: 'ITC', ltp: 490.00, changePct: 0.35, high52w: 528.55, low52w: 399.30 },
        { symbol: 'HINDUNILVR', ltp: 2750.00, changePct: 0.10, high52w: 3035.00, low52w: 2170.25 },
        { symbol: 'NESTLEIND', ltp: 2450.00, changePct: -0.40, high52w: 2775.00, low52w: 2140.00 },
        { symbol: 'BRITANNIA', ltp: 5850.00, changePct: 0.60, high52w: 6470.00, low52w: 4500.00 },
        { symbol: 'TATACONSUM', ltp: 1120.00, changePct: -0.30, high52w: 1269.00, low52w: 820.00 },
        { symbol: 'DABUR', ltp: 540.00, changePct: 0.20, high52w: 672.00, low52w: 490.00 },
        { symbol: 'GODREJCP', ltp: 1280.00, changePct: 0.80, high52w: 1530.00, low52w: 960.00 },
        { symbol: 'MARICO', ltp: 630.00, changePct: -0.15, high52w: 705.00, low52w: 485.00 }
      ]
    },
    'NIFTY-ENERGY': {
      id: 'NIFTY-ENERGY',
      name: 'NIFTY Energy',
      description: 'Petroleum, gas and power generation giants',
      stocks: [
        { symbol: 'RELIANCE', ltp: 2950.00, changePct: 0.85, high52w: 3217.90, low52w: 2220.30 },
        { symbol: 'NTPC', ltp: 410.00, changePct: 0.50, high52w: 448.45, low52w: 210.00 },
        { symbol: 'POWERGRID', ltp: 330.00, changePct: 0.20, high52w: 366.25, low52w: 195.00 },
        { symbol: 'ONGC', ltp: 295.00, changePct: -0.70, high52w: 345.00, low52w: 175.00 },
        { symbol: 'BPCL', ltp: 345.00, changePct: 0.30, high52w: 395.00, low52w: 165.00 },
        { symbol: 'COALINDIA', ltp: 485.00, changePct: 1.10, high52w: 540.00, low52w: 230.00 },
        { symbol: 'TATAPOWER', ltp: 435.00, changePct: 0.40, high52w: 495.00, low52w: 215.00 },
        { symbol: 'IOC', ltp: 168.00, changePct: -0.20, high52w: 197.00, low52w: 85.00 }
      ]
    }
  };

  let activeCategoryInModal = null;

  /* ---- NUMBER SANITIZATION ---- */
  function parseNum(str) {
    if (typeof str === 'number') return str;
    const clean = String(str || '')
      .replace(/[₹$,\s]/g, '')
      .replace(/^\((.*)\)$/, '-$1')
      .trim();
    return parseFloat(clean) || 0;
  }

  /* ---- EXCEL & CSV FILE PARSER ---- */
  function parseFile(file) {
    if (!file) return;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
          processRawRows(rawRows, file.name);
        } catch (err) {
          App.toast('Failed to parse Excel file: ' + err.message, 'error');
        }
      };
      reader.onerror = err => App.toast('File read error: ' + (err.message || 'Could not read file'), 'error');
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const text = e.target.result;
          Papa.parse(text, {
            skipEmptyLines: true,
            complete: result => processRawRows(result.data, file.name),
            error: err => App.toast('CSV error: ' + err.message, 'error')
          });
        } catch (err) {
          App.toast('Failed to parse CSV: ' + err.message, 'error');
        }
      };
      reader.onerror = err => App.toast('File read error: ' + (err.message || 'Could not read file'), 'error');
      reader.readAsText(file);
    }
  }

  function processRawRows(rawRows, filename) {
    if (!rawRows || rawRows.length < 2) {
      App.toast('File appears empty or invalid', 'error');
      return;
    }

    // Find header row containing "SYMBOL" or "COMPANY"
    let headerIdx = -1;
    for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
      const row = rawRows[i].map(c => String(c).trim().toUpperCase());
      if (row.some(c => c.includes('SYMBOL') || c.includes('SECURITY') || c.includes('STOCK'))) {
        headerIdx = i;
        break;
      }
    }

    let rawCategoryName = '';
    // Look above header row or use filename for category name
    if (headerIdx > 0 && rawRows[0][0]) {
      rawCategoryName = String(rawRows[0][0]).trim();
    }
    if (!rawCategoryName) {
      rawCategoryName = filename.replace(/\.(csv|xlsx|xls)$/i, '').replace(/[-_]/g, ' ').toUpperCase();
    }

    const headers = (headerIdx !== -1 ? rawRows[headerIdx] : rawRows[0]).map(c => String(c).trim().toUpperCase());
    const dataRows = rawRows.slice(headerIdx !== -1 ? headerIdx + 1 : 1);

    const symbolCol = headers.findIndex(h => h.includes('SYMBOL') || h.includes('TICKER') || h.includes('SECURITY'));
    const ltpCol = headers.findIndex(h => h.includes('LTP') || h.includes('PRICE') || h.includes('LAST') || h.includes('CLOSE'));
    const chgCol = headers.findIndex(h => h.includes('%') || h.includes('CHG') || h.includes('CHANGE'));
    const highCol = headers.findIndex(h => h.includes('52W H') || h.includes('HIGH') || h.includes('52 W H'));
    const lowCol = headers.findIndex(h => h.includes('52W L') || h.includes('LOW') || h.includes('52 W L'));

    if (symbolCol === -1) {
      App.toast('Could not find Symbol column in the file', 'error');
      return;
    }

    const stocks = [];
    dataRows.forEach(row => {
      if (!row || !row[symbolCol]) return;
      let sym = String(row[symbolCol]).replace(/[",]/g, '').trim().toUpperCase();
      if (!sym || sym.startsWith('NIFTY') || sym === 'SYMBOL' || sym.startsWith('INDEX')) return;

      sym = window.PriceService ? PriceService.cleanSymbol(sym) : sym;

      stocks.push({
        symbol: sym,
        ltp: ltpCol !== -1 ? parseNum(row[ltpCol]) : 0,
        changePct: chgCol !== -1 ? parseNum(row[chgCol]) : 0,
        high52w: highCol !== -1 ? parseNum(row[highCol]) : 0,
        low52w: lowCol !== -1 ? parseNum(row[lowCol]) : 0
      });
    });

    if (stocks.length === 0) {
      App.toast('No valid stock symbols extracted from file', 'warn');
      return;
    }

    const catId = rawCategoryName.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase();

    Storage.upsertWatchlistCategory({
      id: catId,
      name: rawCategoryName,
      stocks: stocks,
      importedAt: new Date().toISOString()
    });

    renderWatchlist();
    App.toast(`Imported ${stocks.length} stocks for "${rawCategoryName}"`, 'success');
  }

  /* ---- PRESET LOADER ---- */
  function loadPreset(presetKey) {
    const preset = NIFTY_PRESETS[presetKey];
    if (!preset) return;

    Storage.upsertWatchlistCategory({
      id: preset.id,
      name: preset.name,
      stocks: preset.stocks,
      importedAt: new Date().toISOString()
    });

    renderWatchlist();
    App.toast(`Loaded ${preset.name} watchlist (${preset.stocks.length} stocks)`, 'success');
  }

  function loadAllPresets() {
    Object.values(NIFTY_PRESETS).forEach(preset => {
      Storage.upsertWatchlistCategory({
        id: preset.id,
        name: preset.name,
        stocks: preset.stocks,
        importedAt: new Date().toISOString()
      });
    });

    renderWatchlist();
    App.toast('All NIFTY Sectoral Watchlists successfully loaded!', 'success');
  }

  /* ---- RENDER CATEGORY GRID ---- */
  function renderWatchlist() {
    const wl = Storage.getWatchlist();
    const cats = Object.values(wl);
    const grid = document.getElementById('watchlist-categories-grid');

    const elCats = document.getElementById('wl-card-cats');
    const elStocks = document.getElementById('wl-card-stocks');
    if (elCats) elCats.textContent = cats.length;
    if (elStocks) elStocks.textContent = cats.reduce((s, c) => s + c.stocks.length, 0);

    if (!grid) return;

    if (cats.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;background:var(--card-bg);padding:2.5rem;border-radius:12px;text-align:center;border:1px dashed var(--border)">
          <div style="font-size:2.5rem;margin-bottom:.5rem">📊</div>
          <h3 style="margin-bottom:.5rem">No Watchlists Added Yet</h3>
          <p style="color:var(--text-muted);margin-bottom:1.5rem;max-width:500px;margin-left:auto;margin-right:auto">
            You can load built-in NIFTY sectoral watchlists with one click, or import custom CSV / Excel sheets from the NSE website.
          </p>
          <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="Watchlist.loadAllPresets()">⚡ Load All NIFTY Watchlists</button>
            <button class="btn btn-secondary" id="btn-empty-import" onclick="document.getElementById('watchlist-file-input').click()">📁 Import CSV/Excel</button>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = cats.map(cat => {
      const dateStr = cat.importedAt ? Utils.formatDate(cat.importedAt) : 'Preset';
      const sampleStocks = cat.stocks.slice(0, 4).map(s => s.symbol).join(', ') + (cat.stocks.length > 4 ? '...' : '');

      return `
        <div class="wl-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div class="wl-card-name">${Utils.escHtml(cat.name)}</div>
              <div class="wl-card-meta">${cat.stocks.length} stocks &middot; ${dateStr}</div>
            </div>
            <span class="badge" style="background:#e0f2fe;color:#0369a1;font-weight:600">${cat.stocks.length} Stocks</span>
          </div>
          <div style="margin:.75rem 0;font-size:.8rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
            ${Utils.escHtml(sampleStocks)}
          </div>
          <div class="btn-group" style="margin-top:.75rem">
            <button class="btn btn-secondary btn-sm" data-view-cat="${cat.id}">👁️ View Stocks</button>
            <button class="btn btn-secondary btn-sm" data-refresh-cat="${cat.id}" title="Refresh Live Prices">&#8635; Refresh</button>
            <button class="btn btn-danger btn-sm" data-delete-cat="${cat.id}" title="Delete Category">&#128465;</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ---- VIEW MODAL ---- */
  function openViewModal(id) {
    const wl = Storage.getWatchlist();
    const cat = wl[id];
    if (!cat) return;
    activeCategoryInModal = id;

    const titleEl = document.getElementById('wl-view-title');
    if (titleEl) titleEl.textContent = `${cat.name} (${cat.stocks.length} stocks)`;

    renderModalStocks(cat);
    App.openModal('modal-watchlist-view');
  }

  function renderModalStocks(cat) {
    const tbody = document.getElementById('wl-stocks-tbody');
    if (!tbody) return;

    tbody.innerHTML = cat.stocks.map(s => {
      const pData = Storage.getPrice(s.symbol);
      const ltp = pData && pData.price ? pData.price : (s.ltp || 0);
      const changePct = pData && pData.changePct != null ? pData.changePct : (s.changePct || 0);
      const high52 = pData && pData.fiftyTwoWeekHigh ? pData.fiftyTwoWeekHigh : (s.high52w || 0);
      const low52 = pData && pData.fiftyTwoWeekLow ? pData.fiftyTwoWeekLow : (s.low52w || 0);

      const pctClass = changePct >= 0 ? 'gain' : 'loss';
      const pctSign = changePct >= 0 ? '+' : '';

      return `<tr>
        <td style="text-align:left">
          <strong>${Utils.escHtml(s.symbol)}</strong>
        </td>
        <td><strong>${Utils.formatCurrency(ltp)}</strong></td>
        <td class="${pctClass}">${pctSign}${changePct.toFixed(2)}%</td>
        <td class="col-hide-md">${high52 ? Utils.formatCurrency(high52) : '—'}</td>
        <td class="col-hide-md">${low52 ? Utils.formatCurrency(low52) : '—'}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="Watchlist.quickAddToPlan('${s.symbol}', ${ltp})" title="Set purchase target for ${s.symbol}">+ Plan</button>
        </td>
      </tr>`;
    }).join('');
  }

  /* ---- REFRESH CATEGORY PRICES ---- */
  async function refreshCategoryPrices(id) {
    const wl = Storage.getWatchlist();
    const cat = wl[id];
    if (!cat || !cat.stocks.length) return;

    if (window.PriceService) {
      App.toast(`Fetching live prices for ${cat.name}...`, 'info');
      await PriceService.fetchMultiple(cat.stocks);

      // Update cached values in watchlist storage
      cat.stocks.forEach(s => {
        const p = Storage.getPrice(s.symbol);
        if (p && p.price) {
          s.ltp = p.price;
          s.changePct = p.changePct || 0;
          if (p.fiftyTwoWeekHigh) s.high52w = p.fiftyTwoWeekHigh;
          if (p.fiftyTwoWeekLow) s.low52w = p.fiftyTwoWeekLow;
        }
      });
      Storage.upsertWatchlistCategory(cat);

      if (activeCategoryInModal === id) {
        renderModalStocks(cat);
      }
      renderWatchlist();
      App.toast(`Live prices updated for ${cat.name}`, 'success');
    }
  }

  /* ---- QUICK ADD TO PLAN HELPER ---- */
  function quickAddToPlan(symbol, curPrice) {
    App.closeModal('modal-watchlist-view');
    // Switch to Plan tab
    const tabPlanBtn = document.querySelector('.tab-btn[data-tab="plan"]');
    if (tabPlanBtn) tabPlanBtn.click();

    setTimeout(() => {
      const btnAdd = document.getElementById('btn-add-plan');
      if (btnAdd) btnAdd.click();

      setTimeout(() => {
        const inpSym = document.getElementById('p-symbol');
        const inpPrice = document.getElementById('p-price');
        const catSel = document.getElementById('p-category');

        if (catSel) {
          catSel.value = '';
          const symbolGroup = document.getElementById('p-symbol-group');
          const stockGroup = document.getElementById('p-stock-select-group');
          if (symbolGroup) symbolGroup.style.display = '';
          if (stockGroup) stockGroup.style.display = 'none';
        }

        if (inpSym) inpSym.value = symbol;
        if (inpPrice && curPrice) inpPrice.value = (curPrice * 0.97).toFixed(2); // default target 3% lower
      }, 100);
    }, 150);
  }

  /* ---- DELETE CATEGORY ---- */
  function deleteCategory(id) {
    const wl = Storage.getWatchlist();
    const cat = wl[id];
    if (!cat) return;

    const confirmText = document.getElementById('confirm-text');
    const confirmBtn = document.getElementById('btn-confirm-ok');

    confirmText.innerHTML = `Delete watchlist <strong>"${Utils.escHtml(cat.name)}"</strong> (${cat.stocks.length} stocks)?`;

    function handler() {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');
      Storage.deleteWatchlistCategory(id);
      renderWatchlist();
      App.toast(`Watchlist "${cat.name}" deleted.`, 'success');
    }

    confirmBtn.addEventListener('click', handler);
    App.openModal('modal-confirm');
  }

  /* ---- INIT ---- */
  function init() {
    const importBtn = document.getElementById('btn-import-watchlist');
    const fileInput = document.getElementById('watchlist-file-input');

    if (importBtn && fileInput) {
      importBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', function () {
        const files = Array.from(this.files);
        files.forEach(f => parseFile(f));
        this.value = '';
      });
    }

    const grid = document.getElementById('watchlist-categories-grid');
    if (grid) {
      grid.addEventListener('click', e => {
        const viewBtn = e.target.closest('[data-view-cat]');
        const refreshBtn = e.target.closest('[data-refresh-cat]');
        const deleteBtn = e.target.closest('[data-delete-cat]');

        if (viewBtn) openViewModal(viewBtn.dataset.viewCat);
        if (refreshBtn) refreshCategoryPrices(refreshBtn.dataset.refreshCat);
        if (deleteBtn) deleteCategory(deleteBtn.dataset.deleteCat);
      });
    }

    renderWatchlist();
  }

  window.Watchlist = {
    init,
    render: renderWatchlist,
    loadPreset,
    loadAllPresets,
    quickAddToPlan,
    refreshCategoryPrices
  };
})();
