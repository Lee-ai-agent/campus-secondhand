function adminRows(page) {
  const commonActions = `<button class="btn" type="button">查看</button>`;
  const maps = {
    users: [
      ["student001", "李同学", "13800000000", "普通用户", "8", state.disabledUser ? "禁用" : "正常", "2026-04-12"],
      ["student002", "林同学", "13900000000", "普通用户", "14", "正常", "2026-03-06"]
    ],
    audit: products.filter((item) => item.audit === "待审核").map((item) => [item.title, item.seller, money(item.price), item.stock, item.category, item.updated]),
    products: products.map((item) => [item.title, item.seller, money(item.price), item.stock, item.status, item.updated]),
    categories: [["教材资料", "无", "1", "10", "启用"], ["生活用品", "无", "1", "20", "启用"], ["数码电子", "无", "1", "30", "启用"]],
    orders: orders.map((item) => [item.no, item.buyer, item.seller, money(item.amount), item.status, "2026-05-29"]),
    wanted: wantedPosts.map((item) => [item.title, item.user, item.price, item.condition, item.status, "2026-05-29"]),
    announcements: [["毕业季交易安全提示", "启用", "1", "2026-05-29", "2026-05-29"], ["线下自提规范", "下线", "2", "2026-05-20", "2026-05-22"]],
    messages: [["九成新 Java 课程教材", "李同学", "林同学", "这本教材有笔记吗？", "正常", "2026-05-29"]]
  };
  return maps[page].map((row) => `
    <tr>
      ${row.map((cell) => `<td>${cell}</td>`).join("")}
      <td class="btn-row">
        ${commonActions}
        ${page === "audit" ? `<button class="btn primary" type="button" onclick="state.adminAudited=true; showToast('商品审核已通过'); render(); syncHash()">通过</button><button class="btn danger" type="button" onclick="rejectAudit()">驳回</button>` : ""}
        ${page === "users" ? `<button class="btn ${state.disabledUser ? "primary" : "danger"}" type="button" onclick="if (!state.disabledUser && typeof window.confirm === 'function' && !window.confirm('确认禁用该用户？')) return; state.disabledUser=!state.disabledUser; showToast(state.disabledUser ? '用户已禁用，可在提示时间内撤销' : '用户已解禁'); render(); syncHash()">${state.disabledUser ? "解禁" : "禁用"}</button>` : ""}
        ${page === "categories" ? `<button class="btn" type="button">编辑</button><button class="btn danger" type="button" onclick="confirmAction('确认删除该分类？分类下存在商品时不可删除。', '分类删除请求已记录')">删除</button>` : ""}
        ${page === "announcements" ? `<button class="btn" type="button">编辑</button><button class="btn" type="button" onclick="confirmAction('确认下线该公告？', '公告已下线')">下线</button>` : ""}
        ${page === "wanted" || page === "messages" ? `<button class="btn danger" type="button" onclick="confirmAction('确认删除违规内容？', '违规内容已删除并记录原因')">删除违规</button>` : ""}
      </td>
    </tr>
  `).join("");
}

