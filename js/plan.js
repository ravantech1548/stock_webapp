(function () {
  'use strict';

  let pendingDeleteId = null;

  /* ---- SUMMARY CARDS ---- */
  function updateSummaryCards(plans) {
    const planned  = plans.filter(p => p.status === 'planned').length;
    const executed = plans.filter(p => p.status === 'executed').length;
    const totalValue = plans
      .filter(p => p.status === 'planned')
      .reduce((sum, p) => sum + p.qty * p.targetPrice, 0);

    document.getElementById('plan-card-total').textContent   = plans.length;
    document.getElementById('plan-card-planned').textContent = planned;
    document.getElementById('plan-card-executed').textContent = executed;
    document.getElementById('plan-card-value').textContent   = Utils.formatCurrency(totalValue);
  }

  /* ---- RENDER ---- */
  function renderPlans() {
    const plans  = Storage.getPlans();
    const tbody  = document.getElementById('plan-tbody');
    const tfoot  = document.getElementById('plan-tfoot');

    updateSummaryCards(plans);

    if (plans.length === 0) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="8">No plans yet. Click "+ Add Plan" to get started.</td></tr>';
      tfoot.innerHTML = '';
      return;
    }

    tbody.innerHTML = plans.map(plan => {
      const isExecuted  = plan.status === 'executed';
      const targetValue = plan.qty * plan.targetPrice;
      return `<tr>
        <td><strong>${Utils.escHtml(plan.symbol)}</strong></td>
        <td><span class="exchange-badge">${Utils.escHtml(plan.exchange)}</span></td>
        <td>${plan.qty}</td>
        <td>${Utils.formatCurrency(plan.targetPrice)}</td>
        <td>${Utils.formatCurrency(targetValue)}</td>
        <td><span class="badge ${isExecuted ? 'badge-executed' : 'badge-planned'}">${isExecuted ? 'Executed' : 'Planned'}</span></td>
        <td class="col-hide-md">${Utils.escHtml(plan.notes || '—')}</td>
        <td>
          ${!isExecuted ? `<button class="action-btn execute-plan-btn" data-id="${plan.id}" title="Execute — add to Holdings">&#10003;</button>` : ''}
          ${!isExecuted ? `<button class="action-btn edit-plan-btn" data-id="${plan.id}" title="Edit">&#9998;</button>` : ''}
          <button class="action-btn delete-plan-btn" data-id="${plan.id}" title="Delete">&#128465;</button>
        </td>
      </tr>`;
    }).join('');

    const plannedTotal = plans
      .filter(p => p.status === 'planned')
      .reduce((s, p) => s + p.qty * p.targetPrice, 0);
    const executedTotal = plans
      .filter(p => p.status === 'executed')
      .reduce((s, p) => s + p.qty * p.targetPrice, 0);

    tfoot.innerHTML = `<tr>
      <td colspan="4" style="text-align:right;font-weight:600;color:var(--text-muted)">Planned total</td>
      <td style="font-weight:600">${Utils.formatCurrency(plannedTotal)}</td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td colspan="4" style="text-align:right;font-weight:600;color:var(--text-muted)">Executed total</td>
      <td style="font-weight:600;color:var(--gain)">${Utils.formatCurrency(executedTotal)}</td>
      <td colspan="3"></td>
    </tr>`;
  }

  /* ---- MODAL HELPERS ---- */
  function clearErrors() {
    ['p-symbol-err', 'p-qty-err', 'p-price-err'].forEach(id => {
      document.getElementById(id).textContent = '';
    });
    ['p-symbol', 'p-qty', 'p-price'].forEach(id => {
      document.getElementById(id).classList.remove('error');
    });
  }

  function openAddModal() {
    clearErrors();
    document.getElementById('plan-id').value       = '';
    document.getElementById('p-symbol').value      = '';
    document.getElementById('p-exchange').value    = 'NSE';
    document.getElementById('p-qty').value         = '';
    document.getElementById('p-price').value       = '';
    document.getElementById('p-notes').value       = '';
    document.getElementById('plan-modal-title').textContent = 'Add Plan';
    App.openModal('modal-plan');
    setTimeout(() => document.getElementById('p-symbol').focus(), 50);
  }

  function openEditModal(id) {
    const plan = Storage.getPlans().find(p => p.id === id);
    if (!plan) return;
    clearErrors();
    document.getElementById('plan-id').value       = plan.id;
    document.getElementById('p-symbol').value      = plan.symbol;
    document.getElementById('p-exchange').value    = plan.exchange;
    document.getElementById('p-qty').value         = plan.qty;
    document.getElementById('p-price').value       = plan.targetPrice;
    document.getElementById('p-notes').value       = plan.notes || '';
    document.getElementById('plan-modal-title').textContent = 'Edit Plan';
    App.openModal('modal-plan');
    setTimeout(() => document.getElementById('p-symbol').focus(), 50);
  }

  function validateAndSave() {
    clearErrors();
    const id          = document.getElementById('plan-id').value.trim();
    const symbol      = document.getElementById('p-symbol').value.trim().toUpperCase();
    const exchange    = document.getElementById('p-exchange').value;
    const qty         = parseFloat(document.getElementById('p-qty').value);
    const targetPrice = parseFloat(document.getElementById('p-price').value);
    const notes       = document.getElementById('p-notes').value.trim();

    let valid = true;
    if (!symbol) {
      document.getElementById('p-symbol-err').textContent = 'Symbol is required';
      document.getElementById('p-symbol').classList.add('error');
      valid = false;
    }
    if (!qty || qty <= 0) {
      document.getElementById('p-qty-err').textContent = 'Enter a valid quantity';
      document.getElementById('p-qty').classList.add('error');
      valid = false;
    }
    if (!targetPrice || targetPrice <= 0) {
      document.getElementById('p-price-err').textContent = 'Enter a valid target price';
      document.getElementById('p-price').classList.add('error');
      valid = false;
    }
    if (!valid) return;

    const existing = id ? Storage.getPlans().find(p => p.id === id) : null;
    const plan = {
      id:          id || Utils.generateId(),
      symbol,
      exchange,
      qty,
      targetPrice,
      notes,
      status:      existing ? existing.status : 'planned',
      holdingId:   existing ? existing.holdingId : null
    };

    Storage.upsertPlan(plan);
    App.closeModal('modal-plan');
    renderPlans();
    App.toast(`Plan ${id ? 'updated' : 'added'}: ${symbol}`, 'success');
  }

  /* ---- EXECUTE PLAN ---- */
  function executePlan(id) {
    const plan = Storage.getPlans().find(p => p.id === id);
    if (!plan || plan.status === 'executed') return;

    const confirmText = document.getElementById('confirm-text');
    const confirmBtn  = document.getElementById('btn-confirm-ok');

    confirmText.textContent =
      `Add ${plan.qty} × ${plan.symbol} at ${Utils.formatCurrency(plan.targetPrice)} to Holdings?`;

    const handler = function () {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');

      const now       = new Date().toISOString();
      const holdingId = plan.holdingId || Utils.generateId();

      Storage.upsertHolding({
        id:          holdingId,
        symbol:      plan.symbol,
        name:        plan.symbol,
        exchange:    plan.exchange,
        qty:         plan.qty,
        avgBuyPrice: plan.targetPrice,
        notes:       'Promoted from investment plan' + (plan.notes ? ': ' + plan.notes : ''),
        addedAt:     now,
        updatedAt:   now
      });

      Storage.upsertPlan({ ...plan, status: 'executed', holdingId, updatedAt: now });
      Holdings.render();
      renderPlans();
      App.toast(`${plan.symbol} added to Holdings`, 'success');
    };

    confirmBtn.addEventListener('click', handler);
    App.openModal('modal-confirm');
  }

  /* ---- DELETE PLAN ---- */
  function deletePlan(id) {
    const plan = Storage.getPlans().find(p => p.id === id);
    if (!plan) return;
    pendingDeleteId = id;

    const confirmText = document.getElementById('confirm-text');
    const confirmBtn  = document.getElementById('btn-confirm-ok');

    confirmText.textContent = `Delete plan for ${plan.symbol}?`;

    const handler = function () {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');
      if (pendingDeleteId) {
        Storage.deletePlan(pendingDeleteId);
        pendingDeleteId = null;
        renderPlans();
        App.toast('Plan deleted', 'success');
      }
    };

    confirmBtn.addEventListener('click', handler);
    App.openModal('modal-confirm');
  }

  /* ---- INIT ---- */
  function init() {
    document.getElementById('btn-add-plan').addEventListener('click', openAddModal);
    document.getElementById('btn-save-plan').addEventListener('click', validateAndSave);

    document.getElementById('modal-plan').addEventListener('keydown', e => {
      if (e.key === 'Enter') validateAndSave();
    });

    document.getElementById('plan-tbody').addEventListener('click', e => {
      const executeBtn = e.target.closest('.execute-plan-btn');
      if (executeBtn) { executePlan(executeBtn.dataset.id); return; }

      const editBtn = e.target.closest('.edit-plan-btn');
      if (editBtn) { openEditModal(editBtn.dataset.id); return; }

      const deleteBtn = e.target.closest('.delete-plan-btn');
      if (deleteBtn) { deletePlan(deleteBtn.dataset.id); return; }
    });

    renderPlans();
  }

  window.Plan = { init, render: renderPlans };
})();
