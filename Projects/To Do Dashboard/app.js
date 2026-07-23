/* ==========================================================================
   TASKPULSE DASHBOARD - JAVASCRIPT APPLICATION CORE
   ========================================================================== */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. DEMO INITIAL DATA
    // --------------------------------------------------------------------------
    const INITIAL_TASKS = [
        {
            id: 'task-1',
            title: 'Design TaskPulse Glassmorphism Dashboard',
            description: 'Refine UI layout with responsive CSS grid, glassmorphism panels, and smooth micro-animations.',
            category: 'Work',
            priority: 'High',
            dueDate: getFormattedDate(0), // Today
            completed: true,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            subtasks: [
                { id: 'sub-1', title: 'Create color palette & typography CSS variables', completed: true },
                { id: 'sub-2', title: 'Build sidebar navigation & stats grid', completed: true },
                { id: 'sub-3', title: 'Add dark/light theme switch logic', completed: true }
            ]
        },
        {
            id: 'task-2',
            title: 'Prepare Q3 Product Roadmap & Milestones',
            description: 'Synthesize feature requests, prioritize user backlog, and present wireframes to stakeholders.',
            category: 'Work',
            priority: 'High',
            dueDate: getFormattedDate(1), // Tomorrow
            completed: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            subtasks: [
                { id: 'sub-4', title: 'Gather feedback from user testing sessions', completed: true },
                { id: 'sub-5', title: 'Draft technical specifications document', completed: false }
            ]
        },
        {
            id: 'task-3',
            title: 'Morning 5K Cardio & Core Workout',
            description: 'Maintain fitness routine with interval training at sunrise.',
            category: 'Health',
            priority: 'Medium',
            dueDate: getFormattedDate(0),
            completed: true,
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            subtasks: []
        },
        {
            id: 'task-4',
            title: 'Read 2 Chapters of "Atomic Habits"',
            description: 'Focus on identity-based habit formation and environment optimization.',
            category: 'Learning',
            priority: 'Low',
            dueDate: getFormattedDate(2),
            completed: false,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            subtasks: []
        },
        {
            id: 'task-5',
            title: 'Review Monthly Investment Portfolio & Expenses',
            description: 'Check index fund distributions, recurring subscriptions, and budget goals.',
            category: 'Finance',
            priority: 'Medium',
            dueDate: getFormattedDate(3),
            completed: false,
            createdAt: new Date().toISOString(),
            subtasks: [
                { id: 'sub-6', title: 'Export transaction CSVs', completed: false }
            ]
        }
    ];

    // Helper: format YYYY-MM-DD
    function getFormattedDate(offsetDays = 0) {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        return d.toISOString().split('T')[0];
    }

    // --------------------------------------------------------------------------
    // 2. STATE MANAGEMENT
    // --------------------------------------------------------------------------
    let state = {
        tasks: [],
        activeView: 'dashboard', // dashboard, all-tasks, today, upcoming, high-priority, pomodoro, analytics
        activeCategory: 'all',   // all, Work, Personal, Health, Learning, Finance
        activeStatus: 'all',     // all, active, completed
        activeSort: 'created-desc',
        searchQuery: '',
        layoutView: 'list',       // list, grid
        theme: 'dark',
        editingTaskId: null,
        subtaskDrafts: []         // array of string titles for modal
    };

    // Pomodoro Timer State
    let timerState = {
        mode: 'work',           // work (25m), shortBreak (5m), longBreak (15m)
        duration: 25 * 60,
        timeLeft: 25 * 60,
        isRunning: false,
        intervalId: null,
        sessionsCompleted: 2,
        totalFocusSeconds: 50 * 60,
        soundEnabled: true
    };

    // --------------------------------------------------------------------------
    // 3. STORAGE & INITIALIZATION
    // --------------------------------------------------------------------------
    function initApp() {
        loadLocalStorage();
        setupEventListeners();
        startClock();
        applyTheme(state.theme);
        renderAll();
    }

    function loadLocalStorage() {
        const savedTasks = localStorage.getItem('taskpulse_tasks');
        if (savedTasks) {
            try {
                state.tasks = JSON.parse(savedTasks);
            } catch (e) {
                state.tasks = INITIAL_TASKS;
            }
        } else {
            state.tasks = INITIAL_TASKS;
            saveLocalStorage();
        }

        const savedTheme = localStorage.getItem('taskpulse_theme');
        if (savedTheme) {
            state.theme = savedTheme;
        }

        const savedPomo = localStorage.getItem('taskpulse_pomo');
        if (savedPomo) {
            try {
                const parsed = JSON.parse(savedPomo);
                timerState.sessionsCompleted = parsed.sessionsCompleted || 0;
                timerState.totalFocusSeconds = parsed.totalFocusSeconds || 0;
            } catch (e) {}
        }
    }

    function saveLocalStorage() {
        localStorage.setItem('taskpulse_tasks', JSON.stringify(state.tasks));
    }

    function savePomoStorage() {
        localStorage.setItem('taskpulse_pomo', JSON.stringify({
            sessionsCompleted: timerState.sessionsCompleted,
            totalFocusSeconds: timerState.totalFocusSeconds
        }));
    }

    // --------------------------------------------------------------------------
    // 4. DOM ELEMENTS
    // --------------------------------------------------------------------------
    const elements = {
        // App Containers
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        toggleSidebarBtn: document.getElementById('toggle-sidebar-btn'),
        closeSidebarBtn: document.getElementById('close-sidebar-btn'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        themeIcon: document.getElementById('theme-icon'),

        // Search & Clock
        searchInput: document.getElementById('search-input'),
        liveClock: document.getElementById('live-clock'),
        liveDate: document.getElementById('live-date'),

        // Nav
        navItems: document.querySelectorAll('.nav-list .nav-item[data-view]'),
        categoryItems: document.querySelectorAll('#category-filter-list .category-item'),
        navCountAll: document.getElementById('nav-count-all'),
        navCountToday: document.getElementById('nav-count-today'),
        navCountPriority: document.getElementById('nav-count-priority'),

        // Dashboard Elements
        greetingTime: document.getElementById('greeting-time'),
        bannerSubtitle: document.getElementById('banner-subtitle'),
        bannerRingCircle: document.getElementById('banner-ring-circle'),
        bannerRingPercent: document.getElementById('banner-ring-percent'),
        statTotal: document.getElementById('stat-total'),
        statCompleted: document.getElementById('stat-completed'),
        statPending: document.getElementById('stat-pending'),
        statRate: document.getElementById('stat-rate'),

        // View Sections
        viewDashboard: document.getElementById('view-dashboard'),
        viewPomodoro: document.getElementById('view-pomodoro'),
        viewAnalytics: document.getElementById('view-analytics'),
        currentViewTitle: document.getElementById('current-view-title'),
        visibleTaskCount: document.getElementById('visible-task-count'),

        // Tasks List Controls
        tasksContainer: document.getElementById('tasks-container'),
        emptyState: document.getElementById('empty-state'),
        emptyStateMsg: document.getElementById('empty-state-msg'),
        emptyAddBtn: document.getElementById('empty-add-btn'),
        statusTabGroup: document.getElementById('status-tab-group'),
        sortSelect: document.getElementById('sort-select'),
        viewListBtn: document.getElementById('view-list-btn'),
        viewGridBtn: document.getElementById('view-grid-btn'),

        // Buttons
        headerAddTaskBtn: document.getElementById('header-add-task-btn'),
        sidebarAddTaskBtn: document.getElementById('sidebar-add-task-btn'),

        // Modal Elements
        taskModal: document.getElementById('task-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalCloseBtn: document.getElementById('modal-close-btn'),
        modalCancelBtn: document.getElementById('modal-cancel-btn'),
        taskForm: document.getElementById('task-form'),
        taskIdField: document.getElementById('task-id-field'),
        taskTitleInput: document.getElementById('task-title-input'),
        taskDescInput: document.getElementById('task-desc-input'),
        taskCategorySelect: document.getElementById('task-category-select'),
        taskPrioritySelect: document.getElementById('task-priority-select'),
        taskDueDate: document.getElementById('task-due-date'),
        newSubtaskInput: document.getElementById('new-subtask-input'),
        addSubtaskBtn: document.getElementById('add-subtask-btn'),
        subtasksBuilderList: document.getElementById('subtasks-builder-list'),

        // Pomodoro Elements
        pomoModeBtns: document.querySelectorAll('.pomo-mode-btn'),
        timerDisplay: document.getElementById('timer-display'),
        timerLabel: document.getElementById('timer-label'),
        timerProgressRing: document.getElementById('timer-progress-ring'),
        timerStartBtn: document.getElementById('timer-start-btn'),
        timerPlayIcon: document.getElementById('timer-play-icon'),
        timerResetBtn: document.getElementById('timer-reset-btn'),
        timerSoundBtn: document.getElementById('timer-sound-btn'),
        timerSoundIcon: document.getElementById('timer-sound-icon'),
        pomoSessionsCount: document.getElementById('pomo-sessions-count'),
        pomoTotalTime: document.getElementById('pomo-total-time'),

        // Analytics Elements
        barHighFill: document.getElementById('bar-high-fill'),
        barHighVal: document.getElementById('bar-high-val'),
        barMediumFill: document.getElementById('bar-medium-fill'),
        barMediumVal: document.getElementById('bar-medium-val'),
        barLowFill: document.getElementById('bar-low-fill'),
        barLowVal: document.getElementById('bar-low-val'),
        categoryBreakdownList: document.getElementById('category-breakdown-list'),

        // Toast
        toastContainer: document.getElementById('toast-container')
    };

    // --------------------------------------------------------------------------
    // 5. CLOCK & THEME UTILITIES
    // --------------------------------------------------------------------------
    function startClock() {
        updateClockDisplay();
        setInterval(updateClockDisplay, 1000);
    }

    function updateClockDisplay() {
        const now = new Date();
        if (elements.liveClock) {
            elements.liveClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (elements.liveDate) {
            elements.liveDate.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }

        // Greeting update based on hour
        const hour = now.getHours();
        if (elements.greetingTime) {
            if (hour < 12) elements.greetingTime.textContent = 'Good Morning ☀️';
            else if (hour < 18) elements.greetingTime.textContent = 'Good Afternoon 🌤️';
            else elements.greetingTime.textContent = 'Good Evening 🌙';
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        state.theme = theme;
        localStorage.setItem('taskpulse_theme', theme);

        if (elements.themeIcon) {
            if (theme === 'light') {
                elements.themeIcon.className = 'fa-solid fa-sun';
            } else {
                elements.themeIcon.className = 'fa-solid fa-moon';
            }
        }
    }

    // --------------------------------------------------------------------------
    // 6. FILTERING & SORTING LOGIC
    // --------------------------------------------------------------------------
    function getFilteredTasks() {
        const todayStr = getFormattedDate(0);

        return state.tasks.filter(task => {
            // View Filter
            if (state.activeView === 'today') {
                if (task.dueDate !== todayStr) return false;
            } else if (state.activeView === 'upcoming') {
                if (!task.dueDate || task.dueDate <= todayStr) return false;
            } else if (state.activeView === 'high-priority') {
                if (task.priority !== 'High') return false;
            }

            // Category Filter
            if (state.activeCategory !== 'all') {
                if (task.category !== state.activeCategory) return false;
            }

            // Status Filter (Tab)
            if (state.activeStatus === 'active') {
                if (task.completed) return false;
            } else if (state.activeStatus === 'completed') {
                if (!task.completed) return false;
            }

            // Search Query Filter
            if (state.searchQuery.trim() !== '') {
                const q = state.searchQuery.toLowerCase();
                const matchTitle = task.title.toLowerCase().includes(q);
                const matchDesc = task.description.toLowerCase().includes(q);
                const matchCat = task.category.toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchCat) return false;
            }

            return true;
        }).sort(sortComparator);
    }

    function sortComparator(a, b) {
        const sortMode = state.activeSort;
        if (sortMode === 'created-desc') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortMode === 'created-asc') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortMode === 'due-asc') {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
        } else if (sortMode === 'priority-desc') {
            const prioWeight = { High: 3, Medium: 2, Low: 1 };
            return prioWeight[b.priority] - prioWeight[a.priority];
        } else if (sortMode === 'title-asc') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    }

    // --------------------------------------------------------------------------
    // 7. RENDER FUNCTIONS
    // --------------------------------------------------------------------------
    function renderAll() {
        renderNavBadges();
        renderStats();
        renderTasks();
        renderAnalytics();
        renderPomodoro();
    }

    function renderNavBadges() {
        const todayStr = getFormattedDate(0);
        const totalCount = state.tasks.length;
        const todayCount = state.tasks.filter(t => t.dueDate === todayStr && !t.completed).length;
        const priorityCount = state.tasks.filter(t => t.priority === 'High' && !t.completed).length;

        if (elements.navCountAll) elements.navCountAll.textContent = totalCount;
        if (elements.navCountToday) elements.navCountToday.textContent = todayCount;
        if (elements.navCountPriority) elements.navCountPriority.textContent = priorityCount;
    }

    function renderStats() {
        const total = state.tasks.length;
        const completed = state.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        if (elements.statTotal) elements.statTotal.textContent = total;
        if (elements.statCompleted) elements.statCompleted.textContent = completed;
        if (elements.statPending) elements.statPending.textContent = pending;
        if (elements.statRate) elements.statRate.textContent = `${rate}%`;

        // Progress ring in banner
        if (elements.bannerRingPercent) elements.bannerRingPercent.textContent = `${rate}%`;
        if (elements.bannerRingCircle) {
            const radius = 36;
            const circumference = 2 * Math.PI * radius; // ~226.19
            elements.bannerRingCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            const offset = circumference - (rate / 100) * circumference;
            elements.bannerRingCircle.style.strokeDashoffset = offset;
        }

        // Subtitle message update
        const todayCount = state.tasks.filter(t => t.dueDate === getFormattedDate(0) && !t.completed).length;
        if (elements.bannerSubtitle) {
            if (todayCount === 0) {
                elements.bannerSubtitle.textContent = 'All clear for today! Take time to focus on your long term goals.';
            } else {
                elements.bannerSubtitle.textContent = `You have ${todayCount} active task${todayCount > 1 ? 's' : ''} scheduled for today. Keep up the momentum!`;
            }
        }
    }

    function renderTasks() {
        const filtered = getFilteredTasks();
        if (elements.visibleTaskCount) {
            elements.visibleTaskCount.textContent = `${filtered.length} task${filtered.length !== 1 ? 's' : ''}`;
        }

        if (filtered.length === 0) {
            elements.tasksContainer.innerHTML = '';
            elements.emptyState.classList.remove('hidden');
            if (state.searchQuery) {
                elements.emptyStateMsg.textContent = `No tasks matching "${state.searchQuery}". Try a different keyword.`;
            } else {
                elements.emptyStateMsg.textContent = "You don't have any tasks in this view yet.";
            }
            return;
        }

        elements.emptyState.classList.add('hidden');
        elements.tasksContainer.className = `tasks-container ${state.layoutView}-view`;

        const todayStr = getFormattedDate(0);

        elements.tasksContainer.innerHTML = filtered.map(task => {
            const isCompleted = task.completed;
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubtasksCount = hasSubtasks ? task.subtasks.filter(s => s.completed).length : 0;
            const subtaskPercent = hasSubtasks ? Math.round((completedSubtasksCount / task.subtasks.length) * 100) : 0;

            const isOverdue = task.dueDate && task.dueDate < todayStr && !isCompleted;
            const dueDisplay = task.dueDate ? (task.dueDate === todayStr ? 'Today' : task.dueDate) : null;

            return `
                <div class="task-card ${isCompleted ? 'completed' : ''}" data-id="${task.id}">
                    <button class="task-checkbox-btn" aria-label="Toggle task status" onclick="TaskPulse.toggleTaskComplete('${task.id}')">
                        <i class="fa-solid fa-check"></i>
                    </button>

                    <div class="task-main">
                        <div class="task-header-row">
                            <h3 class="task-title">${escapeHTML(task.title)}</h3>
                            <div class="task-actions">
                                <button class="action-btn" title="Edit Task" onclick="TaskPulse.openEditTaskModal('${task.id}')">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="action-btn delete-btn" title="Delete Task" onclick="TaskPulse.deleteTask('${task.id}')">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>

                        ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ''}

                        <div class="task-meta">
                            <span class="cat-badge ${task.category}">
                                <span class="cat-dot cat-${task.category.toLowerCase()}"></span> ${task.category}
                            </span>
                            <span class="priority-badge ${task.priority}">${task.priority}</span>
                            ${dueDisplay ? `
                                <span class="due-badge ${isOverdue ? 'overdue' : ''}">
                                    <i class="fa-regular fa-calendar"></i> ${dueDisplay} ${isOverdue ? '(Overdue)' : ''}
                                </span>
                            ` : ''}
                        </div>

                        ${hasSubtasks ? `
                            <div class="subtasks-progress-wrap">
                                <div class="subtasks-progress-info">
                                    <span>Subtasks (${completedSubtasksCount}/${task.subtasks.length})</span>
                                    <span>${subtaskPercent}%</span>
                                </div>
                                <div class="progress-bar-track">
                                    <div class="progress-bar-fill" style="width: ${subtaskPercent}%;"></div>
                                </div>
                                <ul class="task-subtasks-list">
                                    ${task.subtasks.map(sub => `
                                        <li class="subtask-item ${sub.completed ? 'completed' : ''}">
                                            <input type="checkbox" class="subtask-checkbox" 
                                                ${sub.completed ? 'checked' : ''} 
                                                onchange="TaskPulse.toggleSubtask('${task.id}', '${sub.id}')">
                                            <span>${escapeHTML(sub.title)}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderAnalytics() {
        const total = state.tasks.length || 1;
        const highCount = state.tasks.filter(t => t.priority === 'High').length;
        const medCount = state.tasks.filter(t => t.priority === 'Medium').length;
        const lowCount = state.tasks.filter(t => t.priority === 'Low').length;

        if (elements.barHighVal) elements.barHighVal.textContent = highCount;
        if (elements.barMediumVal) elements.barMediumVal.textContent = medCount;
        if (elements.barLowVal) elements.barLowVal.textContent = lowCount;

        if (elements.barHighFill) elements.barHighFill.style.width = `${Math.round((highCount / total) * 100)}%`;
        if (elements.barMediumFill) elements.barMediumFill.style.width = `${Math.round((medCount / total) * 100)}%`;
        if (elements.barLowFill) elements.barLowFill.style.width = `${Math.round((lowCount / total) * 100)}%`;

        // Category distribution breakdown list
        const categories = ['Work', 'Personal', 'Health', 'Learning', 'Finance'];
        if (elements.categoryBreakdownList) {
            elements.categoryBreakdownList.innerHTML = categories.map(cat => {
                const catTasks = state.tasks.filter(t => t.category === cat);
                const count = catTasks.length;
                const doneCount = catTasks.filter(t => t.completed).length;
                const percent = count > 0 ? Math.round((doneCount / count) * 100) : 0;

                return `
                    <div class="cat-breakdown-item">
                        <div class="cat-info">
                            <span class="cat-dot cat-${cat.toLowerCase()}"></span>
                            <span>${cat}</span>
                        </div>
                        <div class="cat-count">
                            ${doneCount}/${count} completed (${percent}%)
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    function renderPomodoro() {
        const minutes = Math.floor(timerState.timeLeft / 60);
        const seconds = timerState.timeLeft % 60;
        const displayStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (elements.timerDisplay) elements.timerDisplay.textContent = displayStr;

        // Circular countdown progress
        if (elements.timerProgressRing) {
            const radius = 110;
            const circumference = 2 * Math.PI * radius; // ~691.15
            elements.timerProgressRing.style.strokeDasharray = `${circumference} ${circumference}`;
            const progress = timerState.timeLeft / timerState.duration;
            const offset = circumference - (progress * circumference);
            elements.timerProgressRing.style.strokeDashoffset = offset;
        }

        if (elements.pomoSessionsCount) elements.pomoSessionsCount.textContent = timerState.sessionsCompleted;
        if (elements.pomoTotalTime) {
            const totalMins = Math.floor(timerState.totalFocusSeconds / 60);
            const hrs = Math.floor(totalMins / 60);
            const mins = totalMins % 60;
            elements.pomoTotalTime.textContent = `${hrs}h ${mins}m`;
        }
    }

    // --------------------------------------------------------------------------
    // 8. TASK CRUD OPERATIONS
    // --------------------------------------------------------------------------
    function saveTaskFromModal(e) {
        e.preventDefault();
        const title = elements.taskTitleInput.value.trim();
        if (!title) return;

        const id = elements.taskIdField.value;
        const category = elements.taskCategorySelect.value;
        const priority = elements.taskPrioritySelect.value;
        const dueDate = elements.taskDueDate.value;
        const description = elements.taskDescInput.value.trim();

        const subtasks = state.subtaskDrafts.map((subTitle, idx) => ({
            id: `sub-${Date.now()}-${idx}`,
            title: subTitle,
            completed: false
        }));

        if (id) {
            // Edit existing
            const index = state.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                state.tasks[index] = {
                    ...state.tasks[index],
                    title,
                    description,
                    category,
                    priority,
                    dueDate,
                    subtasks: subtasks.length > 0 ? subtasks : state.tasks[index].subtasks
                };
                showToast('Task updated successfully! ✨', 'success');
            }
        } else {
            // Create new
            const newTask = {
                id: `task-${Date.now()}`,
                title,
                description,
                category,
                priority,
                dueDate,
                completed: false,
                createdAt: new Date().toISOString(),
                subtasks
            };
            state.tasks.unshift(newTask);
            showToast('New task added! 🎯', 'success');
        }

        saveLocalStorage();
        closeModal();
        renderAll();
    }

    function toggleTaskComplete(taskId) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed && task.subtasks) {
                // Auto check subtasks when main task is completed
                task.subtasks.forEach(s => s.completed = true);
            }
            saveLocalStorage();
            renderAll();
            showToast(task.completed ? 'Task completed! 🎉' : 'Task marked active', 'info');
        }
    }

    function toggleSubtask(taskId, subtaskId) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task && task.subtasks) {
            const sub = task.subtasks.find(s => s.id === subtaskId);
            if (sub) {
                sub.completed = !sub.completed;
                // Check if all subtasks completed
                const allDone = task.subtasks.every(s => s.completed);
                if (allDone) task.completed = true;
                saveLocalStorage();
                renderAll();
            }
        }
    }

    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            state.tasks = state.tasks.filter(t => t.id !== taskId);
            saveLocalStorage();
            renderAll();
            showToast('Task deleted', 'info');
        }
    }

    // Modal Helpers
    function openAddTaskModal() {
        state.editingTaskId = null;
        state.subtaskDrafts = [];
        elements.modalTitle.textContent = 'Create New Task';
        elements.taskIdField.value = '';
        elements.taskTitleInput.value = '';
        elements.taskDescInput.value = '';
        elements.taskCategorySelect.value = 'Work';
        elements.taskPrioritySelect.value = 'Medium';
        elements.taskDueDate.value = getFormattedDate(0);
        renderSubtasksBuilder();
        elements.taskModal.classList.remove('hidden');
        elements.taskTitleInput.focus();
    }

    function openEditTaskModal(taskId) {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;

        state.editingTaskId = taskId;
        state.subtaskDrafts = task.subtasks ? task.subtasks.map(s => s.title) : [];
        elements.modalTitle.textContent = 'Edit Task';
        elements.taskIdField.value = task.id;
        elements.taskTitleInput.value = task.title;
        elements.taskDescInput.value = task.description || '';
        elements.taskCategorySelect.value = task.category;
        elements.taskPrioritySelect.value = task.priority;
        elements.taskDueDate.value = task.dueDate || '';
        renderSubtasksBuilder();
        elements.taskModal.classList.remove('hidden');
    }

    function closeModal() {
        elements.taskModal.classList.add('hidden');
    }

    function addSubtaskDraft() {
        const val = elements.newSubtaskInput.value.trim();
        if (val) {
            state.subtaskDrafts.push(val);
            elements.newSubtaskInput.value = '';
            renderSubtasksBuilder();
        }
    }

    function removeSubtaskDraft(index) {
        state.subtaskDrafts.splice(index, 1);
        renderSubtasksBuilder();
    }

    function renderSubtasksBuilder() {
        if (elements.subtasksBuilderList) {
            elements.subtasksBuilderList.innerHTML = state.subtaskDrafts.map((sub, idx) => `
                <li class="subtask-builder-item">
                    <span>${escapeHTML(sub)}</span>
                    <button type="button" class="subtask-builder-remove" onclick="TaskPulse.removeSubtaskDraft(${idx})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </li>
            `).join('');
        }
    }

    // --------------------------------------------------------------------------
    // 9. POMODORO TIMER CONTROLS
    // --------------------------------------------------------------------------
    function switchPomoMode(mode) {
        timerState.mode = mode;
        timerState.isRunning = false;
        clearInterval(timerState.intervalId);

        if (mode === 'work') {
            timerState.duration = 25 * 60;
            elements.timerLabel.textContent = 'Time to Focus!';
        } else if (mode === 'shortBreak') {
            timerState.duration = 5 * 60;
            elements.timerLabel.textContent = 'Short Refresh Break ☕';
        } else if (mode === 'longBreak') {
            timerState.duration = 15 * 60;
            elements.timerLabel.textContent = 'Rest & Recharge 🌿';
        }

        timerState.timeLeft = timerState.duration;
        elements.timerPlayIcon.className = 'fa-solid fa-play';
        elements.pomoModeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        renderPomodoro();
    }

    function toggleTimer() {
        if (timerState.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function startTimer() {
        timerState.isRunning = true;
        elements.timerPlayIcon.className = 'fa-solid fa-pause';
        timerState.intervalId = setInterval(() => {
            if (timerState.timeLeft > 0) {
                timerState.timeLeft--;
                if (timerState.mode === 'work') {
                    timerState.totalFocusSeconds++;
                }
                renderPomodoro();
            } else {
                handleTimerCompletion();
            }
        }, 1000);
    }

    function pauseTimer() {
        timerState.isRunning = false;
        elements.timerPlayIcon.className = 'fa-solid fa-play';
        clearInterval(timerState.intervalId);
    }

    function resetTimer() {
        pauseTimer();
        timerState.timeLeft = timerState.duration;
        renderPomodoro();
    }

    function handleTimerCompletion() {
        pauseTimer();
        if (timerState.mode === 'work') {
            timerState.sessionsCompleted++;
            savePomoStorage();
            showToast('Focus session complete! Take a break! 🔔', 'success');
            switchPomoMode('shortBreak');
        } else {
            showToast('Break over! Ready to focus again?', 'info');
            switchPomoMode('work');
        }
        renderPomodoro();
    }

    // --------------------------------------------------------------------------
    // 10. TOAST NOTIFICATION UTILITY
    // --------------------------------------------------------------------------
    function showToast(message, type = 'info') {
        if (!elements.toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'} toast-icon"></i>
            <span>${escapeHTML(message)}</span>
        `;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

    // --------------------------------------------------------------------------
    // 11. EVENT LISTENERS SETUP
    // --------------------------------------------------------------------------
    function setupEventListeners() {
        // Navigation View switching
        elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                elements.navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');

                const view = item.dataset.view;
                state.activeView = view;

                // Toggle main views
                document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
                if (view === 'pomodoro') {
                    elements.viewPomodoro.classList.add('active');
                } else if (view === 'analytics') {
                    elements.viewAnalytics.classList.add('active');
                } else {
                    elements.viewDashboard.classList.add('active');
                    if (elements.currentViewTitle) {
                        const titleMap = {
                            'dashboard': 'Dashboard Tasks',
                            'all-tasks': 'All Tasks',
                            'today': "Today's Focus",
                            'upcoming': 'Upcoming Tasks',
                            'high-priority': 'High Priority Tasks'
                        };
                        elements.currentViewTitle.textContent = titleMap[view] || 'Tasks';
                    }
                }

                renderAll();
                // Mobile sidebar close on nav item click
                if (window.innerWidth <= 992) {
                    elements.sidebar.classList.remove('active');
                    elements.sidebarOverlay.classList.remove('active');
                }
            });
        });

        // Category Filter Selection
        elements.categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                elements.categoryItems.forEach(c => c.classList.remove('active'));
                item.classList.add('active');
                state.activeCategory = item.dataset.category;
                renderTasks();
            });
        });

        // Search Input & Keyboard Shortcut '/'
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                renderTasks();
            });
        }
        window.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== elements.searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (elements.searchInput) elements.searchInput.focus();
            }
        });

        // Status Tabs (All, Active, Completed)
        if (elements.statusTabGroup) {
            elements.statusTabGroup.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.statusTabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    state.activeStatus = btn.dataset.status;
                    renderTasks();
                });
            });
        }

        // Sort Select
        if (elements.sortSelect) {
            elements.sortSelect.addEventListener('change', (e) => {
                state.activeSort = e.target.value;
                renderTasks();
            });
        }

        // View Layout Toggle (List vs Grid)
        if (elements.viewListBtn && elements.viewGridBtn) {
            elements.viewListBtn.addEventListener('click', () => {
                state.layoutView = 'list';
                elements.viewListBtn.classList.add('active');
                elements.viewGridBtn.classList.remove('active');
                renderTasks();
            });
            elements.viewGridBtn.addEventListener('click', () => {
                state.layoutView = 'grid';
                elements.viewGridBtn.classList.add('active');
                elements.viewListBtn.classList.remove('active');
                renderTasks();
            });
        }

        // Theme Toggle
        if (elements.themeToggleBtn) {
            elements.themeToggleBtn.addEventListener('click', () => {
                const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
                applyTheme(nextTheme);
            });
        }

        // Mobile Sidebar Controls
        if (elements.toggleSidebarBtn) {
            elements.toggleSidebarBtn.addEventListener('click', () => {
                elements.sidebar.classList.add('active');
                elements.sidebarOverlay.classList.add('active');
            });
        }
        if (elements.closeSidebarBtn) {
            elements.closeSidebarBtn.addEventListener('click', () => {
                elements.sidebar.classList.remove('active');
                elements.sidebarOverlay.classList.remove('active');
            });
        }
        if (elements.sidebarOverlay) {
            elements.sidebarOverlay.addEventListener('click', () => {
                elements.sidebar.classList.remove('active');
                elements.sidebarOverlay.classList.remove('active');
            });
        }

        // Modal Triggers
        if (elements.headerAddTaskBtn) elements.headerAddTaskBtn.addEventListener('click', openAddTaskModal);
        if (elements.sidebarAddTaskBtn) elements.sidebarAddTaskBtn.addEventListener('click', openAddTaskModal);
        if (elements.emptyAddBtn) elements.emptyAddBtn.addEventListener('click', openAddTaskModal);

        if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeModal);
        if (elements.modalCancelBtn) elements.modalCancelBtn.addEventListener('click', closeModal);
        if (elements.taskForm) elements.taskForm.addEventListener('submit', saveTaskFromModal);

        // Subtasks Builder inside Modal
        if (elements.addSubtaskBtn) elements.addSubtaskBtn.addEventListener('click', addSubtaskDraft);
        if (elements.newSubtaskInput) {
            elements.newSubtaskInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubtaskDraft();
                }
            });
        }

        // Pomodoro Timer Controls
        elements.pomoModeBtns.forEach(btn => {
            btn.addEventListener('click', () => switchPomoMode(btn.dataset.mode));
        });
        if (elements.timerStartBtn) elements.timerStartBtn.addEventListener('click', toggleTimer);
        if (elements.timerResetBtn) elements.timerResetBtn.addEventListener('click', resetTimer);
        if (elements.timerSoundBtn) {
            elements.timerSoundBtn.addEventListener('click', () => {
                timerState.soundEnabled = !timerState.soundEnabled;
                elements.timerSoundIcon.className = timerState.soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
                showToast(timerState.soundEnabled ? 'Sound alerts enabled' : 'Sound alerts muted', 'info');
            });
        }
    }

    // Expose Global Public API for Inline HTML Handlers
    window.TaskPulse = {
        toggleTaskComplete,
        toggleSubtask,
        deleteTask,
        openEditTaskModal,
        removeSubtaskDraft
    };

    // Initialize on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
