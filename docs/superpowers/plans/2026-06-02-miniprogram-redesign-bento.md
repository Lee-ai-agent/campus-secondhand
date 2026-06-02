# 小程序 UI 重设计 — Bento Box 精致卡片风 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将小程序 24 个页面从「校园市集暖绿黄」风格整体迁移到 Bento Box 精致卡片风（Apple Design 风格）

**Architecture:** 设计系统先行——先重写 `app.wxss` 全局设计 token 和全局类（配色、阴影、圆角、组件），再逐页清理 WXML 中的 emoji 和内联旧色值。JS 逻辑零改动，页面级 WXSS 当前为空白（全部依赖全局类），仅需确认无需新增内容。

**Tech Stack:** 微信小程序原生框架 (WXML/WXSS/JS)

**参考 Spec:** `docs/superpowers/specs/2026-06-02-miniprogram-redesign-bento.md`

---

## 文件结构

| 文件 | 职责 | 改动类型 |
|------|------|----------|
| `miniprogram/app.wxss` | 全局设计 token + 全局组件类（1100+ 行） | **完全重写** |
| `miniprogram/app.json` | tabBar 配置、导航栏颜色 | **修改** |
| `miniprogram/pages/*/index.wxml` | 24 个页面模板（含 emoji 和内联旧色值） | **逐页清理** |
| `miniprogram/pages/*/index.wxss` | 24 个页面样式文件（当前均为空或仅引用全局） | **确认即可** |
| `miniprogram/pages/*/index.js` | 页面逻辑 | **不改** |
| `miniprogram/pages/*/index.json` | 页面配置 | **不改** |

---

## Phase 1: 设计系统基础

### Task 1: 重写 app.wxss — 新设计 Token

**Files:**
- Modify: `miniprogram/app.wxss`（完全重写）

- [ ] **Step 1: 用新设计 token 完全替换 app.wxss**

用以下内容完全替换 `miniprogram/app.wxss`：

