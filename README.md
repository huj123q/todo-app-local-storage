# Todo App - 本地存储待办事项应用

一个功能完整的待办事项应用，支持本地存储、任务管理、优先级设置和数据持久化。

## 🎯 功能特性

- ✅ **任务创建** - 快速添加新的待办事项
- ✅ **本地存储** - 使用 localStorage/IndexedDB 本地持久化数据
- ✅ **编辑删除** - 修改和删除任务
- ✅ **优先级管理** - 设置任务优先级（高/中/低）
- ✅ **完成标记** - 标记任务为已完成
- ✅ **分类筛选** - 按状态筛选任务（全部/进行中/已完成）
- ✅ **搜索功能** - 快速搜索任务
- ✅ **截止日期** - 设置任务截止日期
- ✅ **统计信息** - 显示任务统计数据
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **数据导出** - 导出任务数据为 JSON
- ✅ **深色模式** - 支持浅色/深色主题切换

## 🛠️ 技术栈

- **前端框架**：HTML5 + CSS3 + JavaScript (ES6+)
- **存储方案**：
  - localStorage（基础数据存储）
  - IndexedDB（大数据量备选方案）
- **样式框架**：原生 CSS + CSS Grid/Flexbox
- **打包工具**：Webpack（可选）
- **版本管理**：Git

## 📁 项目结构

```
todo-app-local-storage/
├── index.html              # 主页面
├── css/
│   ├── style.css          # 主样式文件
│   ├── responsive.css     # 响应式设计
│   └── theme.css          # 主题切换样式
├── js/
│   ├── app.js             # 主应用逻辑
│   ├── storage.js         # 存储管理模块
│   ├── ui.js              # UI 操作模块
│   ├── utils.js           # 工具函数
│   └── theme.js           # 主题管理
├── assets/
│   ├── icons/             # 图标文件
│   └── images/            # 图片资源
├── .gitignore             # Git 忽略文件
├── package.json           # 项目配置
├── README.md              # 项目说明
└── docs/
    ├── API.md             # API 文档
    ├── GUIDE.md           # 用户指南
    └── DEVELOPMENT.md     # 开发指南
```

## 🚀 快速开始

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/huj123q/todo-app-local-storage.git
cd todo-app-local-storage

# 安装依赖（可选，如果使用��建工具）
npm install
```

### 运行应用

#### 方案 1：直接打开（推荐新手）
```bash
# 直接用浏览器打开 index.html
open index.html
```

#### 方案 2：使用本地服务器
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js http-server
npx http-server

# 或使用 VS Code Live Server 扩展
# 右击 index.html -> Open with Live Server
```

访问 `http://localhost:8000`

### 构建生产版本（可选）

```bash
npm run build
```

## 📖 使用指南

### 基本操作

1. **添加任务**
   - 在输入框输入任务内容
   - 点击 "添加" 按钮或按 Enter 键
   - 可选：设置优先级和截止日期

2. **编辑任务**
   - 点击任务旁的编辑按钮
   - 修改内容后确认

3. **完成任务**
   - 点击任务前的复选框标记为完成

4. **删除任务**
   - 点击删除按钮移除任务

5. **筛选和搜索**
   - 使用分类标签筛选任务
   - 使用搜索框快速查找任务

6. **切换主题**
   - 点击右上角的主题按钮切换深色/浅色模式

### 高级功能

- **优先级排序**：任务按优先级自动排序（高>中>低）
- **截止日期提醒**：即将到期的任务标记为警告
- **数据导出**：将所有任务导出为 JSON 文件
- **批量操作**：选中多个任务进行批量删除

## 💾 本地存储说明

### localStorage 版本（默认）

**优点：**
- 简单易用
- 浏览器原生支持
- 无需额外配置

**缺点：**
- 存储空间有限（约 5-10MB）
- 性能限制：大量数据操作较慢

**适用场景：** 日常任务管理（<1000条）

### IndexedDB 版本（可选）

**优点：**
- 存储空间大（几百 MB～GB）
- 性能好，支持复杂查询
- 支持异步操作

**缺点：**
- API 相对复杂
- 调试困难

**适用场景：** 大型任务数据库（>10000条）

### 数据结构

```javascript
// Todo 对象结构
{
  id: "uuid",                    // 唯一标识
  title: "任务标题",              // 任务标题
  description: "详细描述",        // 任务描述
  completed: false,              // 完成状态
  priority: "high"|"medium"|"low", // 优先级
  dueDate: "2024-12-31",        // 截止日期
  category: "work"|"personal"|..., // 分类
  tags: ["标签1", "标签2"],      // 标签列表
  createdAt: 1694289600000,      // 创建时间戳
  updatedAt: 1694289600000,      // 更新时间戳
  notes: "备注信息"               // 备注
}
```

