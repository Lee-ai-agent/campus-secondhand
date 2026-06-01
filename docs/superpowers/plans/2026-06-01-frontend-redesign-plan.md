# 前端设计系统重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将小程序端和管理后台前端完全对齐原型 `prototypes/second-hand-campus/` 的设计语言和页面结构。

**Architecture:** 设计系统先行 — 先建 WXSS 全局样式和 CSS 变量体系，再逐页改造。小程序端纯 WXML/WXSS/JS 改造（不引入第三方 UI 库），管理后台保留 Element Plus 做表格/表单但用自定义 CSS 覆盖样式。

**Tech Stack:** 微信小程序原生框架 (WXML/WXSS/JS) + Vue 3 + Element Plus + Vite

**原型参考:** `prototypes/second-hand-campus/` — styles.css (3299行), mini-pages.js, seller-pages.js, admin-pages.js, ui-components.js

---

## Phase 1: 设计系统基础

### Task 1: 小程序全局样式 — 设计 Token

**Files:**
- Modify: `miniprogram/app.wxss` (完全重写)

- [ ] **Step 1: 重写 app.wxss — 设计变量 + 全局类**

用以下内容完全替换 `miniprogram/app.wxss`：

```css
/* ===== Design Tokens ===== */
page {
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
  --shadow-soft: 0 10rpx 28rpx rgba(24, 73, 53, 0.1);
  --shadow-card: 0 10rpx 24rpx rgba(62, 76, 57, 0.08);
  --shadow-float: 0 14rpx 28rpx rgba(48, 65, 55, 0.1);
  --shadow-heavy: 0 18rpx 34rpx rgba(13, 96, 70, 0.2);
  --radius-sm: 8rpx;
  --radius-md: 12rpx;
  --radius-lg: 18rpx;
  --radius-full: 999rpx;

  background: var(--market-paper);
  color: var(--market-ink);
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
}

/* ===== Layout ===== */
.page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

/* ===== Cards ===== */
.card {
  background: var(--market-panel);
  border-radius: var(--radius-md);
  padding: 24rpx;
  box-shadow: var(--shadow-card);
}

.screen-card {
  background: var(--market-panel);
  border: 1rpx solid rgba(13, 96, 70, 0.11);
  border-radius: var(--radius-md);
  padding: 24rpx;
  box-shadow: var(--shadow-card);
}

/* ===== Typography ===== */
.muted {
  color: var(--market-muted);
  font-size: 24rpx;
}

.price {
  color: var(--market-red);
  font-size: 36rpx;
  font-weight: 800;
}

.name {
  font-size: 32rpx;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 40rpx;
  padding: 0 16rpx;
  border: 1rpx solid rgba(13, 96, 70, 0.14);
  border-radius: var(--radius-full);
  color: var(--market-deep);
  background: #ecf9f2;
  font-size: 22rpx;
  font-weight: 800;
}

/* ===== Buttons ===== */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80rpx;
  padding: 0 28rpx;
  border: 1rpx solid rgba(13, 96, 70, 0.14);
  border-radius: var(--radius-full);
  background: var(--market-panel);
  color: var(--market-ink);
  font-weight: 800;
  font-size: 28rpx;
}

.btn.primary {
  border-color: #f1c13b;
  color: #16231f;
  background: var(--market-yellow);
  box-shadow: 0 10rpx 18rpx rgba(158, 107, 0, 0.18);
}

.btn.ghost {
  color: var(--market-deep);
  background: #ecf8f1;
  border-color: rgba(34, 160, 107, 0.18);
}

.btn.danger {
  border-color: var(--market-red);
  color: #fff;
  background: var(--market-red);
}

.btn.small {
  min-height: 60rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
}

/* ===== Badge / Status ===== */
.badge {
  display: inline-flex;
  align-items: center;
  min-height: 40rpx;
  padding: 0 14rpx;
  border-radius: var(--radius-full);
  font-size: 22rpx;
  font-weight: 700;
}

.badge.success {
  color: var(--market-deep);
  background: #e7f7ef;
}

.badge.warn {
  color: #8b5d08;
  background: #fff3d6;
}

.badge.danger {
  color: #a73535;
  background: #ffe4e2;
}

.badge.blue {
  color: #255fac;
  background: #e6efff;
}

/* ===== Tags ===== */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 8rpx 18rpx;
  border-radius: var(--radius-full);
  background: #eaf7ef;
  color: var(--market-deep);
  font-size: 22rpx;
  font-weight: 700;
}

.tag.active {
  background: var(--market-deep);
  color: #fff;
}

/* ===== Inputs ===== */
.input {
  width: 100%;
  min-height: 76rpx;
  padding: 0 24rpx;
  border: 1rpx solid rgba(13, 96, 70, 0.14);
  border-radius: var(--radius-md);
  background: #fbfefd;
  box-sizing: border-box;
  font-size: 28rpx;
}

.textarea {
  width: 100%;
  min-height: 140rpx;
  padding: 20rpx 24rpx;
  border: 1rpx solid rgba(13, 96, 70, 0.14);
  border-radius: var(--radius-md);
  background: #fbfefd;
  box-sizing: border-box;
  font-size: 28rpx;
}

/* ===== Form ===== */
.form-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
  padding: 24rpx;
  box-shadow: var(--shadow-card);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 20rpx;
}

.field-label {
  color: var(--market-muted);
  font-size: 24rpx;
  font-weight: 700;
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
  border: 1rpx solid rgba(15, 91, 65, 0.12);
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--shadow-float);
}

.soft-search .search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: var(--radius-md);
  color: #fff;
  background: linear-gradient(135deg, #0d6046, #20a36d);
  font-size: 28rpx;
  font-weight: 900;
  flex-shrink: 0;
}

.soft-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #12291f;
  font-size: 28rpx;
  font-weight: 700;
}

.soft-search .search-action {
  flex-shrink: 0;
  min-width: 100rpx;
  min-height: 64rpx;
  padding: 0 24rpx;
  border: 0;
  border-radius: var(--radius-full);
  color: #13251c;
  background: var(--market-yellow);
  font-weight: 900;
  font-size: 26rpx;
  box-shadow: 0 8rpx 16rpx rgba(158, 107, 0, 0.17);
}

/* ===== Product Card ===== */
.product-card {
  display: flex;
  gap: 18rpx;
  padding: 18rpx;
  border: 1rpx solid rgba(35, 87, 66, 0.08);
  border-radius: var(--radius-md);
  background: #fffdf8;
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
  color: #fff;
  font-size: 22rpx;
  font-weight: 900;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.product-img[data-kind="教材资料"] {
  background: linear-gradient(160deg, #2f775e, #f2d38c);
}

.product-img[data-kind="数码电子"] {
  background: linear-gradient(145deg, #2c5d9e, #54bdd1);
}

.product-img[data-kind="生活用品"] {
  background: linear-gradient(145deg, #bf7b32, #28a66d);
}

.product-img[data-kind="运动户外"] {
  background: linear-gradient(160deg, #1c8a62, #9fd7a0);
}

.product-img .product-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--radius-sm);
  color: var(--market-deep);
  background: rgba(255, 255, 255, 0.9);
  font-size: 30rpx;
  font-weight: 900;
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
  font-weight: 900;
  line-height: 1.35;
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
  font-size: 22rpx;
  font-weight: 800;
}

.seller-tag.name {
  color: var(--market-deep);
  background: #e5f7ee;
}

.seller-tag.cat {
  color: #335f91;
  background: #e8f2ff;
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
  padding: 18rpx 24rpx;
  padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid rgba(14, 91, 66, 0.1);
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 -12rpx 24rpx rgba(29, 63, 46, 0.08);
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
  padding: 60rpx 30rpx;
  border: 1rpx dashed rgba(13, 96, 70, 0.14);
  border-radius: var(--radius-md);
  background: #fbfaf5;
  text-align: center;
}

.empty-state .empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
  color: var(--market-deep);
  background: #e9f8ef;
  font-size: 36rpx;
  font-weight: 900;
}

.empty-state .empty-title {
  color: #17231f;
  font-size: 30rpx;
  font-weight: 800;
}

.empty-state .empty-desc {
  max-width: 440rpx;
  color: var(--market-muted);
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
  padding: 0 24rpx;
  border: 0;
  border-radius: var(--radius-full);
  color: #52615b;
  background: rgba(255, 255, 255, 0.86);
  font-weight: 800;
  font-size: 26rpx;
}

.status-tabs .tab.active {
  color: #13251c;
  background: var(--market-yellow);
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
  align-items: center;
  gap: 6rpx;
  flex-shrink: 0;
  padding: 0 20rpx;
  min-height: 56rpx;
  border: 1rpx solid rgba(14, 91, 66, 0.1);
  border-radius: var(--radius-full);
  background: #fffef9;
  font-size: 24rpx;
  font-weight: 800;
}

.filter-chip .chip-label {
  color: #758179;
  font-size: 20rpx;
}

.filter-chip .chip-value {
  color: #254137;
  font-size: 24rpx;
  font-weight: 900;
}

.filter-chip.active {
  border-color: rgba(18, 129, 91, 0.18);
  background: #eaf8ef;
}

.filter-reset {
  flex-shrink: 0;
  min-height: 56rpx;
  padding: 0 24rpx;
  border: 1rpx solid rgba(14, 91, 66, 0.1);
  border-radius: var(--radius-full);
  background: #fff;
  color: #4f5d57;
  font-weight: 800;
  font-size: 24rpx;
}

/* ===== Banner ===== */
.banner {
  padding: 28rpx;
  border-radius: var(--radius-md);
  color: #fff;
  background: linear-gradient(135deg, rgba(13, 96, 70, 0.96), rgba(34, 160, 107, 0.9)), #0d6046;
  box-shadow: var(--shadow-heavy);
  position: relative;
  overflow: hidden;
}

.banner .banner-kicker {
  display: inline-flex;
  margin-bottom: 16rpx;
  padding: 6rpx 14rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.34);
  border-radius: var(--radius-full);
  font-size: 20rpx;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
}

.banner h3 {
  margin: 0;
  font-size: 38rpx;
  font-weight: 900;
}

.banner p {
  margin-top: 10rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.55;
}

/* Market Hero (首页黄色banner) */
.market-hero {
  padding: 28rpx;
  border-radius: var(--radius-md);
  color: #10251c;
  background: radial-gradient(circle at 86% 22%, rgba(255,255,255,0.62) 0 13%, transparent 14%),
              linear-gradient(135deg, #ffe08a 0%, #fff1bf 38%, #8ee0b6 100%);
  box-shadow: 0 16rpx 34rpx rgba(84, 92, 54, 0.16);
  position: relative;
  overflow: hidden;
}

.market-hero .banner-kicker {
  color: var(--market-deep);
  border-color: rgba(12, 92, 66, 0.24);
  background: rgba(255, 255, 255, 0.45);
}

.market-hero h3 {
  font-size: 42rpx;
  color: #0f3023;
}

.market-hero p {
  color: #315145;
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
  color: #0f4a36;
  background: rgba(255, 255, 255, 0.7);
  font-size: 20rpx;
  font-weight: 800;
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
  padding: 16rpx 10rpx;
  border: 1rpx solid rgba(13, 96, 70, 0.1);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 8rpx 20rpx rgba(24, 73, 53, 0.06);
  font-size: 22rpx;
  font-weight: 800;
}

.category-item .cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
  border-radius: var(--radius-sm);
  color: var(--market-deep);
  background: linear-gradient(135deg, #e4f7ec, #fff7df);
  font-size: 24rpx;
  font-weight: 900;
}

/* ===== Section Title ===== */
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-top: 6rpx;
}

.section-title h4 {
  font-size: 30rpx;
  font-weight: 800;
  margin: 0;
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
  color: #f8fff9;
  background: linear-gradient(135deg, rgba(16,63,49,0.96), rgba(24,166,107,0.92));
  box-shadow: var(--shadow-heavy);
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: var(--market-yellow);
  color: #113425;
  font-size: 36rpx;
  font-weight: 900;
  flex-shrink: 0;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.stat-item {
  text-align: center;
  padding: 16rpx 10rpx;
  border: 1rpx solid rgba(12, 92, 66, 0.1);
  border-radius: var(--radius-md);
  background: #fffdf8;
}

.stat-item .stat-num {
  display: block;
  color: var(--market-deep);
  font-size: 32rpx;
  font-weight: 900;
}

.stat-item .stat-label {
  color: #6c776f;
  font-size: 22rpx;
}

.profile-section {
  padding: 24rpx;
  border: 1rpx solid rgba(35, 87, 66, 0.08);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--shadow-card);
}

/* ===== Order Card ===== */
.order-card {
  padding: 24rpx;
  border: 1rpx solid rgba(35, 87, 66, 0.08);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.88);
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
  margin-top: 16rpx;
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
  background: #f0f2ef;
  color: #748078;
  font-size: 20rpx;
  font-weight: 800;
  text-align: center;
}

.mini-timeline .dot.done {
  background: #e5f7ee;
  color: var(--market-deep);
}

/* ===== Message ===== */
.message-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  min-height: 140rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #eceee9;
  background: #fff;
}

.message-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9) 0 12%, transparent 13%),
              linear-gradient(145deg, #ffe56d, #b8ead3);
  color: #103f31;
  font-size: 30rpx;
  font-weight: 800;
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
  font-weight: 700;
}

.message-line .msg-time {
  margin-left: auto;
  color: #8a8f8c;
  font-size: 22rpx;
}

.message-preview {
  overflow: hidden;
  color: #7d8580;
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
  border-radius: 20rpx;
  background: linear-gradient(145deg, #2f775e, #f2d38c);
  color: #fff;
  flex-shrink: 0;
}

.message-unread {
  display: inline-block;
  min-height: 30rpx;
  padding: 2rpx 12rpx;
  border-radius: var(--radius-full);
  background: #ef5650;
  color: #fff;
  font-size: 20rpx;
  font-weight: 700;
  margin-top: 6rpx;
}

/* ===== Chat ===== */
.chat-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: 16rpx;
}

.chat-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 18rpx;
  border: 1rpx solid rgba(48, 110, 86, 0.12);
  border-radius: 24rpx;
  background: #fff;
  box-shadow: var(--shadow-card);
}

.chat-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 12rpx 4rpx;
}

.chat-time {
  align-self: center;
  color: #9aa19c;
  font-size: 22rpx;
}

.chat-bubble {
  max-width: 76%;
  padding: 18rpx 22rpx;
  border-radius: 28rpx;
  font-size: 28rpx;
  line-height: 1.45;
  word-break: break-word;
}

.chat-bubble.incoming {
  border-bottom-left-radius: 8rpx;
  background: #fff;
  box-shadow: 0 6rpx 18rpx rgba(42, 54, 48, 0.06);
  align-self: flex-start;
}

.chat-bubble.outgoing {
  border-bottom-right-radius: 8rpx;
  background: #d9f5e5;
  color: #0d3324;
  align-self: flex-end;
}

.chat-compose {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 14rpx;
  border: 1rpx solid #eceee9;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -8rpx 18rpx rgba(42, 54, 48, 0.05);
}

.chat-compose input {
  flex: 1;
  min-height: 68rpx;
  padding: 0 22rpx;
  border: 0;
  border-radius: var(--radius-full);
  outline: 0;
  background: #f4f6f3;
  font-size: 28rpx;
}

/* ===== Seller Card ===== */
.seller-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(35, 87, 66, 0.08);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--shadow-card);
}

/* ===== Wanted Card ===== */
.wanted-hero {
  padding: 28rpx;
  border: 1rpx solid rgba(14, 91, 66, 0.1);
  border-radius: 28rpx;
  background: radial-gradient(circle at 92% 12%, rgba(255,218,68,0.55), transparent 30%),
              linear-gradient(135deg, #fff9dc 0%, #eefaf2 58%, #ffffff 100%);
  box-shadow: 0 12rpx 26rpx rgba(62, 76, 57, 0.08);
}

.wanted-card {
  position: relative;
  padding: 24rpx;
  border: 1rpx solid rgba(35, 87, 66, 0.08);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.88);
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
  background: #eef8f2;
  color: var(--market-deep);
  font-size: 22rpx;
  font-weight: 800;
}

/* ===== Floating Action ===== */
.floating-action {
  display: flex;
  align-items: center;
  gap: 10rpx;
  min-height: 76rpx;
  margin: 8rpx 0 0 auto;
  padding: 0 26rpx 0 18rpx;
  border: 1rpx solid #f1c13b;
  border-radius: var(--radius-full);
  background: var(--market-yellow);
  color: #13251c;
  font-weight: 900;
  font-size: 26rpx;
  box-shadow: 0 14rpx 28rpx rgba(138, 92, 0, 0.2);
}

/* ===== Upload ===== */
.upload-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  min-height: 200rpx;
  border: 1rpx dashed rgba(14, 91, 66, 0.24);
  border-radius: var(--radius-md);
  background: #f5fbf7;
  color: var(--market-deep);
}

/* ===== Stepper ===== */
.stepper {
  display: flex;
  align-items: center;
  border-radius: var(--radius-full);
  background: #f4f7f4;
}

.stepper .step-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border: 0;
  background: transparent;
  color: var(--market-deep);
  font-size: 32rpx;
  font-weight: 800;
}

.stepper .step-val {
  min-width: 52rpx;
  text-align: center;
  font-weight: 800;
  font-size: 26rpx;
}

/* ===== Link Row ===== */
.link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76rpx;
  color: var(--market-deep);
  font-weight: 800;
}

/* ===== Logout ===== */
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 76rpx;
  border: 0;
  background: transparent;
  color: #758179;
  font-weight: 700;
  font-size: 28rpx;
}

/* ===== Choice Grid ===== */
.choice-field {
  margin-bottom: 20rpx;
}

.choice-field .choice-legend {
  color: var(--market-muted);
  font-size: 24rpx;
  font-weight: 700;
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
  padding: 0 16rpx;
  border: 1rpx solid rgba(14, 91, 66, 0.14);
  border-radius: var(--radius-sm);
  background: #fffef9;
  color: #30483d;
  font-size: 26rpx;
  font-weight: 800;
  text-align: center;
  transition: all 140ms ease;
}

.choice-pill.checked {
  border-color: rgba(18, 129, 91, 0.34);
  color: #0b6044;
  background: #e9f8ef;
}

/* ===== Post Card (seller) ===== */
.post-card {
  display: flex;
  gap: 18rpx;
  padding: 18rpx;
  border: 1rpx solid rgba(35, 87, 66, 0.08);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--shadow-card);
}

/* ===== Address Card ===== */
.address-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  min-height: 120rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(35, 87, 66, 0.08);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--shadow-card);
}

/* ===== Range Selects ===== */
.range-field {
  padding: 18rpx;
  border: 1rpx solid rgba(14, 91, 66, 0.12);
  border-radius: var(--radius-sm);
  background: #fbfefb;
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
  color: var(--market-deep);
  font-weight: 900;
}

.range-result {
  margin-top: 6rpx;
  padding: 14rpx 18rpx;
  border-radius: var(--radius-sm);
  color: var(--market-deep);
  background: #e9f8ef;
  font-size: 24rpx;
  font-weight: 900;
}
```