```css
/* ===== Design Tokens ===== */
page {
  --bg:         #F5F5F7;
  --card:       #FFFFFF;
  --text:       #1D1D1F;
  --text-muted: #86868B;
  --line:       #E5E5EA;
  --primary:    #0071E3;
  --primary-bg: #EBF5FF;
  --red:        #FF3B30;
  --green:      #34C759;
  --orange:     #FF9500;
  --fill:       #F9F9FB;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04);
  --radius-sm:  12rpx;
  --radius-md:  20rpx;
  --radius-full: 999rpx;
  --space-1:  8rpx;
  --space-2: 16rpx;
  --space-3: 24rpx;
  --space-4: 32rpx;
  --space-5: 48rpx;
  --fs-xs: 20rpx;
  --fs-sm: 24rpx;
  --fs-md: 28rpx;
  --fs-lg: 32rpx;
  --fs-xl: 36rpx;
  --fs-2xl: 44rpx;

  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  font-size: var(--fs-md);
  line-height: 1.5;
}

/* ===== Layout ===== */
.page {
  min-height: 100vh;
  padding: var(--space-3);
  box-sizing: border-box;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

/* ===== Cards ===== */
.card {
  background: var(--card);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-card);
  border: 1rpx solid var(--line);
}

.screen-card {
  background: var(--card);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-card);
  border: 1rpx solid var(--line);
}

/* ===== Typography ===== */
.muted {
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

.price {
  color: var(--red);
  font-size: var(--fs-xl);
  font-weight: 700;
  letter-spacing: -0.5rpx;
}

.name {
  font-size: var(--fs-lg);
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.3rpx;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 40rpx;
  padding: 0 var(--space-2);
  border-radius: var(--radius-full);
  color: var(--primary);
  background: var(--primary-bg);
  font-size: var(--fs-xs);
  font-weight: 600;
}

/* ===== Buttons ===== */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80rpx;
  padding: 0 28rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-full);
  background: var(--card);
  color: var(--text);
  font-weight: 600;
  font-size: var(--fs-md);
  transition: opacity 150ms ease-out;
}

.btn:active {
  opacity: 0.6;
}

.btn.primary {
  border-color: transparent;
  color: #FFFFFF;
  background: var(--primary);
}

.btn.ghost {
  color: var(--primary);
  background: var(--primary-bg);
  border-color: transparent;
}

.btn.danger {
  border-color: transparent;
  color: #FFFFFF;
  background: var(--red);
}

.btn.small {
  min-height: 60rpx;
  padding: 0 20rpx;
  font-size: var(--fs-sm);
}

/* ===== Badge / Status ===== */
.badge {
  display: inline-flex;
  align-items: center;
  min-height: 40rpx;
  padding: 0 14rpx;
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: 600;
}

.badge.success {
  color: #1B7F3B;
  background: #EBFAF0;
}

.badge.warn {
  color: #B05D00;
  background: #FFF5E6;
}

.badge.danger {
  color: #C41E3A;
  background: #FFE8EC;
}

.badge.blue {
  color: var(--primary);
  background: var(--primary-bg);
}

/* ===== Tags ===== */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 8rpx 18rpx;
  border-radius: var(--radius-full);
  background: var(--fill);
  color: var(--text-muted);
  font-size: var(--fs-xs);
  font-weight: 600;
}

.tag.active {
  background: var(--primary);
  color: #FFFFFF;
}

/* ===== Inputs ===== */
.input {
  width: 100%;
  min-height: 76rpx;
  padding: 0 var(--space-3);
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--fill);
  box-sizing: border-box;
  font-size: var(--fs-md);
}

.textarea {
  width: 100%;
  min-height: 140rpx;
  padding: 20rpx var(--space-3);
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--fill);
  box-sizing: border-box;
  font-size: var(--fs-md);
}

/* ===== Form ===== */
.form-card {
  background: var(--card);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-card);
  border: 1rpx solid var(--line);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: 20rpx;
}

.field-label {
  color: var(--text-muted);
  font-size: var(--fs-sm);
  font-weight: 600;
}

/* ===== Search Bar ===== */
.soft-search {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 96rpx;
  padding: 12rpx 14rpx 12rpx 18rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-full);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.soft-search .search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: var(--radius-sm);
  color: #FFFFFF;
  background: var(--primary);
  font-size: var(--fs-md);
  font-weight: 700;
  flex-shrink: 0;
}

.soft-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: var(--fs-md);
  font-weight: 500;
}

.soft-search .search-action {
  flex-shrink: 0;
  min-width: 100rpx;
  min-height: 64rpx;
  padding: 0 var(--space-3);
  border: 0;
  border-radius: var(--radius-full);
  color: #FFFFFF;
  background: var(--primary);
  font-weight: 600;
  font-size: 26rpx;
}

/* ===== Product Card ===== */
.product-card {
  display: flex;
  gap: 18rpx;
  padding: 18rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.product-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 160rpx;
  height: 160rpx;
  border-radius: var(--radius-md);
  color: #FFFFFF;
  font-size: var(--fs-xs);
  font-weight: 700;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.product-img[data-kind="教材资料"] {
  background: linear-gradient(160deg, #2563EB, #60A5FA);
}

.product-img[data-kind="数码电子"] {
  background: linear-gradient(145deg, #6366F1, #A78BFA);
}

.product-img[data-kind="生活用品"] {
  background: linear-gradient(145deg, #0071E3, #38BDF8);
}

.product-img[data-kind="运动户外"] {
  background: linear-gradient(160deg, #0EA5E9, #67E8F9);
}

.product-img .product-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--radius-sm);
  color: var(--primary);
  background: rgba(255, 255, 255, 0.92);
  font-size: 30rpx;
  font-weight: 700;
}

.product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.product-info .title {
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.3rpx;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.seller-line {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  align-items: center;
}

.seller-tag {
  display: inline-flex;
  align-items: center;
  min-height: 36rpx;
  padding: 0 12rpx;
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: 600;
}

.seller-tag.name {
  color: var(--primary);
  background: var(--primary-bg);
}

.seller-tag.cat {
  color: var(--text-muted);
  background: var(--fill);
}

/* ===== Bottom Action Bar ===== */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
  padding: 18rpx var(--space-3);
  padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid var(--line);
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(20px);
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
  padding: 60rpx 30rpx;
  border-radius: var(--radius-md);
  background: var(--card);
  border: 1rpx solid var(--line);
  text-align: center;
}

.empty-state .empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: var(--radius-md);
  color: var(--primary);
  background: var(--primary-bg);
  font-size: var(--fs-xl);
  font-weight: 700;
}

.empty-state .empty-title {
  color: var(--text);
  font-size: 30rpx;
  font-weight: 700;
}

.empty-state .empty-desc {
  max-width: 440rpx;
  color: var(--text-muted);
  font-size: 26rpx;
  line-height: 1.55;
}

/* ===== Status Tabs ===== */
.status-tabs {
  display: flex;
  gap: 12rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.status-tabs .tab {
  flex-shrink: 0;
  min-height: 60rpx;
  padding: 0 var(--space-3);
  border: 1rpx solid var(--line);
  border-radius: var(--radius-full);
  color: var(--text-muted);
  background: var(--card);
  font-weight: 600;
  font-size: 26rpx;
}

.status-tabs .tab.active {
  color: #FFFFFF;
  background: var(--primary);
  border-color: var(--primary);
}

/* ===== Filter Chip Row ===== */
.filter-row {
  display: flex;
  gap: 12rpx;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4rpx;
}

.filter-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  min-height: 56rpx;
  padding: 0 20rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-full);
  background: var(--card);
  font-size: var(--fs-sm);
  font-weight: 600;
  justify-content: center;
}

.filter-chip .chip-label {
  color: var(--text-muted);
  font-size: var(--fs-xs);
}

.filter-chip .chip-value {
  color: var(--text);
  font-size: var(--fs-sm);
  font-weight: 700;
}

.filter-chip.active {
  border-color: var(--primary);
  background: var(--primary-bg);
}

.filter-reset {
  flex-shrink: 0;
  min-height: 56rpx;
  padding: 0 var(--space-3);
  border: 1rpx solid var(--line);
  border-radius: var(--radius-full);
  background: var(--card);
  color: var(--text-muted);
  font-weight: 600;
  font-size: var(--fs-sm);
}

/* ===== Banner ===== */
.banner {
  padding: 28rpx;
  border-radius: var(--radius-md);
  color: #FFFFFF;
  background: var(--primary);
  position: relative;
  overflow: hidden;
}

.banner .banner-kicker {
  display: inline-flex;
  margin-bottom: var(--space-2);
  padding: 6rpx 14rpx;
  border: 1rpx solid rgba(255,255,255,0.3);
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: rgba(255,255,255,0.9);
}

.banner h3 {
  margin: 0;
  font-size: 38rpx;
  font-weight: 800;
  letter-spacing: -0.3rpx;
}

.banner p {
  margin-top: 10rpx;
  color: rgba(255,255,255,0.85);
  line-height: 1.55;
}

/* Market Hero (首页卡片式) */
.market-hero {
  padding: 28rpx;
  border-radius: var(--radius-md);
  background: var(--card);
  border: 1rpx solid var(--line);
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
}

.market-hero .banner-kicker {
  color: var(--primary);
  border-color: rgba(0,113,227,0.2);
  background: var(--primary-bg);
}

.market-hero h3 {
  font-size: 42rpx;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.3rpx;
}

.market-hero p {
  color: var(--text-muted);
  opacity: 1;
}

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 20rpx;
}

.hero-chips .chip {
  display: inline-flex;
  align-items: center;
  min-height: 36rpx;
  padding: 0 14rpx;
  border-radius: var(--radius-full);
  color: var(--primary);
  background: var(--primary-bg);
  font-size: var(--fs-xs);
  font-weight: 600;
}

/* ===== Category Grid ===== */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  min-height: 130rpx;
  padding: var(--space-2) 10rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
  font-size: var(--fs-xs);
  font-weight: 600;
}

.category-item .cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
  border-radius: var(--radius-sm);
  color: var(--primary);
  background: var(--primary-bg);
  font-size: var(--fs-sm);
  font-weight: 700;
}

/* ===== Section Title ===== */
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: 6rpx;
}

.section-title h4 {
  font-size: 30rpx;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.3rpx;
}

.section-title .muted {
  margin: 4rpx 0 0;
}

/* ===== Profile Hero ===== */
.profile-hero {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 26rpx;
  border-radius: var(--radius-md);
  color: #FFFFFF;
  background: linear-gradient(135deg, #0071E3, #0EA5E9);
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
  color: #FFFFFF;
  font-size: var(--fs-xl);
  font-weight: 700;
  flex-shrink: 0;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.stat-item {
  text-align: center;
  padding: var(--space-2) 10rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
}

.stat-item .stat-num {
  display: block;
  color: var(--primary);
  font-size: var(--fs-lg);
  font-weight: 700;
}

.stat-item .stat-label {
  color: var(--text-muted);
  font-size: var(--fs-xs);
}

.profile-section {
  padding: var(--space-3);
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

/* ===== Order Card ===== */
.order-card {
  padding: var(--space-3);
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.order-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 10rpx;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12rpx;
  margin-top: var(--space-2);
}

/* ===== Timeline ===== */
.mini-timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8rpx;
  margin-top: 8rpx;
}

.mini-timeline .dot {
  padding: 10rpx 6rpx;
  border-radius: var(--radius-full);
  background: var(--fill);
  color: var(--text-muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  text-align: center;
}

.mini-timeline .dot.done {
  background: #EBFAF0;
  color: #1B7F3B;
}

/* ===== Message ===== */
.message-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  min-height: 140rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid var(--line);
  background: var(--card);
}

.message-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #0071E3, #0EA5E9);
  color: #FFFFFF;
  font-size: 30rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.message-main {
  flex: 1;
  min-width: 0;
}

.message-line {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.message-line .msg-name {
  font-size: 30rpx;
  font-weight: 600;
}

.message-line .msg-time {
  margin-left: auto;
  color: var(--text-muted);
  font-size: var(--fs-xs);
}

.message-preview {
  overflow: hidden;
  color: var(--text-muted);
  font-size: 26rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 6rpx;
}

.message-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  border-radius: var(--radius-md);
  background: linear-gradient(145deg, #0071E3, #38BDF8);
  color: #FFFFFF;
  flex-shrink: 0;
}

.message-unread {
  display: inline-block;
  min-height: 30rpx;
  padding: 2rpx 12rpx;
  border-radius: var(--radius-full);
  background: var(--red);
  color: #FFFFFF;
  font-size: var(--fs-xs);
  font-weight: 600;
  margin-top: 6rpx;
}

/* ===== Chat ===== */
.chat-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: var(--space-2);
}

.chat-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 18rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.chat-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: 12rpx 4rpx;
}

.chat-time {
  align-self: center;
  color: var(--text-muted);
  font-size: var(--fs-xs);
}

.chat-bubble {
  max-width: 76%;
  padding: 18rpx 22rpx;
  border-radius: 28rpx;
  font-size: var(--fs-md);
  line-height: 1.45;
  word-break: break-word;
}

.chat-bubble.incoming {
  border-bottom-left-radius: 8rpx;
  background: var(--card);
  box-shadow: var(--shadow-card);
  border: 1rpx solid var(--line);
  align-self: flex-start;
}

.chat-bubble.outgoing {
  border-bottom-right-radius: 8rpx;
  background: var(--primary-bg);
  color: var(--text);
  align-self: flex-end;
}

.chat-compose {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 14rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-full);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.chat-compose input {
  flex: 1;
  min-height: 68rpx;
  padding: 0 22rpx;
  border: 0;
  border-radius: var(--radius-full);
  outline: 0;
  background: var(--fill);
  font-size: var(--fs-md);
}

/* ===== Seller Card ===== */
.seller-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 20rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

/* ===== Wanted Card ===== */
.wanted-hero {
  padding: 28rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.wanted-card {
  position: relative;
  padding: var(--space-3);
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

.wanted-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 12rpx;
}

.wanted-meta-tag {
  padding: 8rpx 14rpx;
  border-radius: var(--radius-full);
  background: var(--primary-bg);
  color: var(--primary);
  font-size: var(--fs-xs);
  font-weight: 600;
}

/* ===== Floating Action ===== */
.floating-action {
  display: flex;
  align-items: center;
  gap: 10rpx;
  min-height: 76rpx;
  margin: 8rpx 0 0 auto;
  padding: 0 26rpx 0 18rpx;
  border: 0;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: #FFFFFF;
  font-weight: 600;
  font-size: 26rpx;
}

/* ===== Upload ===== */
.upload-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  min-height: 200rpx;
  border: 1rpx dashed var(--line);
  border-radius: var(--radius-md);
  background: var(--fill);
  color: var(--text-muted);
}

/* ===== Stepper ===== */
.stepper {
  display: flex;
  align-items: center;
  border-radius: var(--radius-full);
  background: var(--fill);
}

.stepper .step-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border: 0;
  background: transparent;
  color: var(--primary);
  font-size: var(--fs-lg);
  font-weight: 700;
}

.stepper .step-val {
  min-width: 52rpx;
  text-align: center;
  font-weight: 600;
  font-size: 26rpx;
}

/* ===== Link Row ===== */
.link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76rpx;
  color: var(--primary);
  font-weight: 600;
}

/* ===== Logout ===== */
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 76rpx;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: var(--fs-md);
}

/* ===== Choice Grid ===== */
.choice-field {
  margin-bottom: 20rpx;
}

.choice-field .choice-legend {
  color: var(--text-muted);
  font-size: var(--fs-sm);
  font-weight: 600;
  margin-bottom: 12rpx;
}

.choice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}

.choice-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 var(--space-2);
  border: 1rpx solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--card);
  color: var(--text-muted);
  font-size: 26rpx;
  font-weight: 600;
  text-align: center;
  transition: all 140ms ease;
}

.choice-pill.checked {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-bg);
}

/* ===== Post Card (seller) ===== */
.post-card {
  display: flex;
  gap: 18rpx;
  padding: 18rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

/* ===== Address Card ===== */
.address-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 120rpx;
  padding: 20rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-card);
}

/* ===== Range Selects ===== */
.range-field {
  padding: 18rpx;
  border: 1rpx solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--fill);
  margin-bottom: 20rpx;
}

.range-selects {
  display: flex;
  align-items: flex-end;
  gap: 12rpx;
}

.range-selects .range-col {
  flex: 1;
  min-width: 0;
}

.range-separator {
  display: flex;
  align-items: flex-end;
  min-height: 76rpx;
  color: var(--text-muted);
  font-weight: 700;
}

.range-result {
  margin-top: 6rpx;
  padding: 14rpx 18rpx;
  border-radius: var(--radius-sm);
  color: var(--primary);
  background: var(--primary-bg);
  font-size: var(--fs-sm);
  font-weight: 700;
}
```

