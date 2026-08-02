(function () {
  'use strict';

  const { formatCurrency, formatDate, generateId, todayISO, currentMonthKey, getMonthKey, monthLabel, clamp, escHtml } = window.Utils;

  let pendingDeleteId = null;
  let selectedMonthKey = currentMonthKey();

  /* ---- MONTHLY BUDGET & CARRY-FORWARD CALCULATION ---- */
  function calcMonthlyPlanBudget(targetMonthKey) {
    const funds = Storage.getFunds() || { monthlyTarget: 25000, transactions: [] };
    const baseMonthlyTarget = parseFloat(funds.monthlyTarget) || 25000;
    const plans = Storage.getPlans() || [];
    const txs = Array.isArray(funds.transactions) ? funds.transactions : [];

    // Gather all distinct months in chronological order
    const monthKeysSet = new Set();
    monthKeysSet.add(currentMonthKey());
    if (targetMonthKey && targetMonthKey !== 'all') monthKeysSet.add(targetMonthKey);

    txs.forEach(t => {
      if (t && t.date) {
        const k = getMonthKey(t.date);
        if (k) monthKeysSet.add(k);
      }
    });

    plans.forEach(p => {
      if (p.executedMonthKey) monthKeysSet.add(p.executedMonthKey);
      if (p.monthKey) monthKeysSet.add(p.monthKey);
      if (p.updatedAt) {
        const k = getMonthKey(p.updatedAt);
        if (k) monthKeysSet.add(k);
      }
    });

    const sortedMonthKeys = Array.from(monthKeysSet).filter(Boolean).sort(); // chronological: oldest to newest

    let runningCarryForward = 0;
    const monthStatsMap = {};

    sortedMonthKeys.forEach(mKey => {
      const available = baseMonthlyTarget + runningCarryForward;

      // Executed plans attributed to this month
      const executedInMonth = plans.filter(p => {
        if (p.status !== 'executed') return false;
        if (p.executedMonthKey) return p.executedMonthKey === mKey;
        if (p.monthKey) return p.monthKey === mKey;
        if (p.executedAt) return getMonthKey(p.executedAt) === mKey;
        return mKey === currentMonthKey();
      });

      const consumed = executedInMonth.reduce((s, p) => s + ((parseFloat(p.qty) || 0) * (parseFloat(p.targetPrice) || 0)), 0);
      const remaining = Math.max(0, available - consumed);

      // Active / planned in this month
      const plannedInMonth = plans.filter(p => {
        if (p.status === 'executed') return false;
        const pMonth = p.monthKey || currentMonthKey();
        return pMonth === mKey;
      });
      const activePlannedValue = plannedInMonth.reduce((s, p) => s + ((parseFloat(p.qty) || 0) * (parseFloat(p.targetPrice) || 0)), 0);

      monthStatsMap[mKey] = {
        monthKey: mKey,
        baseTarget: baseMonthlyTarget,
        carriedForward: runningCarryForward,
        totalAvailable: available,
        consumed: consumed,
        remaining: remaining,
        activePlannedValue: activePlannedValue,
        executedCount: executedInMonth.length,
        plannedCount: plannedInMonth.length
      };

      // Unexecuted remaining budget carries forward to next month
      runningCarryForward = remaining;
    });

    // If targetMonthKey is 'all' or not found, return summary
    if (targetMonthKey === 'all') {
      const allExecuted = plans.filter(p => p.status === 'executed');
      const allPlanned = plans.filter(p => p.status === 'planned');
      const totalConsumed = allExecuted.reduce((s, p) => s + (p.qty * p.targetPrice), 0);
      const totalPlanned = allPlanned.reduce((s, p) => s + (p.qty * p.targetPrice), 0);
      const curStats = monthStatsMap[currentMonthKey()] || {
        baseTarget: baseMonthlyTarget,
        carriedForward: 0,
        totalAvailable: baseMonthlyTarget,
        consumed: 0,
        remaining: baseMonthlyTarget
      };
      return {
        monthKey: 'all',
        baseTarget: baseMonthlyTarget,
        carriedForward: curStats.carriedForward,
        totalAvailable: curStats.totalAvailable,
        consumed: totalConsumed,
        remaining: curStats.remaining,
        activePlannedValue: totalPlanned,
        executedCount: allExecuted.length,
        plannedCount: allPlanned.length
      };
    }

    return monthStatsMap[targetMonthKey] || {
      monthKey: targetMonthKey,
      baseTarget: baseMonthlyTarget,
      carriedForward: runningCarryForward,
      totalAvailable: baseMonthlyTarget + runningCarryForward,
      consumed: 0,
      remaining: baseMonthlyTarget + runningCarryForward,
      activePlannedValue: 0,
      executedCount: 0,
      plannedCount: 0
    };
  }

  /* ---- SUMMARY CARDS & MONTH PROGRESS ---- */
  function updateSummaryCards(budgetStats, filteredPlans) {
    const planned = filteredPlans.filter(p => p.status === 'planned');
    const executed = filteredPlans.filter(p => p.status === 'executed');

    // Calculate how many are currently in buy zone (LTP <= Target Price)
    let inBuyZoneCount = 0;
    planned.forEach(p => {
      const pData = Storage.getPrice(p.symbol);
      if (pData && pData.price && pData.price <= p.targetPrice) {
        inBuyZoneCount++;
      }
    });

    // Summary Cards
    const elCardBudget = document.getElementById('plan-card-budget');
    const elCardBudgetSub = document.getElementById('plan-card-budget-sub');
    const elCardExecutedVal = document.getElementById('plan-card-executed-val');
    const elCardExecutedCount = document.getElementById('plan-card-executed-count');
    const elCardRemaining = document.getElementById('plan-card-remaining');
    const elCardRemainingSub = document.getElementById('plan-card-remaining-sub');
    const elCardValue = document.getElementById('plan-card-value');
    const elCardPlannedCount = document.getElementById('plan-card-planned-count');

    if (elCardBudget) elCardBudget.textContent = formatCurrency(budgetStats.totalAvailable);
    if (elCardBudgetSub) {
      if (budgetStats.carriedForward > 0) {
        elCardBudgetSub.innerHTML = `<span style="color:var(--primary);font-weight:600">+${formatCurrency(budgetStats.carriedForward)}</span> carried fwd`;
      } else {
        elCardBudgetSub.textContent = `Target: ${formatCurrency(budgetStats.baseTarget)}`;
      }
    }

    if (elCardExecutedVal) elCardExecutedVal.textContent = formatCurrency(budgetStats.consumed);
    if (elCardExecutedCount) {
      elCardExecutedCount.textContent = `${budgetStats.executedCount} plan${budgetStats.executedCount === 1 ? '' : 's'} executed`;
    }

    if (elCardRemaining) {
      elCardRemaining.textContent = formatCurrency(budgetStats.remaining);
      elCardRemaining.className = 'card-value ' + (budgetStats.remaining >= 0 ? 'gain' : 'loss');
    }
    if (elCardRemainingSub) {
      elCardRemainingSub.textContent = budgetStats.remaining >= 0
        ? `Available for next plans`
        : 'Exceeded available budget';
    }

    if (elCardValue) elCardValue.textContent = formatCurrency(budgetStats.activePlannedValue);
    if (elCardPlannedCount) {
      elCardPlannedCount.innerHTML = `${planned.length} planned ${inBuyZoneCount > 0 ? `<span class="badge badge-gain" style="font-size:.75rem;margin-left:.35rem">🎯 ${inBuyZoneCount} in Buy Zone</span>` : ''}`;
    }

    // Month Progress & Carry-forward Bar
    const elMonthTitle = document.getElementById('plan-month-title');
    const elStatBaseTarget = document.getElementById('plan-stat-base-target');
    const elStatCarryForward = document.getElementById('plan-stat-carry-forward');
    const elStatConsumed = document.getElementById('plan-stat-consumed');
    const elStatRemaining = document.getElementById('plan-stat-remaining');
    const elProgressBar = document.getElementById('plan-progress-bar');
    const elProgressPct = document.getElementById('plan-progress-pct');
    const elProgressTarget = document.getElementById('plan-progress-target');

    if (elMonthTitle) {
      elMonthTitle.textContent = budgetStats.monthKey === 'all' ? 'All Months Overview' : `${monthLabel(budgetStats.monthKey)} Plan Budget`;
    }
    if (elStatBaseTarget) elStatBaseTarget.textContent = formatCurrency(budgetStats.baseTarget);
    if (elStatCarryForward) {
      elStatCarryForward.textContent = budgetStats.carriedForward > 0 ? `+${formatCurrency(budgetStats.carriedForward)}` : '₹0.00';
    }
    if (elStatConsumed) elStatConsumed.textContent = formatCurrency(budgetStats.consumed);
    if (elStatRemaining) {
      if (budgetStats.remaining > 0) {
        elStatRemaining.innerHTML = `<span style="color:var(--gain);font-weight:600">${formatCurrency(budgetStats.remaining)} left</span>`;
      } else {
        elStatRemaining.innerHTML = `<span style="color:var(--text-muted)">₹0.00 fully utilized</span>`;
      }
    }

    const pctConsumed = budgetStats.totalAvailable > 0 ? (budgetStats.consumed / budgetStats.totalAvailable) * 100 : 0;
    const clampedPct = clamp(pctConsumed, 0, 100);

    if (elProgressBar) {
      elProgressBar.style.width = clampedPct + '%';
      elProgressBar.className = 'progress-bar' + (pctConsumed >= 100 ? ' over' : '');
    }
    if (elProgressPct) {
      elProgressPct.textContent = `${Math.round(pctConsumed)}% consumed (${formatCurrency(budgetStats.consumed)})`;
    }
    if (elProgressTarget) {
      elProgressTarget.textContent = `Available Budget: ${formatCurrency(budgetStats.totalAvailable)}`;
    }
  }

  /* ---- MONTH SELECTOR POPULATION ---- */
  function populateMonthSelector() {
    const sel = document.getElementById('plan-month-select');
    if (!sel) return;

    const funds = Storage.getFunds();
    const plans = Storage.getPlans();
    const monthKeysSet = new Set();
    monthKeysSet.add(currentMonthKey());

    if (funds && Array.isArray(funds.transactions)) {
      funds.transactions.forEach(t => {
        if (t && t.date) {
          const k = getMonthKey(t.date);
          if (k) monthKeysSet.add(k);
        }
      });
    }

    plans.forEach(p => {
      if (p.executedMonthKey) monthKeysSet.add(p.executedMonthKey);
      if (p.monthKey) monthKeysSet.add(p.monthKey);
    });

    const sortedKeys = Array.from(monthKeysSet).sort().reverse();

    sel.innerHTML = `<option value="all" ${selectedMonthKey === 'all' ? 'selected' : ''}>— All Months —</option>` +
      sortedKeys.map(k => `<option value="${k}" ${k === selectedMonthKey ? 'selected' : ''}>${monthLabel(k)}</option>`).join('');
  }

  /* ---- RENDER PLANS TABLE ---- */
  function renderPlans() {
    const plans = Storage.getPlans();
    const tbody = document.getElementById('plan-tbody');
    const tfoot = document.getElementById('plan-tfoot');
    const tableTitle = document.getElementById('plan-table-title');
    if (!tbody) return;

    populateMonthSelector();

    const budgetStats = calcMonthlyPlanBudget(selectedMonthKey);

    // Filter plans for selected month
    const filteredPlans = plans.filter(p => {
      if (selectedMonthKey === 'all') return true;
      if (p.status === 'executed') {
        const execM = p.executedMonthKey || (p.executedAt ? getMonthKey(p.executedAt) : null) || p.monthKey || currentMonthKey();
        return execM === selectedMonthKey;
      }
      const planM = p.monthKey || currentMonthKey();
      return planM === selectedMonthKey;
    });

    updateSummaryCards(budgetStats, filteredPlans);

    if (tableTitle) {
      tableTitle.textContent = selectedMonthKey === 'all' ? 'All Investment Plans' : `${monthLabel(selectedMonthKey)} Investment Plans`;
    }

    if (filteredPlans.length === 0) {
      tbody.innerHTML = `<tr class="loading-row"><td colspan="10" style="padding:2rem;text-align:center;color:var(--text-muted)">No purchase plans for <strong>${selectedMonthKey === 'all' ? 'any month' : monthLabel(selectedMonthKey)}</strong>. Click <strong>+ Add Plan</strong> to schedule purchase targets.</td></tr>`;
      if (tfoot) tfoot.innerHTML = '';
      return;
    }

    tbody.innerHTML = filteredPlans.map(plan => {
      const isExecuted = plan.status === 'executed';
      const targetValue = plan.qty * plan.targetPrice;
      const pData = Storage.getPrice(plan.symbol);
      const ltp = pData && pData.price ? pData.price : null;

      let ltpDisplay = '<span style="color:var(--text-muted)">—</span>';
      let statusBadge = '';

      if (isExecuted) {
        const execDate = plan.executedAt ? formatDate(plan.executedAt) : '';
        statusBadge = `<span class="badge badge-executed" title="Executed on ${execDate}">&#10003; Executed</span>`;
      } else if (ltp != null) {
        const diff = ((ltp - plan.targetPrice) / plan.targetPrice) * 100;
        const diffAbs = Math.abs(diff).toFixed(1);
        const sign = diff >= 0 ? '+' : '-';

        if (ltp <= plan.targetPrice) {
          ltpDisplay = `<strong>${formatCurrency(ltp)}</strong> <span class="badge badge-gain" style="font-size:.7rem;margin-left:.25rem">${sign}${diffAbs}%</span>`;
          statusBadge = '<span class="badge badge-gain" title="Market price is at or below your target price!">🎯 Buy Zone</span>';
        } else {
          ltpDisplay = `${formatCurrency(ltp)} <span class="badge badge-loss" style="font-size:.7rem;margin-left:.25rem">${sign}${diffAbs}%</span>`;
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
        ? `<span class="exchange-badge" style="background:#ede9fe;color:#5b21b6">${escHtml(plan.categoryId.replace(/-/g, ' '))}</span> `
        : '';

      const monthTag = (plan.monthKey && plan.monthKey !== currentMonthKey())
        ? `<div style="font-size:.72rem;color:var(--text-muted);margin-top:.2rem">📅 ${monthLabel(plan.monthKey)}</div>`
        : '';

      return `<tr>
        <td><strong>${escHtml(plan.symbol)}</strong>${monthTag}</td>
        <td>${catBadge}<span class="exchange-badge">${escHtml(plan.exchange || 'NSE')}</span></td>
        <td>${priorityBadge}</td>
        <td>${plan.qty}</td>
        <td><strong>${formatCurrency(plan.targetPrice)}</strong></td>
        <td>${ltpDisplay}</td>
        <td><strong>${formatCurrency(targetValue)}</strong></td>
        <td>${statusBadge}</td>
        <td class="col-hide-md" style="font-size:.85rem;color:var(--text-muted)">${escHtml(plan.notes || '—')}</td>
        <td>
          <div class="actions-cell">
            ${!isExecuted ? `<button class="action-btn execute-plan-btn" data-id="${plan.id}" title="Execute — add to Holdings and consume fund budget" style="color:var(--gain);background:#ecfdf5;border-color:#a7f3d0;font-weight:600">&#10003; Execute</button>` : ''}
            ${!isExecuted ? `<button class="action-btn edit-plan-btn" data-id="${plan.id}" title="Edit Plan">&#9998;</button>` : ''}
            <button class="action-btn delete-plan-btn" data-id="${plan.id}" title="Delete Plan">&#128465;</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    const plannedTotal = filteredPlans
      .filter(p => p.status === 'planned')
      .reduce((s, p) => s + (p.qty * p.targetPrice), 0);
    const executedTotal = filteredPlans
      .filter(p => p.status === 'executed')
      .reduce((s, p) => s + (p.qty * p.targetPrice), 0);

    if (tfoot) {
      tfoot.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:right;font-weight:600;color:var(--text-muted)">Active Planned Capital:</td>
          <td style="font-weight:700;color:var(--primary)">${formatCurrency(plannedTotal)}</td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="6" style="text-align:right;font-weight:600;color:var(--text-muted)">Consumed in Executed:</td>
          <td style="font-weight:700;color:var(--gain)">${formatCurrency(executedTotal)}</td>
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
      Object.values(wl).map(cat => `<option value="${cat.id}">${escHtml(cat.name)} (${cat.stocks.length})</option>`).join('');
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
          return `<option value="${escHtml(s.symbol)}" data-ltp="${s.ltp || ''}">${escHtml(s.symbol)} — ₹${(s.ltp || 0).toFixed(2)} (${sign}${(s.changePct || 0).toFixed(2)}%)</option>`;
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

    const monthInput = document.getElementById('p-month');
    if (monthInput) {
      monthInput.value = (selectedMonthKey && selectedMonthKey !== 'all') ? selectedMonthKey : currentMonthKey();
    }

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

    const monthInput = document.getElementById('p-month');
    if (monthInput) {
      monthInput.value = plan.monthKey || currentMonthKey();
    }

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
    const monthEl = document.getElementById('p-month');
    const monthKey = (monthEl && monthEl.value) ? monthEl.value : (selectedMonthKey !== 'all' ? selectedMonthKey : currentMonthKey());

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
      id: id || generateId(),
      symbol: symbol,
      exchange: exchange,
      qty: qty,
      targetPrice: price,
      priority: priority,
      notes: notes,
      monthKey: monthKey,
      categoryId: catId || null,
      status: existing ? existing.status : 'planned',
      holdingId: existing ? existing.holdingId : null,
      executedMonthKey: existing ? existing.executedMonthKey : null,
      executedAt: existing ? existing.executedAt : null,
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

  /* ---- EXECUTE PLAN (CONSUMES MONTHLY FUND BUDGET) ---- */
  function executePlan(id) {
    const plan = Storage.getPlans().find(p => p.id === id);
    if (!plan || plan.status === 'executed') return;

    const targetVal = plan.qty * plan.targetPrice;
    const execMonth = (selectedMonthKey && selectedMonthKey !== 'all') ? selectedMonthKey : (plan.monthKey || currentMonthKey());
    const budgetStats = calcMonthlyPlanBudget(execMonth);

    const remainingAfter = budgetStats.remaining - targetVal;

    const confirmText = document.getElementById('confirm-text');
    const confirmBtn = document.getElementById('btn-confirm-ok');

    confirmText.innerHTML = `
      Execute Plan for <strong>${escHtml(plan.symbol)}</strong>?<br>
      <div style="margin-top:.75rem;padding:.75rem;background:#f8fafc;border-radius:6px;font-size:.9rem">
        <div>Qty: <strong>${plan.qty}</strong> @ <strong>${formatCurrency(plan.targetPrice)}</strong></div>
        <div style="margin-top:.25rem">Total Invested: <strong style="color:var(--gain)">${formatCurrency(targetVal)}</strong></div>
        <div style="margin-top:.35rem;padding-top:.35rem;border-top:1px dashed #e2e8f0;font-size:.82rem;color:var(--text-muted)">
          Consumes from <strong>${monthLabel(execMonth)}</strong> budget:
          <br>Remaining after execution: <strong style="color:${remainingAfter >= 0 ? 'var(--gain)' : 'var(--loss)'}">${formatCurrency(Math.max(0, remainingAfter))}</strong>
        </div>
      </div>
      <p style="margin-top:.75rem;font-size:.85rem;color:var(--text-muted)">This will add <strong>${escHtml(plan.symbol)}</strong> to your Holdings and consume from your targeted monthly fund.</p>
    `;

    function handler() {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');

      const now = new Date().toISOString();
      const holdingId = plan.holdingId || generateId();

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
        executedMonthKey: execMonth,
        executedAt: now,
        updatedAt: now
      });

      if (window.Holdings) Holdings.render();
      if (window.Funds) Funds.render();
      renderPlans();
      App.toast(`${plan.symbol} executed! ₹${Math.round(targetVal).toLocaleString('en-IN')} consumed from ${monthLabel(execMonth)} budget.`, 'success');

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

    confirmText.innerHTML = `Delete purchase plan for <strong>${escHtml(plan.symbol)}</strong>?`;

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
    const monthSel = document.getElementById('plan-month-select');

    if (btnAdd) btnAdd.addEventListener('click', openAddModal);
    if (btnSave) btnSave.addEventListener('click', validateAndSave);
    if (catSel) catSel.addEventListener('change', onCategoryChange);
    if (stockSel) stockSel.addEventListener('change', onStockSelectChange);

    if (monthSel) {
      monthSel.addEventListener('change', e => {
        selectedMonthKey = e.target.value;
        renderPlans();
      });
    }

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
    calcMonthlyPlanBudget,
    refreshPlanPrices
  };
})();