- [ ] **Step 2: 更新 app.json 导航栏和tabBar样式**

修改 `miniprogram/app.json`:

```json
{
  "pages": [
    "pages/home/index",
    "pages/list/index",
    "pages/detail/index",
    "pages/cart/index",
    "pages/confirm/index",
    "pages/orders/index",
    "pages/order-detail/index",
    "pages/review/index",
    "pages/wanted/index",
    "pages/wanted-publish/index",
    "pages/wanted-detail/index",
    "pages/messages/index",
    "pages/chat/index",
    "pages/profile/index",
    "pages/favorites/index",
    "pages/address/index",
    "pages/seller/index",
    "pages/seller-publish/index",
    "pages/seller-posts/index",
    "pages/seller-orders/index",
    "pages/seller-ship/index",
    "pages/seller-refund/index",
    "pages/seller-shop/index",
    "pages/login/index"
  ],
  "window": {
    "navigationBarTitleText": "校园二手",
    "navigationBarBackgroundColor": "#f7f3e8",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#f7f3e8"
  },
  "tabBar": {
    "color": "#7a7f86",
    "selectedColor": "#0c5c42",
    "backgroundColor": "#ffffff",
    "borderStyle": "white",
    "list": [
      { "pagePath": "pages/home/index", "text": "首页", "iconPath": "", "selectedIconPath": "" },
      { "pagePath": "pages/wanted/index", "text": "求购", "iconPath": "", "selectedIconPath": "" },
      { "pagePath": "pages/cart/index", "text": "购物车", "iconPath": "", "selectedIconPath": "" },
      { "pagePath": "pages/messages/index", "text": "消息", "iconPath": "", "selectedIconPath": "" },
      { "pagePath": "pages/profile/index", "text": "我的", "iconPath": "", "selectedIconPath": "" }
    ]
  }
}
```

