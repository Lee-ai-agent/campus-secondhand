const app = getApp();

Page({
  data: {},
  onShow() {
    if (!app.hasSession()) {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }
  },
  goPublish() { wx.navigateTo({ url: '/pages/seller-publish/index' }); },
  goPosts() { wx.navigateTo({ url: '/pages/seller-posts/index' }); },
  goOrders() { wx.navigateTo({ url: '/pages/seller-orders/index' }); },
  goShop() { wx.navigateTo({ url: '/pages/seller-shop/index' }); }
});
