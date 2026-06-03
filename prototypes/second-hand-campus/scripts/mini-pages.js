function renderMini() {
  const visibleProducts = products.filter((item) => item.audit !== "待审核");
  const currentListProducts = listProducts();
  const minOptions = ["0", "10", "15", "20", "30", "50", "80", "100", "150", "200"];
  const maxOptions = ["15", "20", "25", "30", "50", "80", "100", "150", "200", "300"];
  const pages = {
    login: () => miniShell(`
      <div class="stack">
        <div class="banner"><h3>校园二手交易</h3><p>学生认证后可下单、收藏、发布求购。</p></div>
        <form class="form-card" onsubmit="event.preventDefault(); showToast('登录成功，返回首页'); routeMini('home');">
          <label class="field"><span class="label">手机号/账号</span><input name="account" value="student001" autocomplete="username" /></label>
          <label class="field"><span class="label">验证码或密码</span><input name="password" value="123456" type="password" autocomplete="current-password" /></label>
          <button class="btn primary" type="submit">登录</button>
          <button class="btn" type="button" onclick="showToast('已进入注册流程')">注册</button>
          <button class="btn ghost" type="button" onclick="routeMini('home')">游客浏览</button>
        </form>
      </div>
    `),
    home: () => miniShell(`
      <div class="stack">
        ${softSearch("keyword", "", "搜索教材、台灯、耳机…", "搜索", "routeList('全部分类', '最新发布', document.querySelector('[name=keyword]').value)")}
        <div class="banner market-hero">
          <span class="banner-kicker">校园市集</span>
          <h3>毕业季闲置市集</h3>
          <p>教材、台灯、耳机和宿舍好物都在同一个小程序里买卖。</p>
          <div class="hero-chips"><span>本周新增 38 件</span><span>线下自提</span><span>学生交易</span></div>
          <button class="btn primary sell-fab" type="button" onclick="routeSell('publish')">卖闲置</button>
        </div>
        <div class="category-grid">
          ${["教材资料", "数码电子", "生活用品", "运动户外", "美妆服饰", "票券卡券", "求购专区", "最新上架"].map((item) => categoryButton(item, item === "求购专区" ? "routeMini('wanted')" : item === "最新上架" ? "routeList('全部分类', '最新发布')" : `routeList('${item}', '最新发布')`)).join("")}
        </div>
        <div class="section-title"><div><strong>同学正在转</strong><p class="meta">按距离、价格和发布时间综合推荐</p></div><button class="btn" type="button" onclick="routeList('全部分类', '最新发布')">查看全部</button></div>
        <div class="market-feed">${visibleProducts.map(productCard).join("")}</div>
      </div>
    `),
    list: () => miniShell(`
      <div class="stack">
        <div class="filter-panel market-filter">
          ${softSearch("filterKeyword", state.listKeyword, "搜索当前分类", "筛选", "state.listKeyword=document.querySelector('[name=filterKeyword]').value; showToast('已按关键词筛选'); render(); syncHash()")}
          <div class="filter-chip-row">
            ${filterChip("分类", state.listCategory, "cycleListFilter('listCategory')")}
            ${filterChip("价格", state.listPrice, "cycleListFilter('listPrice')")}
            ${filterChip("成色", state.listCondition, "cycleListFilter('listCondition')")}
            ${filterChip("排序", state.listSort, "cycleListFilter('listSort')")}
            <button class="filter-reset" type="button" onclick="resetListFilters()">重置</button>
          </div>
        </div>
        <div class="result-summary"><strong>${state.listCategory === "全部分类" ? "全部好物" : state.listCategory}</strong><span>${currentListProducts.length} 件</span></div>
        ${currentListProducts.length ? currentListProducts.map(productCard).join("") : emptyState("没有找到相关商品", "可以换个筛选条件，或发布求购让同学主动联系你。", "发布求购", "routeMini('wanted')")}
      </div>
    `),
    detail: () => {
      const product = state.selectedProduct;
      const canBuy = product.stock > 0 && product.status === "已上架";
      return miniShell(`
        <div class="stack">
          <div class="large-img" data-kind="${product.category}"><span class="product-mark">${categoryIcon(product.category)}</span><span>${product.category}</span></div>
          <div class="screen-card stack">
            <div class="row"><h3>${product.title}</h3>${badge(product.status, canBuy ? "" : "danger")}</div>
            <div class="row"><span class="price">${money(product.price)}</span><span class="pill">${product.condition}</span></div>
            <p class="meta">库存 ${product.stock} · ${product.pickup} · 发布者 ${product.seller}</p>
            <p>${product.desc}</p>
            <button class="link-row" type="button" onclick="routeMini('wanted')"><span>想要类似商品</span><strong>去求购</strong></button>
          </div>
          <div class="seller-card">
            <span class="message-avatar">${product.seller.slice(0, 1)}</span>
            <div><strong>${product.seller}</strong><p class="meta">校内当面交易 · ${product.pickup}</p></div>
            ${badge("学生认证")}
          </div>
          ${bottomActionBar(`
            <button class="icon-btn favorite-btn ${state.favorite ? "active" : ""}" type="button" aria-label="收藏" onclick="state.favorite = !state.favorite; showToast(state.favorite ? '已收藏商品' : '已取消收藏'); render();">${categoryIcon("收藏")}</button>
            <button class="btn chat-action" type="button" onclick="routeMini('chat','c1')">聊一聊</button>
            <button class="btn ghost" type="button" ${canBuy ? "" : "disabled"} onclick="addToCart('${product.id}')">加购物车</button>
            <button class="btn primary" type="button" ${canBuy ? "" : "disabled"} onclick="routeMini('confirm')">立即购买</button>
          `)}
        </div>
      `);
    },
    cart: () => {
      const rows = state.cart.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return { ...item, product };
      });
      const total = rows.reduce((sum, item) => sum + (item.checked ? item.product.price * item.quantity : 0), 0);
      return miniShell(`
        <div class="stack with-bottom-bar">
          ${rows.length ? rows.map((item) => `
            <div class="product-card cart-item">
              <button class="product-img" type="button" data-kind="${item.product.category}" onclick="routeMini('detail','${item.product.id}')"><span class="product-mark">${categoryIcon(item.product.category)}</span><span>${item.product.category}</span></button>
              <div class="stack">
                <div class="row"><h3>${item.product.title}</h3><label class="check-control" aria-label="选择 ${item.product.title}"><input name="cartItem" type="checkbox" ${item.checked ? "checked" : ""} onchange="toggleCart('${item.product.id}')" /></label></div>
                <p class="meta">单价 ${money(item.product.price)} · 库存 ${item.product.stock}</p>
                <div class="row">
                  <div class="stepper"><button type="button" aria-label="减少">${categoryIcon("减少")}</button><span>${item.quantity}</span><button type="button" aria-label="增加">${categoryIcon("增加")}</button></div>
                  <span class="price">${money(item.product.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          `).join("") : emptyState("购物车为空", "看到喜欢的校园好物，可以先加入购物车再一起结算。", "去逛逛", "routeMini('home')")}
          ${bottomActionBar(`
            <div><span class="label">已选 ${rows.filter((item) => item.checked).length} 件</span><strong class="price">${money(total)}</strong></div>
            <button class="btn primary" type="button" ${total ? "" : "disabled"} onclick="routeMini('confirm')">结算</button>
          `)}
        </div>
      `, "cart");
    },
    confirm: () => miniShell(`
      <div class="stack with-bottom-bar">
        <button class="address-card" type="button" onclick="routeMini('address')"><span>${categoryIcon("地址")}</span><div><strong>李同学 13800000000</strong><p>东区 3 栋 501</p></div><em>更换</em></button>
        ${productCard(state.selectedProduct)}
        <label class="field"><span class="label">订单备注</span><textarea name="orderRemark">今晚 18:00 后方便自提</textarea></label>
        <p class="soft-note">提交前会校验库存、商品状态和默认地址。</p>
        ${bottomActionBar(`<div><span class="label">应付</span><strong class="price">${money(state.selectedProduct.price)}</strong></div><button class="btn primary" type="button" onclick="state.orderStatus='待付款'; routeMini('orderDetail'); showToast('订单已提交，进入模拟支付')">提交订单</button>`)}
      </div>
    `),
    orders: () => miniShell(`
      <div class="stack">
        <div class="status-tabs"><button class="active" type="button">全部</button><button type="button">待付款</button><button type="button">待发货</button><button type="button">售后</button></div>
        ${orders.map((order) => `
          <div class="order-card">
            <div class="row"><strong>${order.no}</strong>${badge(order.status, order.status === "售后中" ? "warn" : "")}</div>
            <p>${order.product}</p>
            <p class="meta">金额 ${money(order.amount)} · 支付 ${order.payment} · 退款 ${order.refund}</p>
            <div class="order-actions"><button class="btn primary" type="button" onclick="state.orderStatus='${order.status}'; routeMini('orderDetail')">查看详情</button></div>
          </div>
        `).join("")}
      </div>
    `, "profile"),
    orderDetail: () => {
      const actions = {
        待付款: `<button class="btn primary" type="button" onclick="state.orderStatus='待发货'; showToast('模拟支付成功，订单变为待发货'); render()">去付款</button>`,
        待发货: `<button class="btn ghost single-note-action" type="button" onclick="showToast('已提醒发布者尽快发货')">提醒发货</button>`,
        待收货: `<button class="btn primary" type="button" onclick="state.orderStatus='已完成'; showToast('已确认收货'); render()">确认收货</button>`,
        已完成: `<button class="btn primary" type="button" onclick="routeMini('review')">去评价</button>`,
        售后中: `<button class="btn ghost single-note-action" type="button" onclick="showToast('售后处理中，请留意消息')">查看售后进度</button>`
      };
      return miniShell(`
        <div class="stack with-bottom-bar">
          <div class="order-card">
            <div class="row"><strong>SO20260529001</strong>${badge(state.orderStatus, state.orderStatus === "待付款" ? "warn" : state.orderStatus === "已完成" ? "" : "blue")}</div>
            <p>商品：${state.selectedProduct.title}</p>
            <p class="meta">地址：李同学 13800000000 · 东区 3 栋 501</p>
            <p class="meta">发货信息：${state.orderStatus === "待收货" || state.orderStatus === "已完成" ? "校内自提：东区图书馆 18:30" : "发布者待发货"}</p>
            <div class="mini-timeline"><span class="done">待付款</span><span class="${state.orderStatus !== "待付款" ? "done" : ""}">待发货</span><span class="${state.orderStatus === "待收货" || state.orderStatus === "已完成" ? "done" : ""}">待收货</span><span class="${state.orderStatus === "已完成" ? "done" : ""}">已完成</span></div>
          </div>
          ${bottomActionBar(actions[state.orderStatus] || actions["待付款"])}
        </div>
      `, "profile");
    },
    review: () => miniShell(`
      <form class="form-card soft-form" onsubmit="event.preventDefault(); showToast('评价提交成功'); routeMini('orderDetail');">
        <strong>${state.selectedProduct.title}</strong>
        <fieldset class="choice-field"><legend>评分</legend><div class="choice-grid rating-grid"><label class="choice-pill"><input type="radio" name="rating" checked /><span>5 分</span></label><label class="choice-pill"><input type="radio" name="rating" /><span>4 分</span></label><label class="choice-pill"><input type="radio" name="rating" /><span>3 分</span></label></div></fieldset>
        <label class="field"><span class="label">评价内容</span><textarea name="reviewContent">商品与描述一致，线下交接顺利。</textarea></label>
        <button class="btn primary" type="submit">提交评价</button>
      </form>
    `, "profile"),
    wanted: () => miniShell(`
      <div class="stack">
        ${softSearch("wantedKeyword", "", "搜索想买的教材、台灯、耳机...", "搜索", "showToast('已按求购关键词筛选')")}
        <section class="wanted-market-hero">
          <div>
            <span>求购专区</span>
            <strong>同学们正在找</strong>
            <p>看到你有的物品，直接联系对方。</p>
          </div>
        </section>
        <div class="filter-chip-row">
          ${filterChip("排序", "最新发布", "showToast('已按最新求购排序')")}
          ${filterChip("预算", "全部预算", "showToast('预算筛选已收起到底部面板')", false)}
          ${filterChip("成色", "全部要求", "showToast('成色筛选已收起到底部面板')", false)}
        </div>
        <div class="result-summary"><strong>求购大厅</strong><span>${wantedPosts.length} 条</span></div>
        ${wantedPosts.length ? wantedPosts.map((item) => `
          <button class="wanted-card wanted-feed-card" type="button" onclick="routeMini('wantedDetail','${item.id}')">
            <span>${badge(item.status)}</span>
            <strong>${item.title}</strong>
            <p>${item.desc}</p>
            <div class="wanted-meta-row"><em>${item.user}</em><em>预算 ${item.price} 元</em><em>${item.condition}</em></div>
            <small>${item.updated}</small>
          </button>
        `).join("") : emptyState("暂无求购", "还没有同学发布求购，可以先发起一个需求。", "发起求购", "routeMini('wantedPublish')")}
        <button class="floating-action wanted-float" type="button" onclick="routeMini('wantedPublish')"><span>${categoryIcon("求购专区")}</span><strong>发求购</strong></button>
      </div>
    `, "wanted"),
    wantedPublish: () => miniShell(`
      <div class="stack with-bottom-bar">
        <form class="form-card soft-form" onsubmit="event.preventDefault(); showToast('求购发布成功，已回到求购大厅'); routeMini('wanted');">
          <div class="form-title"><strong>发布求购</strong><span>填写清楚预算和成色，同学更容易判断是否联系你</span></div>
          <label class="field"><span class="label">名称</span><input name="wantedTitle" value="求购高等数学教材下册" autocomplete="off" /></label>
          <fieldset class="choice-field range-field">
            <legend>期望价格区间</legend>
            <div class="range-selects">
              <label><span>最低金额</span><select name="wantedMin" aria-label="最低金额" onchange="updateWantedRange('wantedMin', this.value)">${selectOptions(minOptions, state.wantedMin)}</select></label>
              <span class="range-separator">至</span>
              <label><span>最高金额</span><select name="wantedMax" aria-label="最高金额" onchange="updateWantedRange('wantedMax', this.value)">${selectOptions(maxOptions, state.wantedMax)}</select></label>
            </div>
            <p class="generated-range">自动生成区间：${state.wantedMin}-${state.wantedMax} 元</p>
          </fieldset>
          <fieldset class="choice-field">
            <legend>成色要求</legend>
            <div class="choice-grid" role="radiogroup" aria-label="成色要求">
              <label class="choice-pill"><input type="radio" name="wantedCondition" value="不限" /><span>不限</span></label>
              <label class="choice-pill"><input type="radio" name="wantedCondition" value="七成新以上" /><span>七成新以上</span></label>
              <label class="choice-pill"><input type="radio" name="wantedCondition" value="八成新以上" checked /><span>八成新以上</span></label>
              <label class="choice-pill"><input type="radio" name="wantedCondition" value="九成新以上" /><span>九成新以上</span></label>
            </div>
          </fieldset>
          <label class="field"><span class="label">描述</span><textarea name="wantedDesc">希望可在东区图书馆自提。</textarea></label>
          ${bottomActionBar(`<button class="btn ghost" type="button" onclick="routeMini('wanted')">取消</button><button class="btn primary" type="submit">发布求购</button>`)}
        </form>
      </div>
    `, "wanted"),
    wantedDetail: () => {
      const wanted = state.selectedWanted || wantedPosts[0];
      return miniShell(`
        <div class="stack">
          <div class="screen-card stack wanted-detail">
            <div class="row"><strong>${wanted.title}</strong>${badge(wanted.status)}</div>
            <p class="meta">发布人 ${wanted.user} · 预算 ${wanted.price} 元 · ${wanted.condition}</p>
            <p>${wanted.desc}</p>
            <p class="meta">更新时间：${wanted.updated}</p>
          </div>
          ${bottomActionBar(`<button class="btn ghost" type="button" onclick="routeMini('wanted')">返回大厅</button><button class="btn primary" type="button" onclick="routeMini('chat','c2')">联系发布人</button>`)}
        </div>
      `, "wanted");
    },
    messages: () => miniShell(`
      <div class="message-page">
        <div class="message-title-row">
          <h3>消息</h3>
          <p class="meta">长按会话可置顶或删除</p>
        </div>
        <div class="message-list">
          ${conversations.map((item) => {
            const related = conversationItem(item);
            return `<button class="message-row ${item.pinned ? "pinned" : ""}" type="button" onclick="routeMini('chat','${item.id}')" oncontextmenu="event.preventDefault(); longPressConversation('${item.id}')" onpointerdown="this._pressTimer = setTimeout(() => longPressConversation('${item.id}'), 620)" onpointerup="clearTimeout(this._pressTimer)" onpointerleave="clearTimeout(this._pressTimer)">
              <span class="message-avatar">${item.avatar}</span>
              <span class="message-main">
                <span class="message-line">
                  <strong>${item.user}</strong>
                  <time>${item.time}</time>
                </span>
                <span class="message-preview">${item.last}</span>
                ${item.pinned ? `<span class="message-hint">已置顶</span>` : item.unread ? `<span class="message-hint unread">${item.unread} 条未读</span>` : ""}
              </span>
              <span class="message-thumb" data-kind="${related.category}">${categoryIcon(related.category)}</span>
            </button>`;
          }).join("")}
        </div>
        <div class="empty-message-note">
          <strong>暂无更多咨询</strong>
          <span>商品下架、账号禁用或违规删除时，会在会话中显示原因。</span>
        </div>
      </div>
    `, "messages"),
    chat: () => {
      const convo = state.selectedConversation || conversations[0];
      const disabled = convo.status === "违规消息被删除";
      const related = conversationItem(convo);
      return miniShell(`
        <div class="chat-page">
          <div class="chat-user-card">
            <span class="message-avatar">${convo.avatar}</span>
            <div>
              <strong>${convo.user}</strong>
              <p class="meta">${convo.type} · ${convo.status}</p>
            </div>
          </div>
          <button class="chat-product-card" type="button" onclick="${convo.productId ? `routeMini('detail','${convo.productId}')` : `routeMini('wantedDetail','${convo.wantedId || "w1"}')`}">
            <span class="message-thumb" data-kind="${related.category}">${categoryIcon(related.category)}</span>
            <span>
              <strong>${related.title}</strong>
              <em>${related.price ? `${related.price}${typeof related.price === "number" ? " 元" : " 元"}` : ""} · ${related.condition}</em>
            </span>
          </button>
          <div class="chat-thread">
            <time class="chat-time">2026-05-31 16:02</time>
            <div class="chat-line incoming"><span class="message-avatar small">${convo.avatar}</span><div class="chat-bubble incoming">同学你好，这个还在吗？</div></div>
            <div class="chat-line outgoing"><div class="chat-bubble outgoing">${convo.last}</div></div>
            ${state.chatSent ? `<div class="chat-line outgoing"><div class="chat-bubble outgoing">可以，今晚 18:30 在东区图书馆。</div></div>` : ""}
            ${disabled ? `<div class="chat-disabled">该咨询已被管理员处理，不能继续发送。</div>` : ""}
          </div>
          <div class="chat-compose ${disabled ? "disabled" : ""}">
            <button class="icon-btn" type="button" aria-label="表情" ${disabled ? "disabled" : ""} onclick="showToast('表情面板已打开')">${categoryIcon("表情")}</button>
            <input name="chatMessage" aria-label="消息内容" value="可以，今晚 18:30 在东区图书馆。" ${disabled ? "disabled" : ""} onkeydown="if(event.key==='Enter'){event.preventDefault(); sendChatMessage()}" autocomplete="off" />
            <button class="icon-btn" type="button" aria-label="附件" ${disabled ? "disabled" : ""} onclick="toggleAttachmentPanel()">${categoryIcon("附件")}</button>
          </div>
          ${state.attachmentOpen && !disabled ? `<div class="attachment-sheet"><button type="button" onclick="showToast('已选择图片')">${categoryIcon("图片")}<span>图片</span></button><button type="button" onclick="showToast('已打开相机')">${categoryIcon("相机")}<span>相机</span></button></div>` : ""}
        </div>
      `, "messages");
    },
    favorites: () => miniShell(`
      <div class="stack">
        ${state.favorite ? productCard(state.selectedProduct) : emptyState("收藏为空", "点亮商品详情里的收藏图标，之后可以在这里快速找到。", "去首页看看", "routeMini('home')")}
      </div>
    `, "profile"),
    address: () => miniShell(`
      <div class="stack with-bottom-bar">
        <div class="address-list-card"><div class="row"><strong>李同学</strong><span>${badge("默认")}${moreButton("地址更多")}</span></div><p>13800000000</p><p class="meta">东区 3 栋 501</p></div>
        <form class="form-card soft-form compact-form"><strong>新增地址</strong><label class="field"><span class="label">姓名</span><input name="receiverName" value="李同学" autocomplete="name" /></label><label class="field"><span class="label">手机号</span><input name="receiverPhone" type="tel" value="13800000000" autocomplete="tel" /></label><label class="field"><span class="label">详细地址</span><input name="receiverAddress" value="东区 3 栋 501" autocomplete="street-address" /></label></form>
        ${bottomActionBar(`<button class="btn primary" type="button" onclick="showToast('地址已保存')">保存地址</button>`)}
      </div>
    `, "profile"),
    profile: () => miniShell(`
      <div class="stack">
        <div class="profile-hero">
          <div class="profile-avatar">李</div>
          <div><strong>李同学</strong><p class="meta">13800000000 · 普通用户 · 可买可卖</p></div>
          ${badge("已登录")}
        </div>
        <div class="profile-stats"><div><strong>3</strong><span>买入</span></div><div><strong>12</strong><span>发布</span></div><div><strong>2</strong><span>卖出</span></div><div><strong>1</strong><span>求购</span></div></div>
        <div class="profile-section">
          <strong>交易</strong>
          <div class="grid-2">${categoryButton("买入订单", "routeMini('orders')")}${categoryButton("我的求购", "routeMini('wanted')")}</div>
        </div>
        <div class="profile-section stall-section">
          <div class="row"><strong>我的校园摊位</strong><button class="btn primary" type="button" onclick="routeSell('publish')">卖闲置</button></div>
          <div class="grid-2">${categoryButton("我的发布", "routeSell('posts')")}${categoryButton("卖出订单", "routeSell('sellOrders')")}</div>
        </div>
        <div class="profile-section">
          <strong>工具</strong>
          <div class="grid-2">${categoryButton("收藏", "routeMini('favorites')")}${categoryButton("地址", "routeMini('address')")}${categoryButton("店铺资料", "routeSell('shop')")}</div>
        </div>
        <button class="logout-link" type="button" onclick="routeMini('login')">退出登录</button>
      </div>
    `, "profile")
  };
  app.innerHTML = pages[state.miniPage]();
}
