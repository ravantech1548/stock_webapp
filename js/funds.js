(function () {
  'use strict';

  const { formatCurrency, formatDate, generateId, todayISO, currentMonthKey, getMonthKey, monthLabel, clamp, escHtml } = window.Utils;

  /* ---- TOTALS ---- */
  function calcTotals() {
    const funds = Storage.getFunds();
    const holdings = Storage.getHoldings();
    const totalLoaded = funds.transactions.reduce((s, t) => s + t.amount, 0);
    const totalInvested = holdings.reduce((s, h) => s + h.avgBuyPrice * h.qty, 0);
    const balance = totalLoaded - totalInvested;
    const monthKey = currentMonthKey();
    const monthLoaded = funds.transactions
      .filter(t => getMonthKey(t.date) === monthKey)
      .reduce((s, t) => s + t.amount, 0);
    return { totalLoaded, totalInvested, balance, monthLoaded, monthlyTarget: funds.monthlyTarget };
  }

  /* ---- RENDER ---- */
  function render() {
    const { totalLoaded, totalInvested, balance, monthLoaded, monthlyTarget } = calcTotals();
    const funds = Storage.getFunds();

    // Cards
    document.getElementById('fund-card-target').textContent = formatCurrency(monthlyTarget);
    document.getElementById('fund-card-loaded').textContent = formatCurrency(totalLoaded);
    document.getElementById('fund-card-invested').textContent = formatCurrency(totalInvested);

    const balEl = document.getElementById('fund-card-balance');
    balEl.textContent = formatCurrency(balance);
    balEl.className = 'card-value ' + (balance >= 0 ? 'gain' : 'loss');
    document.getElementById('fund-card-balance-sub').textContent =
      balance >= 0 ? 'Available to invest' : 'Over-invested vs funds loaded';

    // Month section
    const mk = currentMonthKey();
    document.getElementById('fund-month-title').textContent = monthLabel(mk);
    document.getElementById('fund-month-loaded').textContent = formatCurrency(monthLoaded);
    document.getElementById('fund-month-target').textContent = formatCurrency(monthlyTarget);
    const remaining = monthlyTarget - monthLoaded;
    document.getElementById('fund-month-remaining').textContent =
      remaining > 0 ? formatCurrency(remaining) + ' more to target' : 'Target reached!';

    const pct = monthlyTarget > 0 ? clamp((monthLoaded / monthlyTarget) * 100, 0, 100) : 0;
    const bar = document.getElementById('fund-progress-bar');
    bar.style.width = pct + '%';
    bar.className = 'progress-bar' + (monthLoaded >= monthlyTarget ? ' over' : '');
    document.getElementById('fund-progress-pct').textContent = Math.round(pct) + '%';
    document.getElementById('fund-progress-target').textContent = formatCurrency(monthlyTarget);

    // Transactions table
    const tbody = document.getElementById('funds-tbody');
    const tfoot = document.getElementById('funds-tfoot');
    const txs = funds.transactions;

    if (txs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
        <div class="empty-state-icon">&#128181;</div>
        <p>No fund transactions yet. Add funds loaded into your trading account.</p>
      </div></td></tr>`;
      tfoot.innerHTML = '';
      return;
    }

    tbody.innerHTML = txs.map(t => `
      <tr data-fund-id="${escHtml(t.id)}">
        <td style="text-align:left">${formatDate(t.date)}</td>
        <td style="text-align:left">${escHtml(t.note || '—')}</td>
        <td>${formatCurrency(t.amount)}</td>
        <td>
          <button class="action-btn del fund-del-btn" data-id="${escHtml(t.id)}" title="Delete">&#128465;</button>
        </td>
      </tr>
    `).join('');

    tfoot.innerHTML = `<tr>
      <td style="text-align:left" colspan="2">Total</td>
      <td class="fw-bold">${formatCurrency(totalLoaded)}</td>
      <td></td>
    </tr>`;
  }

  /* ---- ADD FUNDS MODAL ---- */
  function openAddModal() {
    document.getElementById('fund-id').value = '';
    document.getElementById('f-date').value = todayISO();
    document.getElementById('f-amount').value = Storage.getFunds().monthlyTarget;
    document.getElementById('f-note').value = '';
    clearErrors();
    App.openModal('modal-funds');
    document.getElementById('f-amount').focus();
  }

  function clearErrors() {
    ['f-date-err', 'f-amount-err'].forEach(id => {
      document.getElementById(id).textContent = '';
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
    App.toast(`₹${amount.toLocaleString('en-IN')} added.`, 'success');
  }

  /* ---- DELETE TRANSACTION ---- */
  function deleteTransaction(id) {
    Storage.deleteFundTransaction(id);
    render();
    App.toast('Transaction deleted.', 'success');
  }

  /* ---- EDIT TARGET ---- */
  function openTargetModal() {
    document.getElementById('target-amount').value = Storage.getFunds().monthlyTarget;
    App.openModal('modal-target');
    document.getElementById('target-amount').focus();
  }

  function saveTarget() {
    const v = parseFloat(document.getElementById('target-amount').value);
    if (!v || v <= 0) return;
    Storage.setMonthlyTarget(v);
    App.closeModal('modal-target');
    render();
    App.toast('Monthly target updated.', 'success');
  }

  /* ---- INIT ---- */
  function init() {
    document.getElementById('btn-add-funds').addEventListener('click', openAddModal);
    document.getElementById('btn-save-fund').addEventListener('click', validateAndSave);
    document.getElementById('btn-edit-target').addEventListener('click', openTargetModal);
    document.getElementById('btn-save-target').addEventListener('click', saveTarget);

    document.getElementById('modal-funds').addEventListener('keydown', e => {
      if (e.key === 'Enter') validateAndSave();
    });
    document.getElementById('modal-target').addEventListener('keydown', e => {
      if (e.key === 'Enter') saveTarget();
    });

    // Delegated delete
    document.getElementById('funds-tbody').addEventListener('click', e => {
      const btn = e.target.closest('.fund-del-btn');
      if (btn) deleteTransaction(btn.dataset.id);
    });

    render();
  }

  window.Funds = { init, render };
})();
