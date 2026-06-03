const { request } = require('../../utils/api');

Page({
  data: {
    keyword: '',
    categoryId: null,
    categories: [
      { id: 1, name: '教材资料', iconKey: 'books' },
      { id: 2, name: '数码电子', iconKey: 'digital' },
      { id: 3, name: '生活用品', iconKey: 'life' },
      { id: 4, name: '运动户外', iconKey: 'sport' },
      { id: 5, name: '美妆服饰', iconKey: 'fashion' },
      { id: 6, name: '票券卡券', iconKey: 'ticket' }
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
      if (cats && cats.length) {
        const catIds = new Set(cats.map(c => c.id));
        const merged = cats.map(c => ({
          ...c,
          name: this.getCatDisplayName(c.name),
          iconKey: this.getCatIconKey(c.name)
        }));
        const extras = this.data.categories.filter(c => !catIds.has(c.id));
        this.setData({ categories: [...merged, ...extras] });
      }
    } catch (_) {}
    const data = await request('/products', {
      data: { keyword: this.data.keyword, categoryId: this.data.categoryId || undefined, status: 'approved' }
    });
    const products = (data.items || []).map(p => ({
      ...p,
      categoryName: this.getCatDisplayName(p.categoryName || this.getCatName(p.categoryId)),
      sellerNickname: p.sellerNickname || '同学',
      primaryImage: this.normalizeImageUrl((p.images || [])[0])
    }));
    this.setData({ products });
  },
  normalizeImageUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//.test(url)) return url;
    const app = getApp();
    return `${app.globalData.apiBase.replace(/\/api$/, '')}${url}`;
  },
  getCatIconKey(name) {
    const map = {
      '教材': 'books',
      '教材资料': 'books',
      '教材教辅': 'books',
      '数码': 'digital',
      '数码电子': 'digital',
      '生活用品': 'life',
      '运动户外': 'sport',
      '美妆服饰': 'fashion',
      '票券卡券': 'ticket'
    };
    return map[name] || 'package';
  },
  getCatDisplayName(name) {
    const map = { '教材': '教材教辅', '教材资料': '教材教辅', '数码': '数码电子' };
    return map[name] || name || '其他';
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
  goSeller() { wx.switchTab({ url: '/pages/seller/index' }); },
  goWanted() { wx.switchTab({ url: '/pages/wanted/index' }); },
  goAll() { wx.navigateTo({ url: '/pages/list/index' }); },
  goAllLatest() { wx.navigateTo({ url: '/pages/list/index?sort=latest' }); }
});