- [ ] **Step 2: 验证 app.wxss 无语法错误**

打开微信开发者工具，确认无 CSS 报错。

- [ ] **Step 3: Commit**

```bash
git add miniprogram/app.wxss
git commit -m "refactor: 全局样式重写 — 暖绿黄→Bento Box 冷灰蓝 token

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 2: 更新 app.json — 导航栏 + TabBar 配色

**Files:**
- Modify: `miniprogram/app.json`

- [ ] **Step 1: 更新 window 和 tabBar 配色**

将 `miniprogram/app.json` 中的以下字段替换：

```json
"window": {
  "navigationBarTitleText": "校园二手",
  "navigationBarBackgroundColor": "#F5F5F7",
  "navigationBarTextStyle": "black",
  "backgroundColor": "#F5F5F7"
},
"tabBar": {
  "color": "#86868B",
  "selectedColor": "#0071E3",
  "backgroundColor": "#FFFFFF",
  "borderStyle": "white",
  "list": [
    { "pagePath": "pages/home/index", "text": "首页", "iconPath": "", "selectedIconPath": "" },
    { "pagePath": "pages/wanted/index", "text": "求购", "iconPath": "", "selectedIconPath": "" },
    { "pagePath": "pages/cart/index", "text": "购物车", "iconPath": "", "selectedIconPath": "" },
    { "pagePath": "pages/messages/index", "text": "消息", "iconPath": "", "selectedIconPath": "" },
    { "pagePath": "pages/profile/index", "text": "我的", "iconPath": "", "selectedIconPath": "" }
  ]
}
```

改动点：`navigationBarBackgroundColor` `#f7f3e8`→`#F5F5F7`，`selectedColor` `#0c5c42`→`#0071E3`，`color` `#7a7f86`→`#86868B`

