/**
 * 主题管理模块
 */

const ThemeManager = {
    THEME_KEY: 'todo_app_theme',
    LIGHT_THEME: 'light-theme',
    DARK_THEME: 'dark-theme',

    /**
     * 初始化主题
     */
    init() {
        const savedTheme = this.getSavedTheme();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? this.DARK_THEME : this.LIGHT_THEME);
        this.setTheme(theme);
    },

    /**
     * 获取保存的主题
     */
    getSavedTheme() {
        return localStorage.getItem(this.THEME_KEY);
    },

    /**
     * 设置主题
     */
    setTheme(theme) {
        document.body.classList.remove(this.LIGHT_THEME, this.DARK_THEME);
        document.body.classList.add(theme);
        localStorage.setItem(this.THEME_KEY, theme);
        this.updateThemeIcon(theme);
    },

    /**
     * 切换主题
     */
    toggleTheme() {
        const currentTheme = document.body.classList.contains(this.DARK_THEME)
            ? this.DARK_THEME
            : this.LIGHT_THEME;
        const newTheme = currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;
        this.setTheme(newTheme);
    },

    /**
     * 更新主题图标
     */
    updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = theme === this.DARK_THEME ? '☀️' : '🌙';
        }
    },

    /**
     * 获取当前主题
     */
    getCurrentTheme() {
        return document.body.classList.contains(this.DARK_THEME) ? this.DARK_THEME : this.LIGHT_THEME;
    }
};
