const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { id: null, product: null, favorite: false, canBuy: false },
  onLoad(query) {
    this.setData({ id: query.id });
    this.load();
  },
  async load() {
    const product = await request(`/products/${this.data.id}`);
    const canBuy = product.status === 'approved';
    this.setData({
      product: {
        ...product,
        categoryName: product.categoryName || '其他',
        sellerNickname: product.sellerNickname || '同学'
      },
      canBuy
    });
  },
  requireLogin() {
    if (!app.hasSession()) { wx.navigateTo({ url: '/pages/login/index' }); return false; }
    return true;
  },
  toggleFavorite() {
    this.setData({ favorite: !this.data.favorite });
    wx.showToast({ title: this.data.favorite ? '已收藏' : '已取消收藏', icon: 'none' });
  },
  async buyNow() {
    if (!this.requireLogin()) return;
    wx.navigateTo({
      url: `/pages/confirm/index?productId=${this.data.id}&title=${encodeURIComponent(this.data.product.title)}&price=${this.data.product.price}&pickup=${encodeURIComponent(this.data.product.pickupLocation || '')}`
    });
  },
  async sendMessage() {
    if (!this.requireLogin()) return;
    wx.navigateTo({
      url: `/pages/chat/index?productId=${this.data.id}&sellerId=${this.data.product.sellerId}&productTitle=${encodeURIComponent(this.data.product.title)}&productPrice=${this.data.product.price}`
    });
  },
  goWanted() { wx.switchTab({ url: '/pages/wanted/index' }); }
});
