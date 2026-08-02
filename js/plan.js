(function () {
  'use strict';

  let pendingDeleteId = null;

  /* ---- SUMMARY CARDS ---- */
  function updateSummaryCards(plans) {
    const planned = plans.filter(p => p.status === 'planned');
    const executed = plans.filter(p => p.status === 'executed');
    const totalPlannedValue = planned.reduce((s, p) => s + (p.qty * p.targetPrice), 0);

    // Calculate how many are currently in buy zone (LTP <= Target Price)
    let inBuyZoneCount = 0;
    planned.forEach(p => {
      const pData = Storage.getPrice(p.symbol);
      if (pData && pData.price && pData.price <= p.targetPrice) {
        inBuyZoneCount++;
      }
    });

    const elTotal = document.getElementById('plan-card-total');
    const elPlanned = document.getElementById('plan-card-planned');
    const elExecuted = document.getElementById('plan-card-executed');
    const elValue = document.getElementById('plan-card-value');

    if (elTotal) elTotal.textContent = plans.length;
    if (elPlanned) {
      elPlanned.innerHTML = `${planned.length} ${inBuyZoneCount > 0 ? `<span class="badge badge-gain" style="font-size:.75rem;margin-left:.35rem">🎯 ${inBuyZoneCount} in Buy Zone</span>` : ''}`;
    }
    if (elExecuted) elExecuted.textContent = executed.length;
    if (elValue) elValue.textContent = Utils.formatCurrency(totalPlannedValue);
  }

  /* ---- RENDER PLANS TABLE ---- */
  function renderPlans() {
    const plans = Storage.getPlans();
    const tbody = document.getElementById('plan-tbody');
    const tfoot = document.getElementById('plan-tfoot');
    if (!tbody) return;

    updateSummaryCards(plans);

    if (plans.length === 0) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="10" style="padding:2rem;text-align:center;color:var(--text-muted)">No purchase plans yet. Click <strong>+ Add Plan</strong> to set target prices for stocks you want to buy.</td></tr>';
      if (tfoot) tfoot.innerHTML = '';
      return;
    }

    tbody.innerHTML = plans.map(plan => {
      const isExecuted = plan.status === 'executed';
      const targetValue = plan.qty * plan.targetPrice;
      const pData = Storage.getPrice(plan.symbol);
      const ltp = pData && pData.price ? pData.price : null;

      let ltpDisplay = '<span style="color:var(--text-muted)">—</span>';
      let statusBadge = '';

      if (isExecuted) {
        statusBadge = '<span class="badge badge-executed">&#10003; Executed</span>';
      } else if (ltp != null) {
        const diff = ((ltp - plan.targetPrice) / plan.targetPrice) * 100;
        const diffAbs = Math.abs(diff).toFixed(1);
        const sign = diff >= 0 ? '+' : '-';

        if (ltp <= plan.targetPrice) {
          ltpDisplay = `<strong>${Utils.formatCurrency(ltp)}</strong> <span class="badge badge-gain" style="font-size:.7rem;margin-left:.25rem">${sign}${diffAbs}%</span>`;
          statusBadge = '<span class="badge badge-gain" title="Market price is at or below your target price!">🎯 Buy Zone</span>';
        } else {
          ltpDisplay = `${Utils.formatCurrency(ltp)} <span class="badge badge-loss" style="font-size:.7rem;margin-left:.25rem">${sign}${diffAbs}%</span>`;
          statusBadge = `<span class="badge badge-planned" title="Market price is ${diffAbs}% above target">Above Target</span>`;
        }
      } else {
        statusBadge = '<span class="badge badge-planned">Planned</span>';
      }

      // Priority badge
      const priority = plan.priority || 'medium';
      let priorityBadge = '';
      if (priority === 'high') {
        priorityBadge = '<span class="badge" style="background:#fee2e2;color:#991b1b" title="High Priority">🔥 High</span>';
      } else if (priority === 'low') {
        priorityBadge = '<span class="badge" style="background:#f1f5f9;color:#475569" title="Low Priority">Low</span>';
      } else {
        priorityBadge = '<span class="badge" style="background:#e0f2fe;color:#0369a1" title="Medium Priority">Med</span>';
      }

      const catBadge = plan.categoryId
        ? `<span class="exchange-badge" style="background:#ede9fe;color:#5b21b6">${Utils.escHtml(plan.categoryId.replace(/-/g, ' '))}</span> `
        : '';

      return `<tr>
        <td><strong>${Utils.escHtml(plan.symbol)}</strong></td>
        <td>${catBadge}<span class="exchange-badge">${Utils.escHtml(plan.exchange || 'NSE')}</span></td>
        <td>${priorityBadge}</td>
        <td>${plan.qty}</td>
        <td><strong>${Utils.formatCurrency(plan.targetPrice)}</strong></td>
        <td>${ltpDisplay}</td>
        <td>${Utils.formatCurrency(targetValue)}</td>
        <td>${statusBadge}</td>
        <td class="col-hide-md" style="font-size:.85rem;color:var(--text-muted)">${Utils.escHtml(plan.notes || '—')}</td>
        <td>
          <div class="actions-cell">
            ${!isExecuted ? `<button class="action-btn execute-plan-btn" data-id="${plan.id}" title="Execute — add to Holdings" style="color:var(--gain);background:#ecfdf5;border-color:#a7f3d0">&#10003; Execute</button>` : ''}
            ${!isExecuted ? `<button class="action-btn edit-plan-btn" data-id="${plan.id}" title="Edit Plan">&#9998;</button>` : ''}
            <button class="action-btn delete-plan-btn" data-id="${plan.id}" title="Delete Plan">&#128465;</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    const plannedTotal = plans
      .filter(p => p.status === 'planned')
      .reduce((s, p) => s + (p.qty * p.targetPrice), 0);
    const executedTotal = plans
      .filter(p => p.status === 'executed')
      .reduce((s, p) => s + (p.qty * p.targetPrice), 0);

    if (tfoot) {
      tfoot.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:right;font-weight:600;color:var(--text-muted)">Total Planned Capital:</td>
          <td style="font-weight:700;color:var(--primary)">${Utils.formatCurrency(plannedTotal)}</td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="6" style="text-align:right;font-weight:600;color:var(--text-muted)">Total Executed:</td>
          <td style="font-weight:700;color:var(--gain)">${Utils.formatCurrency(executedTotal)}</td>
          <td colspan="3"></td>
        </tr>
      `;
    }
  }

  /* ---- CATEGORY & SELECT HELPERS ---- */
  function refreshCategorySelect() {
    const wl = Storage.getWatchlist();
    const sel = document.getElementById('p-category');
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">— Type symbol manually —</option>' +
      Object.values(wl).map(cat => `<option value="${cat.id}">${Utils.escHtml(cat.name)} (${cat.stocks.length})</option>`).join('');
    if (cur) sel.value = cur;
  }

  function onCategoryChange() {
    const catId = document.getElementById('p-category').value;
    const symbolGroup = document.getElementById('p-symbol-group');
    const stockGroup = document.getElementById('p-stock-select-group');

    if (!catId) {
      if (symbolGroup) symbolGroup.style.display = '';
      if (stockGroup) stockGroup.style.display = 'none';
      return;
    }

    if (symbolGroup) symbolGroup.style.display = 'none';
    if (stockGroup) stockGroup.style.display = '';

    const stocks = (Storage.getWatchlist()[catId] || {}).stocks || [];
    const stockSel = document.getElementById('p-stock-select');
    if (stockSel) {
      stockSel.innerHTML = '<option value="">— Select stock —</option>' +
        stocks.map(s => {
          const sign = s.changePct >= 0 ? '+' : '';
          return `<option value="${Utils.escHtml(s.symbol)}" data-ltp="${s.ltp || ''}">${Utils.escHtml(s.symbol)} — ₹${(s.ltp || 0).toFixed(2)} (${sign}${(s.changePct || 0).toFixed(2)}%)</option>`;
        }).join('');
    }

    const exchEl = document.getElementById('p-exchange');
    if (exchEl) exchEl.value = 'NSE';
  }

  function onStockSelectChange() {
    const stockSel = document.getElementById('p-stock-select');
    if (!stockSel || !stockSel.value) return;
    const opt = stockSel.selectedOptions[0];
    if (opt && opt.dataset.ltp) {
      const priceInput = document.getElementById('p-price');
      if (priceInput && !priceInput.value) {
        priceInput.value = parseFloat(opt.dataset.ltp).toFixed(2);
      }
    }
  }

  /* ---- MODAL HELPERS ---- */
  function clearErrors() {
    ['p-symbol-err', 'p-qty-err', 'p-price-err', 'p-stock-err'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['p-symbol', 'p-qty', 'p-price'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });
  }

  function openAddModal() {
    clearErrors();
    document.getElementById('plan-id').value = '';
    document.getElementById('p-qty').value = '';
    document.getElementById('p-price').value = '';
    document.getElementById('p-notes').value = '';
    document.getElementById('p-exchange').value = 'NSE';
    document.getElementById('p-symbol').value = '';
    const prioEl = document.getElementById('p-priority');
    if (prioEl) prioEl.value = 'medium';
    document.getElementById('plan-modal-title').textContent = 'Add Stock Purchase Plan';

    refreshCategorySelect();
    document.getElementById('p-category').value = '';
    onCategoryChange();

    App.openModal('modal-plan');
    setTimeout(() => {
      const inp = document.getElementById('p-symbol');
      if (inp) inp.focus();
    }, 50);
  }

  function openEditModal(id) {
    const plan = Storage.getPlans().find(p => p.id === id);
    if (!plan) return;

    clearErrors();
    document.getElementById('plan-id').value = plan.id;
    document.getElementById('p-qty').value = plan.qty;
    document.getElementById('p-price').value = plan.targetPrice;
    document.getElementById('p-notes').value = plan.notes || '';
    document.getElementById('p-exchange').value = plan.exchange || 'NSE';
    const prioEl = document.getElementById('p-priority');
    if (prioEl) prioEl.value = plan.priority || 'medium';
    document.getElementById('plan-modal-title').textContent = 'Edit Stock Purchase Plan';

    refreshCategorySelect();

    const catId = plan.categoryId || '';
    document.getElementById('p-category').value = catId;
    onCategoryChange();

    if (catId) {
      document.getElementById('p-stock-select').value = plan.symbol;
    } else {
      document.getElementById('p-symbol').value = plan.symbol;
    }

    App.openModal('modal-plan');
    setTimeout(() => {
      const inp = document.getElementById('p-symbol');
      if (inp) inp.focus();
    }, 50);
  }

  function validateAndSave() {
    clearErrors();

    const id = document.getElementById('plan-id').value.trim();
    const catId = document.getElementById('p-category').value;
    const exchange = document.getElementById('p-exchange').value;
    const qty = parseFloat(document.getElementById('p-qty').value);
    const price = parseFloat(document.getElementById('p-price').value);
    const notes = document.getElementById('p-notes').value.trim();
    const prioEl = document.getElementById('p-priority');
    const priority = prioEl ? prioEl.value : 'medium';

    let symbol = '';
    let valid = true;

    if (catId) {
      symbol = document.getElementById('p-stock-select').value;
      if (!symbol) {
        document.getElementById('p-stock-err').textContent = 'Please select a stock';
        valid = false;
      }
    } else {
      symbol = (document.getElementById('p-symbol').value || '').trim().toUpperCase();
      if (!symbol) {
        document.getElementById('p-symbol-err').textContent = 'Symbol is required';
        document.getElementById('p-symbol').classList.add('error');
        valid = false;
      }
    }

    if (!qty || qty <= 0) {
      document.getElementById('p-qty-err').textContent = 'Enter a valid quantity';
      document.getElementById('p-qty').classList.add('error');
      valid = false;
    }
    if (!price || price <= 0) {
      document.getElementById('p-price-err').textContent = 'Enter a valid target price';
      document.getElementById('p-price').classList.add('error');
      valid = false;
    }
    if (!valid) return;

    symbol = window.PriceService ? PriceService.cleanSymbol(symbol) : symbol;

    const existing = id ? Storage.getPlans().find(p => p.id === id) : null;
    const plan = {
      id: id || Utils.generateId(),
      symbol: symbol,
      exchange: exchange,
      qty: qty,
      targetPrice: price,
      priority: priority,
      notes: notes,
      categoryId: catId || null,
      status: existing ? existing.status : 'planned',
      holdingId: existing ? existing.holdingId : null,
      updatedAt: new Date().toISOString()
    };

    Storage.upsertPlan(plan);
    App.closeModal('modal-plan');
    renderPlans();
    App.toast(`Plan ${id ? 'updated' : 'added'}: ${symbol}`, 'success');

    // Fetch live price for this planned stock in background
    if (window.PriceService) {
      PriceService.fetchOne(symbol, exchange).then(() => renderPlans());
    }
  }

  /* ---- EXECUTE PLAN ---- */
  function executePlan(id) {
    const plan = Storage.getPlans().find(p => p.id === id);
    if (!plan || plan.status === 'executed') return;

    const targetVal = plan.qty * plan.targetPrice;
    const confirmText = document.getElementById('confirm-text');
    const confirmBtn = document.getElementById('btn-confirm-ok');

    confirmText.innerHTML = `
      Execute Plan for <strong>${Utils.escHtml(plan.symbol)}</strong>?<br>
      <div style="margin-top:.75rem;padding:.75rem;background:#f8fafc;border-radius:6px;font-size:.9rem">
        <div>Qty: <strong>${plan.qty}</strong> @ <strong>${Utils.formatCurrency(plan.targetPrice)}</strong></div>
        <div style="margin-top:.25rem">Total Invested: <strong>${Utils.formatCurrency(targetVal)}</strong></div>
      </div>
      <p style="margin-top:.75rem;font-size:.85rem;color:var(--text-muted)">This will add <strong>${Utils.escHtml(plan.symbol)}</strong> to your Holdings list.</p>
    `;

    function handler() {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');

      const now = new Date().toISOString();
      const holdingId = plan.holdingId || Utils.generateId();

      Storage.upsertHolding({
        id: holdingId,
        symbol: plan.symbol,
        name: plan.symbol,
        exchange: plan.exchange || 'NSE',
        qty: plan.qty,
        avgBuyPrice: plan.targetPrice,
        notes: 'Promoted from investment plan' + (plan.notes ? ': ' + plan.notes : ''),
        addedAt: now,
        updatedAt: now
      });

      Storage.upsertPlan({
        ...plan,
        status: 'executed',
        holdingId: holdingId,
        executedAt: now,
        updatedAt: now
      });

      if (window.Holdings) Holdings.render();
      if (window.Funds) Funds.render();
      renderPlans();
      App.toast(`${plan.symbol} successfully added to Holdings!`, 'success');

      if (window.PriceService) {
        PriceService.fetchOne(plan.symbol, plan.exchange);
      }
    }

    confirmBtn.addEventListener('click', handler);
    App.openModal('modal-confirm');
  }

  /* ---- DELETE PLAN ---- */
  function deletePlan(id) {
    const plan = Storage.getPlans().find(p => p.id === id);
    if (!plan) return;
    pendingDeleteId = id;

    const confirmText = document.getElementById('confirm-text');
    const confirmBtn = document.getElementById('btn-confirm-ok');

    confirmText.innerHTML = `Delete purchase plan for <strong>${Utils.escHtml(plan.symbol)}</strong>?`;

    function handler() {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');
      if (pendingDeleteId) {
        Storage.deletePlan(pendingDeleteId);
        pendingDeleteId = null;
        renderPlans();
        App.toast('Plan deleted', 'success');
      }
    }

    confirmBtn.addEventListener('click', handler);
    App.openModal('modal-confirm');
  }

  /* ---- REFRESH ALL PLAN PRICES ---- */
  async function refreshPlanPrices() {
    const plans = Storage.getPlans().filter(p => p.status === 'planned');
    if (plans.length === 0) {
      App.toast('No active plans to check prices for.', 'info');
      return;
    }

    if (window.PriceService) {
      App.toast(`Checking live prices for ${plans.length} planned stock(s)...`, 'info');
      await PriceService.fetchMultiple(plans);
      renderPlans();
      App.toast('Plan stock prices updated.', 'success');
    }
  }

  /* ---- INIT ---- */
  function init() {
    const btnAdd = document.getElementById('btn-add-plan');
    const btnSave = document.getElementById('btn-save-plan');
    const catSel = document.getElementById('p-category');
    const stockSel = document.getElementById('p-stock-select');

    if (btnAdd) btnAdd.addEventListener('click', openAddModal);
    if (btnSave) btnSave.addEventListener('click', validateAndSave);
    if (catSel) catSel.addEventListener('change', onCategoryChange);
    if (stockSel) stockSel.addEventListener('change', onStockSelectChange);

    const modalPlan = document.getElementById('modal-plan');
    if (modalPlan) {
      modalPlan.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') validateAndSave();
      });
    }

    const tbody = document.getElementById('plan-tbody');
    if (tbody) {
      tbody.addEventListener('click', e => {
        const executeBtn = e.target.closest('.execute-plan-btn');
        if (executeBtn) { executePlan(executeBtn.dataset.id); return; }

        const editBtn = e.target.closest('.edit-plan-btn');
        if (editBtn) { openEditModal(editBtn.dataset.id); return; }

        const deleteBtn = e.target.closest('.delete-plan-btn');
        if (deleteBtn) { deletePlan(deleteBtn.dataset.id); return; }
      });
    }

    renderPlans();
  }

  window.Plan = {
    init,
    render: renderPlans,
    refreshPlanPrices
  };
})();
