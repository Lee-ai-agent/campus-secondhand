const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { title: '', minPrice: '15', maxPrice: '25', conditionLevel: '八成新以上', description: '' },
  onTitle(e) { this.setData({ title: e.detail.value }); },
  onMin(e) { this.setData({ minPrice: e.detail.value }); },
  onMax(e) { this.setData({ maxPrice: e.detail.value }); },
  onDesc(e) { this.setData({ description: e.detail.value }); },
  setCondition(e) { this.setData({ conditionLevel: e.currentTarget.dataset.value }); },
  async submit() {
    if (!app.hasSession()) { wx.navigateTo({ url: '/pages/login/index' }); return; }
    await request('/wanted', {
      method: 'POST',
      data: {
        userId: app.globalData.user.userId,
        title: this.data.title,
        minPrice: Number(this.data.minPrice),
        maxPrice: Number(this.data.maxPrice),
        conditionLevel: this.data.conditionLevel,
        description: this.data.description
      }
    });
    wx.showToast({ title: '求购发布成功' });
    wx.switchTab({ url: '/pages/wanted/index' });
  },
  cancel() { wx.navigateBack(); }
});