## 🔧 API 文档

详见 [docs/API.md](./docs/API.md)

### 核心 API

```javascript
// 初始化应用
const app = new TodoApp();

// 添加任务
app.addTodo(title, options);

// 更新任务
app.updateTodo(id, updates);

// 删除任务
app.deleteTodo(id);

// 获取所有任务
app.getTodos();

// 搜索任务
app.searchTodos(query);

// 清空已完成任务
app.clearCompleted();

// 导出数据
app.exportData();

// 导入数据
app.importData(jsonData);
```

## 🎨 自定义

### 修改主题颜色

编辑 `css/theme.css`：

```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  /* ... 更多颜色 */
}
```

### 添加新的分类

在 `js/app.js` 中修改 `categories`：

```javascript
const categories = [
  'work',      // 工作
  'personal',  // 个人
  'shopping',  // 购物
  'health',    // 健康
  // 添加新分类
];
```

## 📱 浏览器兼容性

| 浏览器 | 最低版本 | 支持度 |
|--------|---------|--------|
| Chrome | 60+ | ✅ 完全支持 |
| Firefox | 55+ | ✅ 完全支持 |
| Safari | 11+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| IE 11 | - | ⚠️ 需要 polyfill |

**localStorage 支持：** 所有现代浏览器

**IndexedDB 支持：** Chrome, Firefox, Safari, Edge

## 🐛 常见问题

### Q: 数据会丢失吗？
**A:** 不会。所有数据存储在浏览器的 localStorage 中，除非主动清除浏览数据或卸载应用，否则数据会永久保存。

### Q: 能在多个设备间同步吗？
**A:** 目前不支持。如需同步，可以：
1. 导出数据（JSON）后手动传输
2. 使用云存储API（待实现）
3. 部署后端服务器（可选）

### Q: localStorage 满了怎么办？
**A:** 
1. 清理已完成的旧任务
2. 导出数据为备份
3. 切换到 IndexedDB 版本

### Q: 如何备份数据？
**A:** 点击"导出"按钮下载 JSON 文件，妥善保管。

### Q: 如何恢复备份？
**A:** 点击"导入"按钮，选择之前导出的 JSON 文件。

## 🔒 隐私和安全

- ✅ **完全本地存储** - 所有数据仅存储在你的设备
- ✅ **无服务器依赖** - 无需网络连接即可使用
- ✅ **无数据上传** - 不会收集或上传任何个人信息
- ✅ **开源透明** - 代码完全公开，可自行审查

## 📈 性能指标

- 页面加载时间：< 200ms
- 添加任务响应时间：< 50ms
- 支持任务数量：5000+ 条
- 内存占用：< 50MB

## 🚀 未来功能

- [ ] 云端同步（云存储集成）
- [ ] 移动应用版本（React Native/Flutter）
- [ ] 协作功能（共享任务列表）
- [ ] AI 智能助手（任务分析和建议）
- [ ] 日历视图
- [ ] 定时提醒（桌面通知）
- [ ] 语音输入
- [ ] 子任务支持
- [ ] 重复任务
- [ ] 番茄工作法集成

## 📝 许可证

MIT License - 详见 [LICENSE](./LICENSE)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 贡献步骤

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

详见 [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

## 💬 反馈和支持

- 📧 Email: huj123q@users.noreply.github.com
- 🐛 Bug 报告: [GitHub Issues](https://github.com/huj123q/todo-app-local-storage/issues)
- 💡 功能建议: [GitHub Discussions](https://github.com/huj123q/todo-app-local-storage/discussions)

## 📊 项目统计

```
代码行数: ~1500 行
HTML: ~300 行
CSS: ~400 行
JavaScript: ~800 行
浏览器支持: 95%+ 用户
```

## 🎓 学习资源

本项目适合学习以下技术：

- HTML5 DOM 操作
- CSS3 Grid 和 Flexbox 布局
- JavaScript ES6+ 语法
- localStorage 和 IndexedDB API
- 事件处理和事件委托
- 模块化编程
- MVC 设计模式

## 🙏 致谢

感谢所有贡献者和用户的支持！

---

**项目状态**：🚀 活跃开发中

**最后更新**：2024年9月

如果有帮助，请给个 ⭐ Star！
