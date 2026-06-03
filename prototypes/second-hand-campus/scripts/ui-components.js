function categoryButton(name, action) {
  return `
    <button class="category" type="button" onclick="${action}">
      <span class="category-icon">${categoryIcon(name)}</span>
      <span>${name}</span>
    </button>
  `;
}

function selectOptions(options, selected) {
  return options.map((item) => `<option value="${item}" ${item === selected ? "selected" : ""}>${item}</option>`).join("");
}

function badge(text, tone = "") {
  return `<span class="status-pill ${tone}">${text}</span>`;
}

function pageTitle() {
  const map = {
    login: "登录注册",
    home: "校园二手",
    list: "分类搜索",
    detail: "商品详情",
    cart: "购物车",
    confirm: "确认订单",
    orders: "买入订单",
    orderDetail: "订单详情",
    review: "评价",
    wanted: "求购",
    wantedPublish: "发布求购",
    wantedDetail: "求购详情",
    messages: "消息",
    chat: "咨询会话",
    favorites: "收藏",
    address: "地址管理",
    profile: "我的",
    sell: "卖闲置",
    publish: "发布闲置",
    posts: "我的发布",
    sellOrders: "卖出订单",
    ship: "发货",
    refund: "退款处理",
    consultReplies: "咨询回复",
    shop: "店铺资料"
  };
  return map[state.miniPage];
}

function productCard(product) {
  const tone = product.status === "库存不足" ? "danger" : product.audit === "待审核" ? "warn" : "";
  return `
    <article class="product-card market-card">
      <button class="product-img" type="button" data-kind="${product.category}" onclick="routeMini('detail','${product.id}')">
        <span class="product-mark">${categoryIcon(product.category)}</span>
        <span>${product.category}</span>
      </button>
      <div class="stack">
        <div class="row">
          <h3>${product.title}</h3>
          ${badge(product.status, tone)}
        </div>
        <div class="row">
          <span class="price">${money(product.price)}</span>
          <span class="object-label">${product.condition}</span>
        </div>
        <p class="meta market-meta">${product.pickup} · 库存 ${product.stock} · ${product.updated}</p>
        <div class="seller-line"><span>${product.seller}</span><span>${product.category}</span></div>
      </div>
    </article>
  `;
}

function softSearch(name, value, placeholder, actionLabel, action) {
  return `
    <div class="soft-search">
      <span class="search-leading">${categoryIcon("搜索")}</span>
      <input name="${name}" aria-label="${placeholder}" value="${value || ""}" placeholder="${placeholder}" autocomplete="off" />
      <button class="search-action" type="button" onclick="${action}">${actionLabel}</button>
    </div>
  `;
}

function filterChip(label, value, action, active = true) {
  return `<button class="filter-chip ${active ? "active" : ""}" type="button" onclick="${action}"><span>${label}</span><strong>${value}</strong></button>`;
}

function emptyState(title, desc, actionText = "", action = "") {
  return `
    <div class="empty-state">
      <span class="empty-icon">${categoryIcon("搜索")}</span>
      <strong>${title}</strong>
      <p>${desc}</p>
      ${actionText ? `<button class="btn primary" type="button" onclick="${action}">${actionText}</button>` : ""}
    </div>
  `;
}

function bottomActionBar(content) {
  return `<div class="bottom-action-bar">${content}</div>`;
}

function moreButton(label = "更多") {
  return `<button class="icon-btn subtle" type="button" aria-label="${label}" onclick="showToast('${label}操作已收起到更多菜单')">${categoryIcon("更多")}</button>`;
}

function miniShell(content, activeTab = "home") {
  const tabs = [
    ["home", "首页"],
    ["wanted", "求购"],
    ["cart", "购物车"],
    ["messages", "消息"],
    ["profile", "我的"]
  ];
  const showHeader = state.miniPage !== "messages";
  const rootPages = ["home", "wanted", "cart", "messages", "profile"];
  const showBack = !rootPages.includes(state.miniPage);
  const showTabs = rootPages.includes(state.miniPage);
  const backTargets = {
    wantedPublish: "routeMini('wanted')",
    wantedDetail: "routeMini('wanted')",
    chat: "routeMini('messages')",
    confirm: "routeMini('cart')",
    orderDetail: "routeMini('orders')",
    review: "routeMini('orderDetail')",
    address: "routeMini('profile')",
    favorites: "routeMini('profile')",
    orders: "routeMini('profile')",
    publish: "routeMini('profile')",
    sell: "routeMini('profile')",
    posts: "routeMini('profile')",
    sellOrders: "routeMini('profile')",
    ship: "routeSell('sellOrders')",
    refund: "routeSell('sellOrders')",
    shop: "routeMini('profile')",
    list: "routeMini('home')",
    detail: "routeMini('home')",
    login: "routeMini('home')"
  };
  const backAction = backTargets[state.miniPage] || "routeMini('home')";
  return `
    <section class="phone-stage">
      <div class="phone">
        <div class="phone-screen">
          <div class="phone-status"><span>09:41</span><span>校园二手</span></div>
          ${showHeader ? `<header class="mini-header">
            ${showBack ? `<button class="btn mini-back" type="button" onclick="${backAction}">返回</button>` : `<span class="mini-header-spacer" aria-hidden="true"></span>`}
            <h2 class="mini-title">${pageTitle()}</h2>
            <span class="mini-header-spacer" aria-hidden="true"></span>
          </header>` : ""}
          <div class="mini-content ${showTabs ? "" : "immersive-content"}">${content}</div>
          ${showTabs ? `<nav class="bottom-tabs" aria-label="小程序底部导航">
            ${tabs.map(([key, label]) => `<button class="${activeTab === key ? "active" : ""}" type="button" onclick="routeMini('${key}')"><span class="tab-icon">${categoryIcon(label)}</span><span>${label}</span></button>`).join("")}
          </nav>` : ""}
        </div>
      </div>
      ${flowPanel()}
    </section>
  `;
}

function flowPanel() {
  const sellPages = ["sell", "publish", "posts", "sellOrders", "ship", "refund", "consultReplies", "shop"];
  const items = sellPages.includes(state.miniPage)
    ? [
        ["发布商品", "填写标题、分类、价格、库存、成色、图片和取货点。"],
        ["审核状态", "待审核、已上架、驳回原因、重新提交。"],
        ["订单处理", "发货、退款、咨询回复和店铺资料维护。"],
        ["管理衔接", "管理员后台审核后商品才会在小程序公开展示。"]
      ]
    : [
        ["浏览商品", "首页推荐、分类、搜索和公告入口。"],
        ["下单支付", "商品详情加入购物车，确认订单后模拟支付。"],
        ["订单闭环", "待付款、待发货、待收货、已完成、评价。"],
        ["P1 页面", "收藏、求购、地址和个人中心均可展示。"]
      ];
  return `
    <aside class="note-panel">
      <h2>买卖一体小程序演示说明</h2>
      <p class="meta">该区域用于答辩时说明当前页面映射的 PRD 流程和状态。</p>
      <div class="flow-list">
        ${items.map((item, index) => `
          <div class="flow-item">
            <span class="flow-index">${index + 1}</span>
            <div><strong>${item[0]}</strong><p class="meta">${item[1]}</p></div>
          </div>
        `).join("")}
      </div>
    </aside>
  `;
}
