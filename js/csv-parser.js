(function () {
  'use strict';

  const { generateId, escHtml } = window.Utils;

  // Known broker header signatures → column mappings
  const BROKER_PROFILES = [
    {
      name: 'Zerodha',
      detect: headers => headers.includes('instrument') && (headers.includes('avg cost') || headers.includes('avgcost')),
      map: row => ({
        symbol: clean(col(row, 'instrument')),
        name: clean(col(row, 'instrument')),
        qty: parseFloat(col(row, 'qty', 'qty.', 'quantity', 'net qty')) || 0,
        avgBuyPrice: parseFloat(col(row, 'avg. cost', 'avg cost', 'avgcost', 'average cost')) || 0,
        exchange: 'NSE'
      })
    },
    {
      name: 'Groww',
      detect: headers => headers.includes('symbol') && (headers.includes('avg cost') || headers.includes('avgcost')) && (headers.includes('quantity') || headers.includes('qty')),
      map: row => ({
        symbol: clean(col(row, 'symbol')),
        name: clean(col(row, 'stocks', 'name', 'company', 'symbol')),
        qty: parseFloat(col(row, 'quantity', 'qty')) || 0,
        avgBuyPrice: parseFloat(col(row, 'avg cost', 'avgcost', 'average cost', 'avg buy price')) || 0,
        exchange: 'NSE'
      })
    },
    {
      name: 'Standard',
      detect: headers => headers.includes('symbol') && (headers.includes('avgbuyprice') || headers.includes('avg buy price') || headers.includes('avgprice')),
      map: row => ({
        symbol: clean(col(row, 'symbol')),
        name: clean(col(row, 'name', 'company', 'symbol')),
        qty: parseFloat(col(row, 'qty', 'quantity', 'shares')) || 0,
        avgBuyPrice: parseFloat(col(row, 'avgbuyprice', 'avg buy price', 'avgprice', 'avg price')) || 0,
        exchange: (col(row, 'exchange') || 'NSE').toUpperCase()
      })
    }
  ];

  function clean(val) {
    return String(val || '').trim().replace(/\.(NS|BO)$/i, '').toUpperCase();
  }

  function normalizeHeaders(headers) {
    return headers.map(h => String(h).trim().toLowerCase().replace(/[^a-z0-9 ]/g, ''));
  }

  // Fuzzy column lookup: strips punctuation/spaces from both key and candidates
  function col(row, ...names) {
    const keys = Object.keys(row);
    for (const name of names) {
      // Direct match first
      if (row[name] !== undefined && row[name] !== '') return row[name];
      // Alphanumeric-only match (handles "Qty." → "qty", "Avg. cost" → "avg cost")
      const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const found = keys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
      if (found && row[found] !== undefined) return row[found];
    }
    return '';
  }

  let parsedRows = [];
  let brokerProfile = null;
  let validRows = [];
  let errorRows = [];

  /* ---- FILE PICKER ---- */
  function init() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseLink = document.getElementById('browse-link');
    const importBtn = document.getElementById('btn-import');
    const confirmBtn = document.getElementById('import-confirm');
    const backBtn = document.getElementById('import-back');
    const cancelBtn = document.getElementById('import-cancel');

    importBtn.addEventListener('click', () => {
      resetImportModal();
      App.openModal('modal-import');
    });

    browseLink.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handleFile(file);
      fileInput.value = '';
    });

    confirmBtn.addEventListener('click', executeImport);
    backBtn.addEventListener('click', resetImportModal);
    cancelBtn.addEventListener('click', () => App.closeModal('modal-import'));
  }

  function resetImportModal() {
    document.getElementById('import-step-1').style.display = '';
    document.getElementById('import-step-2').style.display = 'none';
    document.getElementById('import-confirm').style.display = 'none';
    document.getElementById('import-back').style.display = 'none';
    document.getElementById('broker-detected').innerHTML = '';
    document.getElementById('import-summary').textContent = '';
    document.getElementById('import-preview-thead').innerHTML = '';
    document.getElementById('import-preview-tbody').innerHTML = '';
    document.getElementById('import-error-container').innerHTML = '';
    parsedRows = []; validRows = []; errorRows = []; brokerProfile = null;
  }

  /* ---- FILE HANDLING ---- */
  function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'xlsx' || ext === 'xls') {
      readExcel(file);
    } else {
      readCSV(file);
    }
  }

  function readCSV(file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: result => processData(result.data),
      error: err => App.toast('CSV parse error: ' + err.message, 'error')
    });
  }

  function readExcel(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' });
        processData(json);
      } catch (err) {
        App.toast('Excel read error: ' + err.message, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /* ---- PARSE & DETECT ---- */
  function processData(data) {
    if (!data || data.length === 0) {
      App.toast('File appears to be empty.', 'error');
      return;
    }

    parsedRows = data;
    const rawHeaders = Object.keys(data[0]);
    const normHeaders = normalizeHeaders(rawHeaders);

    brokerProfile = BROKER_PROFILES.find(p => p.detect(normHeaders)) || null;

    // Case-insensitive row mapper
    const caseInsensitiveRow = row => {
      const out = {};
      Object.keys(row).forEach(k => { out[k.trim().toLowerCase()] = row[k]; out[k] = row[k]; });
      return out;
    };

    validRows = [];
    errorRows = [];
    parsedRows.forEach((rawRow, idx) => {
      const row = caseInsensitiveRow(rawRow);
      let mapped;
      if (brokerProfile) {
        mapped = brokerProfile.map(row);
      } else {
        // Fallback generic: fuzzy-match common column names
        mapped = {
          symbol: clean(col(row, 'symbol', 'scrip', 'instrument', 'ticker', 'stock')),
          name: clean(col(row, 'name', 'company', 'stock name', 'instrument', 'symbol')),
          qty: parseFloat(col(row, 'qty', 'qty.', 'quantity', 'shares', 'net qty', 'holdings')) || 0,
          avgBuyPrice: parseFloat(col(row, 'avgbuyprice', 'avg buy price', 'avg price', 'average price', 'avg cost', 'avg. cost', 'buy price', 'cost')) || 0,
          exchange: (col(row, 'exchange') || 'NSE').toUpperCase()
        };
      }

      // Validation
      const errs = [];
      if (!mapped.symbol) errs.push('Symbol missing');
      if (!mapped.qty || mapped.qty <= 0) errs.push('Qty invalid');
      if (!mapped.avgBuyPrice || mapped.avgBuyPrice <= 0) errs.push('Avg price invalid');
      if (!['NSE', 'BSE'].includes(mapped.exchange)) mapped.exchange = 'NSE';

      if (errs.length > 0) {
        errorRows.push({ row: idx + 2, symbol: mapped.symbol || '?', errors: errs });
      } else {
        mapped.symbol = mapped.symbol.toUpperCase();
        mapped.name = mapped.name || mapped.symbol;
        validRows.push(mapped);
      }
    });

    showPreview();
  }

  /* ---- PREVIEW MODAL ---- */
  function showPreview() {
    document.getElementById('import-step-1').style.display = 'none';
    document.getElementById('import-step-2').style.display = '';
    document.getElementById('import-confirm').style.display = '';
    document.getElementById('import-back').style.display = '';

    // Broker badge
    const brokerEl = document.getElementById('broker-detected');
    if (brokerProfile) {
      brokerEl.innerHTML = `<div class="broker-badge">&#10003; Detected: ${escHtml(brokerProfile.name)} format</div>`;
    } else {
      brokerEl.innerHTML = `<div class="broker-badge" style="background:#fef3c7;color:#92400e">&#9888; Generic format detected</div>`;
    }

    // Summary
    document.getElementById('import-summary').textContent =
      `${validRows.length} valid row(s) ready to import${errorRows.length > 0 ? `, ${errorRows.length} row(s) with errors (skipped)` : ''}.`;

    // Preview table (first 5 valid rows)
    const thead = document.getElementById('import-preview-thead');
    const tbody = document.getElementById('import-preview-tbody');
    thead.innerHTML = '<th>Symbol</th><th>Name</th><th>Qty</th><th>Avg Buy Price</th><th>Exchange</th>';
    tbody.innerHTML = validRows.slice(0, 5).map(r => `
      <tr>
        <td>${escHtml(r.symbol)}</td>
        <td>${escHtml(r.name)}</td>
        <td>${r.qty}</td>
        <td>₹${r.avgBuyPrice.toFixed(2)}</td>
        <td>${escHtml(r.exchange)}</td>
      </tr>
    `).join('') + (validRows.length > 5 ? `<tr><td colspan="5" style="text-align:center;color:#64748b">…and ${validRows.length - 5} more</td></tr>` : '');

    // Errors
    const errContainer = document.getElementById('import-error-container');
    if (errorRows.length > 0) {
      errContainer.innerHTML = `<div class="import-error-list">
        <strong>Skipped rows with errors:</strong>
        <ul>${errorRows.map(e => `<li>Row ${e.row} (${escHtml(e.symbol)}): ${e.errors.join(', ')}</li>`).join('')}</ul>
      </div>`;
    } else {
      errContainer.innerHTML = '';
    }

    document.getElementById('import-confirm').disabled = validRows.length === 0;
  }

  /* ---- EXECUTE IMPORT ---- */
  function executeImport() {
    if (validRows.length === 0) return;
    const strategy = document.getElementById('import-merge-strategy').value;
    const existing = Storage.getHoldings();
    const existingMap = {};
    existing.forEach(h => { existingMap[h.symbol] = h; });

    let added = 0, updated = 0, skipped = 0;

    validRows.forEach(row => {
      if (existingMap[row.symbol]) {
        if (strategy === 'skip') { skipped++; return; }
        Storage.upsertHolding({
          ...existingMap[row.symbol],
          qty: row.qty,
          avgBuyPrice: row.avgBuyPrice,
          exchange: row.exchange,
          name: row.name || existingMap[row.symbol].name
        });
        updated++;
      } else {
        Storage.upsertHolding({
          id: generateId(),
          symbol: row.symbol,
          name: row.name,
          qty: row.qty,
          avgBuyPrice: row.avgBuyPrice,
          exchange: row.exchange,
          notes: ''
        });
        added++;
      }
    });

    App.closeModal('modal-import');
    Holdings.render();
    Funds.render();

    const parts = [];
    if (added > 0) parts.push(`${added} added`);
    if (updated > 0) parts.push(`${updated} updated`);
    if (skipped > 0) parts.push(`${skipped} skipped`);
    App.toast('Import complete: ' + parts.join(', ') + '.', 'success');
  }

  window.CSVParser = { init };
})();
