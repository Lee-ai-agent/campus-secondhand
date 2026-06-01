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
