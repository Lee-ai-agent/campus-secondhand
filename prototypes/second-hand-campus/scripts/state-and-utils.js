const state = {
  mode: "mini",
  miniPage: "home",
  adminPage: "dashboard",
  selectedProduct: products[0],
  selectedWanted: wantedPosts[0],
  selectedConversation: conversations[0],
  cart: [{ productId: "p1", quantity: 1, checked: true }],
  orderStatus: "待付款",
  listCategory: "全部分类",
  listSort: "最新发布",
  listCondition: "全部成色",
  listPrice: "全部价格",
  listKeyword: "教材",
  wantedMin: "15",
  wantedMax: "25",
  chatSent: false,
  attachmentOpen: false,
  favorite: false,
  sellerSubmitted: false,
  adminAudited: false,
  disabledUser: false
};

const filterOptions = {
  listCategory: ["全部分类", "教材资料", "数码电子", "生活用品", "运动户外", "美妆服饰", "票券卡券"],
  listSort: ["最新发布", "价格从低到高", "价格从高到低"],
  listCondition: ["全部成色", "九成新", "八成新", "七成新"],
  listPrice: ["全部价格", "0-50 元", "50-100 元", "100 元以上"]
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const moneyFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  minimumFractionDigits: 2
});

function money(value) {
  return moneyFormatter.format(value);
}

function svgIcon(paths) {
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function categoryIcon(name) {
  const icons = {
    教材资料: svgIcon('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20"/><path d="M8 12h8"/>'),
    数码电子: svgIcon('<rect x="6" y="3" width="12" height="18" rx="2.5"/><path d="M10 6h4"/><path d="M11.5 17.5h1"/>'),
    生活用品: svgIcon('<path d="M7 10h10l-1 10H8L7 10Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/><path d="M6 10h12"/>'),
    运动户外: svgIcon('<circle cx="8" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M8 17l4-8h3l3 8"/><path d="M10 9h3"/><path d="M15 9l-3 8"/>'),
    美妆服饰: svgIcon('<path d="M8 4l4 3 4-3 4 5-3 2v9H7v-9L4 9l4-5Z"/><path d="M10 7c.6.8 1.2 1.2 2 1.2S13.4 7.8 14 7"/>'),
    票券卡券: svgIcon('<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4V7Z"/><path d="M9 8h6"/><path d="M9 16h6"/><path d="M12 10v4"/>'),
    搜索: svgIcon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l4 4"/>'),
    表情: svgIcon('<circle cx="12" cy="12" r="8"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M8.5 14.5c1.8 1.8 5.2 1.8 7 0"/>'),
    附件: svgIcon('<path d="M12 5v14"/><path d="M5 12h14"/>'),
    图片: svgIcon('<rect x="4" y="5" width="16" height="14" rx="2"/><path d="m8 14 2.2-2.2a1.5 1.5 0 0 1 2.1 0L16 15.5"/><circle cx="8.5" cy="9.5" r="1.2"/>'),
    相机: svgIcon('<path d="M7 7.5 8.5 5h7L17 7.5h2a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2h2Z"/><circle cx="12" cy="13" r="3.2"/>'),
    求购专区: svgIcon('<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5 5"/><path d="M10.5 7.5v6"/><path d="M7.5 10.5h6"/>'),
    消息: svgIcon('<path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H10l-5 4v-5.5A3.5 3.5 0 0 1 5 11.5v-5Z"/><path d="M8 8h8"/><path d="M8 11h5"/>'),
    最新上架: svgIcon('<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 19h14"/>'),
    首页: svgIcon('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>'),
    购物车: svgIcon('<path d="M5 5h2l2 11h8l2-8H8"/><circle cx="10" cy="20" r="1"/><circle cx="17" cy="20" r="1"/>'),
    我的: svgIcon('<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>'),
    买入订单: svgIcon('<path d="M7 3h10v18H7z"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h3"/>'),
    卖闲置: svgIcon('<path d="M12 5v14"/><path d="M5 12h14"/><path d="M6 7h12a2 2 0 0 1 2 2v8H4V9a2 2 0 0 1 2-2Z"/>'),
    收藏: svgIcon('<path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 4Z"/>'),
    地址: svgIcon('<path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/>'),
    我的求购: svgIcon('<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5 5"/><path d="M10.5 7.5v6"/><path d="M7.5 10.5h6"/>'),
    消息中心: svgIcon('<path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H10l-5 4v-5.5A3.5 3.5 0 0 1 5 11.5v-5Z"/><path d="M8 8h8"/><path d="M8 11h5"/>'),
    退出登录: svgIcon('<path d="M10 17l5-5-5-5"/><path d="M15 12H4"/><path d="M13 4h5v16h-5"/>'),
    发布闲置: svgIcon('<path d="M12 5v14"/><path d="M5 12h14"/><rect x="4" y="4" width="16" height="16" rx="3"/>'),
    我的发布: svgIcon('<path d="M6 4h12v16H6z"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h3"/>'),
    卖出订单: svgIcon('<path d="M4 7h16v12H4z"/><path d="M8 7V5h8v2"/><path d="M8 12h8"/><path d="M8 16h5"/>'),
    咨询回复: svgIcon('<path d="M4 5h12a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H9l-5 4V5Z"/><path d="m14 8 2 2-2 2"/><path d="M10 10h6"/>'),
    店铺资料: svgIcon('<path d="M5 9h14l-1 11H6L5 9Z"/><path d="M7 9V6a5 5 0 0 1 10 0v3"/><path d="M9 14h6"/>'),
    返回我的: svgIcon('<path d="m11 7-5 5 5 5"/><path d="M6 12h12"/>'),
    更多: svgIcon('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'),
    减少: svgIcon('<path d="M6 12h12"/>'),
    增加: svgIcon('<path d="M12 5v14"/><path d="M5 12h14"/>')
  };
  return icons[name] || svgIcon('<circle cx="12" cy="12" r="7"/><path d="M12 8v4l3 2"/>');
}