### Task 2: 管理后台全局样式 — 设计 Token + Element Plus 覆盖

**Files:**
- Modify: `admin-web/src/styles.css` (完全重写)

- [ ] **Step 1: 重写 admin-web/src/styles.css**

用以下内容完全替换 `admin-web/src/styles.css`:

```css
/* ===== Design Tokens ===== */
:root {
  --admin-bg: #f4f6f8;
  --admin-panel: #ffffff;
  --admin-line: #dde3ea;
  --admin-ink: #18212b;
  --admin-muted: #6a7480;
  --admin-green: #16875d;
  --admin-red: #c84848;
  --admin-yellow: #d58a24;
  --sidebar-bg-start: #142433;
  --sidebar-bg-end: #0e1722;
  --sidebar-text: rgba(237, 244, 251, 0.74);
  --sidebar-hover: rgba(255, 255, 255, 0.08);
  --sidebar-active-text: #f7fff9;
  --sidebar-active-bg: #16875d;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 14px;

  --shadow-sm: 0 6px 18px rgba(22, 35, 48, 0.06);
  --shadow-md: 0 8px 20px rgba(22, 35, 48, 0.05);
  --shadow-lg: 0 20px 54px rgba(18, 33, 47, 0.14);

  font-family: Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-width: 1120px;
  background: var(--admin-bg);
  color: var(--admin-ink);
}

/* ===== Shell ===== */
.shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

/* ===== Sidebar ===== */
.sidebar {
  background: linear-gradient(180deg, var(--sidebar-bg-start), var(--sidebar-bg-end));
  color: #edf4fb;
  padding: 24px 16px;
}

.sidebar .brand {
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.06);
  margin-bottom: 22px;
}

.sidebar .brand strong {
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 900;
}

.sidebar .brand span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar nav button {
  width: 100%;
  min-height: 42px;
  padding: 0 14px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--sidebar-text);
  text-align: left;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease, transform 140ms ease;
}

.sidebar nav button:hover {
  color: #fff;
  background: var(--sidebar-hover);
  transform: translateX(2px);
}

.sidebar nav button.active {
  color: var(--sidebar-active-text);
  background: var(--sidebar-active-bg);
}

/* ===== Main Area ===== */
.main {
  padding: 22px;
  background: var(--admin-bg);
}

/* ===== Top Bar ===== */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  margin-bottom: 20px;
  border: 1px solid var(--admin-line);
  border-radius: var(--radius-md);
  background: var(--admin-panel);
  box-shadow: var(--shadow-sm);
}

.topbar h1 {
  margin: 0;
  color: var(--admin-ink);
  font-size: 24px;
  font-weight: 900;
}

.topbar .eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border: 1px solid #cfe5db;
  border-radius: 999px;
  color: var(--admin-green);
  background: #edf7f2;
  font-size: 12px;
  font-weight: 800;
}

/* ===== Login Panel ===== */
.login-panel {
  width: 420px;
  margin: 12vh auto 0;
  padding: 32px;
  background: var(--admin-panel);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-panel h1 {
  margin: 0 0 4px;
  font-size: 28px;
  font-weight: 900;
}

.login-panel p {
  margin: 0;
  color: var(--admin-muted);
}

/* ===== KPI Grid ===== */
.metrics {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.metric {
  position: relative;
  overflow: hidden;
  padding: 18px;
  border: 1px solid var(--admin-line);
  border-radius: var(--radius-md);
  background: var(--admin-panel);
  box-shadow: var(--shadow-md);
}

.metric::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--admin-green);
}

.metric.urgent::before {
  background: var(--admin-yellow);
}

.metric span {
  color: var(--admin-muted);
  font-size: 13px;
}

.metric strong {
  display: block;
  margin-top: 10px;
  color: var(--admin-ink);
  font-size: 28px;
  font-weight: 900;
}

/* ===== Panel ===== */
.panel {
  padding: 22px;
  border: 1px solid var(--admin-line);
  border-radius: var(--radius-md);
  background: var(--admin-panel);
  box-shadow: var(--shadow-md);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.panel-head h2 {
  margin: 0;
  color: var(--admin-ink);
  font-size: 18px;
  font-weight: 900;
}

/* ===== Audit Focus Card ===== */
.audit-focus {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  margin-bottom: 20px;
  border: 1px solid var(--admin-line);
  border-left: 4px solid var(--admin-green);
  border-radius: var(--radius-md);
  background: var(--admin-panel);
  box-shadow: var(--shadow-md);
}

/* ===== Filters ===== */
.filters {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr auto;
  gap: 10px;
  padding: 14px;
  margin-bottom: 16px;
  border: 1px solid var(--admin-line);
  border-radius: var(--radius-md);
  background: var(--admin-panel);
  box-shadow: var(--shadow-sm);
}

.filters input,
.filters select {
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid var(--admin-line);
  border-radius: var(--radius-sm);
  background: #fbfcfd;
  font-size: 13px;
}

/* ===== Chart Row ===== */
.chart-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 14px;
}

.admin-card {
  border: 1px solid var(--admin-line);
  border-radius: var(--radius-md);
  background: var(--admin-panel);
  padding: 18px;
  box-shadow: var(--shadow-md);
}

.admin-card strong {
  display: block;
  margin-bottom: 12px;
  color: var(--admin-ink);
  font-size: 15px;
  font-weight: 800;
}

/* ===== Bars Chart ===== */
.bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0 0;
}

.bar {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  align-items: center;
  gap: 10px;
  color: var(--admin-muted);
  font-size: 13px;
}

.bar .bar-fill {
  position: relative;
  overflow: hidden;
  height: 12px;
  background: #dceae2;
  border-radius: 999px;
}

.bar .bar-fill::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--admin-green), #62b486);
}

/* ===== Element Plus Overrides ===== */

/* Table */
.el-table {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.el-table th.el-table__cell {
  background: #eef2f5;
  color: #4f5f6f;
  font-weight: 700;
  border-bottom: 1px solid var(--admin-line);
}

.el-table td.el-table__cell {
  border-bottom: 1px solid var(--admin-line);
}

.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: #fbfcfd;
}

.el-table .el-table__body tr:hover > td.el-table__cell {
  background: #f7faf9;
}

/* Button */
.el-button--primary {
  --el-button-bg-color: var(--admin-green);
  --el-button-border-color: var(--admin-green);
  --el-button-hover-bg-color: #147a53;
  --el-button-hover-border-color: #147a53;
  --el-button-active-bg-color: #0f6b46;
  border-radius: var(--radius-sm);
  font-weight: 700;
}

.el-button--success {
  --el-button-bg-color: var(--admin-green);
  --el-button-border-color: var(--admin-green);
  border-radius: var(--radius-sm);
  font-weight: 700;
}

.el-button--danger {
  --el-button-bg-color: var(--admin-red);
  --el-button-border-color: var(--admin-red);
  border-radius: var(--radius-sm);
  font-weight: 700;
}

.el-button--default {
  border-radius: var(--radius-sm);
  font-weight: 700;
}

/* Input */
.el-input__wrapper {
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 1px var(--admin-line) inset;
}

/* Pagination */
.el-pagination {
  margin-top: 16px;
}

/* Dialog */
.el-dialog {
  border-radius: var(--radius-md);
}

.el-dialog__header {
  font-weight: 800;
}

/* Message */
.el-message {
  border-radius: var(--radius-md);
}

/* ===== Responsive ===== */
@media (max-width: 960px) {
  .shell {
    grid-template-columns: 1fr;
  }
  .sidebar {
    border-bottom: 1px solid var(--admin-line);
  }
  .sidebar nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  .filters,
  .chart-row {
    grid-template-columns: 1fr;
  }
}
```