function renderAdmin() {
  const nav = [
    ["dashboard", "仪表盘"],
    ["users", "用户管理"],
    ["audit", "商品审核"],
    ["products", "商品管理"],
    ["categories", "分类管理"],
    ["orders", "订单管理"],
    ["wanted", "求购管理"],
    ["announcements", "公告管理"],
    ["messages", "咨询管理"],
    ["stats", "数据统计"]
  ];
  const title = nav.find(([key]) => key === state.adminPage)[1];
  const dashboard = `
    <div class="stack">
      <div class="admin-kpi-grid">
        <div class="stat admin-kpi"><span class="label">用户数</span><strong>1,286</strong><em>较昨日 +24</em></div>
        <div class="stat admin-kpi"><span class="label">商品数</span><strong>342</strong><em>在售 286</em></div>
        <div class="stat admin-kpi urgent"><span class="label">待审核</span><strong>${state.adminAudited ? 0 : 1}</strong><em>需管理员处理</em></div>
        <div class="stat admin-kpi"><span class="label">成交额</span><strong>¥18,420</strong><em>模拟支付统计</em></div>
      </div>
      <div class="admin-card audit-focus"><div><strong>审核工作台</strong><p class="meta">待审核商品、违规用户和异常订单集中处理。</p></div><button class="btn primary" type="button" onclick="routeAdmin('audit')">进入审核</button></div>
      <div class="chart-row">
        <div class="screen-card admin-card"><strong>近 7 天订单趋势</strong><div class="bars">${[42, 56, 38, 64, 72, 61, 83].map((value, index) => `<div class="bar"><span>D${index + 1}</span><span style="width:${value}%"></span><b>${value}</b></div>`).join("")}</div></div>
        <div class="screen-card admin-card"><strong>热门分类</strong><div class="bars">${["教材资料", "生活用品", "数码电子"].map((name, index) => `<div class="bar"><span>${name}</span><span style="width:${80 - index * 18}%"></span><b>${80 - index * 18}</b></div>`).join("")}</div></div>
      </div>
      <div class="btn-row"><button class="btn primary" type="button" onclick="routeAdmin('audit')">查看待审核</button><button class="btn" type="button" onclick="routeAdmin('orders')">查看订单</button></div>
    </div>
  `;
  const stats = `
    <div class="stack">
      <div class="filters"><select name="statsRange" aria-label="统计时间范围"><option>近 7 天</option><option>近 30 天</option></select><input name="statsDateRange" aria-label="统计日期区间" value="2026-05-23 至 2026-05-29" /><button class="btn primary" type="button">查询</button></div>
      ${dashboard}
      <div class="screen-card"><strong>空状态</strong><p class="meta">无数据时统计卡片展示 0，图表区域展示暂无数据。</p></div>
    </div>
  `;
  const tableHead = {
    users: ["账号", "昵称", "手机号", "角色", "交易次数", "状态", "注册时间", "操作"],
    audit: ["商品", "卖家", "价格", "库存", "分类", "提交时间", "操作"],
    products: ["商品", "卖家", "价格", "库存", "状态", "更新时间", "操作"],
    categories: ["分类名称", "父级", "层级", "排序", "状态", "操作"],
    orders: ["订单号", "买家", "卖家", "金额", "状态", "创建时间", "操作"],
    wanted: ["标题", "发布人", "期望价格", "成色", "状态", "发布时间", "操作"],
    announcements: ["标题", "状态", "排序", "创建时间", "更新时间", "操作"],
    messages: ["商品", "发送人", "接收人", "内容摘要", "状态", "时间", "操作"]
  };
  const tablePage = (page) => `
    <div class="filters">
      <input name="adminKeyword" aria-label="关键词、编号或用户" placeholder="关键词/编号/用户…" />
      <select name="adminStatus" aria-label="状态筛选"><option>全部状态</option><option>正常</option><option>待审核</option></select>
      <select name="adminType" aria-label="分类或角色筛选"><option>全部分类/角色</option><option>教材资料</option><option>普通用户</option></select>
      <button class="btn primary" type="button">查询</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr>${tableHead[page].map((item) => `<th>${item}</th>`).join("")}</tr></thead>
        <tbody>${adminRows(page)}</tbody>
      </table>
    </div>
    <div class="screen-card admin-card table-note"><strong>验收状态</strong><p class="meta">支持筛选、查看、状态处理、空状态和异常提示。分类存在商品时不可删除，驳回商品必须填写原因。</p></div>
  `;
  const content = state.adminPage === "dashboard" ? dashboard : state.adminPage === "stats" ? stats : tablePage(state.adminPage);
  app.innerHTML = `
    <section class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-brand"><strong>校园二手后台</strong><span class="meta">管理员 Web 控制台</span></div>
        <nav class="admin-nav">${nav.map(([key, label]) => `<button class="${state.adminPage === key ? "active" : ""}" type="button" onclick="routeAdmin('${key}')">${label}</button>`).join("")}</nav>
      </aside>
      <main class="admin-main">
        <div class="admin-header">
          <div><p class="eyebrow">管理员控制台</p><h2>${title}</h2></div>
          <div class="btn-row"><button class="btn" type="button" onclick="showToast('管理员 admin 已登录')">admin</button><button class="btn danger" type="button" onclick="confirmAction('确认退出后台登录？', '已退出后台登录')">退出</button></div>
        </div>
        ${content}
      </main>
    </section>
  `;
}
