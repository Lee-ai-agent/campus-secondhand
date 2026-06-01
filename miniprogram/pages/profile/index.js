const app = getApp();

Page({
  data: { user: null },
  onShow() { this.setData({ user: app.hasSession() ? app.globalData.user : null }); },
  login() { wx.navigateTo({ url: '/pages/login/index' }); },
  orders() { wx.navigateTo({ url: '/pages/orders/index' }); },
  goWanted() { wx.switchTab({ url: '/pages/wanted/index' }); },
  goSeller() { wx.navigateTo({ url: '/pages/seller/index' }); },
  goPosts() { wx.navigateTo({ url: '/pages/seller-posts/index' }); },
  goSellerOrders() { wx.navigateTo({ url: '/pages/seller-orders/index' }); },
  goFavorites() { wx.navigateTo({ url: '/pages/favorites/index' }); },
  goAddress() { wx.navigateTo({ url: '/pages/address/index' }); },
  logout() {
    app.clearSession();
    this.setData({ user: null });
  }
});
