(function () {
  'use strict';

  let pendingDeleteId = null;

  /* ---- SUMMARY CARDS ---- */
  function updateSummaryCards(plans) {
    var planned   = plans.filter(function (p) { return p.status === 'planned'; }).length;
    var executed  = plans.filter(function (p) { return p.status === 'executed'; }).length;
    var totalValue = plans
      .filter(function (p) { return p.status === 'planned'; })
      .reduce(function (s, p) { return s + p.qty * p.targetPrice; }, 0);

    document.getElementById('plan-card-total').textContent    = plans.length;
    document.getElementById('plan-card-planned').textContent  = planned;
    document.getElementById('plan-card-executed').textContent = executed;
    document.getElementById('plan-card-value').textContent    = Utils.formatCurrency(totalValue);
  }

  /* ---- RENDER ---- */
  function renderPlans() {
    var plans = Storage.getPlans();
    var tbody = document.getElementById('plan-tbody');
    var tfoot = document.getElementById('plan-tfoot');

    updateSummaryCards(plans);

    if (plans.length === 0) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="9">No plans yet. Click "+ Add Plan" to get started.</td></tr>';
      tfoot.innerHTML = '';
      return;
    }

    tbody.innerHTML = plans.map(function (plan) {
      var isExecuted  = plan.status === 'executed';
      var targetValue = plan.qty * plan.targetPrice;
      var catBadge    = plan.categoryId
        ? '<span class="exchange-badge" style="background:#ede9fe;color:#5b21b6">' + Utils.escHtml(plan.categoryId.replace(/-/g, ' ')) + '</span> '
        : '';
      return '<tr>' +
        '<td><strong>' + Utils.escHtml(plan.symbol) + '</strong></td>' +
        '<td>' + catBadge + '<span class="exchange-badge">' + Utils.escHtml(plan.exchange) + '</span></td>' +
        '<td>' + plan.qty + '</td>' +
        '<td>' + Utils.formatCurrency(plan.targetPrice) + '</td>' +
        '<td>' + Utils.formatCurrency(targetValue) + '</td>' +
        '<td><span class="badge ' + (isExecuted ? 'badge-executed' : 'badge-planned') + '">' +
          (isExecuted ? 'Executed' : 'Planned') + '</span></td>' +
        '<td class="col-hide-md">' + Utils.escHtml(plan.notes || '—') + '</td>' +
        '<td>' +
          (!isExecuted ? '<button class="action-btn execute-plan-btn" data-id="' + plan.id + '" title="Execute — add to Holdings">&#10003;</button>' : '') +
          (!isExecuted ? '<button class="action-btn edit-plan-btn" data-id="' + plan.id + '" title="Edit">&#9998;</button>' : '') +
          '<button class="action-btn delete-plan-btn" data-id="' + plan.id + '" title="Delete">&#128465;</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    var plannedTotal  = plans.filter(function (p) { return p.status === 'planned'; })
      .reduce(function (s, p) { return s + p.qty * p.targetPrice; }, 0);
    var executedTotal = plans.filter(function (p) { return p.status === 'executed'; })
      .reduce(function (s, p) { return s + p.qty * p.targetPrice; }, 0);

    tfoot.innerHTML =
      '<tr><td colspan="4" style="text-align:right;font-weight:600;color:var(--text-muted)">Planned total</td>' +
      '<td style="font-weight:600">' + Utils.formatCurrency(plannedTotal) + '</td><td colspan="4"></td></tr>' +
      '<tr><td colspan="4" style="text-align:right;font-weight:600;color:var(--text-muted)">Executed total</td>' +
      '<td style="font-weight:600;color:var(--gain)">' + Utils.formatCurrency(executedTotal) + '</td><td colspan="4"></td></tr>';
  }

  /* ---- CATEGORY / STOCK SELECT HELPERS ---- */
  function refreshCategorySelect() {
    var wl  = Storage.getWatchlist();
    var sel = document.getElementById('p-category');
    var cur = sel.value;
    sel.innerHTML = '<option value="">— Type symbol manually —</option>' +
      Object.values(wl).map(function (cat) {
        return '<option value="' + cat.id + '">' + Utils.escHtml(cat.name) +
          ' (' + cat.stocks.length + ')</option>';
      }).join('');
    if (cur) sel.value = cur;
  }

  function onCategoryChange() {
    var catId       = document.getElementById('p-category').value;
    var symbolGroup = document.getElementById('p-symbol-group');
    var stockGroup  = document.getElementById('p-stock-select-group');

    if (!catId) {
      symbolGroup.style.display = '';
      stockGroup.style.display  = 'none';
      return;
    }

    symbolGroup.style.display = 'none';
    stockGroup.style.display  = '';

    var stocks = (Storage.getWatchlist()[catId] || {}).stocks || [];
    document.getElementById('p-stock-select').innerHTML =
      '<option value="">— Select stock —</option>' +
      stocks.map(function (s) {
        var sign = s.changePct >= 0 ? '+' : '';
        return '<option value="' + Utils.escHtml(s.symbol) + '">' +
          Utils.escHtml(s.symbol) + ' — ₹' + s.ltp.toFixed(2) +
          ' (' + sign + s.changePct.toFixed(2) + '%)</option>';
      }).join('');

    document.getElementById('p-exchange').value = 'NSE';
  }

  /* ---- MODAL HELPERS ---- */
  function clearErrors() {
    ['p-symbol-err', 'p-qty-err', 'p-price-err', 'p-stock-err'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['p-symbol', 'p-qty', 'p-price'].forEach(function (id) {
      document.getElementById(id).classList.remove('error');
    });
  }

  function openAddModal() {
    clearErrors();
    document.getElementById('plan-id').value    = '';
    document.getElementById('p-qty').value      = '';
    document.getElementById('p-price').value    = '';
    document.getElementById('p-notes').value    = '';
    document.getElementById('p-exchange').value = 'NSE';
    document.getElementById('p-symbol').value   = '';
    document.getElementById('plan-modal-title').textContent = 'Add Plan';

    refreshCategorySelect();
    document.getElementById('p-category').value = '';
    onCategoryChange();

    App.openModal('modal-plan');
    setTimeout(function () { document.getElementById('p-symbol').focus(); }, 50);
  }

  function openEditModal(id) {
    var plan = Storage.getPlans().find(function (p) { return p.id === id; });
    if (!plan) return;

    clearErrors();
    document.getElementById('plan-id').value    = plan.id;
    document.getElementById('p-qty').value      = plan.qty;
    document.getElementById('p-price').value    = plan.targetPrice;
    document.getElementById('p-notes').value    = plan.notes || '';
    document.getElementById('p-exchange').value = plan.exchange;
    document.getElementById('plan-modal-title').textContent = 'Edit Plan';

    refreshCategorySelect();

    var catId = plan.categoryId || '';
    document.getElementById('p-category').value = catId;
    onCategoryChange();

    if (catId) {
      document.getElementById('p-stock-select').value = plan.symbol;
    } else {
      document.getElementById('p-symbol').value = plan.symbol;
    }

    App.openModal('modal-plan');
    setTimeout(function () { document.getElementById('p-symbol').focus(); }, 50);
  }

  function validateAndSave() {
    clearErrors();

    var id       = document.getElementById('plan-id').value.trim();
    var catId    = document.getElementById('p-category').value;
    var exchange = document.getElementById('p-exchange').value;
    var qty      = parseFloat(document.getElementById('p-qty').value);
    var price    = parseFloat(document.getElementById('p-price').value);
    var notes    = document.getElementById('p-notes').value.trim();

    var symbol = '';
    var valid  = true;

    if (catId) {
      symbol = document.getElementById('p-stock-select').value;
      if (!symbol) {
        document.getElementById('p-stock-err').textContent = 'Select a stock';
        valid = false;
      }
    } else {
      symbol = document.getElementById('p-symbol').value.trim().toUpperCase();
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

    var existing = id ? Storage.getPlans().find(function (p) { return p.id === id; }) : null;
    var plan = {
      id:          id || Utils.generateId(),
      symbol:      symbol,
      exchange:    exchange,
      qty:         qty,
      targetPrice: price,
      notes:       notes,
      categoryId:  catId || null,
      status:      existing ? existing.status : 'planned',
      holdingId:   existing ? existing.holdingId : null
    };

    Storage.upsertPlan(plan);
    App.closeModal('modal-plan');
    renderPlans();
    App.toast('Plan ' + (id ? 'updated' : 'added') + ': ' + symbol, 'success');
  }

  /* ---- EXECUTE PLAN ---- */
  function executePlan(id) {
    var plan = Storage.getPlans().find(function (p) { return p.id === id; });
    if (!plan || plan.status === 'executed') return;

    var confirmText = document.getElementById('confirm-text');
    var confirmBtn  = document.getElementById('btn-confirm-ok');

    confirmText.textContent =
      'Add ' + plan.qty + ' × ' + plan.symbol +
      ' at ' + Utils.formatCurrency(plan.targetPrice) + ' to Holdings?';

    function handler() {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');

      var now       = new Date().toISOString();
      var holdingId = plan.holdingId || Utils.generateId();

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

      Storage.upsertPlan({ ...plan, status: 'executed', holdingId: holdingId, updatedAt: now });
      Holdings.render();
      renderPlans();
      App.toast(plan.symbol + ' added to Holdings', 'success');
    }

    confirmBtn.addEventListener('click', handler);
    App.openModal('modal-confirm');
  }

  /* ---- DELETE PLAN ---- */
  function deletePlan(id) {
    var plan = Storage.getPlans().find(function (p) { return p.id === id; });
    if (!plan) return;
    pendingDeleteId = id;

    var confirmText = document.getElementById('confirm-text');
    var confirmBtn  = document.getElementById('btn-confirm-ok');

    confirmText.textContent = 'Delete plan for ' + plan.symbol + '?';

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

  /* ---- INIT ---- */
  function init() {
    document.getElementById('btn-add-plan').addEventListener('click', openAddModal);
    document.getElementById('btn-save-plan').addEventListener('click', validateAndSave);
    document.getElementById('p-category').addEventListener('change', onCategoryChange);

    document.getElementById('modal-plan').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') validateAndSave();
    });

    document.getElementById('plan-tbody').addEventListener('click', function (e) {
      var executeBtn = e.target.closest('.execute-plan-btn');
      if (executeBtn) { executePlan(executeBtn.dataset.id); return; }

      var editBtn = e.target.closest('.edit-plan-btn');
      if (editBtn) { openEditModal(editBtn.dataset.id); return; }

      var deleteBtn = e.target.closest('.delete-plan-btn');
      if (deleteBtn) { deletePlan(deleteBtn.dataset.id); return; }
    });

    renderPlans();
  }

  window.Plan = { init: init, render: renderPlans };
})();
