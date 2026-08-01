(function () {
  'use strict';

  let pieChart = null;
  let barChart = null;

  const PIE_COLORS = [
    '#2563eb','#7c3aed','#db2777','#ea580c','#16a34a',
    '#0891b2','#9333ea','#dc2626','#d97706','#059669',
    '#2dd4bf','#f472b6','#fb923c','#34d399','#60a5fa',
    '#a78bfa','#f87171','#fbbf24','#4ade80','#38bdf8'
  ];

  function getColor(i) {
    return PIE_COLORS[i % PIE_COLORS.length];
  }

  function update(enrichedRows) {
    if (!enrichedRows || enrichedRows.length === 0) {
      destroyAll();
      return;
    }

    const withPrices = enrichedRows.filter(r => r.currentValue != null && r.currentValue > 0);

    updatePie(withPrices);
    updateBar(enrichedRows);
  }

  function updatePie(rows) {
    const labels = rows.map(r => r.symbol);
    const data = rows.map(r => parseFloat(r.currentValue.toFixed(2)));
    const colors = rows.map((_, i) => getColor(i));

    const ctx = document.getElementById('chart-pie');
    if (!ctx) return;

    if (pieChart) {
      pieChart.data.labels = labels;
      pieChart.data.datasets[0].data = data;
      pieChart.data.datasets[0].backgroundColor = colors;
      pieChart.update('none');
    } else {
      pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                  return ` ${ctx.label}: ₹${ctx.raw.toLocaleString('en-IN')} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }
  }

  function updateBar(rows) {
    const sorted = [...rows].sort((a, b) => (b.pnlRs || 0) - (a.pnlRs || 0));
    const labels = sorted.map(r => r.symbol);
    const data = sorted.map(r => r.pnlRs != null ? parseFloat(r.pnlRs.toFixed(2)) : 0);
    const colors = data.map(v => v >= 0 ? '#16a34a' : '#dc2626');

    const ctx = document.getElementById('chart-bar');
    if (!ctx) return;

    if (barChart) {
      barChart.data.labels = labels;
      barChart.data.datasets[0].data = data;
      barChart.data.datasets[0].backgroundColor = colors;
      barChart.update('none');
    } else {
      barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors,
            borderRadius: 3,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` ₹${ctx.raw.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
            }
          },
          scales: {
            x: { ticks: { font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
            y: {
              ticks: {
                callback: v => '₹' + (Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)
              }
            }
          }
        }
      });
    }
  }

  function destroyAll() {
    if (pieChart) { pieChart.destroy(); pieChart = null; }
    if (barChart) { barChart.destroy(); barChart = null; }
  }

  window.Charts = { update, destroyAll };
})();
