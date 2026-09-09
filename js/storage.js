/**
 * 本地存储管理模块
 */

const StorageManager = {
    STORAGE_KEY: 'todos_app_data',
    BACKUP_KEY: 'todos_app_backup',

    /**
     * 初始化存储
     */
    init() {
        const data = this.load();
        if (!data) {
            this.save([]);
        }
    },

    /**
     * 加载所有任务
     */
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('加载数据失败:', error);
            return [];
        }
    },

    /**
     * 保存所有任务
     */
    save(todos) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    },

    /**
     * 添加或更新任务
     */
    addOrUpdate(todo) {
        const todos = this.load();
        const existingIndex = todos.findIndex(t => t.id === todo.id);
        
        if (existingIndex > -1) {
            todos[existingIndex] = { ...todos[existingIndex], ...todo, updatedAt: Date.now() };
        } else {
            todos.push({
                ...todo,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }
        
        return this.save(todos);
    },

    /**
     * 删除任务
     */
    delete(id) {
        const todos = this.load();
        const filtered = todos.filter(t => t.id !== id);
        return this.save(filtered);
    },

    /**
     * 批量删除
     */
    deleteMultiple(ids) {
        const todos = this.load();
        const filtered = todos.filter(t => !ids.includes(t.id));
        return this.save(filtered);
    },

    /**
     * 清空所有任务
     */
    clear() {
        return this.save([]);
    },

    /**
     * 备份数据
     */
    backup() {
        try {
            const todos = this.load();
            const backup = {
                timestamp: Date.now(),
                data: todos
            };
            localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
            return backup;
        } catch (error) {
            console.error('备份失败:', error);
            return null;
        }
    },

    /**
     * 恢复数据
     */
    restore(backup) {
        try {
            if (backup && backup.data && Array.isArray(backup.data)) {
                return this.save(backup.data);
            }
            return false;
        } catch (error) {
            console.error('恢复失败:', error);
            return false;
        }
    },

    /**
     * 导出数据为 JSON
     */
    exportJSON() {
        const todos = this.load();
        return JSON.stringify(todos, null, 2);
    },

    /**
     * 从 JSON 导入数据
     */
    importJSON(jsonString) {
        try {
            const todos = JSON.parse(jsonString);
            if (Array.isArray(todos)) {
                return this.save(todos);
            }
            return false;
        } catch (error) {
            console.error('导入失败:', error);
            return false;
        }
    },

    /**
     * 获取储存容量信息
     */
    getStorageInfo() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const backup = localStorage.getItem(this.BACKUP_KEY);
            const dataSize = data ? new Blob([data]).size : 0;
            const backupSize = backup ? new Blob([backup]).size : 0;
            
            return {
                dataSize: (dataSize / 1024).toFixed(2) + ' KB',
                backupSize: (backupSize / 1024).toFixed(2) + ' KB',
                totalSize: ((dataSize + backupSize) / 1024).toFixed(2) + ' KB'
            };
        } catch (error) {
            console.error('获取储存信息失败:', error);
            return null;
        }
    }
};
