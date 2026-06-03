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
    if (!this.data.title.trim()) { wx.showToast({ title: '请输入求购名称', icon: 'none' }); return; }
    if (!this.data.minPrice || Number(this.data.minPrice) <= 0) { wx.showToast({ title: '请输入有效最低价', icon: 'none' }); return; }
    if (!this.data.maxPrice || Number(this.data.maxPrice) <= 0) { wx.showToast({ title: '请输入有效最高价', icon: 'none' }); return; }
    if (Number(this.data.minPrice) > Number(this.data.maxPrice)) { wx.showToast({ title: '最低价不能高于最高价', icon: 'none' }); return; }
    if (!this.data.description.trim()) { wx.showToast({ title: '请输入描述', icon: 'none' }); return; }
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
