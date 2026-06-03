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
    wx.navigateTo({
      url: `/pages/chat/index?sellerId=${this.data.wanted.userId || 3}&productTitle=${encodeURIComponent(this.data.wanted.title)}&productPrice=${this.data.wanted.maxPrice || 0}`
    });
  }
});
