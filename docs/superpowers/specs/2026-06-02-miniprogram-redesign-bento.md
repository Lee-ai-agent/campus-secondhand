# 校园二手小程序 — UI 重设计规格

**日期**: 2026-06-02
**状态**: 已确认
**范围**: 小程序端 (miniprogram/) — 24 个页面完整视觉重设计

---

## 一、设计方向

从当前的「校园市集暖绿黄」风格，整体迁移到 **Bento Box Grid 精致卡片风**（Apple Design 风格）。

| 维度 | 旧值 | 新值 |
|------|------|------|
| 底色 | `#f7f3e8` 纸色 | `#F5F5F7` 冷灰 |
| 主色调 | `#18a66b` 绿 + `#ffd45a` 黄 | `#0071E3` 蓝 |
| 字体风格 | 系统默认 | Inter 风格（系统字体回退） |
| 图标 | emoji | SVG / iconfont |
| 卡片阴影 | `0 10rpx 24rpx` 大阴影 | `0 1px 3px` 微阴影 + 细边框 |
| 圆角 | 8/12/18rpx | 统一 20rpx |
| 按钮 | 黄色大阴影 | 纯色 + 微边框，无阴影 |

## 二、设计 Token

### 2.1 色彩

```css
--bg:         #F5F5F7;  /* 页底 */
--card:       #FFFFFF;  /* 卡片 */
--text:       #1D1D1F;  /* 主文字 */
--text-muted: #86868B;  /* 次要文字 */
--line:       #E5E5EA;  /* 边框/分割线 */
--primary:    #0071E3;  /* 主色 */
--primary-bg: #EBF5FF;  /* 主色浅底 */
--red:        #FF3B30;  /* 价格/危险 */
--green:      #34C759;  /* 成功/状态 */
--orange:     #FF9500;  /* 提醒 */
--fill:       #F9F9FB;  /* 输入框/选中态背景 */
```

### 2.2 阴影

```css
--shadow-card: 0 1px 3px rgba(0,0,0,0.04);  /* 唯一阴影，极轻 */
```

### 2.3 圆角

```css
--radius-sm:  12rpx;
--radius-md:  20rpx;   /* 统一主圆角 */
--radius-full: 999rpx;
```

### 2.4 间距（8rpx 体系）

```css
--space-1:  8rpx;
--space-2: 16rpx;
--space-3: 24rpx;
--space-4: 32rpx;
--space-5: 48rpx;
```

### 2.5 字号

```css
--fs-xs: 20rpx;
--fs-sm: 24rpx;
--fs-md: 28rpx;
--fs-lg: 32rpx;
--fs-xl: 36rpx;
--fs-2xl: 44rpx;
```

## 三、字体与排版

- 字体栈：`-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif`
- 标题 weight 700，正文 weight 400-500，标签 weight 600
- 行高：正文 1.5，标题 1.3
- 标题 letter-spacing: -0.3px（通过 rpx 近似的负 letter-spacing 实现）

## 四、图标策略

彻底移除全部 emoji。替换为统一 SVG 图标集。

方案：使用 iconfont（单色字体图标），在 `app.wxss` 中引入 `@font-face`。若 iconfont 不可用，退而用小程序的 `<icon>` 组件或纯 CSS 绘制。

涉及图标：
- 分类 icon：教材、数码、生活、运动（当前用 📖📱🏠⚽）
- TabBar icon：首页、求购、购物车、消息、我的（当前用 🏠🔍🛒💬👤）
- 搜索、空状态、操作按钮等

## 五、全局组件样式重构

以下全局类需重写（对应 `app.wxss`）：

| 类名 | 改动 |
|------|------|
| `.card` | 去阴影，改细边框 + 20rpx 圆角 |
| `.product-card` | 同上，卡片图区改蓝色系渐变 |
| `.btn` / `.btn.primary` | 去阴影，primary 改蓝色 |
| `.soft-search` | 去阴影，按钮黑改蓝 |
| `.banner` | 去绿色渐变，改纯白卡片 + 蓝色点缀 |
| `.market-hero` | 去黄色渐变，改白卡 + 蓝色统计标签 |
| `.category-item` | 去阴影边框，改白卡微阴影 |
| `.bottom-action-bar` | 去大阴影，改细线 |
| `.section-title` | 字重加大 |
| `.empty-state` | emoji → iconfont |
| `.badge` / `.tag` | 配色对齐新 token |
| `.input` / `.textarea` | 灰底改冷灰底 |

## 六、页面清单（24 页）

### P0 核心（6 页）
- home — 首页
- login — 登录
- detail — 商品详情
- cart — 购物车
- profile — 个人中心
- wanted — 求购大厅

### P1 交易（12 页）
- list — 分类列表
- confirm — 确认订单
- orders — 订单列表
- order-detail — 订单详情
- wanted-publish — 求购发布
- wanted-detail — 求购详情
- messages — 消息列表
- chat — 聊天
- seller — 卖家摊位
- seller-publish — 发布商品
- seller-posts — 我的发布
- seller-orders — 卖出订单

### P2 辅助（6 页）
- review — 评价
- favorites — 收藏
- address — 地址管理
- seller-ship — 发货
- seller-refund — 退款
- seller-shop — 店铺

## 七、技能清单

| 技能 | 用途 |
|------|------|
| `ui-ux-pro-max` | 设计系统搜索、UX 规范审核、色板字体验证 |
| `frontend-design` | 页面视觉实现、卡片/列表/表单精修 |
| `gsap-core` | 微交互：按钮按下、卡片入场、骨架屏过渡 |
| `writing-plans` | 生成分步实现计划 |
| `subagent-driven-development` | 并行改造多个页面 |

## 八、不改的范围

- JS 业务逻辑（所有 `.js` 文件不动）
- API 接口调用
- 页面路由结构
- 管理后台（admin-web/）
- 数据结构与状态管理

## 九、成功标准

- [ ] 全局 token 全部替换为新配色
- [ ] 24 个页面 0 个 emoji
- [ ] 所有阴影降为极轻
- [ ] 卡片统一 20rpx 圆角
- [ ] tabBar 图标替换为 iconfont
- [ ] 无 JS 逻辑改动
- [ ] 无新增 lint/type 错误
