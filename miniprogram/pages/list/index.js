const { request } = require('../../utils/api');

const categories = ['全部分类', '教材资料', '数码电子', '生活用品', '运动户外', '美妆服饰', '票券卡券'];
const prices = ['全部价格', '0-50 元', '50-100 元', '100 元以上'];
const conditions = ['全部成色', '九成新', '八成新', '七成新'];
const sorts = ['最新发布', '价格从低到高', '价格从高到低'];

Page({
  data: {
    keyword: '',
    categoryId: null,
    currentCategory: '全部分类',
    currentPrice: '全部价格',
    currentCondition: '全部成色',
    currentSort: '最新发布',
    products: []
  },
  onLoad(query) {
    if (query.categoryId) this.setData({ categoryId: Number(query.categoryId) });
    if (query.sort === 'latest') this.setData({ currentSort: '最新发布' });
    this.loadProducts();
  },
  onKeyword(e) { this.setData({ keyword: e.detail.value }); },
  async loadProducts() {
    const data = await request('/products', {
      data: {
        keyword: this.data.keyword,
        categoryId: this.data.categoryId || undefined,
        status: 'approved'
      }
    });
    const products = (data.items || []).map(p => ({
      ...p,
      categoryName: p.categoryName || '其他',
      sellerNickname: p.sellerNickname || '同学'
    }));
    this.setData({ products });
  },
  cycle(e, field, options) {
    const next = (options.indexOf(e) + 1) % options.length;
    this.setData({ [field]: options[next] });
    this.loadProducts();
  },
  cycleCategory() { this.cycle(this.data.currentCategory, 'currentCategory', categories); },
  cyclePrice() { this.cycle(this.data.currentPrice, 'currentPrice', prices); },
  cycleCondition() { this.cycle(this.data.currentCondition, 'currentCondition', conditions); },
  cycleSort() { this.cycle(this.data.currentSort, 'currentSort', sorts); },
  resetFilters() {
    this.setData({ currentCategory: '全部分类', currentPrice: '全部价格', currentCondition: '全部成色', currentSort: '最新发布', keyword: '' });
    this.loadProducts();
  },
  goDetail(e) { wx.navigateTo({ url: `/pages/detail/index?id=${e.currentTarget.dataset.id}` }); },
  goWanted() { wx.switchTab({ url: '/pages/wanted/index' }); }
});
