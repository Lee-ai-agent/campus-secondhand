function renderSeller() {
  const pages = {
    sell: () => miniShell(`
      <div class="stack">
        <div class="banner seller-banner"><span class="banner-kicker">个人摊位</span><h3>我的校园摊位</h3><p>发布闲置、看审核、处理卖出订单都在这里。</p></div>
        <div class="stat-grid mini-stats"><div class="stat"><span class="label">发布</span><strong>12</strong></div><div class="stat"><span class="label">待发货</span><strong>2</strong></div><div class="stat"><span class="label">咨询</span><strong>3</strong></div><div class="stat"><span class="label">成交</span><strong>8</strong></div></div>
        <div class="grid-2">${categoryButton("发布闲置", "routeSell('publish')")}${categoryButton("我的发布", "routeSell('posts')")}${categoryButton("卖出订单", "routeSell('sellOrders')")}${categoryButton("店铺资料", "routeSell('shop')")}</div>
      </div>
    `, "profile"),
    publish: () => miniShell(`
      <form class="form-card soft-form publish-form" onsubmit="event.preventDefault(); state.sellerSubmitted = true; showToast('已提交管理员审核'); routeSell('posts');">
        <div class="upload-cover"><span>${categoryIcon("图片")}</span><strong>添加商品图片</strong><em>最多 9 张</em></div>
        <div class="form-title"><strong>发布闲置</strong><span>审核通过后展示在商品流</span></div>
        <label class="field"><span class="label">标题</span><input name="productTitle" value="毕业季台灯" autocomplete="off" /></label>
        <label class="field"><span class="label">分类</span><select name="productCategory"><option>生活用品</option><option>教材资料</option></select></label>
        <div class="grid-2"><label class="field"><span class="label">价格</span><input name="productPrice" type="number" min="0" step="0.01" value="32" inputmode="decimal" /></label><label class="field"><span class="label">库存</span><input name="productStock" type="number" min="0" step="1" value="2" inputmode="numeric" /></label></div>
        <fieldset class="choice-field"><legend>成色</legend><div class="choice-grid"><label class="choice-pill"><input type="radio" name="productCondition" checked /><span>九成新</span></label><label class="choice-pill"><input type="radio" name="productCondition" /><span>八成新</span></label><label class="choice-pill"><input type="radio" name="productCondition" /><span>七成新</span></label><label class="choice-pill"><input type="radio" name="productCondition" /><span>其他</span></label></div></fieldset>
        <label class="field"><span class="label">描述</span><textarea name="productDesc">护眼台灯，亮度可调，毕业离校转让。</textarea></label>
        <label class="field"><span class="label">取货地点</span><input name="pickupPlace" value="西区操场" autocomplete="off" /></label>
        ${bottomActionBar(`<button class="btn ghost" type="button" onclick="showToast('草稿已保存')">存草稿</button><button class="btn primary" type="submit">提交审核</button>`)}
      </form>
    `, "profile"),
    posts: () => miniShell(`
      <div class="stack">
        <div class="status-tabs"><button class="active" type="button">全部</button><button type="button">待审核</button><button type="button">已上架</button><button type="button">驳回</button></div>
        ${[products[0], products[3]].map((item) => `<div class="post-card"><button class="product-img" type="button" data-kind="${item.category}" onclick="routeMini('detail','${item.id}')"><span class="product-mark">${categoryIcon(item.category)}</span></button><div><div class="row"><strong>${item.title}</strong>${badge(state.sellerSubmitted && item.id === "p4" ? "待审核" : item.audit, item.audit === "待审核" ? "warn" : "")}</div><p class="meta">价格 ${money(item.price)} · 库存 ${item.stock}</p><p class="meta">${item.id === "p4" ? "图片不清晰，可编辑后重新提交。" : "审核通过，可被其他用户搜索购买。"}</p><div class="order-actions"><button class="btn primary" type="button" onclick="routeSell('publish')">编辑</button>${moreButton("发布更多")}</div></div></div>`).join("")}
      </div>
    `, "profile"),
    sellOrders: () => miniShell(`
      <div class="stack">
        <div class="status-tabs"><button class="active" type="button">全部</button><button type="button">待发货</button><button type="button">待收货</button><button type="button">售后</button></div>
        ${orders.slice(1).map((order) => `<div class="order-card"><div class="row"><strong>${order.no}</strong>${badge(order.status, order.status === "售后中" ? "warn" : "blue")}</div><p>${order.product}</p><p class="meta">买方 ${order.buyer} · 金额 ${money(order.amount)} · 东区 3 栋 501</p><div class="order-actions"><button class="btn primary" type="button" onclick="${order.status === "售后中" ? "routeSell('refund')" : "routeSell('ship')"}">${order.status === "售后中" ? "处理退款" : "发货"}</button>${moreButton("订单更多")}</div></div>`).join("")}
      </div>
    `, "profile"),
    ship: () => miniShell(`
      <form class="form-card soft-form" onsubmit="event.preventDefault(); state.orderStatus='待收货'; showToast('发货成功，订单变为待收货'); routeSell('sellOrders');">
        <div class="form-title"><strong>订单发货</strong><span>校园内优先当面交易</span></div>
        <label class="field"><span class="label">发货方式</span><select name="deliveryType"><option>当面交易/无需物流</option><option>快递/物流单号</option></select></label>
        <label class="field"><span class="label">物流单号</span><input name="trackingNo" placeholder="当面交易可不填…" autocomplete="off" /></label>
        <label class="field"><span class="label">取货说明</span><input name="pickupNote" value="东区图书馆 18:30 自提" autocomplete="off" /></label>
        <label class="field"><span class="label">备注</span><textarea name="deliveryRemark">请携带学生卡核验。</textarea></label>
        <button class="btn primary" type="submit">确认发货</button>
        <p class="soft-note">当面交易时物流单号可为空，但取货说明必填。</p>
      </form>
    `, "profile"),
    refund: () => miniShell(`
      <form class="form-card soft-form" onsubmit="event.preventDefault(); showToast('退款处理结果已记录'); routeSell('sellOrders');">
        <div class="form-title"><strong>退款处理</strong><span>先沟通，再确认处理结果</span></div>
        <p class="meta">退款原因：商品与描述不符。订单：SO20260527003。买方：钱同学。</p>
        <label class="field"><span class="label">处理备注</span><textarea name="refundRemark">已与买方沟通，同意退款。</textarea></label>
        <div class="btn-row"><button class="btn primary" type="submit">同意退款</button><button class="btn danger" type="button" onclick="showToast('已拒绝退款并记录原因')">拒绝退款</button></div>
      </form>
    `, "profile"),
    consultReplies: () => miniShell(`
      <div class="stack">
        ${conversations.slice(0, 2).map((item) => `<button class="message-row" type="button" onclick="routeMini('chat','${item.id}')"><span class="message-avatar">${item.avatar}</span><span class="message-main"><span class="message-line"><strong>${item.user}</strong><time>${item.time}</time></span><span class="message-preview">${item.last}</span></span><span class="message-thumb" data-kind="${conversationItem(item).category}">${categoryIcon(conversationItem(item).category)}</span></button>`).join("")}
      </div>
    `, "profile"),
    shop: () => miniShell(`
      <form class="form-card soft-form" onsubmit="event.preventDefault(); showToast('店铺资料已保存');">
        <div class="form-title"><strong>店铺资料</strong><span>展示给联系你的同学</span></div>
        <label class="field"><span class="label">个人简介</span><textarea name="shopIntro">毕业季闲置转让，教材和宿舍用品为主。</textarea></label>
        <label class="field"><span class="label">联系方式</span><input name="shopPhone" type="tel" value="13800000000" autocomplete="tel" /></label>
        <label class="field"><span class="label">校园取货地点</span><input name="shopPickup" value="东区图书馆 / 西区操场" autocomplete="off" /></label>
        <button class="btn primary" type="submit">保存</button>
      </form>
    `, "profile")
  };
  app.innerHTML = pages[state.miniPage]();
}
