const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { messages: [] },
  onShow() {
    if (!app.hasSession()) {
      this.setData({ messages: [] });
      return;
    }
    this.load();
  },
  async load() {
    this.setData({ messages: await request(`/messages?userId=${app.globalData.user.userId}`) });
  },
  openChat(e) {
    wx.navigateTo({ url: `/pages/chat/index?id=${e.currentTarget.dataset.id}` });
  }
});