### Task 3: 创建缺失页面目录

**Files:**
- Create: 多个新页面目录

- [ ] **Step 1: 创建小程序端新页面目录结构**

```bash
cd /Users/lee/Documents/Lee/miniprogram/pages
mkdir -p list confirm order-detail review wanted-publish wanted-detail chat favorites address seller-publish seller-posts seller-orders seller-ship seller-refund seller-shop
```

Run: `cd /Users/lee/Documents/Lee/miniprogram/pages && mkdir -p list confirm order-detail review wanted-publish wanted-detail chat favorites address seller-publish seller-posts seller-orders seller-ship seller-refund seller-shop`

### Task 4: 小程序登录页改造

**Files:**
- Modify: `miniprogram/pages/login/index.wxml`
- Modify: `miniprogram/pages/login/index.js`
- Modify: `miniprogram/pages/login/index.wxss`

- [ ] **Step 1: 改造登录页 WXML**

替换 `miniprogram/pages/login/index.wxml`:

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
    <button class="btn" style="width:100%; background:transparent; border:0; color:var(--market-muted)" bindtap="guestBrowse">游客浏览</button>
  </view>
</view>
```

- [ ] **Step 2: 更新登录页 JS**

替换 `miniprogram/pages/login/index.js`:

```javascript
const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { username: 'student01', password: '123456' },
  onUsername(e) { this.setData({ username: e.detail.value }); },
  onPassword(e) { this.setData({ password: e.detail.value }); },
  async login() {
    const session = await request('/auth/login', {
      method: 'POST',
      data: { username: this.data.username, password: this.data.password }
    });
    app.setSession(session);
    wx.switchTab({ url: '/pages/home/index' });
  },
  register() {
    wx.showToast({ title: '注册功能开发中，请用演示账号', icon: 'none' });
  },
  guestBrowse() {
    wx.switchTab({ url: '/pages/home/index' });
  }
});
```

- [ ] **Step 3: 简化登录页 WXSS**

替换 `miniprogram/pages/login/index.wxss` (清空，所有样式由 app.wxss 全局类覆盖):

```css
/* 所有样式使用 app.wxss 全局类 */
```

---

## Phase 2: 核心页面 (P0)

### Task 5: 首页改造 — 原型匹配

**Files:**
- Modify: `miniprogram/pages/home/index.wxml`
- Modify: `miniprogram/pages/home/index.js`
- Modify: `miniprogram/pages/home/index.wxss`

- [ ] **Step 1: 改造首页 WXML**

替换 `miniprogram/pages/home/index.wxml`:

```xml
<view class="page stack">
  <!-- 搜索栏 -->
  <view class="soft-search">
    <view class="search-icon">🔍</view>
    <input placeholder="搜索教材、台灯、耳机…" value="{{keyword}}" bindinput="onKeyword" confirm-type="search" bindconfirm="loadProducts" />
    <button class="search-action" bindtap="loadProducts">搜索</button>
  </view>

  <!-- 市场 Banner -->
  <view class="market-hero">
    <view class="banner-kicker">校园市集</view>
    <h3>毕业季闲置市集</h3>
    <p>教材、台灯、耳机和宿舍好物都在同一个小程序里买卖。</p>
    <view class="hero-chips">
      <view class="chip">本周新增 38 件</view>
      <view class="chip">线下自提</view>
      <view class="chip">学生交易</view>
    </view>
    <button class="btn primary" style="position:absolute;right:20rpx;top:20rpx;color:#112219;background:#ffd45a;box-shadow:0 12rpx 22rpx rgba(158,107,0,0.22);" bindtap="goSeller">卖闲置</button>
  </view>

  <!-- 分类入口 -->
  <view class="category-grid">
    <block wx:for="{{categories}}" wx:key="id">
      <view class="category-item" bindtap="chooseCategory" data-id="{{item.id}}">
        <view class="cat-icon">{{item.icon || '📦'}}</view>
        <text>{{item.name}}</text>
      </view>
    </block>
    <view class="category-item" bindtap="goWanted">
      <view class="cat-icon">🔍</view>
      <text>求购专区</text>
    </view>
    <view class="category-item" bindtap="goAllLatest">
      <view class="cat-icon">🆕</view>
      <text>最新上架</text>
    </view>
  </view>

  <!-- 推荐标题 -->
  <view class="section-title">
    <view>
      <h4>同学正在转</h4>
      <text class="muted">按距离、价格和发布时间综合推荐</text>
    </view>
    <button class="btn small" bindtap="goAll">查看全部</button>
  </view>

  <!-- 商品流 -->
  <block wx:for="{{products}}" wx:key="id">
    <view class="product-card" bindtap="goDetail" data-id="{{item.id}}">
      <view class="product-img" data-kind="{{item.categoryName}}">
        <view class="product-mark">{{item.categoryName === '教材资料' ? '📖' : item.categoryName === '数码电子' ? '📱' : item.categoryName === '生活用品' ? '🏠' : '📦'}}</view>
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
    <view class="empty-icon">🔍</view>
    <text class="empty-title">暂无商品</text>
    <text class="empty-desc">换个分类看看，或发布求购让同学主动联系你。</text>
    <button class="btn primary" bindtap="goWanted">去求购</button>
  </view>
