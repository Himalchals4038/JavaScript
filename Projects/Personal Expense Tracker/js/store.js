/**
 * ApexExpense - Store Module
 * Handles local state, LocalStorage persistence, seed dataset, budget tracking, and CSV parsing/export.
 */

const Store = (function() {
  const STORAGE_KEYS = {
    TRANSACTIONS: 'apex_expense_transactions',
    BUDGETS: 'apex_expense_budgets',
    GOALS: 'apex_expense_goals',
    THEME: 'apex_expense_theme'
  };

  // Category Configuration with Metadata
  const CATEGORIES = {
    expense: [
      { id: 'Food & Dining', icon: 'fa-utensils', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
      { id: 'Housing & Rent', icon: 'fa-house-chimney', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)' },
      { id: 'Utilities & Bills', icon: 'fa-bolt', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
      { id: 'Shopping', icon: 'fa-bag-shopping', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
      { id: 'Transportation', icon: 'fa-car', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
      { id: 'Entertainment', icon: 'fa-gamepad', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
      { id: 'Health & Fitness', icon: 'fa-heart-pulse', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
      { id: 'Education & Learning', icon: 'fa-graduation-cap', color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.15)' },
      { id: 'Miscellaneous', icon: 'fa-ellipsis', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' }
    ],
    income: [
      { id: 'Salary', icon: 'fa-money-bill-wave', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
      { id: 'Freelance & Side Gig', icon: 'fa-laptop-code', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
      { id: 'Investments', icon: 'fa-chart-line', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)' },
      { id: 'Business Income', icon: 'fa-briefcase', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
      { id: 'Gifts & Refunds', icon: 'fa-gift', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
      { id: 'Other Income', icon: 'fa-piggy-bank', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' }
    ]
  };

  const DEFAULT_BUDGETS = {
    'Food & Dining': 600,
    'Housing & Rent': 1500,
    'Utilities & Bills': 300,
    'Shopping': 400,
    'Transportation': 250,
    'Entertainment': 200,
    'Health & Fitness': 150,
    'Education & Learning': 150,
    'Miscellaneous': 100
  };

  const DEFAULT_GOALS = [
    { id: 'g1', title: 'Emergency Fund', target: 5000, current: 3250, icon: 'fa-shield-halved' },
    { id: 'g2', title: 'Japan Vacation', target: 3500, current: 1800, icon: 'fa-plane' },
    { id: 'g3', title: 'M3 Macbook Pro', target: 2400, current: 1600, icon: 'fa-laptop' }
  ];

  let state = {
    transactions: [],
    budgets: { ...DEFAULT_BUDGETS },
    goals: [ ...DEFAULT_GOALS ],
    theme: 'dark'
  };

  // Helper to get formatted date string (YYYY-MM-DD) offset by days
  function getOffsetDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() - daysOffset);
    return d.toISOString().split('T')[0];
  }

  // Seed data generator for instantly rich interactive preview
  function generateSeedTransactions() {
    return [
      { id: 'tx_1', title: 'Monthly Software Engineer Salary', amount: 4800, type: 'income', category: 'Salary', date: getOffsetDate(2), paymentMethod: 'Bank Transfer', notes: 'Direct deposit' },
      { id: 'tx_2', title: 'Luxury Apartment Rent', amount: 1450, type: 'expense', category: 'Housing & Rent', date: getOffsetDate(3), paymentMethod: 'Bank Transfer', notes: 'Monthly rent' },
      { id: 'tx_3', title: 'Whole Foods Grocery Shopping', amount: 184.50, type: 'expense', category: 'Food & Dining', date: getOffsetDate(1), paymentMethod: 'Credit Card', notes: 'Weekly groceries' },
      { id: 'tx_4', title: 'UI/UX Freelance Design Project', amount: 1200, type: 'income', category: 'Freelance & Side Gig', date: getOffsetDate(5), paymentMethod: 'UPI / Wallet', notes: 'Client invoice payout' },
      { id: 'tx_5', title: 'Electricity & High-Speed Wifi', amount: 145.20, type: 'expense', category: 'Utilities & Bills', date: getOffsetDate(6), paymentMethod: 'Credit Card', notes: 'Utility bills' },
      { id: 'tx_6', title: 'Dinner at Steakhouse & Drinks', amount: 96.80, type: 'expense', category: 'Food & Dining', date: getOffsetDate(4), paymentMethod: 'Credit Card', notes: 'Weekend dinner' },
      { id: 'tx_7', title: 'Equinox Fitness Gym Membership', amount: 85.00, type: 'expense', category: 'Health & Fitness', date: getOffsetDate(8), paymentMethod: 'Debit Card', notes: 'Subscription' },
      { id: 'tx_8', title: 'Gas & Auto Insurance Refill', amount: 110.00, type: 'expense', category: 'Transportation', date: getOffsetDate(7), paymentMethod: 'Credit Card', notes: 'Car expenses' },
      { id: 'tx_9', title: 'Stock Dividend Yield Payout', amount: 320.00, type: 'income', category: 'Investments', date: getOffsetDate(12), paymentMethod: 'Bank Transfer', notes: 'Quarterly dividends' },
      { id: 'tx_10', title: 'New Mechanical Keyboard & Mouse', amount: 215.00, type: 'expense', category: 'Shopping', date: getOffsetDate(10), paymentMethod: 'Credit Card', notes: 'Desk upgrade' },
      { id: 'tx_11', title: 'Cinema IMAX Tickets & Snacks', amount: 42.50, type: 'expense', category: 'Entertainment', date: getOffsetDate(9), paymentMethod: 'Cash', notes: 'Movie night' },
      { id: 'tx_12', title: 'Online Course Masterclass', amount: 89.00, type: 'expense', category: 'Education & Learning', date: getOffsetDate(14), paymentMethod: 'Credit Card', notes: 'Skill building' }
    ];
  }

  function init() {
    try {
      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const storedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      const storedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

      if (storedTx) {
        const parsed = JSON.parse(storedTx);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.transactions = parsed;
        } else {
          state.transactions = generateSeedTransactions();
          saveTransactions();
        }
      } else {
        state.transactions = generateSeedTransactions();
        saveTransactions();
      }

      if (storedBudgets) {
        state.budgets = { ...DEFAULT_BUDGETS, ...JSON.parse(storedBudgets) };
      } else {
        saveBudgets();
      }

      if (storedGoals) {
        state.goals = JSON.parse(storedGoals);
      } else {
        saveGoals();
      }

      if (storedTheme) {
        state.theme = storedTheme;
      }
    } catch (err) {
      console.error('Error loading store from localStorage:', err);
      state.transactions = generateSeedTransactions();
    }
  }

  function saveTransactions() {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  }

  function saveBudgets() {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
  }

  function saveGoals() {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(state.goals));
  }

  function saveTheme(theme) {
    state.theme = theme;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  return {
    init,
    
    // Theme
    getTheme: () => state.theme,
    setTheme: (t) => saveTheme(t),

    // Categories Meta
    getCategories: () => CATEGORIES,
    getCategoryMeta: (type, catId) => {
      const list = CATEGORIES[type] || [];
      const found = list.find(c => c.id === catId);
      if (found) return found;
      return { id: catId, icon: 'fa-circle-dollar-to-slot', color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)' };
    },

    // Transactions API
    getTransactions: () => [ ...state.transactions ],
    
    addTransaction: (tx) => {
      const newTx = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        title: tx.title,
        amount: parseFloat(tx.amount),
        type: tx.type, // 'income' | 'expense'
        category: tx.category,
        date: tx.date,
        paymentMethod: tx.paymentMethod || 'Credit Card',
        notes: tx.notes || ''
      };
      state.transactions.unshift(newTx);
      saveTransactions();
      return newTx;
    },

    updateTransaction: (id, updatedData) => {
      const idx = state.transactions.findIndex(t => t.id === id);
      if (idx !== -1) {
        state.transactions[idx] = {
          ...state.transactions[idx],
          ...updatedData,
          amount: parseFloat(updatedData.amount)
        };
        saveTransactions();
        return state.transactions[idx];
      }
      return null;
    },

    deleteTransaction: (id) => {
      state.transactions = state.transactions.filter(t => t.id !== id);
      saveTransactions();
    },

    clearAllTransactions: () => {
      state.transactions = [];
      saveTransactions();
    },

    seedDemoData: () => {
      state.transactions = generateSeedTransactions();
      saveTransactions();
      return state.transactions;
    },

    // Budgets API
    getBudgets: () => ({ ...state.budgets }),
    updateBudgets: (newBudgets) => {
      state.budgets = { ...state.budgets, ...newBudgets };
      saveBudgets();
    },

    // Savings Goals API
    getGoals: () => [ ...state.goals ],
    addGoal: (goal) => {
      const newGoal = {
        id: 'g_' + Date.now(),
        title: goal.title,
        target: parseFloat(goal.target),
        current: parseFloat(goal.current || 0),
        icon: goal.icon || 'fa-piggy-bank'
      };
      state.goals.push(newGoal);
      saveGoals();
      return newGoal;
    },
    depositToGoal: (id, amount) => {
      const goal = state.goals.find(g => g.id === id);
      if (goal) {
        goal.current = Math.min(goal.target, goal.current + parseFloat(amount));
        saveGoals();
      }
    },
    deleteGoal: (id) => {
      state.goals = state.goals.filter(g => g.id !== id);
      saveGoals();
    },

    // Financial Metrics Calculation
    getFinancialMetrics: (timeframe = 'this-month') => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      let filtered = state.transactions;

      if (timeframe === 'this-month') {
        filtered = state.transactions.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        });
      } else if (timeframe === 'last-3-months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        filtered = state.transactions.filter(t => new Date(t.date) >= threeMonthsAgo);
      }

      let totalIncome = 0;
      let totalExpenses = 0;
      let incomeCount = 0;
      let expenseCount = 0;

      filtered.forEach(t => {
        if (t.type === 'income') {
          totalIncome += t.amount;
          incomeCount++;
        } else if (t.type === 'expense') {
          totalExpenses += t.amount;
          expenseCount++;
        }
      });

      const totalBalance = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

      return {
        totalIncome,
        totalExpenses,
        totalBalance,
        savingsRate: Math.max(0, savingsRate),
        incomeCount,
        expenseCount
      };
    },

    // Expense breakdown by Category
    getExpensesByCategory: (timeframe = 'this-month') => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      let filtered = state.transactions.filter(t => t.type === 'expense');

      if (timeframe === 'this-month') {
        filtered = filtered.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        });
      } else if (timeframe === 'last-3-months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        filtered = filtered.filter(t => new Date(t.date) >= threeMonthsAgo);
      }

      const map = {};
      filtered.forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

      return map;
    },

    // CSV Export & Parse Helpers
    exportToCSV: () => {
      const headers = ['title', 'amount', 'type', 'category', 'date', 'paymentMethod', 'notes'];
      const rows = state.transactions.map(t => [
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount,
        t.type,
        `"${t.category}"`,
        t.date,
        `"${t.paymentMethod}"`,
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ApexExpense_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    parseCSVText: (text) => {
      const lines = text.trim().split('\n');
      if (lines.length < 2) return [];

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple regex split for CSV handling quoted values
        const cols = line.match(/(?:[^\s",]|"[^"]*")+/g) || [];
        if (cols.length >= 5) {
          const title = cols[0] ? cols[0].replace(/^"|"$/g, '') : 'Imported Item';
          const amount = parseFloat(cols[1]) || 0;
          const type = cols[2] && cols[2].toLowerCase().includes('inc') ? 'income' : 'expense';
          const category = cols[3] ? cols[3].replace(/^"|"$/g, '') : (type === 'income' ? 'Salary' : 'Miscellaneous');
          const date = cols[4] ? cols[4].replace(/^"|"$/g, '') : new Date().toISOString().split('T')[0];
          const paymentMethod = cols[5] ? cols[5].replace(/^"|"$/g, '') : 'Credit Card';
          const notes = cols[6] ? cols[6].replace(/^"|"$/g, '') : 'Imported CSV';

          parsed.push({ title, amount, type, category, date, paymentMethod, notes });
        }
      }
      return parsed;
    }
  };
})();
