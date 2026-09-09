/**
 * 工具函数模块
 */

const Utils = {
    /**
     * 生成一个序列号 ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * 格式化日期
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * 从今天计算剩余天数
     */
    getDaysUntil(dateString) {
        if (!dateString) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(dateString);
        dueDate.setHours(0, 0, 0, 0);
        const timeDiff = dueDate - today;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    },

    /**
     * 检查是否已过期
     */
    isOverdue(dateString) {
        const daysUntil = this.getDaysUntil(dateString);
        return daysUntil !== null && daysUntil < 0;
    },

    /**
     * 检查是否永被日期
     */
    isDueToday(dateString) {
        const daysUntil = this.getDaysUntil(dateString);
        return daysUntil === 0;
    },

    /**
     * 检查是否今天期滱
     */
    isDueSoon(dateString) {
        const daysUntil = this.getDaysUntil(dateString);
        return daysUntil !== null && daysUntil > 0 && daysUntil <= 3;
    },

    /**
     * 清滤不合法的字串
     */
    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>"']/g, (char) => {
            const entities = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return entities[char];
        });
    },

    /**
     * 检查一个字符串是否包含指定的驼下
     */
    includesIgnoreCase(str, query) {
        return str.toLowerCase().includes(query.toLowerCase());
    },

    /**
     * 深克隆一个对象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    /**
     * 一个死字帖筛攉
     */
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * 节流
     */
    throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }
};
