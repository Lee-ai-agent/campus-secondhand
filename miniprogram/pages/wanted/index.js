const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { posts: [] },
  onShow() { this.load(); },
  async load() { this.setData({ posts: await request('/wanted') }); },
  viewDetail(e) {
    wx.navigateTo({ url: `/pages/wanted-detail/index?id=${e.currentTarget.dataset.id}` });
  },
  goPublish() {
    if (!app.hasSession()) { wx.navigateTo({ url: '/pages/login/index' }); return; }
    wx.navigateTo({ url: '/pages/wanted-publish/index' });
  }
});
