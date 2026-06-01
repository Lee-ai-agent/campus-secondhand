const { request } = require('../../utils/api');

Page({
  data: { id: null, wanted: null },
  onLoad(query) {
    this.setData({ id: query.id });
    this.load();
  },
  async load() {
    this.setData({ wanted: await request(`/wanted/${this.data.id}`) });
  },
  goBack() { wx.navigateBack(); },
  contactUser() {
    wx.showToast({ title: '已打开聊天', icon: 'none' });
    wx.switchTab({ url: '/pages/messages/index' });
  }
});
