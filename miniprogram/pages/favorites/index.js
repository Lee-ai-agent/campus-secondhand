Page({
  data: { favorites: [] },
  onShow() {
    this.setData({ favorites: [] });
  },
  viewDetail(e) {
    wx.navigateTo({ url: `/pages/detail/index?id=${e.currentTarget.dataset.id}` });
  },
  goHome() { wx.switchTab({ url: '/pages/home/index' }); }
});