- [ ] **Step 2: Commit**

```bash
git add miniprogram/app.json
git commit -m "style: 导航栏/tabBar 配色对齐 Bento Box 风格

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: P0 核心页面（6 页）

所有 P0 页面改造模式一致：WXML 中替换 emoji 为 icon-text + 去除内联旧色值（如 `var(--market-*)` 引用和硬编码旧色值）。WXSS/JS 不改。

### Task 3: 首页 — home

**Files:**
- Modify: `miniprogram/pages/home/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

将 `miniprogram/pages/home/index.wxml` 中：
- 搜索 icon 的 emoji `🔍` → 文字 `⌕`
- 分类 item 中的 emoji `📖` `📱` `🏠` `⚽` `🔍` `🆕` → 对应的 Unicode 符号或纯文字首字
- banner 中 `卖闲置` 按钮的行内 `style="position:absolute;right:20rpx;top:20rpx;color:#112219;background:#ffd45a;box-shadow:..."` → 去除 style 中的旧色值引用，改用全局类
- 空状态 icon `🔍` → `⌕`

改动后的 WXML：

```xml
<view class="page stack">
  <view class="soft-search">
    <view class="search-icon">⌕</view>
    <input placeholder="搜索教材、台灯、耳机…" value="{{keyword}}" bindinput="onKeyword" confirm-type="search" bindconfirm="loadProducts" />
    <button class="search-action" bindtap="loadProducts">搜索</button>
  </view>

  <view class="market-hero">
    <view class="banner-kicker">校园市集</view>
    <h3>毕业季闲置市集</h3>
    <p>教材、台灯、耳机和宿舍好物都在一个小程序里买卖。</p>
    <view class="hero-chips">
      <view class="chip">本周新增 38 件</view>
      <view class="chip">线下自提</view>
      <view class="chip">学生交易</view>
    </view>
    <button class="btn primary small" style="position:absolute;right:20rpx;top:20rpx" bindtap="goSeller">卖闲置</button>
  </view>

  <view class="category-grid">
    <block wx:for="{{categories}}" wx:key="id">
      <view class="category-item" bindtap="chooseCategory" data-id="{{item.id}}">
        <view class="cat-icon">{{item.iconText || '#'}}</view>
        <text>{{item.name}}</text>
      </view>
    </block>
    <view class="category-item" bindtap="goWanted">
      <view class="cat-icon">⌕</view>
      <text>求购专区</text>
    </view>
    <view class="category-item" bindtap="goAllLatest">
      <view class="cat-icon">⬆</view>
      <text>最新上架</text>
    </view>
  </view>

  <view class="section-title">
    <view>
      <h4>同学正在转</h4>
      <text class="muted">按距离、价格和发布时间综合推荐</text>
    </view>
    <button class="btn small" bindtap="goAll">查看全部</button>
  </view>

  <block wx:for="{{products}}" wx:key="id">
    <view class="product-card" bindtap="goDetail" data-id="{{item.id}}">
      <view class="product-img" data-kind="{{item.categoryName}}">
        <view class="product-mark">{{item.categoryName === '教材资料' ? '教' : item.categoryName === '数码电子' ? '数' : item.categoryName === '生活用品' ? '生' : '物'}}</view>
        <text>{{item.categoryName}}</text>
      </view>
      <view class="product-info">
        <view class="row">
          <text class="title">{{item.title}}</text>
          <view wx:if="{{item.status === 'STOCK_OUT'}}" class="badge danger">库存不足</view>
        </view>
        <view class="row">
          <text class="price">¥{{item.price}}</text>
          <view class="badge success">{{item.conditionLevel}}</view>
        </view>
        <text class="muted">{{item.pickupLocation}} · 库存 {{item.stock}}</text>
        <view class="seller-line">
          <view class="seller-tag name">{{item.sellerNickname}}</view>
          <view class="seller-tag cat">{{item.categoryName}}</view>
        </view>
      </view>
    </view>
  </block>

  <view wx:if="{{products.length === 0}}" class="empty-state">
    <view class="empty-icon">⌕</view>
    <text class="empty-title">暂无商品</text>
    <text class="empty-desc">换个分类看看，或发布求购让同学主动联系你。</text>
    <button class="btn primary" bindtap="goWanted">去求购</button>
  </view>
</view>
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/home/index.wxml
git commit -m "style(home): emoji→文本图标 + 移除旧色值

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 4: 商品详情 — detail

**Files:**
- Modify: `miniprogram/pages/detail/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

