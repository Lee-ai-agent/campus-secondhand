const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: {
    title: '', price: '32', stock: '2', categoryId: 3, conditionLevel: '九成新',
    description: '', pickupLocation: '', images: []
  },
  onTitle(e) { this.setData({ title: e.detail.value }); },
  onPrice(e) { this.setData({ price: e.detail.value }); },
  onStock(e) { this.setData({ stock: e.detail.value }); },
  onDesc(e) { this.setData({ description: e.detail.value }); },
  onPickup(e) { this.setData({ pickupLocation: e.detail.value }); },
  setCategory(e) { this.setData({ categoryId: Number(e.currentTarget.dataset.id) }); },
  setCondition(e) { this.setData({ conditionLevel: e.currentTarget.dataset.value }); },
  async submit() {
    await request('/products', {
      method: 'POST',
      data: {
        sellerId: app.globalData.user.userId,
        categoryId: this.data.categoryId,
        title: this.data.title,
        description: this.data.description,
        price: Number(this.data.price),
        stock: Number(this.data.stock),
        conditionLevel: this.data.conditionLevel,
        pickupLocation: this.data.pickupLocation,
        images: this.data.images
      }
    });
    wx.showToast({ title: '已提交审核' });
    wx.navigateTo({ url: '/pages/seller-posts/index' });
  },
  saveDraft() { wx.showToast({ title: '草稿已保存', icon: 'none' }); }
});
