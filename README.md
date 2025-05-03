# Chrome History Cleaner & Stats
# Chrome 历史记录清理与统计工具

A Chrome extension that helps you manage your browsing history and view domain visit statistics.
这是一个帮助您管理浏览历史记录并查看域名访问统计的 Chrome 扩展程序。

## Project Structure 项目结构

```
chrome-history-cleaner/
├── manifest.json           # 扩展程序配置文件
├── popup.html             # 弹出窗口的 HTML 界面
├── popup.js              # 弹出窗口的交互逻辑
├── styles.css            # 样式表文件
├── background.js         # 后台服务脚本
├── icons/                # 图标文件夹
│   ├── icon16.png       # 16x16 图标
│   ├── icon48.png       # 48x48 图标
│   └── icon128.png      # 128x128 图标
└── README.md             # 项目说明文档
```

## Features 功能特点

1. Clean browsing history with flexible options:
1. 灵活的浏览历史清理选项：
   - Predefined time ranges (last hour, day, week, month)
   - 预设时间范围（最近一小时、一天、一周、一月）
   - Custom date range
   - 自定义日期范围
   - Domain-specific cleaning
   - 特定域名清理
   
2. View domain visit statistics:
2. 查看域名访问统计：
   - See most visited domains
   - 查看最常访问的域名
   - Filter by different time periods
   - 按不同时间段筛选
   - Real-time statistics updates
   - 实时统计数据更新

## Installation 安装说明

1. Clone or download this repository
1. 克隆或下载此仓库
2. Open Chrome and go to `chrome://extensions/`
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. Enable "Developer mode" in the top right
3. 在右上角启用"开发者模式"
4. Click "Load unpacked" and select the extension directory
4. 点击"加载已解压的扩展程序"，选择扩展程序目录
5. The extension icon should appear in your Chrome toolbar
5. 扩展程序图标将出现在 Chrome 工具栏中

## Usage 使用说明

### Cleaning History 清理历史记录

1. Click the extension icon to open the popup
1. 点击扩展程序图标打开弹窗
2. Select a time range or choose "Custom Range"
2. 选择时间范围或"自定义范围"
3. Optionally enter a specific domain to clean (e.g., "google.com")
3. 可选择输入要清理的特定域名（例如："google.com"）
4. Click "Clean History"
4. 点击"清理历史记录"

### Viewing Statistics 查看统计数据

1. Open the extension popup
1. 打开扩展程序弹窗
2. Select a time range for statistics
2. 选择统计时间范围
3. View the list of domains and their visit counts
3. 查看域名列表及其访问次数
4. Click "Refresh Stats" to update the statistics
4. 点击"刷新统计"更新数据

## Technical Details 技术细节

### 使用的 Chrome API
- `chrome.history`: 用于访问和管理浏览历史
  - `search()`: 搜索历史记录
  - `deleteUrl()`: 删除特定 URL
  - `deleteRange()`: 删除时间范围内的记录
  - `deleteAll()`: 删除所有历史记录
- `chrome.storage`: 用于存储扩展程序设置
- `chrome.tabs`: 用于标签页管理

### 代码结构
1. **popup.html**: 
   - 使用 HTML5 语义化标签
   - 模块化的界面结构
   - 响应式的表单元素

2. **styles.css**:
   - 采用 Google Material Design 设计规范
   - 模块化的 CSS 结构
   - 响应式设计
   - 优雅的动画效果

3. **popup.js**:
   - 模块化的功能实现
   - 异步操作处理
   - 错误处理机制
   - 实时数据更新

4. **background.js**:
   - 后台服务监听
   - 事件处理
   - 扩展程序生命周期管理

### 安全性考虑
1. 所有危险操作都需要确认
2. 清除操作前会显示警告信息
3. 使用正则表达式验证域名输入
4. 错误处理和用户反馈

## Privacy 隐私说明

This extension only accesses your browsing history when you explicitly request to clean it or view statistics. No data is collected or sent to external servers.
本扩展程序仅在您明确请求清理历史记录或查看统计数据时访问您的浏览历史。不会收集或发送数据到外部服务器。

## Contributing 贡献指南

欢迎贡献代码或提出建议！请遵循以下步骤：
1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## License 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解更多详情。