```xml
<view class="page stack" wx:if="{{product}}" style="padding-bottom:120rpx">
  <view class="product-img large-img" data-kind="{{product.categoryName}}" style="width:100%;height:380rpx">
    <view class="product-mark" style="width:100rpx;height:100rpx;font-size:40rpx">{{product.categoryName === '教材资料' ? '教' : product.categoryName === '数码电子' ? '数' : product.categoryName === '生活用品' ? '生' : '物'}}</view>
    <text>{{product.categoryName}}</text>
  </view>

  <view class="screen-card stack">
    <view class="row">
      <text class="name" style="font-size:34rpx">{{product.title}}</text>
      <view wx:if="{{!canBuy}}" class="badge danger">{{product.status === 'STOCK_OUT' ? '库存不足' : '已下架'}}</view>
    </view>
    <view class="row">
      <text class="price">¥{{product.price}}</text>
      <view class="badge success">{{product.conditionLevel}}</view>
    </view>
    <text class="muted">库存 {{product.stock}} · {{product.pickupLocation}} · 发布者 {{product.sellerNickname || '同学'}}</text>
    <text>{{product.description}}</text>
    <view class="link-row" bindtap="goWanted">
      <text>想要类似商品</text>
      <text style="font-weight:700">去求购 →</text>
    </view>
  </view>

  <view class="seller-card">
    <view class="profile-avatar" style="width:80rpx;height:80rpx;font-size:30rpx">{{product.sellerNickname ? product.sellerNickname[0] : '同'}}</view>
    <view style="flex:1">
      <text style="font-weight:700;font-size:30rpx">{{product.sellerNickname || '同学'}}</text>
      <view class="muted">校内当面交易 · {{product.pickupLocation}}</view>
    </view>
    <view class="badge success">学生认证</view>
  </view>

  <view class="bottom-action-bar">
    <button class="btn small ghost" style="flex-shrink:0;min-width:80rpx" bindtap="toggleFavorite">
      {{favorite ? '♥' : '♡'}}
    </button>
    <button class="btn ghost" style="flex:1" bindtap="sendMessage">聊一聊</button>
    <button class="btn" style="flex:1" bindtap="addCart">加购物车</button>
    <button class="btn primary" style="flex:1" bindtap="buyNow" disabled="{{!canBuy}}">立即购买</button>
  </view>
</view>
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/detail/index.wxml
git commit -m "style(detail): emoji→文本图标 + 移除旧色值

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 5: 登录 — login

**Files:**
- Modify: `miniprogram/pages/login/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

