/**
 * ApexExpense - Main Controller App
 * Wires store, UI view renderers, charts, modals, and event handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Primary UI Element Selectors
  const btnThemeToggle = document.getElementById('btn-theme-toggle');

  // Initialize Store Data
  Store.init();

  // Active Filter State
  const currentFilters = {
    type: 'all',
    category: 'all',
    search: '',
    sort: 'date-desc',
    timeframe: 'this-month'
  };

  let parsedImportTransactions = [];

  function updateThemeIcon(theme) {
    if (!btnThemeToggle) return;
    btnThemeToggle.innerHTML = theme === 'dark' 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';
  }

  // Initial Theme Application
  const savedTheme = Store.getTheme();
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Initialize UI & Components
  UI.updateHeaderDate();
  UI.populateCategoryDropdowns();
  refreshDashboard();
  UI.renderFinancialTip();

  // --------------------------------------------------------------------------
  // Dashboard Refresh Pipeline
  // --------------------------------------------------------------------------
  function refreshDashboard() {
    UI.renderMetrics(currentFilters.timeframe);
    UI.renderTransactions(currentFilters);
    UI.renderCategoryBudgets();
    UI.renderSavingsGoals();
    AppCharts.updateCharts(currentFilters.timeframe);
  }

  // --------------------------------------------------------------------------
  // Theme Switching
  // --------------------------------------------------------------------------
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      Store.setTheme(nextTheme);
      updateThemeIcon(nextTheme);
      AppCharts.updateCharts(currentFilters.timeframe);
      UI.showToast(`Switched to ${nextTheme} theme mode`);
    });
  }

  // --------------------------------------------------------------------------
  // Filter & Search Controls
  // --------------------------------------------------------------------------
  const searchInput = document.getElementById('search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const categoryFilter = document.getElementById('category-filter');
  const sortFilter = document.getElementById('sort-filter');
  const typeTabs = document.querySelectorAll('#type-filter-tabs .filter-tab');
  const timeframeBtns = document.querySelectorAll('.btn-timeframe');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value;
      if (btnClearSearch) {
        if (e.target.value) btnClearSearch.classList.remove('hidden');
        else btnClearSearch.classList.add('hidden');
      }
      UI.renderTransactions(currentFilters);
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentFilters.search = '';
      btnClearSearch.classList.add('hidden');
      UI.renderTransactions(currentFilters);
    });
  }

  typeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      typeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilters.type = tab.getAttribute('data-type');
      UI.renderTransactions(currentFilters);
    });
  });

  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      currentFilters.category = e.target.value;
      UI.renderTransactions(currentFilters);
    });
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      UI.renderTransactions(currentFilters);
    });
  }

  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeframeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilters.timeframe = btn.getAttribute('data-range');
      refreshDashboard();
    });
  });

  // --------------------------------------------------------------------------
  // Modal Utilities
  // --------------------------------------------------------------------------
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // Close modals on background backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add('hidden');
      }
    });
  });

  // --------------------------------------------------------------------------
  // Transaction Modal & Form
  // --------------------------------------------------------------------------
  const modalTx = 'modal-transaction';
  const btnOpenTxModal = document.getElementById('btn-open-modal');
  const btnCloseTxModal = document.getElementById('btn-close-tx-modal');
  const btnCancelTxModal = document.getElementById('btn-cancel-tx-modal');
  const formTx = document.getElementById('form-transaction');
  const txTypeRadios = document.querySelectorAll('input[name="tx-type"]');
  const txCategorySelect = document.getElementById('tx-category');

  if (btnOpenTxModal) {
    btnOpenTxModal.addEventListener('click', () => {
      resetTxForm();
      document.getElementById('modal-tx-title').innerHTML = '<i class="fa-solid fa-money-bill-transfer"></i> Add New Transaction';
      openModal(modalTx);
    });
  }

  if (btnCloseTxModal) btnCloseTxModal.addEventListener('click', () => closeModal(modalTx));
  if (btnCancelTxModal) btnCancelTxModal.addEventListener('click', () => closeModal(modalTx));

  // Dynamic Category Switch on Income / Expense Radio Change
  txTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateTxCategoryDropdown(e.target.value);
    });
  });

  function updateTxCategoryDropdown(type) {
    if (!txCategorySelect) return;
    const categories = Store.getCategories()[type] || [];
    txCategorySelect.innerHTML = '';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.id;
      txCategorySelect.appendChild(opt);
    });
  }

  function resetTxForm() {
    if (!formTx) return;
    formTx.reset();
    document.getElementById('tx-id').value = '';
    document.getElementById('type-expense').checked = true;
    updateTxCategoryDropdown('expense');
    document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
  }

  if (formTx) {
    formTx.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('tx-id').value;
      const type = document.querySelector('input[name="tx-type"]:checked').value;
      const title = document.getElementById('tx-title').value;
      const amount = parseFloat(document.getElementById('tx-amount').value);
      const category = document.getElementById('tx-category').value;
      const date = document.getElementById('tx-date').value;
      const paymentMethod = document.getElementById('tx-payment').value;
      const notes = document.getElementById('tx-notes').value;

      if (!title || isNaN(amount) || amount <= 0) {
        UI.showToast('Please enter a valid title and positive amount', 'danger');
        return;
      }

      if (id) {
        // Edit Mode
        Store.updateTransaction(id, { title, amount, type, category, date, paymentMethod, notes });
        UI.showToast('Transaction updated successfully', 'success');
      } else {
        // Add Mode
        Store.addTransaction({ title, amount, type, category, date, paymentMethod, notes });
        UI.showToast(`Added ${type} of $${amount.toFixed(2)}`, 'success');
      }

      closeModal(modalTx);
      refreshDashboard();
    });
  }

  // Edit / Delete Transaction Actions Delegate
  const txListContainer = document.getElementById('transaction-list');
  if (txListContainer) {
    txListContainer.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-tx');
      const deleteBtn = e.target.closest('.btn-delete-tx');

      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const transactions = Store.getTransactions();
        const tx = transactions.find(t => t.id === id);
        if (tx) {
          document.getElementById('tx-id').value = tx.id;
          document.getElementById('tx-title').value = tx.title;
          document.getElementById('tx-amount').value = tx.amount;
          document.getElementById('tx-date').value = tx.date;
          document.getElementById('tx-payment').value = tx.paymentMethod || 'Credit Card';
          document.getElementById('tx-notes').value = tx.notes || '';

          if (tx.type === 'income') {
            document.getElementById('type-income').checked = true;
            updateTxCategoryDropdown('income');
          } else {
            document.getElementById('type-expense').checked = true;
            updateTxCategoryDropdown('expense');
          }
          document.getElementById('tx-category').value = tx.category;

          document.getElementById('modal-tx-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Transaction';
          openModal(modalTx);
        }
      }

      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this transaction?')) {
          Store.deleteTransaction(id);
          UI.showToast('Transaction deleted', 'warning');
          refreshDashboard();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // Category Budget Modal & Form
  // --------------------------------------------------------------------------
  const modalBudget = 'modal-budget';
  const btnOpenBudgetModal = document.getElementById('btn-open-budget-modal');
  const btnCloseBudgetModal = document.getElementById('btn-close-budget-modal');
  const btnCancelBudgetModal = document.getElementById('btn-cancel-budget-modal');
  const formBudget = document.getElementById('form-budget');

  if (btnOpenBudgetModal) {
    btnOpenBudgetModal.addEventListener('click', () => {
      UI.populateBudgetModalInputs();
      openModal(modalBudget);
    });
  }

  if (btnCloseBudgetModal) btnCloseBudgetModal.addEventListener('click', () => closeModal(modalBudget));
  if (btnCancelBudgetModal) btnCancelBudgetModal.addEventListener('click', () => closeModal(modalBudget));

  if (formBudget) {
    formBudget.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(formBudget);
      const newBudgets = {};

      for (let [key, val] of formData.entries()) {
        if (key.startsWith('budget_')) {
          const catId = key.replace('budget_', '');
          newBudgets[catId] = parseFloat(val) || 0;
        }
      }

      Store.updateBudgets(newBudgets);
      UI.showToast('Category budgets updated', 'success');
      closeModal(modalBudget);
      refreshDashboard();
    });
  }

  // --------------------------------------------------------------------------
  // Savings Goals Modal & Form
  // --------------------------------------------------------------------------
  const modalGoal = 'modal-goal';
  const modalDeposit = 'modal-deposit';
  const btnOpenGoalModal = document.getElementById('btn-open-goal-modal');
  const btnCloseGoalModal = document.getElementById('btn-close-goal-modal');
  const btnCancelGoalModal = document.getElementById('btn-cancel-goal-modal');
  const formGoal = document.getElementById('form-goal');

  const btnCloseDepositModal = document.getElementById('btn-close-deposit-modal');
  const btnCancelDepositModal = document.getElementById('btn-cancel-deposit-modal');
  const formDeposit = document.getElementById('form-deposit');

  if (btnOpenGoalModal) {
    btnOpenGoalModal.addEventListener('click', () => {
      if (formGoal) formGoal.reset();
      openModal(modalGoal);
    });
  }

  if (btnCloseGoalModal) btnCloseGoalModal.addEventListener('click', () => closeModal(modalGoal));
  if (btnCancelGoalModal) btnCancelGoalModal.addEventListener('click', () => closeModal(modalGoal));
  if (btnCloseDepositModal) btnCloseDepositModal.addEventListener('click', () => closeModal(modalDeposit));
  if (btnCancelDepositModal) btnCancelDepositModal.addEventListener('click', () => closeModal(modalDeposit));

  if (formGoal) {
    formGoal.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('goal-title').value;
      const target = parseFloat(document.getElementById('goal-target').value);
      const current = parseFloat(document.getElementById('goal-current').value || 0);
      const icon = document.getElementById('goal-icon').value;

      if (!title || isNaN(target) || target <= 0) {
        UI.showToast('Please enter a valid goal name and target amount', 'danger');
        return;
      }

      Store.addGoal({ title, target, current, icon });
      UI.showToast(`Created savings goal: ${title}`, 'success');
      closeModal(modalGoal);
      UI.renderSavingsGoals();
    });
  }

  // Delegate Goal Deposits & Deletions
  const goalsContainer = document.getElementById('savings-goals-list');
  if (goalsContainer) {
    goalsContainer.addEventListener('click', (e) => {
      const depositBtn = e.target.closest('.btn-deposit-goal');
      const deleteBtn = e.target.closest('.btn-delete-goal');

      if (depositBtn) {
        const id = depositBtn.getAttribute('data-id');
        const goal = Store.getGoals().find(g => g.id === id);
        if (goal) {
          document.getElementById('deposit-goal-id').value = id;
          document.getElementById('deposit-goal-name').textContent = `Add funds towards "${goal.title}" (Target: $${goal.target})`;
          document.getElementById('deposit-amount').value = '';
          openModal(modalDeposit);
        }
      }

      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        if (confirm('Delete this savings goal?')) {
          Store.deleteGoal(id);
          UI.showToast('Goal removed', 'warning');
          UI.renderSavingsGoals();
        }
      }
    });
  }

  if (formDeposit) {
    formDeposit.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('deposit-goal-id').value;
      const amount = parseFloat(document.getElementById('deposit-amount').value);

      if (isNaN(amount) || amount <= 0) {
        UI.showToast('Please enter a valid deposit amount', 'danger');
        return;
      }

      Store.depositToGoal(id, amount);
      UI.showToast(`Deposited $${amount.toFixed(2)} to goal`, 'success');
      closeModal(modalDeposit);
      UI.renderSavingsGoals();
    });
  }

  // --------------------------------------------------------------------------
  // Data Tools: Export CSV, Import CSV, Seed Data, Clear All
  // --------------------------------------------------------------------------
  const btnExportCSV = document.getElementById('btn-export-csv');
  const btnSeedData = document.getElementById('btn-seed-data');
  const btnClearAll = document.getElementById('btn-clear-all');
  const btnEmptyAdd = document.getElementById('btn-empty-add');

  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', () => {
      Store.exportToCSV();
      UI.showToast('Exported transactions CSV', 'success');
    });
  }

  if (btnSeedData) {
    btnSeedData.addEventListener('click', () => {
      Store.seedDemoData();
      refreshDashboard();
      UI.showToast('Loaded sample demo financial data', 'success');
    });
  }

  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      if (confirm('Clear all stored transactions? This action cannot be undone.')) {
        Store.clearAllTransactions();
        refreshDashboard();
        UI.showToast('Cleared all transactions', 'warning');
      }
    });
  }

  if (btnEmptyAdd) {
    btnEmptyAdd.addEventListener('click', () => {
      resetTxForm();
      openModal(modalTx);
    });
  }

  // CSV Import Modal & File Handling
  const modalImport = 'modal-import';
  const btnOpenImportModal = document.getElementById('btn-open-import-modal');
  const btnCloseImportModal = document.getElementById('btn-close-import-modal');
  const btnCancelImportModal = document.getElementById('btn-cancel-import-modal');
  const csvDropZone = document.getElementById('csv-drop-zone');
  const csvFileInput = document.getElementById('csv-file-input');
  const importPreview = document.getElementById('import-preview');
  const btnConfirmImport = document.getElementById('btn-confirm-import');

  if (btnOpenImportModal) {
    btnOpenImportModal.addEventListener('click', () => {
      parsedImportTransactions = [];
      if (importPreview) importPreview.classList.add('hidden');
      if (btnConfirmImport) btnConfirmImport.disabled = true;
      openModal(modalImport);
    });
  }

  if (btnCloseImportModal) btnCloseImportModal.addEventListener('click', () => closeModal(modalImport));
  if (btnCancelImportModal) btnCancelImportModal.addEventListener('click', () => closeModal(modalImport));

  if (csvDropZone && csvFileInput) {
    csvDropZone.addEventListener('click', () => csvFileInput.click());

    csvDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      csvDropZone.classList.add('dragover');
    });

    csvDropZone.addEventListener('dragleave', () => {
      csvDropZone.classList.remove('dragover');
    });

    csvDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      csvDropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        handleCSVFile(e.dataTransfer.files[0]);
      }
    });

    csvFileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleCSVFile(e.target.files[0]);
      }
    });
  }

  function handleCSVFile(file) {
    if (!file.name.endsWith('.csv')) {
      UI.showToast('Please select a valid .csv file', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
      const text = evt.target.result;
      parsedImportTransactions = Store.parseCSVText(text);

      if (parsedImportTransactions.length > 0) {
        document.getElementById('import-file-name').textContent = file.name;
        document.getElementById('import-count').textContent = parsedImportTransactions.length;
        if (importPreview) importPreview.classList.remove('hidden');
        if (btnConfirmImport) btnConfirmImport.disabled = false;
      } else {
        UI.showToast('Could not parse any valid transaction rows from CSV', 'danger');
      }
    };
    reader.readAsText(file);
  }

  if (btnConfirmImport) {
    btnConfirmImport.addEventListener('click', () => {
      if (parsedImportTransactions.length === 0) return;

      parsedImportTransactions.forEach(tx => {
        Store.addTransaction(tx);
      });

      UI.showToast(`Successfully imported ${parsedImportTransactions.length} transactions`, 'success');
      closeModal(modalImport);
      refreshDashboard();
    });
  }
});
