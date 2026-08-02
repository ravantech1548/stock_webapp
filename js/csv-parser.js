(function () {
  'use strict';

  const { generateId, escHtml } = window.Utils;

  // Number cleaner for strings like "₹ 2,450.00", "1,000", "(50)"
  function parseCleanNum(val) {
    if (val == null || val === '') return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    let s = String(val).trim()
      .replace(/[₹$,\s]/g, '') // remove currency symbols, commas, spaces
      .replace(/\(([^)]+)\)/, '-$1'); // handle accounting negatives like (100) -> -100
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
  }

  // Symbol cleaner: Strips broker series like "-EQ", "-BE", ".NS", ".BO"
  function cleanSymbol(val) {
    return String(val || '')
      .trim()
      .toUpperCase()
      .replace(/\.(NS|BO)$/i, '')
      .replace(/-(EQ|BE|SM|IL|BZ|GB|SG|BL|MF|GS|RL|MT|PP)$/i, '')
      .trim();
  }

  // Known broker header signatures & row mappers
  const BROKER_PROFILES = [
    {
      name: 'Zerodha',
      detect: headers => headers.includes('instrument') && (headers.includes('avg cost') || headers.includes('avgcost') || headers.includes('cur val')),
      map: row => ({
        symbol: cleanSymbol(col(row, 'instrument', 'symbol')),
        name: clean(col(row, 'instrument', 'symbol')),
        qty: parseCleanNum(col(row, 'qty', 'qty.', 'quantity', 'net qty')),
        avgBuyPrice: parseCleanNum(col(row, 'avg. cost', 'avg cost', 'avgcost', 'average cost', 'buy avg')),
        exchange: 'NSE'
      })
    },
    {
      name: 'Groww',
      detect: headers => (headers.includes('stocks') || headers.includes('company') || headers.includes('symbol')) && (headers.includes('avg cost') || headers.includes('avgcost') || headers.includes('shares') || headers.includes('quantity')),
      map: row => ({
        symbol: cleanSymbol(col(row, 'symbol', 'stocks', 'company', 'scrip')),
        name: clean(col(row, 'stocks', 'company', 'name', 'symbol')),
        qty: parseCleanNum(col(row, 'quantity', 'qty', 'shares', 'net qty')),
        avgBuyPrice: parseCleanNum(col(row, 'avg cost', 'avgcost', 'average cost', 'avg buy price', 'buy price')),
        exchange: 'NSE'
      })
    },
    {
      name: 'AngelOne / Upstox / Dhan',
      detect: headers => (headers.includes('scrip') || headers.includes('symbol') || headers.includes('trading symbol')) && (headers.includes('buy price') || headers.includes('average price') || headers.includes('avg price')),
      map: row => ({
        symbol: cleanSymbol(col(row, 'trading symbol', 'scrip', 'symbol', 'symbol name', 'instrument')),
        name: clean(col(row, 'company name', 'scrip name', 'name', 'scrip', 'symbol')),
        qty: parseCleanNum(col(row, 'qty', 'quantity', 'net qty', 'total qty', 'holdings')),
        avgBuyPrice: parseCleanNum(col(row, 'buy price', 'average price', 'avg price', 'avg buy price', 'buy avg')),
        exchange: (col(row, 'exchange', 'market') || 'NSE').toUpperCase().includes('BSE') ? 'BSE' : 'NSE'
      })
    },
    {
      name: 'Standard / Generic',
      detect: headers => (headers.includes('symbol') || headers.includes('scrip') || headers.includes('instrument')) && (headers.includes('qty') || headers.includes('quantity') || headers.includes('shares')),
      map: row => ({
        symbol: cleanSymbol(col(row, 'symbol', 'scrip', 'instrument', 'ticker', 'stock')),
        name: clean(col(row, 'name', 'company', 'company name', 'stock name', 'symbol')),
        qty: parseCleanNum(col(row, 'qty', 'qty.', 'quantity', 'shares', 'net qty', 'holdings')),
        avgBuyPrice: parseCleanNum(col(row, 'avgbuyprice', 'avg buy price', 'avg price', 'average price', 'avg cost', 'avg. cost', 'buy price', 'cost', 'price')),
        exchange: (col(row, 'exchange') || 'NSE').toUpperCase().includes('BSE') ? 'BSE' : 'NSE'
      })
    }
  ];

  function clean(val) {
    return String(val || '').trim();
  }

  function normalizeHeader(h) {
    return String(h || '').trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
  }

  // Fuzzy column lookup
  function col(row, ...names) {
    const keys = Object.keys(row);
    for (const name of names) {
      if (row[name] !== undefined && row[name] !== '') return row[name];
      const norm = normalizeHeader(name);
      const found = keys.find(k => normalizeHeader(k) === norm);
      if (found && row[found] !== undefined && row[found] !== '') return row[found];
    }
    return '';
  }

  let parsedRows = [];
  let brokerProfile = null;
  let validRows = [];
  let errorRows = [];

  /* ---- FILE PICKER & MODAL ---- */
  function init() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseLink = document.getElementById('browse-link');
    const importBtn = document.getElementById('btn-import');
    const confirmBtn = document.getElementById('import-confirm');
    const backBtn = document.getElementById('import-back');
    const cancelBtn = document.getElementById('import-cancel');

    if (importBtn) {
      importBtn.addEventListener('click', () => {
        resetImportModal();
        App.openModal('modal-import');
      });
    }

    if (browseLink) browseLink.addEventListener('click', () => fileInput && fileInput.click());
    if (dropZone) {
      dropZone.addEventListener('click', () => fileInput && fileInput.click());
      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) handleFile(file);
        fileInput.value = '';
      });
    }

    if (confirmBtn) confirmBtn.addEventListener('click', executeImport);
    if (backBtn) backBtn.addEventListener('click', resetImportModal);
    if (cancelBtn) cancelBtn.addEventListener('click', () => App.closeModal('modal-import'));
  }

  function resetImportModal() {
    const step1 = document.getElementById('import-step-1');
    const step2 = document.getElementById('import-step-2');
    const confirmBtn = document.getElementById('import-confirm');
    const backBtn = document.getElementById('import-back');

    if (step1) step1.style.display = '';
    if (step2) step2.style.display = 'none';
    if (confirmBtn) confirmBtn.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';

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
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = e.target.result;
        Papa.parse(text, {
          header: false, // Parse as 2D array first to detect multi-row header offset
          skipEmptyLines: true,
          complete: result => processRawGrid(result.data),
          error: err => App.toast('CSV parse error: ' + err.message, 'error')
        });
      } catch (err) {
        App.toast('Failed to parse CSV: ' + err.message, 'error');
      }
    };
    reader.onerror = err => App.toast('File read error: ' + (err.message || 'Could not read file'), 'error');
    reader.readAsText(file);
  }

  function readExcel(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        processRawGrid(grid);
      } catch (err) {
        App.toast('Excel read error: ' + err.message, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /* ---- DETECT HEADER ROW & PROCESS ---- */
  function processRawGrid(grid) {
    if (!grid || grid.length === 0) {
      App.toast('File appears to be empty.', 'error');
      return;
    }

    // Find header row index by looking for key indicators
    const headerKeywords = ['instrument', 'symbol', 'scrip', 'ticker', 'qty', 'quantity', 'shares', 'avg cost', 'avg buy price', 'average price', 'buy price'];
    let headerRowIdx = 0;
    let maxMatchCount = 0;

    for (let r = 0; r < Math.min(grid.length, 15); r++) {
      const row = grid[r];
      if (!Array.isArray(row)) continue;
      const normalizedCells = row.map(c => normalizeHeader(c));
      const matchCount = headerKeywords.filter(kw => normalizedCells.some(cell => cell.includes(kw))).length;
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        headerRowIdx = r;
      }
    }

    const headers = grid[headerRowIdx].map(h => String(h || '').trim());
    const dataRows = grid.slice(headerRowIdx + 1);

    // Convert to array of objects
    const dataObjects = dataRows
      .filter(row => Array.isArray(row) && row.some(cell => cell !== '' && cell != null))
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => {
          if (h) obj[h] = row[i] !== undefined ? row[i] : '';
        });
        return obj;
      });

    processDataObjects(dataObjects, headers);
  }

  function processDataObjects(data, rawHeaders) {
    if (!data || data.length === 0) {
      App.toast('No tabular data found in file.', 'error');
      return;
    }

    parsedRows = data;
    const normHeaders = rawHeaders.map(h => normalizeHeader(h));

    brokerProfile = BROKER_PROFILES.find(p => p.detect(normHeaders)) || BROKER_PROFILES[BROKER_PROFILES.length - 1];

    validRows = [];
    errorRows = [];

    parsedRows.forEach((rawRow, idx) => {
      const mapped = brokerProfile.map(rawRow);

      const errs = [];
      if (!mapped.symbol) errs.push('Symbol is missing');
      if (!mapped.qty || mapped.qty <= 0) errs.push(`Invalid quantity (${mapped.qty})`);
      if (!mapped.avgBuyPrice || mapped.avgBuyPrice <= 0) errs.push(`Invalid avg buy price (${mapped.avgBuyPrice})`);
      if (!['NSE', 'BSE'].includes(mapped.exchange)) mapped.exchange = 'NSE';

      if (errs.length > 0) {
        // Skip totally blank rows silently, log row with errors
        if (mapped.symbol || mapped.qty > 0) {
          errorRows.push({ row: idx + 2, symbol: mapped.symbol || '(Unknown)', errors: errs });
        }
      } else {
        mapped.symbol = cleanSymbol(mapped.symbol);
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

    const brokerEl = document.getElementById('broker-detected');
    if (brokerProfile && brokerProfile.name !== 'Standard / Generic') {
      brokerEl.innerHTML = `<div class="broker-badge">&#10003; Detected format: <strong>${escHtml(brokerProfile.name)}</strong></div>`;
    } else {
      brokerEl.innerHTML = `<div class="broker-badge" style="background:#fef3c7;color:#92400e">&#9888; Generic format detected</div>`;
    }

    document.getElementById('import-summary').textContent =
      `${validRows.length} valid row(s) recognized${errorRows.length > 0 ? `, ${errorRows.length} row(s) skipped with issues` : ''}.`;

    const thead = document.getElementById('import-preview-thead');
    const tbody = document.getElementById('import-preview-tbody');
    thead.innerHTML = '<th>Symbol</th><th>Company Name</th><th>Qty</th><th>Avg Buy Price</th><th>Exchange</th>';
    
    tbody.innerHTML = validRows.slice(0, 6).map(r => `
      <tr>
        <td><strong>${escHtml(r.symbol)}</strong></td>
        <td>${escHtml(r.name)}</td>
        <td>${r.qty}</td>
        <td>₹${r.avgBuyPrice.toFixed(2)}</td>
        <td><span class="exchange-badge">${escHtml(r.exchange)}</span></td>
      </tr>
    `).join('') + (validRows.length > 6 ? `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:.5rem">…and ${validRows.length - 6} more rows</td></tr>` : '');

    const errContainer = document.getElementById('import-error-container');
    if (errorRows.length > 0) {
      errContainer.innerHTML = `<div class="import-error-list">
        <strong>Skipped rows:</strong>
        <ul>${errorRows.slice(0, 5).map(e => `<li>Row ${e.row} (${escHtml(e.symbol)}): ${e.errors.join(', ')}</li>`).join('')}</ul>
        ${errorRows.length > 5 ? `<p style="margin-top:.25rem;font-size:.75rem">...and ${errorRows.length - 5} other error rows.</p>` : ''}
      </div>`;
    } else {
      errContainer.innerHTML = '';
    }

    document.getElementById('import-confirm').disabled = (validRows.length === 0);
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
        if (strategy === 'skip') {
          skipped++;
          return;
        }
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
          name: row.name || row.symbol,
          qty: row.qty,
          avgBuyPrice: row.avgBuyPrice,
          exchange: row.exchange,
          notes: ''
        });
        added++;
      }
    });

    App.closeModal('modal-import');
    if (window.Holdings) Holdings.render();
    if (window.Funds) Funds.render();

    // Trigger immediate cloud push for all imported data
    if (window.DB && window.DB.isEnabled()) {
      window.DB.pushAll().catch(e => console.warn('Cloud sync error after import:', e));
    }

    const parts = [];
    if (added > 0) parts.push(`${added} added`);
    if (updated > 0) parts.push(`${updated} updated`);
    if (skipped > 0) parts.push(`${skipped} skipped`);
    App.toast(`Holdings import complete: ${parts.join(', ')}.`, 'success');

    // Auto-fetch prices for all holdings
    if (window.PriceService) {
      setTimeout(() => PriceService.fetchAll(), 400);
    }
  }

  /* ---- SAMPLE TEMPLATES (CSV & EXCEL) ---- */
  function downloadTemplate(type) {
    const data = [
      { Symbol: 'RELIANCE', 'Company Name': 'Reliance Industries Ltd', Qty: 10, 'Avg Buy Price': 2450.00, Exchange: 'NSE' },
      { Symbol: 'TCS', 'Company Name': 'Tata Consultancy Services', Qty: 5, 'Avg Buy Price': 3650.00, Exchange: 'NSE' },
      { Symbol: 'INFY', 'Company Name': 'Infosys Ltd', Qty: 8, 'Avg Buy Price': 1750.50, Exchange: 'NSE' },
      { Symbol: 'HDFCBANK', 'Company Name': 'HDFC Bank Ltd', Qty: 12, 'Avg Buy Price': 1600.00, Exchange: 'NSE' },
      { Symbol: 'TATAMOTORS', 'Company Name': 'Tata Motors Ltd', Qty: 15, 'Avg Buy Price': 920.00, Exchange: 'NSE' }
    ];

    if (type === 'xlsx' && typeof XLSX !== 'undefined') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Holdings');
      XLSX.writeFile(wb, 'stock_holdings_template.xlsx');
      App.toast('Excel template downloaded.', 'success');
    } else {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stock_holdings_template.csv';
      a.click();
      URL.revokeObjectURL(url);
      App.toast('CSV template downloaded.', 'success');
    }
  }

  window.CSVParser = { init, downloadTemplate, cleanSymbol, parseCleanNum };
})();