```xml
<view class="page stack">
  <view class="banner">
    <view class="banner-kicker">校园二手交易</view>
    <h3>欢迎回来</h3>
    <p>学生认证后可下单、收藏、发布求购。</p>
  </view>

  <view class="form-card">
    <view class="field">
      <text class="field-label">手机号/账号</text>
      <input class="input" placeholder="student01" value="{{username}}" bindinput="onUsername" />
    </view>
    <view class="field">
      <text class="field-label">验证码或密码</text>
      <input class="input" placeholder="123456" password value="{{password}}" bindinput="onPassword" />
    </view>
    <button class="btn primary" style="width:100%" bindtap="login">登录</button>
    <button class="btn ghost" style="width:100%" bindtap="register">注册</button>
    <button class="btn" style="width:100%; background:transparent; border:0; color:var(--text-muted)" bindtap="guestBrowse">游客浏览</button>
  </view>
</view>
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/login/index.wxml
git commit -m "style(login): 移除内联旧色值

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 6: 购物车 — cart

**Files:**
- Modify: `miniprogram/pages/cart/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

```xml
<view class="page stack" style="padding-bottom:120rpx">
  <block wx:for="{{items}}" wx:key="id">
    <view class="product-card">
      <view class="product-img" data-kind="生活用品">
        <view class="product-mark">#</view>
        <text>商品</text>
      </view>
      <view class="product-info">
        <view class="row">
          <text class="title">商品 #{{item.productId}}</text>
          <text class="badge">{{item.checked !== false ? '已选' : '未选'}}</text>
        </view>
        <view class="row">
          <text class="muted">数量 {{item.quantity}}</text>
          <text class="price" style="font-size:32rpx">¥{{item.price || 0}}</text>
        </view>
        <view class="row">
          <view class="stepper">
            <view class="step-btn" bindtap="decrease" data-id="{{item.id}}">-</view>
            <text class="step-val">{{item.quantity}}</text>
            <view class="step-btn" bindtap="increase" data-id="{{item.id}}">+</view>
          </view>
          <view class="btn small danger" bindtap="remove" data-id="{{item.id}}">删除</view>
        </view>
      </view>
    </view>
  </block>
  <view wx:if="{{items.length === 0}}" class="empty-state">
    <view class="empty-icon">C</view>
    <text class="empty-title">购物车为空</text>
    <text class="empty-desc">看到喜欢的校园好物，可以先加入购物车再一起结算。</text>
    <button class="btn primary" bindtap="goHome">去逛逛</button>
  </view>
  <view wx:if="{{items.length > 0}}" class="bottom-action-bar">
    <view>
      <text class="muted">共 {{items.length}} 件</text>
      <text class="price" style="display:block">¥{{totalPrice}}</text>
    </view>
    <button class="btn primary" bindtap="checkout" disabled="{{items.length === 0}}">结算</button>
  </view>
</view>
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/cart/index.wxml
git commit -m "style(cart): emoji→文本图标 + 移除旧色值

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 7: 个人中心 — profile

**Files:**
- Modify: `miniprogram/pages/profile/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