</view>
```

- [ ] **Step 2: 更新首页 JS**

替换 `miniprogram/pages/home/index.js`:

```javascript
const { request } = require('../../utils/api');

Page({
  data: {
    keyword: '',
    categoryId: null,
    categories: [
      { id: 1, name: '教材资料', icon: '📖' },
      { id: 2, name: '数码电子', icon: '📱' },
      { id: 3, name: '生活用品', icon: '🏠' },
      { id: 4, name: '运动户外', icon: '⚽' },
      { id: 5, name: '美妆服饰', icon: '👗' },
      { id: 6, name: '票券卡券', icon: '🎫' }
    ],
    products: []
  },
  onShow() {
    this.loadProducts();
  },
  onKeyword(e) { this.setData({ keyword: e.detail.value }); },
  async loadProducts() {
    try {
      const cats = await request('/categories');
      if (cats && cats.length) this.setData({ categories: cats.map(c => ({ ...c, icon: this.getCatIcon(c.name) })) });
    } catch (_) {}
    const data = await request('/products', {
      data: { keyword: this.data.keyword, categoryId: this.data.categoryId || undefined, status: 'ON_SALE' }
    });
    const products = (data.items || []).map(p => ({
      ...p,
      categoryName: p.categoryName || this.getCatName(p.categoryId),
      sellerNickname: p.sellerNickname || '同学'
    }));
    this.setData({ products });
  },
  getCatIcon(name) {
    const map = { '教材资料': '📖', '数码电子': '📱', '生活用品': '🏠', '运动户外': '⚽', '美妆服饰': '👗', '票券卡券': '🎫' };
    return map[name] || '📦';
  },
  getCatName(id) {
    const cat = this.data.categories.find(c => c.id === id);
    return cat ? cat.name : '其他';
  },
  chooseCategory(e) {
    this.setData({ categoryId: e.currentTarget.dataset.id });
    wx.navigateTo({ url: `/pages/list/index?categoryId=${e.currentTarget.dataset.id}` });
  },
  goDetail(e) {
    wx.navigateTo({ url: `/pages/detail/index?id=${e.currentTarget.dataset.id}` });
  },
  goSeller() { wx.navigateTo({ url: '/pages/seller/index' }); },
  goWanted() { wx.switchTab({ url: '/pages/wanted/index' }); },
  goAll() { wx.navigateTo({ url: '/pages/list/index' }); },
  goAllLatest() { wx.navigateTo({ url: '/pages/list/index?sort=latest' }); }
});
```

- [ ] **Step 3: 简化首页 WXSS**

替换 `miniprogram/pages/home/index.wxss`:

```css
/* 所有样式使用 app.wxss 全局类 */
```

### Task 6: 商品详情页改造

**Files:**
- Modify: `miniprogram/pages/detail/index.wxml`
- Modify: `miniprogram/pages/detail/index.js`
- Modify: `miniprogram/pages/detail/index.wxss`

- [ ] **Step 1: 改造详情页 WXML**

替换 `miniprogram/pages/detail/index.wxml`:

```xml
<view class="page stack" wx:if="{{product}}" style="padding-bottom:120rpx">
  <!-- 大图区 -->
  <view class="product-img large-img" data-kind="{{product.categoryName}}" style="width:100%;height:380rpx">
    <view class="product-mark" style="width:100rpx;height:100rpx;font-size:40rpx">{{product.categoryName === '教材资料' ? '📖' : product.categoryName === '数码电子' ? '📱' : product.categoryName === '生活用品' ? '🏠' : '📦'}}</view>
    <text>{{product.categoryName}}</text>
  </view>

  <!-- 商品信息 -->
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
      <text style="font-weight:900">去求购 →</text>
    </view>
  </view>

  <!-- 卖家卡片 -->
  <view class="seller-card">
    <view class="profile-avatar" style="width:80rpx;height:80rpx;font-size:30rpx">{{product.sellerNickname ? product.sellerNickname[0] : '同'}}</view>
    <view style="flex:1">
      <text style="font-weight:800;font-size:30rpx">{{product.sellerNickname || '同学'}}</text>
      <view class="muted">校内当面交易 · {{product.pickupLocation}}</view>
    </view>
    <view class="badge success">学生认证</view>
  </view>

  <!-- 底部操作栏 -->
  <view class="bottom-action-bar">
    <button class="btn small ghost" style="flex-shrink:0;min-width:80rpx" bindtap="toggleFavorite">
      {{favorite ? '❤️' : '🤍'}}
    </button>
    <button class="btn ghost" style="flex:1" bindtap="sendMessage">聊一聊</button>
    <button class="btn" style="flex:1" bindtap="addCart">加购物车</button>
    <button class="btn primary" style="flex:1" bindtap="buyNow" disabled="{{!canBuy}}">立即购买</button>
  </view>
