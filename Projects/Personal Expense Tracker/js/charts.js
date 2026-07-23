/**
 * ApexExpense - Charts Module
 * Manages dynamic Chart.js visualizations for Category Breakdown & Cash Flow Trends.
 */

const AppCharts = (function() {
  let categoryChartInstance = null;
  let cashflowChartInstance = null;

  // Chart Theme Colors Helper
  function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      textColor: isDark ? '#9CA3AF' : '#64748B',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
      tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
      tooltipTitle: isDark ? '#F3F4F6' : '#0F172A',
      tooltipBody: isDark ? '#9CA3AF' : '#64748B',
      incomeColor: '#10B981',
      expenseColor: '#EF4444'
    };
  }

  // Render or Update Expenses by Category Donut Chart
  function renderCategoryChart(timeframe = 'this-month') {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const dataMap = Store.getExpensesByCategory(timeframe);
    const labels = Object.keys(dataMap);
    const values = Object.values(dataMap);

    const colors = labels.map(cat => {
      const meta = Store.getCategoryMeta('expense', cat);
      return meta.color;
    });

    const themeColors = getChartColors();

    if (categoryChartInstance) {
      categoryChartInstance.destroy();
    }

    if (labels.length === 0) {
      // Render dummy slice if no data
      categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['No Expense Data'],
          datasets: [{
            data: [1],
            backgroundColor: [themeColors.gridColor],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          }
        }
      });
      return;
    }

    categoryChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#111827' : '#FFFFFF',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: themeColors.textColor,
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: themeColors.tooltipBg,
            titleColor: themeColors.tooltipTitle,
            bodyColor: themeColors.tooltipBody,
            borderColor: themeColors.gridColor,
            borderWidth: 1,
            padding: 10,
            boxPadding: 6,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const val = context.raw;
                const pct = ((val / total) * 100).toFixed(1);
                return ` ${context.label}: $${val.toFixed(2)} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Render or Update Income vs Expense Trend Chart
  function renderCashflowChart(timeframe = 'this-month') {
    const ctx = document.getElementById('cashflowChart');
    if (!ctx) return;

    const transactions = Store.getTransactions();
    const themeColors = getChartColors();

    // Group data by last 6 months or recent dates
    const monthsMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize past 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
      monthsMap[key] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
      if (monthsMap[key]) {
        if (t.type === 'income') monthsMap[key].income += t.amount;
        else if (t.type === 'expense') monthsMap[key].expense += t.amount;
      }
    });

    const labels = Object.keys(monthsMap);
    const incomeData = labels.map(k => monthsMap[k].income);
    const expenseData = labels.map(k => monthsMap[k].expense);

    if (cashflowChartInstance) {
      cashflowChartInstance.destroy();
    }

    cashflowChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: themeColors.incomeColor,
            borderRadius: 6,
            barPercentage: 0.6
          },
          {
            label: 'Expense',
            data: expenseData,
            backgroundColor: themeColors.expenseColor,
            borderRadius: 6,
            barPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: themeColors.textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          y: {
            grid: { color: themeColors.gridColor },
            ticks: {
              color: themeColors.textColor,
              font: { family: 'Plus Jakarta Sans', size: 11 },
              callback: value => '$' + value
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: themeColors.textColor,
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: themeColors.tooltipBg,
            titleColor: themeColors.tooltipTitle,
            bodyColor: themeColors.tooltipBody,
            borderColor: themeColors.gridColor,
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: $${context.raw.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }

  function updateCharts(timeframe = 'this-month') {
    renderCategoryChart(timeframe);
    renderCashflowChart(timeframe);
  }

  return {
    renderCategoryChart,
    renderCashflowChart,
    updateCharts
  };
})();