```xml
<view class="page stack">
  <view class="profile-hero">
    <view class="profile-avatar">{{user ? user.nickname[0] : '游'}}</view>
    <view style="flex:1">
      <text style="display:block;font-size:34rpx;font-weight:800">{{user ? user.nickname : '游客'}}</text>
      <text style="font-size:24rpx;opacity:0.85">{{user ? user.role : '登录后可下单、发布和查看订单'}}</text>
    </view>
    <text wx:if="{{user}}" class="badge" style="background:rgba(255,255,255,0.25);color:#fff">已登录</text>
  </view>

  <view wx:if="{{!user}}">
    <button class="btn primary" style="width:100%" bindtap="login">登录</button>
  </view>

  <view wx:if="{{user}}">
    <view class="profile-stats">
      <view class="stat-item">
        <text class="stat-num">3</text><text class="stat-label">买入</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">12</text><text class="stat-label">发布</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">2</text><text class="stat-label">卖出</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">1</text><text class="stat-label">求购</text>
      </view>
    </view>

    <view class="profile-section" style="margin-top:20rpx">
      <text style="font-weight:700;font-size:28rpx;display:block;margin-bottom:16rpx">交易</text>
      <view class="grid-2">
        <view class="category-item" bindtap="goOrders">
          <view class="cat-icon">B</view>
          <text>买入订单</text>
        </view>
        <view class="category-item" bindtap="goWanted">
          <view class="cat-icon">⌕</view>
          <text>我的求购</text>
        </view>
      </view>
    </view>

    <view class="profile-section" style="margin-top:20rpx">
      <view class="row" style="margin-bottom:16rpx">
        <text style="font-weight:700;font-size:28rpx">我的校园摊位</text>
        <button class="btn primary small" bindtap="goSeller">卖闲置</button>
      </view>
      <view class="grid-2">
        <view class="category-item" bindtap="goPosts">
          <view class="cat-icon">P</view>
          <text>我的发布</text>
        </view>
        <view class="category-item" bindtap="goSellerOrders">
          <view class="cat-icon">O</view>
          <text>卖出订单</text>
        </view>
      </view>
    </view>

    <view class="profile-section" style="margin-top:20rpx">
      <text style="font-weight:700;font-size:28rpx;display:block;margin-bottom:16rpx">工具</text>
      <view class="grid-2">
        <view class="category-item" bindtap="goFavorites">
          <view class="cat-icon">★</view>
          <text>收藏</text>
        </view>
        <view class="category-item" bindtap="goAddress">
          <view class="cat-icon">⌖</view>
          <text>地址</text>
        </view>
      </view>
    </view>

    <button class="logout-btn" bindtap="logout">退出登录</button>
  </view>
</view>
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/profile/index.wxml
git commit -m "style(profile): emoji→文本图标 + 头像样式更新

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 8: 求购大厅 — wanted

**Files:**
- Modify: `miniprogram/pages/wanted/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

```xml
<view class="page stack">
  <view class="wanted-hero">
    <text class="badge blue" style="margin-bottom:16rpx">求购专区</text>
    <text style="display:block;font-size:34rpx;font-weight:700;letter-spacing:-0.3rpx">同学们正在找</text>
    <text class="muted">看到你有的物品，直接联系对方。</text>
  </view>

  <view class="filter-row">
    <view class="filter-chip active">
      <text class="chip-label">排序</text>
      <text class="chip-value">最新发布</text>
    </view>
    <view class="filter-chip">
      <text class="chip-label">预算</text>
      <text class="chip-value">全部预算</text>
    </view>
    <view class="filter-chip">
      <text class="chip-label">成色</text>
      <text class="chip-value">全部要求</text>
    </view>
  </view>

  <block wx:for="{{posts}}" wx:key="id">
    <view class="wanted-card" bindtap="viewDetail" data-id="{{item.id}}">
      <text class="badge blue">{{item.status || '展示中'}}</text>
      <text style="display:block;margin-top:14rpx;font-size:30rpx;font-weight:700">{{item.title}}</text>
      <text class="muted">{{item.description}}</text>
      <view class="wanted-meta-row">
        <text class="wanted-meta-tag">{{item.userNickname || '同学'}}</text>
        <text class="wanted-meta-tag">预算 ¥{{item.minPrice}}-{{item.maxPrice}}</text>
        <text class="wanted-meta-tag">{{item.conditionLevel}}</text>
      </view>
    </view>
  </block>

  <view wx:if="{{posts.length === 0}}" class="empty-state">
    <view class="empty-icon">⌕</view>
    <text class="empty-title">暂无求购</text>
    <text class="empty-desc">还没有同学发布求购，可以先发起一个需求。</text>
    <button class="btn primary" bindtap="goPublish">发起求购</button>
  </view>

  <view class="floating-action" bindtap="goPublish">
    <text style="font-size:32rpx;margin-right:4rpx">+</text>
    <text>发求购</text>
  </view>
</view>
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/wanted/index.wxml
git commit -m "style(wanted): emoji→文本图标 + 卡片配色更新

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: P1 交易页面（12 页）

### Task 9: 分类列表 — list

**Files:**
- Modify: `miniprogram/pages/list/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

