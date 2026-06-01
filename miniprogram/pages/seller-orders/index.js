const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { orders: [] },
  onShow() { this.load(); },
  async load() {
    this.setData({ orders: await request(`/seller/orders?sellerId=${app.globalData.user.userId}`) });
  },
  goShip(e) { wx.navigateTo({ url: `/pages/seller-ship/index?id=${e.currentTarget.dataset.id}` }); },
  goRefund(e) { wx.navigateTo({ url: `/pages/seller-refund/index?id=${e.currentTarget.dataset.id}` }); },
  viewDetail(e) { wx.navigateTo({ url: `/pages/order-detail/index?id=${e.currentTarget.dataset.id}` }); }
});
