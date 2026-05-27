# 购物管理 APP

基于 uni-app Vue3 的跨平台购物记录管理应用，一套代码同时支持 iOS、Android 和微信小程序。

## 功能特性

- **商品记录** - 手动录入购物信息，支持分类、平台标签
- **拍照识别** - OCR 小票识别（模拟）
- **分类管理** - 左侧分类菜单 + 右侧记录列表
- **账单分析** - 月度消费统计、趋势图、分类占比
- **数据持久化** - 本地存储，关闭后数据保留
- **滑动删除** - 左滑记录卡片显示删除按钮

## 项目结构

```
shopping_manager_uni/
├── src/
│   ├── App.vue              # 应用入口
│   ├── main.ts              # Vue SSR 入口
│   ├── constants/           # 常量配置
│   │   └── index.ts         # emoji、友好文案
│   ├── types/               # TypeScript 类型
│   │   └── index.ts         # ProductRecord、Category、User
│   ├── styles/              # 全局样式
│   │   └── common.css       # CSS 变量、通用样式
│   ├── utils/               # 工具函数
│   │   └── db.ts            # localStorage 数据存储
│   ├── stores/              # Pinia 状态管理
│   │   ├── records.ts       # 记录状态
│   │   ├── categories.ts    # 分类状态
│   │   └── user.ts          # 用户状态
│   ├── components/          # 公共组件
│   │   ├── tab-bar.vue      # 底部导航栏
│   │   ├── float-menu.vue   # 记一笔浮动菜单
│   │   ├── record-card.vue  # 记录卡片
│   │   └── confirm-dialog.vue # 删除确认弹窗
│   └── pages/               # 页面
│       ├── index/           # 首页
│       ├── categories/      # 分类页
│       ├── bill/            # 账单页
│       ├── bill-detail/     # 消费明细页
│       ├── mine/            # 我的页面
│       ├── add-record/      # 手动录入页
│       ├── ocr-record/      # OCR识别页
│       └── edit-profile/    # 编辑资料页
├── pages.json               # 路由配置
├── manifest.json            # 应用配置
├── package.json
└── vite.config.ts
```

## 快速开始

### 安装依赖

```bash
cd shopping_manager_uni
npm install
```

### 开发模式

```bash
# H5 Web 版（用于开发预览）
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin
```

### 构建发布

```bash
# 构建 H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin

# 构建 App（需配置原生平台）
npm run build:app
```

## 技术栈

- **框架**: uni-app + Vue 3 + TypeScript
- **状态管理**: Pinia
- **样式**: CSS Variables + Scoped CSS
- **存储**: localStorage（可通过条件编译切换云存储）
- **构建**: Vite

## 页面说明

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | /pages/index | 月消费概览 + 最近记录 |
| 分类 | /pages/categories | 左侧分类菜单 + 右侧记录 |
| 账单 | /pages/bill | 消费统计、趋势图、分类占比 |
| 消费明细 | /pages/bill-detail | 按日期分组的记录列表 |
| 我的 | /pages/mine | 用户信息、设置菜单 |
| 手动录入 | /pages/add-record | 表单录入商品信息 |
| OCR识别 | /pages/ocr-record | 拍照/相册选择（模拟） |
| 编辑资料 | /pages/edit-profile | 修改昵称 |

## 数据模型

### 商品记录 (ProductRecord)
- id, name, price, quantity
- purchaseTime, storeName
- categoryId, platformId
- remark, userId

### 分类 (Category)
- id, name, emoji
- sortOrder, isDefault

### 用户 (User)
- id, nickname, avatarUrl, createdAt

## 设计规范

- **主色**: #FF8A80（珊瑚粉）
- **背景**: #FFF9F5（奶油白）
- **卡片**: #FFFFFF（纯白）
- **文字**: #333333（主）、#999999（次）
- **圆角**: 12-16px
- **间距**: 16px

## 后续优化建议

1. **OCR 能力** - 集成百度/腾讯 OCR 识别真实小票
2. **图表组件** - 使用 uCharts 或 echarts 实现趋势图、饼图
3. **云同步** - 接入云开发或多端数据同步
4. **预算提醒** - 设置月度预算，超支提醒
5. **数据导出** - 导出 Excel/CSV/PDF
6. **深色模式** - 适配暗色主题