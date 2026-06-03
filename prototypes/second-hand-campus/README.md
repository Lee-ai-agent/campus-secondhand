# 校园二手交易系统高保真原型

本目录是基于 `docs/second-hand-campus-miniprogram/prd.md` 和 `docs/second-hand-campus-miniprogram/prototype-requirements.md` 生成的静态交互原型。

## 打开方式

直接用浏览器打开：

```text
/Users/lee/Documents/Lee/prototypes/second-hand-campus/index.html
```

如果浏览器限制本地脚本，也可以在本目录启动任意静态文件服务后访问 `index.html`。

## 覆盖范围

- 买卖一体小程序：登录注册、首页、分类搜索、商品详情、购物车、确认订单、模拟支付、买入订单、评价、求购、收藏、地址、个人中心、发布闲置、我的发布、卖出订单、发货、退款处理、咨询回复、店铺资料。
- Web 管理后台：仪表盘、用户管理、商品审核、商品管理、分类管理、订单管理、求购管理、公告管理、咨询管理、数据统计。

## 源码结构

- `scripts/mock-data.js`：前端模拟商品、求购、会话和订单数据。
- `scripts/state-and-utils.js`：页面状态、筛选项、金额格式化和图标工具。
- `scripts/ui-components.js`：通用卡片、筛选、空状态、手机壳和流程说明组件。
- `scripts/router-actions.js`：页面跳转、筛选更新、购物车、聊天、后台审核等交互动作。
- `scripts/mini-pages.js`：买卖一体小程序页面渲染。
- `scripts/seller-pages.js`：普通用户卖出流程页面渲染。
- `scripts/admin-pages.js`：管理员 Web 后台页面渲染。
- `scripts/bootstrap.js`：启动入口、端类型切换和地址 hash 同步。

## 原型说明

- 本原型只用于需求评审、论文截图、答辩演示和后续开发拆分。
- 数据全部为前端模拟，不连接数据库、后端接口、微信 API 或真实支付。
- P0 流程重点覆盖，P1 页面提供可演示状态，P2 功能不在本轮原型中实现。