</view>
```

- [ ] **Step 2: 更新详情页 JS**

替换 `miniprogram/pages/detail/index.js`:

```javascript
const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { id: null, product: null, favorite: false, canBuy: false },
  onLoad(query) {
    this.setData({ id: query.id });
    this.load();
  },
  async load() {
    const product = await request(`/products/${this.data.id}`);
    const canBuy = product.stock > 0 && product.status === 'ON_SALE';
    this.setData({
      product: {
        ...product,
        categoryName: product.categoryName || '其他',
        sellerNickname: product.sellerNickname || '同学'
      },
      canBuy
    });
  },
  requireLogin() {
    if (!app.hasSession()) { wx.navigateTo({ url: '/pages/login/index' }); return false; }
    return true;
  },
  toggleFavorite() {
    this.setData({ favorite: !this.data.favorite });
    wx.showToast({ title: this.data.favorite ? '已收藏' : '已取消收藏', icon: 'none' });
  },
  async addCart() {
    if (!this.requireLogin()) return;
    await request('/cart/items', {
      method: 'POST',
      data: { userId: app.globalData.user.userId, productId: Number(this.data.id), quantity: 1 }
    });
    wx.showToast({ title: '已加入购物车' });
  },
  async buyNow() {
    if (!this.requireLogin()) return;
    await request('/orders', {
      method: 'POST',
      data: {
        buyerId: app.globalData.user.userId,
        productId: Number(this.data.id),
        quantity: 1,
        receiverName: '李同学',
        receiverPhone: '13800000001',
        receiverAddress: '北区 3 栋 502'
      }
    });
    wx.navigateTo({ url: '/pages/orders/index' });
  },
  async sendMessage() {
    if (!this.requireLogin()) return;
    await request('/messages', {
      method: 'POST',
      data: {
        senderId: app.globalData.user.userId,
        receiverId: this.data.product.sellerId,
        productId: Number(this.data.id),
        content: '你好，这个商品还在吗？'
      }
    });
    wx.switchTab({ url: '/pages/messages/index' });
  },
  goWanted() { wx.switchTab({ url: '/pages/wanted/index' }); }
});
```

- [ ] **Step 3: 简化详情页 WXSS**

替换 `miniprogram/pages/detail/index.wxss`:

```css
.large-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  border-radius: var(--radius-md);
  color: #fff;
  font-weight: 900;
  position: relative;
  overflow: hidden;
}
```

---

## Phase 3: 管理后台核心模块

### Task 7: 管理后台完整重构 — App.vue

**Files:**
- Modify: `admin-web/src/App.vue`

- [ ] **Step 1: 重构 App.vue — 完整导航 + 全部模块**

用以下内容替换 `admin-web/src/App.vue`:

```vue
<template>
  <div class="shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <strong>校园二手后台</strong>
        <span>管理员 Web 控制台</span>
      </div>
      <nav>
        <button v-for="item in nav" :key="item.key" :class="{ active: current === item.key }" @click="current = item.key">
          {{ item.label }}
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main">
      <!-- Login -->
      <section v-if="!token" class="login-panel">
        <h1>管理员登录</h1>
        <p>使用 admin / admin123 登录后台，完成商品审核和答辩演示。</p>
        <input class="input-custom" v-model="loginForm.username" placeholder="账号" style="width:100%;padding:12px;border:1px solid var(--admin-line);border-radius:6px;font-size:14px" />
        <input class="input-custom" v-model="loginForm.password" type="password" placeholder="密码" style="width:100%;padding:12px;border:1px solid var(--admin-line);border-radius:6px;font-size:14px" />
        <button class="btn-custom primary" @click="login" style="width:100%;padding:14px;border:0;border-radius:6px;background:var(--admin-green);color:#fff;font-weight:800;font-size:16px;cursor:pointer">登录</button>
      </section>

      <template v-else>
        <!-- Header -->
        <header class="topbar">
          <div>
            <span class="eyebrow">管理员控制台</span>
            <h1>{{ title }}</h1>
          </div>
          <el-button @click="logout">退出</el-button>
        </header>

        <!-- Dashboard -->
        <template v-if="current === 'dashboard'">
          <section class="metrics">
            <article v-for="m in metricCards" :key="m.label" class="metric" :class="{ urgent: m.urgent }">
              <span>{{ m.label }}</span>
              <strong>{{ m.value }}</strong>
            </article>
          </section>
          <div class="audit-focus">
            <div><strong>审核工作台</strong><p style="color:var(--admin-muted);margin:4px 0 0;font-size:13px">待审核商品、违规用户和异常订单集中处理。</p></div>
            <el-button type="primary" @click="current = 'products'">进入审核</el-button>
          </div>
          <div class="chart-row">
            <div class="admin-card"><strong>近 7 天订单趋势</strong><div class="bars"><div class="bar" v-for="d in chartData" :key="d.label"><span>{{ d.label }}</span><div class="bar-fill" :style="{ width: d.pct + '%' }"></div><b>{{ d.val }}</b></div></div></div>
            <div class="admin-card"><strong>热门分类</strong><div class="bars"><div class="bar" v-for="c in hotCats" :key="c.name"><span>{{ c.name }}</span><div class="bar-fill" :style="{ width: c.pct + '%' }"></div><b>{{ c.pct }}</b></div></div></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:14px">
            <el-button type="primary" @click="current = 'products'">查看待审核</el-button>
            <el-button @click="current = 'orders'">查看订单</el-button>
          </div>
        </template>

        <!-- Products (审核) -->
        <section v-if="current === 'products'" class="panel">
          <div class="panel-head"><h2>商品审核</h2><el-button @click="loadPending">刷新</el-button></div>
          <div class="filters">
            <input placeholder="关键词/编号/用户…" />
            <select><option>全部状态</option><option>待审核</option></select>
            <select><option>全部分类</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="pendingProducts" stripe>
            <el-table-column prop="title" label="商品" />
            <el-table-column prop="price" label="价格" width="120" />
            <el-table-column prop="stock" label="库存" width="100" />
            <el-table-column prop="pickupLocation" label="取货点" />
            <el-table-column prop="sellerNickname" label="卖家" width="100" />
            <el-table-column label="操作" width="240">
              <template #default="{ row }">
                <el-button type="success" size="small" @click="approve(row.id)">通过</el-button>
                <el-button type="danger" size="small" @click="reject(row.id)">驳回</el-button>
                <el-button size="small" @click="viewProduct(row.id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-card" style="margin-top:14px"><strong>验收状态</strong><p style="color:var(--admin-muted);font-size:13px">支持筛选、查看、状态处理、空状态和异常提示。驳回商品必须填写原因。</p></div>
        </section>

        <!-- Users -->
        <section v-if="current === 'users'" class="panel">
          <div class="panel-head"><h2>用户管理</h2><el-button @click="loadUsers">刷新</el-button></div>
          <div class="filters">
            <input placeholder="关键词/账号/手机号…" />
            <select><option>全部状态</option><option>正常</option><option>禁用</option></select>
            <select><option>全部角色</option><option>普通用户</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="users" stripe>
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="role" label="角色" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <span :style="{ color: row.status === 'DISABLED' ? '#c84848' : '#16875d', fontWeight: 700 }">{{ row.status === 'DISABLED' ? '禁用' : '正常' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template #default="{ row }">
                <el-button size="small">查看</el-button>
                <el-button :type="row.status === 'DISABLED' ? 'success' : 'danger'" size="small">{{ row.status === 'DISABLED' ? '解禁' : '禁用' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Products Management -->
        <section v-if="current === 'all-products'" class="panel">
          <div class="panel-head"><h2>商品管理</h2><el-button @click="loadAllProducts">刷新</el-button></div>
          <div class="filters">
            <input placeholder="关键词/编号/用户…" />
            <select><option>全部状态</option></select>
            <select><option>全部分类</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="allProducts" stripe>
            <el-table-column prop="title" label="商品" />
            <el-table-column prop="sellerNickname" label="卖家" width="100" />
            <el-table-column prop="price" label="价格" width="120" />
            <el-table-column prop="stock" label="库存" width="80" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="100">
              <template #default><el-button size="small">查看</el-button></template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Categories -->
        <section v-if="current === 'categories'" class="panel">
          <div class="panel-head"><h2>分类管理</h2><el-button type="primary" size="small">新增分类</el-button></div>
          <el-table :data="categories" stripe>
            <el-table-column prop="name" label="分类名称" />
            <el-table-column prop="parentName" label="父级" width="120" />
            <el-table-column prop="level" label="层级" width="80" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="180">
              <template #default>
                <el-button size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Orders -->
        <section v-if="current === 'orders'" class="panel">
          <div class="panel-head"><h2>订单管理</h2><el-button @click="loadOrders">刷新</el-button></div>
          <div class="filters">
            <input placeholder="订单号/买家/卖家…" />
            <select><option>全部状态</option></select>
            <select><option>全部类型</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="orders" stripe>
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="buyerNickname" label="买家" width="100" />
            <el-table-column prop="sellerNickname" label="卖家" width="100" />
            <el-table-column prop="totalAmount" label="金额" width="120" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="100">
              <template #default><el-button size="small">查看</el-button></template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Wanted -->
        <section v-if="current === 'wanted'" class="panel">
          <div class="panel-head"><h2>求购管理</h2><el-button @click="loadWanted">刷新</el-button></div>
          <div class="filters">
            <input placeholder="标题/发布人…" />
            <select><option>全部状态</option></select>
            <select><option>全部预算</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="wantedPosts" stripe>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="userNickname" label="发布人" width="100" />
            <el-table-column prop="minPrice" label="预算" width="140">
              <template #default="{ row }">¥{{ row.minPrice }}-{{ row.maxPrice }}</template>
            </el-table-column>
            <el-table-column prop="conditionLevel" label="成色" width="100" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="140">
              <template #default>
                <el-button size="small">查看</el-button>
                <el-button type="danger" size="small">删除违规</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Announcements -->
        <section v-if="current === 'announcements'" class="panel">
          <div class="panel-head"><h2>公告管理</h2><el-button type="primary" size="small">新建公告</el-button></div>
          <el-table :data="announcements" stripe>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column prop="createdAt" label="创建时间" width="160" />
            <el-table-column label="操作" width="180">
              <template #default>
                <el-button size="small">编辑</el-button>
                <el-button size="small">下线</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Messages -->
        <section v-if="current === 'messages'" class="panel">
          <div class="panel-head"><h2>咨询管理</h2></div>
          <div class="filters">
            <input placeholder="商品/发送人/接收人…" />
            <select><option>全部状态</option></select>
            <select><option>全部类型</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="allMessages" stripe>
            <el-table-column prop="productTitle" label="商品" />
            <el-table-column prop="senderNickname" label="发送人" width="100" />
            <el-table-column prop="receiverNickname" label="接收人" width="100" />
            <el-table-column prop="content" label="内容摘要" />
            <el-table-column prop="status" label="状态" width="80" />
            <el-table-column label="操作" width="100">
              <template #default><el-button type="danger" size="small">删除违规</el-button></template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Stats -->
        <section v-if="current === 'stats'" class="panel">
          <div class="panel-head"><h2>数据统计</h2></div>
          <div class="filters">
            <select><option>近 7 天</option><option>近 30 天</option></select>
            <input value="2026-05-23 至 2026-05-29" />
            <el-button type="primary">查询</el-button>
          </div>
          <section class="metrics">
            <article v-for="m in metricCards" :key="m.label" class="metric"><span>{{ m.label }}</span><strong>{{ m.value }}</strong></article>
          </section>
          <div class="chart-row" style="margin-top:14px">
            <div class="admin-card"><strong>近 7 天订单趋势</strong><div class="bars"><div class="bar" v-for="d in chartData" :key="d.label"><span>{{ d.label }}</span><div class="bar-fill" :style="{ width: d.pct + '%' }"></div><b>{{ d.val }}</b></div></div></div>
            <div class="admin-card"><strong>热门分类</strong><div class="bars"><div class="bar" v-for="c in hotCats" :key="c.name"><span>{{ c.name }}</span><div class="bar-fill" :style="{ width: c.pct + '%' }"></div><b>{{ c.pct }}</b></div></div></div>
          </div>
          <div class="admin-card" style="margin-top:14px"><strong>空状态</strong><p style="color:var(--admin-muted);font-size:13px">无数据时统计卡片展示 0，图表区域展示暂无数据。</p></div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const API_BASE = 'http://localhost:8080/api';
const token = ref(localStorage.getItem('adminToken') || '');
const current = ref('dashboard');
const dashboard = ref(null);
const pendingProducts = ref([]);
const users = ref([]);
const orders = ref([]);
const allProducts = ref([]);
const categories = ref([]);
const wantedPosts = ref([]);
const announcements = ref([{ title: '毕业季交易安全提示', status: '启用', sortOrder: 1, createdAt: '2026-05-29' }, { title: '线下自提规范', status: '下线', sortOrder: 2, createdAt: '2026-05-20' }]);
const allMessages = ref([]);
const loginForm = reactive({ username: 'admin', password: 'admin123' });

const nav = [
  { key: 'dashboard', label: '仪表盘' },
  { key: 'users', label: '用户管理' },
  { key: 'products', label: '商品审核' },
  { key: 'all-products', label: '商品管理' },
  { key: 'categories', label: '分类管理' },
  { key: 'orders', label: '订单管理' },
  { key: 'wanted', label: '求购管理' },
  { key: 'announcements', label: '公告管理' },
  { key: 'messages', label: '咨询管理' },
  { key: 'stats', label: '数据统计' }
];

const title = computed(() => nav.find(item => item.key === current.value)?.label || '后台');

const metricCards = computed(() => {
  const d = dashboard.value || {};
  return [
    { label: '用户数', value: d.userCount ?? '-' },
    { label: '商品数', value: d.productCount ?? '-' },
    { label: '待审核', value: d.pendingProductCount ?? '-', urgent: (d.pendingProductCount || 0) > 0 },
    { label: '订单数', value: d.orderCount ?? '-' },
    { label: '成交额', value: `¥${d.paidAmount ?? 0}` }
  ];
});

const chartData = [
  { label: 'D1', val: 42, pct: 42 }, { label: 'D2', val: 56, pct: 56 },
  { label: 'D3', val: 38, pct: 38 }, { label: 'D4', val: 64, pct: 64 },
  { label: 'D5', val: 72, pct: 72 }, { label: 'D6', val: 61, pct: 61 },
  { label: 'D7', val: 83, pct: 83 }
];

const hotCats = [
  { name: '教材资料', pct: 80 }, { name: '生活用品', pct: 62 }, { name: '数码电子', pct: 44 }
];

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: token.value ? `Bearer ${token.value}` : '' },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const body = await response.json();
  if (body.code !== 0) throw new Error(body.message || '请求失败');
  return body.data;
}

async function login() {
  const data = await api('/auth/login', { method: 'POST', body: loginForm });
  if (data.role !== 'ADMIN') { ElMessage.error('当前账号不是管理员'); return; }
  token.value = data.token;
  localStorage.setItem('adminToken', data.token);
  await loadAll();
}

function logout() {
  token.value = '';
  localStorage.removeItem('adminToken');
}

async function loadDashboard() { dashboard.value = await api('/admin/dashboard'); }
async function loadPending() { pendingProducts.value = await api('/admin/products/pending'); }
async function loadUsers() { users.value = await api('/admin/users'); }
async function loadOrders() { orders.value = await api('/admin/orders'); }
async function loadAllProducts() { allProducts.value = await api('/admin/products'); }
async function loadCategories() { categories.value = await api('/categories'); }
async function loadWanted() { wantedPosts.value = await api('/wanted'); }
async function loadMessages() { allMessages.value = await api('/admin/messages'); }

async function approve(id) {
  await api(`/admin/products/${id}/approve`, { method: 'POST' });
  ElMessage.success('已通过');
  await loadPending(); await loadDashboard();
}
async function reject(id) {
  await api(`/admin/products/${id}/reject`, { method: 'POST', body: { reason: '信息不完整，请补充图片和描述' } });
  ElMessage.success('已驳回');
  await loadPending(); await loadDashboard();
}
function viewProduct(id) { /* detail navigation */ }

async function loadAll() {
  await Promise.all([loadDashboard(), loadPending(), loadUsers(), loadOrders(), loadAllProducts(), loadCategories(), loadWanted(), loadMessages()]);
}

watch(current, async (value) => {
  if (!token.value) return;
  const loaders = { dashboard: loadDashboard, products: loadPending, users: loadUsers, orders: loadOrders, 'all-products': loadAllProducts, categories: loadCategories, wanted: loadWanted, messages: loadMessages, stats: loadDashboard };
  if (loaders[value]) await loaders[value]();
});

if (token.value) loadAll().catch(err => ElMessage.error(err.message));
</script>
```

---

## Phase 4-6: 剩余页面进度概览

后续任务按相同模式继续：

### 剩余的小程序页面（Tasks 8-24）
每个页面改造遵循：WXML 对齐原型结构 → JS 保持现有 API 调用 → WXSS 清空为全局类

| Task | 页面 | 原型参考 |
|------|------|---------|
| 8 | 分类列表 (list) | mini-pages.js `list:` 行37-50 |
| 9 | 购物车 (cart) | mini-pages.js `cart:` 行79-105 |
| 10 | 确认订单 (confirm) | mini-pages.js `confirm:` 行107-114 |
| 11 | 订单列表 (orders) | mini-pages.js `orders:` 行116-128 |
| 12 | 订单详情 (order-detail) | mini-pages.js `orderDetail:` 行129-148 |
| 13 | 评价 (review) | mini-pages.js `review:` 行150-157 |
| 14 | 求购大厅 (wanted) | mini-pages.js `wanted:` 行158-184 |
| 15 | 求购发布 (wanted-publish) | mini-pages.js `wantedPublish:` 行186-213 |
| 16 | 求购详情 (wanted-detail) | mini-pages.js `wantedDetail:` 行214-226 |
| 17 | 消息列表 (messages) | mini-pages.js `messages:` 行228-255 |
| 18 | 聊天 (chat) | mini-pages.js `chat:` 行257-290 |
| 19 | 个人中心 (profile) | mini-pages.js `profile:` 行305-327 |
| 20 | 收藏 (favorites) | mini-pages.js `favorites:` 行293-296 |
| 21 | 地址 (address) | mini-pages.js `address:` 行298-303 |
| 22 | 卖家摊位 (seller) | seller-pages.js `sell:` 行3-9 |
| 23 | 发布商品 (seller-publish) | seller-pages.js `publish:` 行10-22 |
| 24 | 我的发布 (seller-posts) | seller-pages.js `posts:` 行23-28 |
| 25 | 卖出订单 (seller-orders) | seller-pages.js `sellOrders:` 行29-34 |
| 26 | 发货 (seller-ship) | seller-pages.js `ship:` 行35-45 |
| 27 | 退款 (seller-refund) | seller-pages.js `refund:` 行46-53 |
| 28 | 店铺资料 (seller-shop) | seller-pages.js `shop:` 行59-67 |

---

## 验证方式

每个 Task 完成后：
1. 对比原型 `prototypes/second-hand-campus/` 对应页面确认结构和视觉一致
2. 确认现有 API 调用路径不变
3. 确认 `app.wxss` 全局类正确覆盖

## 执行说明

由于页面数量多（28个Task），建议使用 subagent-driven-development 方式，每个 Task 由独立 subagent 执行，批量并行推进。
