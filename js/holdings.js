(function () {
  'use strict';

  const { formatCurrency, formatPercent, formatNumber, escHtml, generateId } = window.Utils;

  let sortCol = 'symbol';
  let sortDir = 'asc';
  let pendingDeleteId = null;
  let pendingDeleteSymbol = '';

  /* ---- P&L CALCULATION ---- */
  function calcRow(h, prices) {
    const p = prices[h.symbol];
    const currentPrice = p ? p.price : null;
    const earnedQty = parseFloat(h.earnedQty) || 0;
    const invested = h.avgBuyPrice * h.qty;
    const currentValue = currentPrice != null ? currentPrice * h.qty : null;
    const earnedValue = currentPrice != null ? currentPrice * earnedQty : (h.avgBuyPrice * earnedQty);
    const pnlRs = currentValue != null ? currentValue - invested : null;
    const pnlPct = pnlRs != null ? (pnlRs / invested) * 100 : null;
    return { ...h, earnedQty, earnedValue, currentPrice, invested, currentValue, pnlRs, pnlPct, priceData: p || null };
  }

  function getEnrichedHoldings() {
    const holdings = Storage.getHoldings();
    const prices = Storage.getPrices();
    return holdings.map(h => calcRow(h, prices));
  }

  /* ---- SORT ---- */
  function sortHoldings(rows) {
    return [...rows].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /* ---- STALENESS DOT ---- */
  function stalenessClass(priceData) {
    if (!priceData) return 'none';
    const fetchedAt = new Date(priceData.fetchedAt);
    if (isNaN(fetchedAt)) return 'none';
    const ageMs = Date.now() - fetchedAt.getTime();
    const ageMins = ageMs / 60000;
    if (ageMins < Config.PRICE_STALE_MINUTES) return 'fresh';
    if (ageMins < Config.PRICE_VERY_STALE_HOURS * 60) return 'warn';
    return 'stale';
  }

  function stalenessTitle(priceData) {
    if (!priceData) return 'No price data';
    return 'Last updated: ' + Utils.formatDate(priceData.fetchedAt) +
           (priceData.source === 'manual' ? ' (manual)' : ' (auto)');
  }

  /* ---- RENDER TABLE ---- */
  function renderHoldings() {
    const rows = sortHoldings(getEnrichedHoldings());
    const tbody = document.getElementById('holdings-tbody');
    const tfoot = document.getElementById('holdings-tfoot');

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state">
        <div class="empty-state-icon">&#128202;</div>
        <p>No holdings yet. Add one or import a CSV file.</p>
      </div></td></tr>`;
      tfoot.innerHTML = '';
      updateSummaryCards(rows);
      return;
    }

    let totalInvested = 0, totalCurrent = 0, totalPnl = 0, totalEarnedVal = 0, totalEarnedQty = 0, earnedCount = 0;

    tbody.innerHTML = rows.map(r => {
      totalInvested += r.invested;
      if (r.currentValue != null) totalCurrent += r.currentValue;
      if (r.pnlRs != null) totalPnl += r.pnlRs;
      if (r.earnedQty > 0) {
        totalEarnedVal += r.earnedValue;
        totalEarnedQty += r.earnedQty;
        earnedCount++;
      }

      const dotClass = stalenessClass(r.priceData);
      const pnlClass = r.pnlRs == null ? 'neutral' : r.pnlRs > 0 ? 'gain' : r.pnlRs < 0 ? 'loss' : 'neutral';
      const yahooSuffix = r.exchange === 'BSE' ? Config.BSE_SUFFIX : Config.DEFAULT_EXCHANGE_SUFFIX;
      const yahooUrl = `https://finance.yahoo.com/quote/${encodeURIComponent(r.symbol + yahooSuffix)}`;

      const qtyFmt = formatNumber(r.qty, r.qty % 1 === 0 ? 0 : 3);
      let earnedBadgeHtml = '';
      if (r.earnedQty > 0) {
        const earnedQtyFmt = formatNumber(r.earnedQty, r.earnedQty % 1 === 0 ? 0 : 3);
        const earnedValFmt = formatCurrency(r.earnedValue);
        if (r.earnedQty >= r.qty) {
          earnedBadgeHtml = `<div style="margin-top:3px"><span class="badge badge-free" title="${r.qty} shares valued at ${earnedValFmt} funded 100% from realized profits (₹0 net cost basis)">🌟 100% Free</span></div>`;
        } else {
          earnedBadgeHtml = `<div style="margin-top:3px"><span class="badge badge-earned" title="${earnedQtyFmt} of ${qtyFmt} shares valued at ${earnedValFmt} funded from realized profits">🎁 ${earnedQtyFmt} Earned</span></div>`;
        }
      }

      return `<tr data-id="${escHtml(r.id)}">
        <td>
          <a class="sym-link" href="${yahooUrl}" target="_blank" rel="noopener" title="View on Yahoo Finance">${escHtml(r.symbol)}</a>
          <span class="exchange-badge">${escHtml(r.exchange)}</span>
        </td>
        <td class="col-hide-md" title="${escHtml(r.name)}">${escHtml(r.name.length > 28 ? r.name.slice(0, 26) + '…' : r.name)}</td>
        <td>
          <div>${qtyFmt}</div>
          ${earnedBadgeHtml}
        </td>
        <td>${formatCurrency(r.avgBuyPrice)}</td>
        <td class="price-cell" data-symbol="${escHtml(r.symbol)}" title="Click to edit price manually">
          <span class="price-wrap">
            <span class="stale-dot ${dotClass}" title="${escHtml(stalenessTitle(r.priceData))}"></span>
            <span class="price-val">${r.currentPrice != null ? formatCurrency(r.currentPrice) : '<span class="text-muted">—</span>'}</span>
          </span>
        </td>
        <td>${r.currentValue != null ? formatCurrency(r.currentValue) : '<span class="text-muted">—</span>'}</td>
        <td class="${pnlClass}">${r.pnlRs != null ? formatCurrency(r.pnlRs) : '—'}</td>
        <td class="${pnlClass}">${r.pnlPct != null ? formatPercent(r.pnlPct) : '—'}</td>
        <td>
          <button class="action-btn edit-btn" data-id="${escHtml(r.id)}" title="Edit">&#9998;</button>
          <button class="action-btn del del-btn" data-id="${escHtml(r.id)}" data-symbol="${escHtml(r.symbol)}" title="Delete">&#128465;</button>
        </td>
      </tr>`;
    }).join('');

    // Totals row
    const totalPnlClass = totalPnl > 0 ? 'gain' : totalPnl < 0 ? 'loss' : '';
    const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    tfoot.innerHTML = `<tr>
      <td colspan="2">Total</td>
      <td>${totalEarnedQty > 0 ? `<span class="badge badge-earned" style="font-size:.7rem">🎁 ${formatNumber(totalEarnedQty)} Free</span>` : ''}</td>
      <td></td>
      <td></td>
      <td class="fw-bold">${formatCurrency(totalCurrent)}</td>
      <td class="fw-bold ${totalPnlClass}">${formatCurrency(totalPnl)}</td>
      <td class="fw-bold ${totalPnlClass}">${formatPercent(totalPnlPct)}</td>
      <td></td>
    </tr>`;

    updateSummaryCards(rows, totalInvested, totalCurrent, totalPnl, totalPnlPct, totalEarnedVal, totalEarnedQty, earnedCount);
    window.Charts && window.Charts.update(rows);
  }

  function updateSummaryCards(rows, totalInvested, totalCurrent, totalPnl, totalPnlPct, totalEarnedVal, totalEarnedQty, earnedCount) {
    const invested = totalInvested || 0;
    const current = totalCurrent || 0;
    const pnl = totalPnl || 0;
    const pnlPct = totalPnlPct || 0;
    const earnedVal = totalEarnedVal || 0;
    const earnedShares = totalEarnedQty || 0;
    const countWithEarned = earnedCount || 0;

    document.getElementById('card-invested').textContent = formatCurrency(invested);
    document.getElementById('card-current').textContent = formatCurrency(current);

    const pnlEl = document.getElementById('card-pnl');
    pnlEl.textContent = formatCurrency(pnl);
    pnlEl.className = 'card-value ' + (pnl > 0 ? 'gain' : pnl < 0 ? 'loss' : '');

    document.getElementById('card-pnl-pct').textContent = formatPercent(pnlPct);
    document.getElementById('card-count').textContent = rows.length;

    const elEarnedVal = document.getElementById('card-earned-value');
    const elEarnedSub = document.getElementById('card-earned-sub');
    if (elEarnedVal) elEarnedVal.textContent = formatCurrency(earnedVal);
    if (elEarnedSub) {
      elEarnedSub.textContent = earnedShares > 0
        ? `${formatNumber(earnedShares)} shares in ${countWithEarned} stock${countWithEarned !== 1 ? 's' : ''}`
        : '0 shares (₹0 value)';
    }

    const prices = Storage.getPrices();
    const freshCount = rows.filter(r => prices[r.symbol] && prices[r.symbol].fetchedAt).length;
    document.getElementById('card-last-refresh').textContent = freshCount > 0 ? `${freshCount} with prices` : 'No prices yet';
  }

  /* ---- SORT HEADER CLICK ---- */
  function updateSortHeaders() {
    document.querySelectorAll('#holdings-table th[data-col]').forEach(th => {
      th.classList.remove('sorted');
      const icon = th.querySelector('.sort-icon');
      if (icon) icon.innerHTML = '&#8597;';
      if (th.dataset.col === sortCol) {
        th.classList.add('sorted');
        if (icon) icon.innerHTML = sortDir === 'asc' ? '&#8593;' : '&#8595;';
      }
    });
  }

  /* ---- ADD / EDIT MODAL ---- */
  /* ---- STOCK SEARCH AUTOCOMPLETE FOR HOLDINGS ---- */
  let activeHIndex = -1;
  let filteredHStocks = [];

  function getAllStockPool() {
    const wl = Storage.getWatchlist();
    const map = new Map();
    Object.values(wl).forEach(cat => {
      (cat.stocks || []).forEach(s => {
        if (s.symbol && !map.has(s.symbol)) map.set(s.symbol, { ...s });
      });
    });
    Storage.getHoldings().forEach(h => {
      if (h.symbol && !map.has(h.symbol)) {
        map.set(h.symbol, { symbol: h.symbol, name: h.name || '', ltp: h.currentPrice || h.avgBuyPrice || 0, changePct: 0 });
      }
    });
    return Array.from(map.values());
  }

  function filterHStocks(query) {
    const stocks = getAllStockPool();
    if (!query || !query.trim()) return stocks.slice(0, 40);

    const rawQ = query.trim();
    const upperQ = rawQ.toUpperCase();

    let regex = null;
    if (rawQ.includes('*') || rawQ.includes('?')) {
      try {
        const pattern = rawQ.replace(/([.+^$[\]\\(){}|-])/g, '\\$1').replace(/\*/g, '.*').replace(/\?/g, '.');
        regex = new RegExp('^' + pattern + '$', 'i');
      } catch (e) {
        regex = null;
      }
    }

    const exact = [], prefix = [], substring = [], nameMatch = [];
    stocks.forEach(s => {
      const sym = (s.symbol || '').toUpperCase();
      const nm = (s.name || '').toUpperCase();
      if (regex) {
        if (regex.test(sym) || regex.test(nm)) substring.push(s);
      } else {
        if (sym === upperQ) exact.push(s);
        else if (sym.startsWith(upperQ)) prefix.push(s);
        else if (sym.includes(upperQ)) substring.push(s);
        else if (nm.includes(upperQ)) nameMatch.push(s);
      }
    });
    return [...exact, ...prefix, ...substring, ...nameMatch].slice(0, 50);
  }

  function renderHDropdown(stocks, query) {
    const dropdown = document.getElementById('h-stock-dropdown');
    if (!dropdown) return;
    filteredHStocks = stocks;
    activeHIndex = -1;

    if (!stocks || !stocks.length) {
      dropdown.innerHTML = `<div class="stock-dropdown-empty">No matching stocks found. Press Tab to use as custom symbol.</div>`;
      dropdown.classList.add('open');
      return;
    }

    let html = `
      <div class="stock-dropdown-header">
        <span><b>${stocks.length}</b> stock${stocks.length > 1 ? 's' : ''} available</span>
        <span>💡 Use <code>*</code> for wildcard</span>
      </div>
    `;

    html += stocks.map((s, idx) => {
      const pData = Storage.getPrice(s.symbol);
      const ltp = pData && pData.price ? pData.price : (s.ltp || 0);
      const chg = pData && pData.changePct != null ? pData.changePct : (s.changePct || 0);
      const sign = chg >= 0 ? '+' : '';
      const pctClass = chg >= 0 ? 'gain' : 'loss';

      return `
        <div class="stock-dropdown-item" data-idx="${idx}">
          <div class="stock-item-left">
            <div class="stock-item-sym">${escHtml(s.symbol)}</div>
            ${s.name ? `<div class="stock-item-name">${escHtml(s.name)}</div>` : ''}
          </div>
          <div class="stock-item-right">
            ${ltp > 0 ? `<div class="stock-item-price">${formatCurrency(ltp)}</div>` : ''}
            ${chg !== 0 ? `<span class="stock-item-pct ${pctClass}">${sign}${chg.toFixed(2)}%</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    dropdown.innerHTML = html;
    dropdown.classList.add('open');
  }

  function closeHDropdown() {
    const dd = document.getElementById('h-stock-dropdown');
    if (dd) dd.classList.remove('open');
    activeHIndex = -1;
  }

  function selectHStock(stock) {
    if (!stock) return;
    const symInp = document.getElementById('h-symbol');
    const nameInp = document.getElementById('h-name');
    const avgInp = document.getElementById('h-avg');
    const clearBtn = document.getElementById('h-stock-clear-btn');

    if (symInp) symInp.value = stock.symbol;
    if (nameInp && stock.name && !nameInp.value) nameInp.value = stock.name;

    const pData = Storage.getPrice(stock.symbol);
    const ltp = pData && pData.price ? pData.price : (stock.ltp || 0);
    if (avgInp && (!avgInp.value || avgInp.dataset.autoFilled === 'true') && ltp > 0) {
      avgInp.value = parseFloat(ltp).toFixed(2);
      avgInp.dataset.autoFilled = 'true';
    }

    if (clearBtn) clearBtn.style.display = 'block';
    closeHDropdown();
    if (symInp) symInp.focus();
  }

  function updateHSearch() {
    const symInp = document.getElementById('h-symbol');
    const clearBtn = document.getElementById('h-stock-clear-btn');
    const q = symInp ? symInp.value : '';
    if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
    const filtered = filterHStocks(q);
    renderHDropdown(filtered, q);
  }

  function openAddModal() {
    document.getElementById('holding-modal-title').textContent = 'Add Holding';
    document.getElementById('holding-id').value = '';
    document.getElementById('h-symbol').value = '';
    document.getElementById('h-exchange').value = 'NSE';
    document.getElementById('h-name').value = '';
    document.getElementById('h-qty').value = '';
    document.getElementById('h-avg').value = '';
    document.getElementById('h-earned-qty').value = '';
    document.getElementById('h-notes').value = '';
    const clearBtn = document.getElementById('h-stock-clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    closeHDropdown();
    clearErrors();
    App.openModal('modal-holding');
    setTimeout(() => {
      const inp = document.getElementById('h-symbol');
      if (inp) {
        inp.focus();
        updateHSearch();
      }
    }, 100);
  }

  function openEditModal(id) {
    const holding = Storage.getHoldings().find(h => String(h.id) === String(id));
    if (!holding) return;
    document.getElementById('holding-modal-title').textContent = 'Edit Holding';
    document.getElementById('holding-id').value = holding.id;
    document.getElementById('h-symbol').value = holding.symbol;
    document.getElementById('h-exchange').value = holding.exchange || 'NSE';
    document.getElementById('h-name').value = holding.name;
    document.getElementById('h-qty').value = holding.qty;
    document.getElementById('h-avg').value = holding.avgBuyPrice;
    document.getElementById('h-earned-qty').value = (holding.earnedQty != null && holding.earnedQty > 0) ? holding.earnedQty : '';
    document.getElementById('h-notes').value = holding.notes || '';
    const clearBtn = document.getElementById('h-stock-clear-btn');
    if (clearBtn) clearBtn.style.display = holding.symbol ? 'block' : 'none';
    closeHDropdown();
    clearErrors();
    App.openModal('modal-holding');
    setTimeout(() => {
      const inp = document.getElementById('h-symbol');
      if (inp) inp.focus();
    }, 100);
  }

  function clearErrors() {
    ['h-symbol-err', 'h-name-err', 'h-qty-err', 'h-avg-err'].forEach(id => {
      document.getElementById(id).textContent = '';
    });
    ['h-symbol', 'h-name', 'h-qty', 'h-avg'].forEach(id => {
      document.getElementById(id).classList.remove('error');
    });
    const avgInp = document.getElementById('h-avg');
    if (avgInp) delete avgInp.dataset.autoFilled;
  }

  function validateAndSave() {
    clearErrors();
    let ok = true;

    const symbol = document.getElementById('h-symbol').value.trim().toUpperCase().replace(/\.(NS|BO)$/i, '');
    const name = document.getElementById('h-name').value.trim();
    const qty = parseFloat(document.getElementById('h-qty').value);
    const avg = parseFloat(document.getElementById('h-avg').value);
    const earnedQty = Math.max(0, parseFloat(document.getElementById('h-earned-qty').value) || 0);
    const exchange = document.getElementById('h-exchange').value;
    const notes = document.getElementById('h-notes').value.trim();
    const id = document.getElementById('holding-id').value || generateId();

    if (!symbol) { setErr('h-symbol', 'Symbol is required'); ok = false; }
    if (!name) { setErr('h-name', 'Company name is required'); ok = false; }
    if (!qty || qty <= 0) { setErr('h-qty', 'Enter a valid quantity'); ok = false; }
    if (!avg || avg <= 0) { setErr('h-avg', 'Enter a valid price'); ok = false; }

    if (!ok) return;

    Storage.upsertHolding({ id, symbol, name, qty, avgBuyPrice: avg, earnedQty, exchange, notes });
    App.closeModal('modal-holding');
    renderHoldings();
    App.toast(`Holding ${symbol} saved.`, 'success');

    // Fetch price for new symbol if not already present
    const existing = Storage.getPrice(symbol);
    if (!existing) {
      PriceService.fetchOne(symbol, exchange).then(() => renderHoldings());
    }
  }

  function setErr(id, msg) {
    document.getElementById(id + '-err').textContent = msg;
    document.getElementById(id).classList.add('error');
  }

  /* ---- DELETE ---- */
  function confirmDelete(id, symbol) {
    pendingDeleteId = id;
    pendingDeleteSymbol = symbol;
    document.getElementById('confirm-text').innerHTML =
      `Delete <span class="confirm-item">${escHtml(symbol)}</span>? This cannot be undone.`;
    App.openModal('modal-confirm');
  }

  function executeDelete() {
    if (!pendingDeleteId) return;
    Storage.deleteHolding(pendingDeleteId);
    App.closeModal('modal-confirm');
    renderHoldings();
    window.Funds && Funds.render();
    App.toast(`${pendingDeleteSymbol} deleted.`, 'success');
    pendingDeleteId = null;
  }

  /* ---- INLINE PRICE EDIT ---- */
  function startInlinePriceEdit(cell) {
    const symbol = cell.dataset.symbol;
    const priceWrap = cell.querySelector('.price-wrap');
    const currentText = cell.querySelector('.price-val') ? cell.querySelector('.price-val').textContent : '';
    const price = Storage.getPrice(symbol);
    const currentVal = price ? price.price : '';

    priceWrap.innerHTML = `<input class="price-input" type="number" step="0.01" min="0" value="${currentVal}" placeholder="Price">`;
    const input = priceWrap.querySelector('.price-input');
    input.focus();
    input.select();

    function commit() {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val > 0) {
        Storage.setPrice(symbol, { price: val, source: 'manual' });
        App.toast(`${symbol} price updated manually.`, 'success');
      }
      renderHoldings();
    }

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') renderHoldings();
    });
    input.addEventListener('blur', commit);
  }

  /* ---- TEMPLATE DOWNLOAD ---- */
  function downloadTemplate() {
    if (window.CSVParser && window.CSVParser.downloadTemplate) {
      window.CSVParser.downloadTemplate('xlsx');
    }
  }

  /* ---- INIT ---- */
  function init() {
    // Sort header clicks
    document.querySelectorAll('#holdings-table th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (sortCol === col) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortCol = col;
          sortDir = 'asc';
        }
        updateSortHeaders();
        renderHoldings();
      });
    });

    // Table action buttons (delegated)
    document.getElementById('holdings-tbody').addEventListener('click', e => {
      const editBtn = e.target.closest('.edit-btn');
      const delBtn = e.target.closest('.del-btn');
      const priceCell = e.target.closest('.price-cell');

      if (editBtn) { openEditModal(editBtn.dataset.id); return; }
      if (delBtn) { confirmDelete(delBtn.dataset.id, delBtn.dataset.symbol); return; }
      if (priceCell && !priceCell.querySelector('.price-input')) { startInlinePriceEdit(priceCell); return; }
    });

    // Toolbar buttons
    document.getElementById('btn-add-holding').addEventListener('click', openAddModal);
    document.getElementById('btn-save-holding').addEventListener('click', validateAndSave);
    document.getElementById('btn-confirm-ok').addEventListener('click', executeDelete);
    document.getElementById('btn-download-template').addEventListener('click', downloadTemplate);

    const hSymInp = document.getElementById('h-symbol');
    const hClearBtn = document.getElementById('h-stock-clear-btn');
    const hDropdown = document.getElementById('h-stock-dropdown');

    if (hSymInp) {
      hSymInp.addEventListener('input', updateHSearch);
      hSymInp.addEventListener('focus', updateHSearch);
      hSymInp.addEventListener('keydown', e => {
        if (!hDropdown || !hDropdown.classList.contains('open')) return;
        const items = hDropdown.querySelectorAll('.stock-dropdown-item');
        if (!items.length) return;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeHIndex = (activeHIndex + 1) % items.length;
          items.forEach((it, i) => it.classList.toggle('active', i === activeHIndex));
          if (items[activeHIndex]) items[activeHIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeHIndex = (activeHIndex - 1 + items.length) % items.length;
          items.forEach((it, i) => it.classList.toggle('active', i === activeHIndex));
          if (items[activeHIndex]) items[activeHIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter' && activeHIndex >= 0 && filteredHStocks[activeHIndex]) {
          e.preventDefault();
          e.stopPropagation();
          selectHStock(filteredHStocks[activeHIndex]);
        } else if (e.key === 'Escape') {
          closeHDropdown();
        }
      });
    }

    if (hClearBtn) {
      hClearBtn.addEventListener('click', e => {
        e.preventDefault();
        if (hSymInp) {
          hSymInp.value = '';
          hSymInp.focus();
        }
        hClearBtn.style.display = 'none';
        updateHSearch();
      });
    }

    if (hDropdown) {
      hDropdown.addEventListener('mousedown', e => {
        const it = e.target.closest('.stock-dropdown-item');
        if (it) {
          const idx = parseInt(it.dataset.idx, 10);
          if (!isNaN(idx) && filteredHStocks[idx]) {
            e.preventDefault();
            selectHStock(filteredHStocks[idx]);
          }
        }
      });
    }

    document.addEventListener('click', e => {
      if (!e.target.closest('#h-symbol-group')) {
        closeHDropdown();
      }
    });

    // Keyboard: Enter on holding modal
    document.getElementById('modal-holding').addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const dd = document.getElementById('h-stock-dropdown');
        if (dd && dd.classList.contains('open') && activeHIndex >= 0) return;
        validateAndSave();
      }
    });

    renderHoldings();
  }

  window.Holdings = { init, render: renderHoldings, calcRow, getEnrichedHoldings };
})();
