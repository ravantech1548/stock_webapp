(function () {
  'use strict';

  const { formatCurrency, formatDate, generateId, todayISO, currentMonthKey, getMonthKey, monthLabel, clamp, escHtml } = window.Utils;

  let selectedMonthKey = currentMonthKey();

  /* ---- TOTALS & ANALYTICS ---- */
  function calcTotals(targetMonthKey) {
    const mk = targetMonthKey || selectedMonthKey;
    const funds = Storage.getFunds() || { monthlyTarget: 25000, transactions: [] };
    const holdings = Storage.getHoldings() || [];
    const txs = Array.isArray(funds.transactions) ? funds.transactions : [];

    const totalLoaded = txs.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    const totalInvested = holdings.reduce((s, h) => s + ((parseFloat(h.avgBuyPrice) || 0) * (parseFloat(h.qty) || 0)), 0);
    const balance = totalLoaded - totalInvested;

    // Monthly breakdown
    const monthLoaded = txs
      .filter(t => t && t.date && getMonthKey(t.date) === mk)
      .reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

    // Monthly invested (holdings added in this month)
    const monthInvested = holdings
      .filter(h => h && h.addedAt && getMonthKey(h.addedAt) === mk)
      .reduce((s, h) => s + ((parseFloat(h.avgBuyPrice) || 0) * (parseFloat(h.qty) || 0)), 0);

    return {
      totalLoaded,
      totalInvested,
      balance,
      monthLoaded,
      monthInvested,
      monthlyTarget: funds.monthlyTarget || 25000,
      monthKey: mk
    };
  }

  /* ---- RENDER ---- */
  function render() {
    const totals = calcTotals(selectedMonthKey);
    const funds = Storage.getFunds();

    // Summary Cards
    const elCardTarget = document.getElementById('fund-card-target');
    const elCardLoaded = document.getElementById('fund-card-loaded');
    const elCardInvested = document.getElementById('fund-card-invested');
    const elCardBalance = document.getElementById('fund-card-balance');
    const elCardBalSub = document.getElementById('fund-card-balance-sub');

    if (elCardTarget) elCardTarget.textContent = formatCurrency(totals.monthlyTarget);
    if (elCardLoaded) elCardLoaded.textContent = formatCurrency(totals.totalLoaded);
    if (elCardInvested) elCardInvested.textContent = formatCurrency(totals.totalInvested);

    if (elCardBalance) {
      elCardBalance.textContent = formatCurrency(totals.balance);
      elCardBalance.className = 'card-value ' + (totals.balance >= 0 ? 'gain' : 'loss');
    }
    if (elCardBalSub) {
      elCardBalSub.textContent = totals.balance >= 0
        ? `₹${Math.round(totals.balance).toLocaleString('en-IN')} available to invest`
        : 'Over-invested vs loaded funds';
    }

    // Month Progress Section
    const elMonthTitle = document.getElementById('fund-month-title');
    const elMonthLoaded = document.getElementById('fund-month-loaded');
    const elMonthTarget = document.getElementById('fund-month-target');
    const elMonthRemaining = document.getElementById('fund-month-remaining');
    const elProgressBar = document.getElementById('fund-progress-bar');
    const elProgressPct = document.getElementById('fund-progress-pct');
    const elProgressTarget = document.getElementById('fund-progress-target');

    if (elMonthTitle) elMonthTitle.textContent = monthLabel(totals.monthKey);
    if (elMonthLoaded) elMonthLoaded.textContent = formatCurrency(totals.monthLoaded);
    if (elMonthTarget) elMonthTarget.textContent = formatCurrency(totals.monthlyTarget);

    const remaining = totals.monthlyTarget - totals.monthLoaded;
    if (elMonthRemaining) {
      if (remaining > 0) {
        elMonthRemaining.innerHTML = `<span style="color:var(--loss)">${formatCurrency(remaining)} remaining</span>`;
      } else {
        elMonthRemaining.innerHTML = `<span style="color:var(--gain);font-weight:600">&#10003; Target achieved! (${formatCurrency(Math.abs(remaining))} extra)</span>`;
      }
    }

    const pctLoaded = totals.monthlyTarget > 0 ? (totals.monthLoaded / totals.monthlyTarget) * 100 : 0;
    const clampedPct = clamp(pctLoaded, 0, 100);

    if (elProgressBar) {
      elProgressBar.style.width = clampedPct + '%';
      elProgressBar.className = 'progress-bar' + (pctLoaded >= 100 ? ' over' : '');
    }
    if (elProgressPct) elProgressPct.textContent = `${Math.round(pctLoaded)}% achieved`;
    if (elProgressTarget) elProgressTarget.textContent = `Target: ${formatCurrency(totals.monthlyTarget)}`;

    // Secondary metric: Invested vs Target if element exists
    const elInvestedStat = document.getElementById('fund-month-invested-stat');
    if (elInvestedStat) {
      elInvestedStat.textContent = formatCurrency(totals.monthInvested);
    }

    // Populate Month Selector dropdown if present
    populateMonthSelector();

    // Transactions Table
    const tbody = document.getElementById('funds-tbody');
    const tfoot = document.getElementById('funds-tfoot');
    const txs = funds.transactions;

    if (!tbody) return;

    if (txs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
        <div class="empty-state-icon">&#128181;</div>
        <p>No fund transactions yet. Click <strong>+ Add Funds</strong> to record money loaded into trading account.</p>
      </div></td></tr>`;
      if (tfoot) tfoot.innerHTML = '';
      return;
    }

    // Sort descending by date
    const sortedTxs = [...txs].sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sortedTxs.map(t => {
      const isCurrentMonth = getMonthKey(t.date) === selectedMonthKey;
      return `<tr data-fund-id="${escHtml(t.id)}" class="${isCurrentMonth ? 'row-highlight' : ''}">
        <td style="text-align:left"><strong>${formatDate(t.date)}</strong></td>
        <td style="text-align:left">${escHtml(t.note || 'Fund Deposit')}</td>
        <td><strong>${formatCurrency(t.amount)}</strong></td>
        <td>
          <button class="action-btn del fund-del-btn" data-id="${escHtml(t.id)}" title="Delete transaction">&#128465;</button>
        </td>
      </tr>`;
    }).join('');

    if (tfoot) {
      tfoot.innerHTML = `<tr>
        <td style="text-align:left" colspan="2"><strong>All-Time Total Funds Loaded</strong></td>
        <td style="font-weight:700;color:var(--primary)">${formatCurrency(totals.totalLoaded)}</td>
        <td></td>
      </tr>`;
    }
  }

  function populateMonthSelector() {
    const sel = document.getElementById('fund-month-select');
    if (!sel) return;

    const funds = Storage.getFunds();
    const monthKeysSet = new Set();
    monthKeysSet.add(currentMonthKey());

    const txs = (funds && Array.isArray(funds.transactions)) ? funds.transactions : [];
    txs.forEach(t => {
      if (t && t.date) monthKeysSet.add(getMonthKey(t.date));
    });

    const sortedKeys = Array.from(monthKeysSet).sort().reverse();
    sel.innerHTML = sortedKeys.map(k => `<option value="${k}" ${k === selectedMonthKey ? 'selected' : ''}>${monthLabel(k)}</option>`).join('');
  }

  /* ---- ADD FUNDS MODAL ---- */
  function openAddModal() {
    document.getElementById('fund-id').value = '';
    document.getElementById('f-date').value = todayISO();
    document.getElementById('f-amount').value = Storage.getFunds().monthlyTarget || 25000;
    document.getElementById('f-note').value = 'Monthly Investment Deposit';
    clearErrors();
    App.openModal('modal-funds');
    const amtInput = document.getElementById('f-amount');
    if (amtInput) {
      setTimeout(() => amtInput.focus(), 50);
    }
  }

  function clearErrors() {
    ['f-date-err', 'f-amount-err'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  function validateAndSave() {
    clearErrors();
    let ok = true;
    const date = document.getElementById('f-date').value;
    const amount = parseFloat(document.getElementById('f-amount').value);
    const note = document.getElementById('f-note').value.trim();

    if (!date) { document.getElementById('f-date-err').textContent = 'Date is required'; ok = false; }
    if (!amount || amount <= 0) { document.getElementById('f-amount-err').textContent = 'Enter a valid amount'; ok = false; }
    if (!ok) return;

    Storage.addFundTransaction({ id: generateId(), date, amount, note });
    App.closeModal('modal-funds');
    render();
    App.toast(`₹${amount.toLocaleString('en-IN')} added to funds.`, 'success');
  }

  /* ---- DELETE TRANSACTION ---- */
  function deleteTransaction(id) {
    Storage.deleteFundTransaction(id);
    render();
    App.toast('Transaction deleted.', 'success');
  }

  /* ---- EDIT TARGET ---- */
  function openTargetModal() {
    const curTarget = Storage.getFunds().monthlyTarget || 25000;
    const inp = document.getElementById('target-amount');
    if (inp) inp.value = curTarget;
    App.openModal('modal-target');
    if (inp) setTimeout(() => inp.focus(), 50);
  }

  function setPresetTarget(val) {
    const inp = document.getElementById('target-amount');
    if (inp) inp.value = val;
  }

  function saveTarget() {
    const v = parseFloat(document.getElementById('target-amount').value);
    if (!v || v <= 0) {
      App.toast('Please enter a valid monthly target amount.', 'warn');
      return;
    }
    Storage.setMonthlyTarget(v);
    App.closeModal('modal-target');
    render();
    App.toast(`Monthly target set to ₹${v.toLocaleString('en-IN')}`, 'success');
  }

  /* ---- INIT ---- */
  function init() {
    const btnAddFunds = document.getElementById('btn-add-funds');
    const btnSaveFund = document.getElementById('btn-save-fund');
    const btnEditTarget = document.getElementById('btn-edit-target');
    const btnSaveTarget = document.getElementById('btn-save-target');
    const monthSelect = document.getElementById('fund-month-select');

    if (btnAddFunds) btnAddFunds.addEventListener('click', openAddModal);
    if (btnSaveFund) btnSaveFund.addEventListener('click', validateAndSave);
    if (btnEditTarget) btnEditTarget.addEventListener('click', openTargetModal);
    if (btnSaveTarget) btnSaveTarget.addEventListener('click', saveTarget);

    if (monthSelect) {
      monthSelect.addEventListener('change', e => {
        selectedMonthKey = e.target.value;
        render();
      });
    }

    const modalFunds = document.getElementById('modal-funds');
    if (modalFunds) {
      modalFunds.addEventListener('keydown', e => {
        if (e.key === 'Enter') validateAndSave();
      });
    }

    const modalTarget = document.getElementById('modal-target');
    if (modalTarget) {
      modalTarget.addEventListener('keydown', e => {
        if (e.key === 'Enter') saveTarget();
      });
    }

    const tbody = document.getElementById('funds-tbody');
    if (tbody) {
      tbody.addEventListener('click', e => {
        const btn = e.target.closest('.fund-del-btn');
        if (btn) deleteTransaction(btn.dataset.id);
      });
    }

    render();
  }

  window.Funds = {
    init,
    render,
    calcTotals,
    setPresetTarget
  };
})();
