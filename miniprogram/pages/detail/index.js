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
    const canBuy = product.stock > 0 && product.status === 'ON_SALE';
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
  async addCart() {
    if (!this.requireLogin()) return;
    await request('/cart/items', {
      method: 'POST',
      data: { userId: app.globalData.user.userId, productId: Number(this.data.id), quantity: 1 }
    });
    wx.showToast({ title: '已加入购物车' });
  },
  async buyNow() {
    if (!this.requireLogin()) return;
    await request('/orders', {
      method: 'POST',
      data: {
        buyerId: app.globalData.user.userId,
        productId: Number(this.data.id),
        quantity: 1,
        receiverName: '李同学',
        receiverPhone: '13800000001',
        receiverAddress: '北区 3 栋 502'
      }
    });
    wx.navigateTo({ url: '/pages/orders/index' });
  },
  async sendMessage() {
    if (!this.requireLogin()) return;
    await request('/messages', {
      method: 'POST',
      data: {
        senderId: app.globalData.user.userId,
        receiverId: this.data.product.sellerId,
        productId: Number(this.data.id),
        content: '你好，这个商品还在吗？'
      }
    });
    wx.switchTab({ url: '/pages/messages/index' });
  },
  goWanted() { wx.switchTab({ url: '/pages/wanted/index' }); }
});
