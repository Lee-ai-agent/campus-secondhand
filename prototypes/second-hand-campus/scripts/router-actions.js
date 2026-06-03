function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function confirmAction(message, successMessage) {
  if (typeof window.confirm === "function" && !window.confirm(message)) return;
  showToast(`${successMessage}，可在提示时间内撤销`);
}

function rejectAudit() {
  const reason = typeof window.prompt === "function" ? window.prompt("请输入驳回原因", "图片不清晰") : "图片不清晰";
  if (!reason) {
    showToast("已取消驳回");
    return;
  }
  showToast(`已驳回，原因：${reason}`);
}

function conversationItem(conversation) {
  if (conversation.productId) return products.find((item) => item.id === conversation.productId) || products[0];
  if (conversation.wantedId) {
    const wanted = wantedPosts.find((item) => item.id === conversation.wantedId) || wantedPosts[0];
    return { title: wanted.title, category: "求购专区", price: wanted.price, condition: wanted.condition, status: wanted.status };
  }
  return products[0];
}

function longPressConversation(id) {
  const conversation = conversations.find((item) => item.id === id);
  showToast(`${conversation ? conversation.user : "会话"}：长按可置顶或删除`);
}

function toggleAttachmentPanel() {
  state.attachmentOpen = !state.attachmentOpen;
  render();
  syncHash();
}

function sendChatMessage() {
  state.chatSent = true;
  state.attachmentOpen = false;
  showToast("已发送");
  render();
  syncHash();
}

function routeId() {
  if (state.miniPage === "detail") return state.selectedProduct.id;
  if (state.miniPage === "wantedDetail") return state.selectedWanted.id;
  if (state.miniPage === "chat") return state.selectedConversation.id;
  return "";
}

function syncHash() {
  if (!window.location || !window.history) return;
  const params = new URLSearchParams();
  params.set("mode", state.mode);
  params.set("mini", state.miniPage);
  params.set("admin", state.adminPage);
  if (routeId()) params.set("id", routeId());
  if (state.miniPage === "list") {
    params.set("category", state.listCategory);
    params.set("sort", state.listSort);
    params.set("condition", state.listCondition);
    params.set("price", state.listPrice);
    params.set("keyword", state.listKeyword);
  }
  window.history.replaceState(null, "", `#${params.toString()}`);
}

function applyHash() {
  if (!window.location || !window.location.hash) return;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const mode = params.get("mode");
  const mini = params.get("mini");
  const admin = params.get("admin");
  const id = params.get("id");
  if (mode === "mini" || mode === "admin") state.mode = mode;
  if (mini) state.miniPage = mini;
  if (admin) state.adminPage = admin;
  if (params.get("category")) state.listCategory = params.get("category");
  if (params.get("sort")) state.listSort = params.get("sort");
  if (params.get("condition")) state.listCondition = params.get("condition");
  if (params.get("price")) state.listPrice = params.get("price");
  if (params.has("keyword")) state.listKeyword = params.get("keyword");
  if (id && state.miniPage === "detail") state.selectedProduct = products.find((item) => item.id === id) || state.selectedProduct;
  if (id && state.miniPage === "wantedDetail") state.selectedWanted = wantedPosts.find((item) => item.id === id) || state.selectedWanted;
  if (id && state.miniPage === "chat") state.selectedConversation = conversations.find((item) => item.id === id) || state.selectedConversation;
}

function listProducts() {
  const keyword = state.listKeyword.trim();
  return products
    .filter((item) => item.audit !== "待审核")
    .filter((item) => state.listCategory === "全部分类" || item.category === state.listCategory)
    .filter((item) => state.listCondition === "全部成色" || item.condition === state.listCondition)
    .filter((item) => {
      if (state.listPrice === "0-50 元") return item.price <= 50;
      if (state.listPrice === "50-100 元") return item.price > 50 && item.price <= 100;
      if (state.listPrice === "100 元以上") return item.price > 100;
      return true;
    })
    .filter((item) => !keyword || item.title.includes(keyword) || item.category.includes(keyword))
    .sort((a, b) => {
      if (state.listSort === "价格从低到高") return a.price - b.price;
      if (state.listSort === "价格从高到低") return b.price - a.price;
      return b.updated.localeCompare(a.updated);
    });
}

function routeList(category = "全部分类", sort = "最新发布", keyword = null) {
  state.mode = "mini";
  state.miniPage = "list";
  state.listCategory = category;
  state.listSort = sort;
  state.listCondition = "全部成色";
  state.listPrice = "全部价格";
  state.listKeyword = keyword === null ? (category === "全部分类" ? "" : category) : keyword;
  render();
  syncHash();
}

function updateListFilter(field, value) {
  state[field] = value;
  render();
  syncHash();
}

function cycleListFilter(field) {
  const options = filterOptions[field];
  const index = options.indexOf(state[field]);
  state[field] = options[(index + 1) % options.length];
  showToast(`已切换为：${state[field]}`);
  render();
  syncHash();
}

function resetListFilters() {
  state.listCategory = "全部分类";
  state.listSort = "最新发布";
  state.listCondition = "全部成色";
  state.listPrice = "全部价格";
  state.listKeyword = "";
  showToast("筛选已重置");
  render();
  syncHash();
}

function updateWantedRange(field, value) {
  state[field] = value;
  if (Number(state.wantedMax) <= Number(state.wantedMin)) {
    state.wantedMax = ["15", "20", "25", "30", "50", "80", "100", "150", "200", "300"].find((item) => Number(item) > Number(state.wantedMin)) || "300";
    showToast("最高金额已自动调整为大于最低金额");
  }
  render();
  syncHash();
}

function routeMini(page, productId) {
  state.mode = "mini";
  state.miniPage = page;
  if (productId) {
    state.selectedProduct = products.find((item) => item.id === productId) || products[0];
  }
  if (page === "wantedDetail" && productId) {
    state.selectedWanted = wantedPosts.find((item) => item.id === productId) || wantedPosts[0];
  }
  if (page === "chat" && productId) {
    state.selectedConversation = conversations.find((item) => item.id === productId) || conversations[0];
    state.chatSent = false;
    state.attachmentOpen = false;
  }
  render();
  syncHash();
}

function routeSell(page) {
  state.mode = "mini";
  state.miniPage = page;
  render();
  syncHash();
}

function routeAdmin(page) {
  state.mode = "admin";
  state.adminPage = page;
  render();
  syncHash();
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  render();
  syncHash();
}

function addToCart(productId) {
  const item = state.cart.find((cartItem) => cartItem.productId === productId);
  if (item) {
    item.quantity += 1;
  } else {
    state.cart.push({ productId, quantity: 1, checked: true });
  }
  showToast("已加入购物车");
  routeMini("cart");
}

function toggleCart(productId) {
  const item = state.cart.find((cartItem) => cartItem.productId === productId);
  if (item) item.checked = !item.checked;
  render();
}