读取 `miniprogram/pages/list/index.wxml`，将所有 emoji 替换为文本 icon，所有内联样式引用 `var(--market-*)` 的改为 `var(--primary)` 或 `var(--text-muted)`。

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/list/index.wxml
git commit -m "style(list): emoji 清理 + 色值更新"
```

### Task 10: 确认订单 — confirm

**Files:**
- Modify: `miniprogram/pages/confirm/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

替换 emoji `📍` `📖` → 文本 icon，去除 inline `color:var(--market-deep)` → `color:var(--primary)`

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/confirm/index.wxml
git commit -m "style(confirm): emoji 清理 + 色值更新"
```

### Task 11: 订单列表 — orders

**Files:**
- Modify: `miniprogram/pages/orders/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

替换 emoji `📦` → `O`

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/orders/index.wxml
git commit -m "style(orders): emoji 清理"
```

### Task 12: 订单详情 — order-detail

**Files:**
- Modify: `miniprogram/pages/order-detail/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/order-detail/index.wxml
git commit -m "style(order-detail): emoji 清理 + 色值更新"
```

### Task 13: 求购发布 — wanted-publish

**Files:**
- Modify: `miniprogram/pages/wanted-publish/index.wxml`

- [ ] **Step 1: 清理内联旧色值**

该页无 emoji，仅需确认无 `var(--market-*)` 引用

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/wanted-publish/index.wxml
git commit -m "style(wanted-publish): 色值更新"
```

### Task 14: 求购详情 — wanted-detail

**Files:**
- Modify: `miniprogram/pages/wanted-detail/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/wanted-detail/index.wxml
git commit -m "style(wanted-detail): emoji 清理 + 色值更新"
```

### Task 15: 消息列表 — messages

**Files:**
- Modify: `miniprogram/pages/messages/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

替换 emoji `💬` → `M`，去除内联旧色值

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/messages/index.wxml
git commit -m "style(messages): emoji 清理"
```

### Task 16: 聊天 — chat

**Files:**
- Modify: `miniprogram/pages/chat/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/chat/index.wxml
git commit -m "style(chat): emoji 清理 + 色值更新"
```

### Task 17: 卖家摊位 — seller

**Files:**
- Modify: `miniprogram/pages/seller/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

替换 emoji `📦` `📋` `📦` `🏪` → `P` `L` `O` `S`，去除 banner 内联 `background:linear-gradient(135deg,#0c5c42,#18a66b)` → 使用 `.banner` 全局类

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/seller/index.wxml
git commit -m "style(seller): emoji 清理 + banner 色值更新"
```

### Task 18: 发布商品 — seller-publish

**Files:**
- Modify: `miniprogram/pages/seller-publish/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

替换 emoji `📷` → 文字 `+`

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/seller-publish/index.wxml
git commit -m "style(seller-publish): emoji 清理"
```

### Task 19: 我的发布 — seller-posts

**Files:**
- Modify: `miniprogram/pages/seller-posts/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/seller-posts/index.wxml
git commit -m "style(seller-posts): emoji 清理 + 色值更新"
```

### Task 20: 卖出订单 — seller-orders

**Files:**
- Modify: `miniprogram/pages/seller-orders/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/seller-orders/index.wxml
git commit -m "style(seller-orders): emoji 清理 + 色值更新"
```

---

## Phase 4: P2 辅助页面（6 页）

### Task 21: 评价 — review

**Files:**
- Modify: `miniprogram/pages/review/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/review/index.wxml
git commit -m "style(review): emoji 清理"
```

### Task 22: 收藏 — favorites

**Files:**
- Modify: `miniprogram/pages/favorites/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/favorites/index.wxml
git commit -m "style(favorites): emoji 清理"
```

### Task 23: 地址管理 — address

**Files:**
- Modify: `miniprogram/pages/address/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

替换 emoji `📍` → `⌖`

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/address/index.wxml
git commit -m "style(address): emoji 清理"
```

### Task 24: 发货 — seller-ship

**Files:**
- Modify: `miniprogram/pages/seller-ship/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/seller-ship/index.wxml
git commit -m "style(seller-ship): emoji 清理"
```

### Task 25: 退款 — seller-refund

**Files:**
- Modify: `miniprogram/pages/seller-refund/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/seller-refund/index.wxml
git commit -m "style(seller-refund): emoji 清理"
```

### Task 26: 店铺 — seller-shop

**Files:**
- Modify: `miniprogram/pages/seller-shop/index.wxml`

- [ ] **Step 1: 清理 emoji 和内联旧色值**

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/seller-shop/index.wxml
git commit -m "style(seller-shop): emoji 清理"
```

---

## 验证清单

全部 26 个 Task 完成后，在微信开发者工具中执行：

- [ ] 所有 24 个页面无 emoji 残留
- [ ] 所有页面无 `var(--market-*)` 旧 token 引用
- [ ] 所有页面无硬编码 `#f7f3e8` `#18a66b` `#0c5c42` `#ffd45a` 旧色值
- [ ] tabBar 选中色为蓝色 `#0071E3`
- [ ] 导航栏背景色为 `#F5F5F7`
- [ ] 无 JS 文件被改动
- [ ] 无新增页面文件
