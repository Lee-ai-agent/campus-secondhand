# 校园二手交易系统 — 前端设计系统规格

**日期**: 2026-06-01
**状态**: 已批准
**范围**: 小程序端 (miniprogram/) + 管理后台 (admin-web/)

---

## 一、概述

基于原型 `prototypes/second-hand-campus/` 的设计语言，对两个前端项目进行完整的设计系统重构。采用"设计系统先行"策略：先建立设计 token 和组件层，再逐页改造。

## 二、设计 Token

### 2.1 小程序端 — 校园市集风格

```css
/* 色彩 */
--market-green: #18a66b;
--market-deep: #0c5c42;
--market-yellow: #ffd45a;
--market-red: #e34f45;
--market-blue: #4d8fd8;
--market-paper: #f7f3e8;
--market-ink: #16231f;
--market-muted: #65756e;
--market-line: #d7e5dd;
--market-panel: #ffffff;

/* 阴影 */
--shadow-soft: 0 10rpx 28rpx rgba(24, 73, 53, 0.1);
--shadow-card: 0 10rpx 24rpx rgba(62, 76, 57, 0.08);
--shadow-float: 0 14rpx 28rpx rgba(48, 65, 55, 0.1);

/* 圆角 */
--radius-sm: 8rpx;
--radius-md: 12rpx;
--radius-lg: 18rpx;
--radius-full: 999rpx;
```

### 2.2 管理后台 — 专业控制台风格

```css
/* 色彩 */
--admin-bg: #f4f6f8;
--admin-panel: #ffffff;
--admin-line: #dde3ea;
--admin-ink: #18212b;
--admin-muted: #6a7480;
--admin-green: #16875d;
--sidebar-bg-start: #142433;
--sidebar-bg-end: #0e1722;
--sidebar-text: rgba(237, 244, 251, 0.74);
--sidebar-active-text: #f7fff9;
--sidebar-active-bg: #16875d;
```

## 三、组件层

### 3.1 小程序端组件

以下组件匹配原型 `scripts/ui-components.js` 中的设计模式：

1. **soft-search** — 圆角搜索栏：搜索 icon + input + 黄色操作按钮
2. **product-card / market-card** — 商品卡片：彩色图片区 + 标题/价格/状态 + 卖家标签行
3. **filter-chip / filter-chip-row** — 横向可滚动筛选条，支持 active 态
4. **bottom-action-bar** — 底部固定操作栏（价格汇总 + 主操作按钮）
5. **empty-state** — 空状态：icon + 标题 + 描述 + 操作按钮
6. **status-tabs** — 状态筛选标签组
7. **form-card / soft-form** — 表单卡片
8. **seller-card / address-card / order-card** — 各类信息卡片
9. **message-row / chat-bubble** — 消息列表行 / 聊天气泡
10. **profile-hero / profile-stats** — 个人中心头部和统计
11. **wanted-card / floating-action** — 求购卡片 / 悬浮操作按钮
12. **category-grid** — 4 列分类入口网格
13. **mini-timeline** — 订单状态时间线

### 3.2 管理后台覆盖策略

- 侧边栏、顶栏、KPI 卡片 → 纯自定义 CSS
- 表格 → 保留 `el-table`，覆盖颜色/间距/圆角/悬停
- 按钮 → 覆盖 `el-button` 为绿色系
- 筛选栏 → 自定义网格布局
- 图表区 → 纯 CSS 柱状图

## 四、页面清单

### 4.1 小程序端（22 个页面）

| 页面 | 路由 | 优先级 |
|------|------|--------|
| 首页 | pages/home | P0 |
| 登录/注册 | pages/login | P0 |
| 分类列表 | pages/list | P1 |
| 商品详情 | pages/detail | P0 |
| 购物车 | pages/cart | P0 |
| 确认订单 | pages/confirm | P1 |
| 订单列表 | pages/orders | P1 |
| 订单详情 | pages/order-detail | P1 |
| 评价 | pages/review | P2 |
| 个人中心 | pages/profile | P0 |
| 收藏 | pages/favorites | P2 |
| 地址管理 | pages/address | P2 |
| 消息列表 | pages/messages | P1 |
| 聊天 | pages/chat | P1 |
| 求购大厅 | pages/wanted | P0 |
| 求购发布 | pages/wanted-publish | P1 |
| 求购详情 | pages/wanted-detail | P1 |
| 卖家摊位 | pages/seller | P1 |
| 发布商品 | pages/seller-publish | P1 |
| 我的发布 | pages/seller-posts | P1 |
| 卖出订单 | pages/seller-orders | P1 |
| 发货/退款/店铺 | pages/seller/ship+refund+shop | P2 |

### 4.2 管理后台（10 个模块）

| 模块 | 页面标识 | 优先级 |
|------|----------|--------|
| 仪表盘 | dashboard | P0 |
| 用户管理 | users | P1 |
| 商品审核 | products (审核tab) | P0 |
| 商品管理 | products/all | P1 |
| 分类管理 | categories | P1 |
| 订单管理 | orders | P1 |
| 求购管理 | wanted | P1 |
| 公告管理 | announcements | P1 |
| 咨询管理 | messages | P1 |
| 数据统计 | stats | P2 |

## 五、实施策略

### Phase 1：设计系统基础
- 小程序：重写 `app.wxss`（设计 token + 全局组件样式）
- 管理后台：重写 `styles.css`（设计 token + Element Plus 覆盖）

### Phase 2：核心页面（P0）
按原型逐页改造，先小程序端 7 个 P0 页面，再管理后台 2 个 P0 模块

### Phase 3：扩展页面（P1）
小程序端 12 个 P1 页面 + 管理后台 7 个 P1 模块

### Phase 4：辅助页面（P2）
小程序端 3 个 P2 页面 + 管理后台 1 个 P2 模块

## 六、成功标准

- [ ] 设计 token 完整覆盖原型所有色彩/阴影/圆角
- [ ] 小程序 22 个页面的视觉风格与原型一致
- [ ] 管理后台 10 个模块的视觉风格与原型一致
- [ ] 现有 API 调用保持不变，接口兼容
- [ ] 小程序 navigationBar/tabBar 颜色与设计 token 一致
- [ ] 管理后台 Element Plus 组件样式被正确覆盖
