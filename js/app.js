/**
 * 主应用程序逻辑
 */

class TodoApp {
    constructor() {
        this.todos = [];
        this.filteredTodos = [];
        this.currentFilter = 'all';
        this.currentSortBy = 'priority'; // priority, date, title
        this.editingTodoId = null;

        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        // 初始化存储和主题
        StorageManager.init();
        ThemeManager.init();

        // 加载任务
        this.todos = StorageManager.load();
        this.applyFilter();

        // 绑定事件
        this.bindEvents();

        // 更新UI
        this.render();
    }

    /**
     * 绑定所有事件
     */
    bindEvents() {
        // 添加任务
        document.getElementById('addBtn').addEventListener('click', () => this.handleAddTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddTodo();
        });

        // 筛选
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.closest('.filter-btn').dataset.filter));
        });

        // 搜索
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));

        // 主题切换
        document.getElementById('themeToggle').addEventListener('click', () => {
            ThemeManager.toggleTheme();
        });

        // 设置
        document.getElementById('settingsBtn').addEventListener('click', () => UI.showModal('settingsModal'));
        document.getElementById('closeSettingsModal').addEventListener('click', () => UI.hideModal('settingsModal'));

        // 编辑模态框
        document.getElementById('closeEditModal').addEventListener('click', () => UI.hideModal('editModal'));
        document.getElementById('cancelEditBtn').addEventListener('click', () => UI.hideModal('editModal'));
        document.getElementById('saveEditBtn').addEventListener('click', () => this.handleSaveEdit());

        // 清空已完成任务
        document.getElementById('clearCompletedBtn').addEventListener('click', () => this.handleClearCompleted());

        // 导出/导入
        document.getElementById('exportBtn').addEventListener('click', () => this.handleExport());
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => this.handleImport(e));

        // 排序
        document.getElementById('sortBtn').addEventListener('click', () => this.handleSort());

        // 设置中的按钮
        document.getElementById('backupBtn').addEventListener('click', () => this.handleBackup());
        document.getElementById('resetBtn').addEventListener('click', () => this.handleReset());

        // 任务列表事件委托
        document.getElementById('todosContainer').addEventListener('click', (e) => this.handleTodoClick(e));
        document.getElementById('todosContainer').addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // 关闭模态框
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // 隐藏上下文菜单
        document.addEventListener('click', () => UI.hideContextMenu());
    }

    /**
     * 处理添加任务
     */
    handleAddTodo() {
        const input = document.getElementById('todoInput');
        const title = input.value.trim();

        if (!title) {
            UI.showToast('请输入任务内容', 'warning');
            return;
        }

        const priority = document.getElementById('prioritySelect').value;
        const category = document.getElementById('categorySelect').value;
        const dueDate = document.getElementById('dueDateInput').value;

        const todo = {
            id: Utils.generateId(),
            title,
            description: '',
            priority,
            category,
            dueDate,
            completed: false,
            tags: []
        };

        this.todos.push(todo);
        StorageManager.save(this.todos);
        this.applyFilter();
        this.render();

        // 清空输入
        input.value = '';
        document.getElementById('expandOptions').style.display = 'none';
        document.getElementById('prioritySelect').value = 'medium';
        document.getElementById('dueDateInput').value = '';

        UI.showToast('任务已添加', 'success');
    }

    /**
     * 处理筛选
     */
    handleFilter(filter) {
        this.currentFilter = filter;
        this.applyFilter();
        this.render();

        // 更新筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }

    /**
     * 应用筛选
     */
    applyFilter() {
        switch (this.currentFilter) {
            case 'active':
                this.filteredTodos = this.todos.filter(t => !t.completed);
                break;
            case 'completed':
                this.filteredTodos = this.todos.filter(t => t.completed);
                break;
            default:
                this.filteredTodos = [...this.todos];
        }
        this.applySorting();
    }

    /**
     * 应用排序
     */
    applySorting() {
        this.filteredTodos.sort((a, b) => {
            switch (this.currentSortBy) {
                case 'priority':
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'date':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    }

    /**
     * 处理搜索
     */
    handleSearch(query) {
        if (!query.trim()) {
            this.applyFilter();
        } else {
            this.filteredTodos = this.todos.filter(t => {
                const matchFilter = this.currentFilter === 'all' ||
                    (this.currentFilter === 'active' && !t.completed) ||
                    (this.currentFilter === 'completed' && t.completed);
                return matchFilter && Utils.includesIgnoreCase(t.title, query);
            });
            this.applySorting();
        }
        this.render();
    }

    /**
     * 处理任务点击
     */
    handleTodoClick(e) {
        const checkbox = e.target.closest('.todo-checkbox');
        const editBtn = e.target.closest('.btn-edit');
        const deleteBtn = e.target.closest('.btn-delete');

        if (checkbox) {
            const todoItem = checkbox.closest('.todo-item');
            const id = todoItem.dataset.id;
            this.toggleComplete(id);
        } else if (editBtn) {
            const todoItem = editBtn.closest('.todo-item');
            const id = todoItem.dataset.id;
            this.openEditModal(id);
        } else if (deleteBtn) {
            const todoItem = deleteBtn.closest('.todo-item');
            const id = todoItem.dataset.id;
            this.deleteTodo(id);
        }
    }

    /**
     * 切换完成状态
     */
    toggleComplete(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            StorageManager.save(this.todos);
            this.applyFilter();
            this.render();
        }
    }

    /**
     * 打开编辑模态框
     */
    openEditModal(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        this.editingTodoId = id;
        document.getElementById('editTitle').value = todo.title;
        document.getElementById('editDescription').value = todo.description || '';
        document.getElementById('editPriority').value = todo.priority;
        document.getElementById('editCategory').value = todo.category || 'personal';
        document.getElementById('editDueDate').value = todo.dueDate || '';

        UI.showModal('editModal');
    }

    /**
     * 处理保存编辑
     */
    handleSaveEdit() {
        if (!this.editingTodoId) return;

        const todo = this.todos.find(t => t.id === this.editingTodoId);
        if (!todo) return;

        todo.title = document.getElementById('editTitle').value.trim();
        if (!todo.title) {
            UI.showToast('任务标题不能为空', 'warning');
            return;
        }

        todo.description = document.getElementById('editDescription').value.trim();
        todo.priority = document.getElementById('editPriority').value;
        todo.category = document.getElementById('editCategory').value;
        todo.dueDate = document.getElementById('editDueDate').value;

        StorageManager.save(this.todos);
        this.applyFilter();
        this.render();
        UI.hideModal('editModal');
        UI.showToast('任务已更新', 'success');
    }

    /**
     * 删除任务
     */
    deleteTodo(id) {
        if (confirm('确定要删除这个任务吗？')) {
            this.todos = this.todos.filter(t => t.id !== id);
            StorageManager.save(this.todos);
            this.applyFilter();
            this.render();
            UI.showToast('任务已删除', 'success');
        }
    }

    /**
     * 处理清空已完成
     */
    handleClearCompleted() {
        if (confirm('确定要清空所有已完成的任务吗？')) {
            this.todos = this.todos.filter(t => !t.completed);
            StorageManager.save(this.todos);
            this.applyFilter();
            this.render();
            UI.showToast('已完成任务已清空', 'success');
        }
    }

    /**
     * 处理排序
     */
    handleSort() {
        const options = ['priority', 'date', 'title'];
        const currentIndex = options.indexOf(this.currentSortBy);
        this.currentSortBy = options[(currentIndex + 1) % options.length];
        
        const labels = {
            'priority': '按优先级排序',
            'date': '按截止日期排序',
            'title': '按标题排序'
        };
        
        this.applyFilter();
        this.render();
        UI.showToast(labels[this.currentSortBy], 'info');
    }

    /**
     * 处理导出
     */
    handleExport() {
        const json = StorageManager.exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos_${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        UI.showToast('数据已导出', 'success');
    }

    /**
     * 处理导入
     */
    handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonString = event.target.result;
                if (StorageManager.importJSON(jsonString)) {
                    this.todos = StorageManager.load();
                    this.applyFilter();
                    this.render();
                    UI.showToast('数据已导入', 'success');
                } else {
                    UI.showToast('导入失败：无效的JSON格式', 'error');
                }
            } catch (error) {
                UI.showToast('导入失败：' + error.message, 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // 重置文件输入
    }

    /**
     * 处理备份
     */
    handleBackup() {
        const backup = StorageManager.backup();
        if (backup) {
            UI.showToast('数据已备份', 'success');
        } else {
            UI.showToast('备份失败', 'error');
        }
    }

    /**
     * 处理重置
     */
    handleReset() {
        if (confirm('确定要清空所有数据吗？此操作无法撤销！')) {
            StorageManager.clear();
            this.todos = [];
            this.applyFilter();
            this.render();
            UI.showToast('所有数据已清空', 'success');
        }
    }

    /**
     * 处理上下文菜单
     */
    handleContextMenu(e) {
        e.preventDefault();
        const todoItem = e.target.closest('.todo-item');
        if (todoItem) {
            UI.showContextMenu(e, todoItem.dataset.id);
        }
    }

    /**
     * 渲染UI
     */
    render() {
        UI.renderTodos(this.filteredTodos);
        UI.updateStats(this.todos);
    }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
