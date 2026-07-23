/**
 * ApexExpense - UI Renderer Module
 * Renders DOM elements for financial metrics, filtered transactions, category budget bars, and goals.
 */

const UI = (function() {
  
  const TIPS = [
    "Following the 50/30/20 rule? Direct 50% of income to Needs, 30% to Wants, and 20% to Savings.",
    "Pay yourself first: Automatically transfer 15-20% of your paycheck into savings on payday.",
    "Review recurring subscriptions monthly. Cancel services you haven't used in 30 days.",
    "Maintain an emergency fund covering 3 to 6 months of essential living expenses.",
    "Use credit cards for cash-back rewards, but pay off the full statement balance every single month."
  ];

  // Show Toast Notification
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-circle-check text-success';
    if (type === 'danger') iconClass = 'fa-triangle-exclamation text-danger';
    if (type === 'warning') iconClass = 'fa-circle-exclamation text-warning';

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
      </div>
      <button class="btn-close" style="font-size: 1.1rem;" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4000);
  }

  // Format currency helper
  function formatCurrency(amount) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Update Header Date
  function updateHeaderDate() {
    const el = document.getElementById('header-date');
    if (el) {
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      el.textContent = new Date().toLocaleDateString('en-US', options);
    }
  }

  // Render Metrics Overview
  function renderMetrics(timeframe = 'this-month') {
    const metrics = Store.getFinancialMetrics(timeframe);

    const elBalance = document.getElementById('total-balance');
    const elIncome = document.getElementById('total-income');
    const elExpenses = document.getElementById('total-expenses');
    const elSavingsRate = document.getElementById('savings-rate');
    const elSavingsBar = document.getElementById('savings-rate-bar');
    const elIncomeCount = document.getElementById('income-count');
    const elExpenseCount = document.getElementById('expense-count');
    const elBalancePill = document.getElementById('balance-status-pill');

    if (elBalance) elBalance.textContent = formatCurrency(metrics.totalBalance);
    if (elIncome) elIncome.textContent = formatCurrency(metrics.totalIncome);
    if (elExpenses) elExpenses.textContent = formatCurrency(metrics.totalExpenses);
    if (elSavingsRate) elSavingsRate.textContent = metrics.savingsRate.toFixed(1);
    
    if (elSavingsBar) {
      const pct = Math.min(100, Math.max(0, metrics.savingsRate));
      elSavingsBar.style.width = `${pct}%`;
    }

    if (elIncomeCount) elIncomeCount.textContent = `${metrics.incomeCount} entries`;
    if (elExpenseCount) elExpenseCount.textContent = `${metrics.expenseCount} entries`;

    if (elBalancePill) {
      if (metrics.totalBalance >= 0) {
        elBalancePill.className = 'trend-pill trend-up';
        elBalancePill.innerHTML = '<i class="fa-solid fa-arrow-trend-up"></i> Net Surplus';
      } else {
        elBalancePill.className = 'trend-pill trend-down';
        elBalancePill.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i> Deficit';
      }
    }
  }

  // Populate Category Filter Dropdown
  function populateCategoryDropdowns() {
    const filterSelect = document.getElementById('category-filter');
    const formCatSelect = document.getElementById('tx-category');

    const categories = Store.getCategories();
    const allCategories = [...categories.expense, ...categories.income];

    if (filterSelect) {
      filterSelect.innerHTML = '<option value="all">All Categories</option>';
      allCategories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.id;
        filterSelect.appendChild(opt);
      });
    }

    if (formCatSelect) {
      // Default to expense categories
      formCatSelect.innerHTML = '';
      categories.expense.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.id;
        formCatSelect.appendChild(opt);
      });
    }
  }

  // Render Transaction List with Filter & Search
  function renderTransactions(filterOpts = {}) {
    const listEl = document.getElementById('transaction-list');
    const emptyEl = document.getElementById('empty-state');
    if (!listEl) return;

    let transactions = Store.getTransactions();

    // Type filter (all, income, expense)
    if (filterOpts.type && filterOpts.type !== 'all') {
      transactions = transactions.filter(t => t.type === filterOpts.type);
    }

    // Category filter
    if (filterOpts.category && filterOpts.category !== 'all') {
      transactions = transactions.filter(t => t.category === filterOpts.category);
    }

    // Search filter
    if (filterOpts.search && filterOpts.search.trim() !== '') {
      const q = filterOpts.search.toLowerCase().trim();
      transactions = transactions.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q))
      );
    }

    // Sort filter
    const sort = filterOpts.sort || 'date-desc';
    transactions.sort((a, b) => {
      if (sort === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sort === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sort === 'amount-desc') return b.amount - a.amount;
      if (sort === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    listEl.innerHTML = '';

    if (transactions.length === 0) {
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');

    transactions.forEach(t => {
      const meta = Store.getCategoryMeta(t.type, t.category);
      const isIncome = t.type === 'income';

      const item = document.createElement('div');
      item.className = 'tx-item';
      item.innerHTML = `
        <div class="tx-left">
          <div class="tx-icon-badge" style="background: ${meta.bg}; color: ${meta.color};">
            <i class="fa-solid ${meta.icon}"></i>
          </div>
          <div class="tx-details">
            <span class="tx-title">${t.title}</span>
            <div class="tx-meta">
              <span class="tx-category-tag">${t.category}</span>
              <span><i class="fa-regular fa-calendar-check"></i> ${t.date}</span>
              <span><i class="fa-regular fa-credit-card"></i> ${t.paymentMethod || 'Card'}</span>
            </div>
          </div>
        </div>
        <div class="tx-right">
          <div class="tx-amount ${isIncome ? 'income' : 'expense'}">
            ${isIncome ? '+' : '-'}$${formatCurrency(t.amount)}
          </div>
          <div class="tx-actions">
            <button class="btn-icon btn-icon-sm btn-edit-tx" data-id="${t.id}" title="Edit Transaction">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon btn-icon-sm btn-delete-tx text-danger-muted" data-id="${t.id}" title="Delete Transaction">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      listEl.appendChild(item);
    });
  }

  // Render Category Budget Bars
  function renderCategoryBudgets() {
    const container = document.getElementById('budget-bars-list');
    if (!container) return;

    const budgets = Store.getBudgets();
    const expensesMap = Store.getExpensesByCategory('this-month');
    const categoriesMeta = Store.getCategories().expense;

    container.innerHTML = '';

    categoriesMeta.forEach(cat => {
      const cap = budgets[cat.id] || 0;
      const spent = expensesMap[cat.id] || 0;
      const pct = cap > 0 ? (spent / cap) * 100 : 0;

      let fillClass = 'fill-safe';
      if (pct >= 80 && pct < 100) fillClass = 'fill-warning';
      if (pct >= 100) fillClass = 'fill-danger';

      const item = document.createElement('div');
      item.className = 'budget-item';
      item.innerHTML = `
        <div class="budget-item-header">
          <span class="budget-category-label">
            <i class="fa-solid ${cat.icon}" style="color: ${cat.color};"></i> ${cat.id}
          </span>
          <span class="budget-amounts">
            <span class="spent">$${formatCurrency(spent)}</span> / $${formatCurrency(cap)}
          </span>
        </div>
        <div class="budget-progress-track" title="${pct.toFixed(1)}% of budget spent">
          <div class="budget-progress-fill ${fillClass}" style="width: ${Math.min(100, pct)}%;"></div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // Render Savings Goals Widget
  function renderSavingsGoals() {
    const container = document.getElementById('savings-goals-list');
    if (!container) return;

    const goals = Store.getGoals();
    container.innerHTML = '';

    if (goals.length === 0) {
      container.innerHTML = '<p class="text-muted" style="font-size: 0.825rem; text-align: center;">No savings goals yet. Create one!</p>';
      return;
    }

    goals.forEach(goal => {
      const pct = Math.min(100, (goal.current / goal.target) * 100);
      const isComplete = goal.current >= goal.target;

      const card = document.createElement('div');
      card.className = 'goal-card';
      card.innerHTML = `
        <div class="goal-card-header">
          <div class="goal-title-group">
            <div class="goal-icon-badge">
              <i class="fa-solid ${goal.icon || 'fa-piggy-bank'}"></i>
            </div>
            <span>${goal.title}</span>
          </div>
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn-icon btn-icon-sm btn-deposit-goal" data-id="${goal.id}" title="Add Funds">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button class="btn-icon btn-icon-sm btn-delete-goal text-danger-muted" data-id="${goal.id}" title="Delete Goal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        <div class="goal-card-body">
          <div class="budget-item-header" style="margin-bottom: 0.35rem;">
            <span class="goal-amounts">Saved <span>$${formatCurrency(goal.current)}</span> of $${formatCurrency(goal.target)}</span>
            <span class="trend-pill ${isComplete ? 'trend-up' : ''}" style="font-size: 0.7rem;">${pct.toFixed(0)}%</span>
          </div>
          <div class="budget-progress-track">
            <div class="budget-progress-fill ${isComplete ? 'fill-safe' : ''}" style="width: ${pct}%; background: linear-gradient(90deg, var(--accent), var(--primary));"></div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Render Random Tip
  function renderFinancialTip() {
    const el = document.getElementById('random-financial-tip');
    if (el) {
      const random = TIPS[Math.floor(Math.random() * TIPS.length)];
      el.textContent = random;
    }
  }

  // Populate Budget Inputs in Edit Modal
  function populateBudgetModalInputs() {
    const container = document.getElementById('budget-input-fields');
    if (!container) return;

    const budgets = Store.getBudgets();
    const categoriesMeta = Store.getCategories().expense;

    container.innerHTML = '';

    categoriesMeta.forEach(cat => {
      const cap = budgets[cat.id] || 0;
      const group = document.createElement('div');
      group.className = 'form-group';
      group.innerHTML = `
        <label class="form-label"><i class="fa-solid ${cat.icon}" style="color: ${cat.color};"></i> ${cat.id} ($)</label>
        <input type="number" name="budget_${cat.id}" value="${cap}" step="50" min="0" required>
      `;
      container.appendChild(group);
    });
  }

  return {
    showToast,
    formatCurrency,
    updateHeaderDate,
    renderMetrics,
    populateCategoryDropdowns,
    renderTransactions,
    renderCategoryBudgets,
    renderSavingsGoals,
    renderFinancialTip,
    populateBudgetModalInputs
  };
})();
