const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { username: 'student01', password: '123456' },
  onUsername(e) { this.setData({ username: e.detail.value }); },
  onPassword(e) { this.setData({ password: e.detail.value }); },
  async login() {
    const session = await request('/auth/login', {
      method: 'POST',
      data: { username: this.data.username, password: this.data.password }
    });
    app.setSession(session);
    wx.switchTab({ url: '/pages/home/index' });
  },
  register() {
    wx.showToast({ title: '注册功能开发中，请用演示账号', icon: 'none' });
  },
  guestBrowse() {
    wx.switchTab({ url: '/pages/home/index' });
  }
});
