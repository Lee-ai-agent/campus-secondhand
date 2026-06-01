const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { posts: [] },
  onShow() { this.load(); },
  async load() {
    this.setData({ posts: await request(`/products?sellerId=${app.globalData.user.userId}`) });
  },
  editPost(e) {
    wx.showToast({ title: '编辑功能开发中', icon: 'none' });
  },
  goPublish() { wx.navigateTo({ url: '/pages/seller-publish/index' }); }
});
