/**
 * UI 控制模块
 */

const UI = {
    /**
     * 显示提示消息
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    },

    /**
     * 显示模态框
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    },

    /**
     * 隐藏模态框
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },

    /**
     * 创建任务元素
     */
    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        div.dataset.id = todo.id;

        // 检查是否过期
        const isOverdue = todo.dueDate && Utils.isOverdue(todo.dueDate) && !todo.completed;
        const isDueToday = todo.dueDate && Utils.isDueToday(todo.dueDate);
        const isDueSoon = todo.dueDate && Utils.isDueSoon(todo.dueDate);

        let html = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-header">
                    <span class="todo-text">${Utils.sanitizeString(todo.title)}</span>
                </div>
                <div class="todo-badges">
                    <span class="badge badge-priority ${todo.priority}" title="优先级">${this.getPriorityLabel(todo.priority)}</span>
                    ${todo.category ? `<span class="badge badge-category" title="分类">${Utils.sanitizeString(todo.category)}</span>` : ''}
                    ${todo.dueDate ? `
                        <span class="badge badge-due-date ${isOverdue ? 'overdue' : ''}" title="截止日期">
                            ${isOverdue ? '已过期' : isDueToday ? '今天' : isDueSoon ? '即将到期' : Utils.formatDate(todo.dueDate)}
                        </span>
                    ` : ''}
                </div>
                ${todo.description ? `<div class="todo-meta">${Utils.sanitizeString(todo.description)}</div>` : ''}
            </div>
            <div class="todo-actions">
                <button class="btn btn-edit" title="编辑">✏️</button>
                <button class="btn btn-delete" title="删除">🗑️</button>
            </div>
        `;

        div.innerHTML = html;
        return div;
    },

    /**
     * 获取优先级标签
     */
    getPriorityLabel(priority) {
        const labels = {
            'high': '高',
            'medium': '中',
            'low': '低'
        };
        return labels[priority] || priority;
    },

    /**
     * 更新统计信息
     */
    updateStats(todos) {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const active = total - completed;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('activeTasks').textContent = active;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('completionRate').textContent = completionRate + '%';

        // 更新筛选按钮计数
        document.getElementById('countAll').textContent = total;
        document.getElementById('countActive').textContent = active;
        document.getElementById('countCompleted').textContent = completed;

        // 显示/隐藏清空按钮
        const clearBtn = document.getElementById('clearCompletedBtn');
        clearBtn.style.display = completed > 0 ? 'block' : 'none';
    },

    /**
     * 渲染任务列表
     */
    renderTodos(todos) {
        const container = document.getElementById('todosContainer');
        const emptyState = document.getElementById('emptyState');

        if (todos.length === 0) {
            container.innerHTML = '';
            container.appendChild(emptyState);
            return;
        }

        container.innerHTML = '';
        todos.forEach(todo => {
            container.appendChild(this.createTodoElement(todo));
        });
    },

    /**
     * 显示上下文菜单
     */
    showContextMenu(e, todoId) {
        const menu = document.getElementById('contextMenu');
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        menu.style.display = 'block';
        menu.dataset.todoId = todoId;
    },

    /**
     * 隐藏上下文菜单
     */
    hideContextMenu() {
        const menu = document.getElementById('contextMenu');
        menu.style.display = 'none';
    }
};
