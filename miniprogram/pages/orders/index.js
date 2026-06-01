const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: {
    orders: [],
    statusText: {
      PENDING_PAYMENT: '待付款',
      PENDING_SHIPMENT: '待发货',
      PENDING_RECEIPT: '待收货',
      COMPLETED: '已完成',
      CANCELLED: '已取消'
    }
  },
  onShow() {
    if (!app.hasSession()) {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }
    this.load();
  },
  async load() {
    this.setData({ orders: await request(`/orders?buyerId=${app.globalData.user.userId}`) });
  },
  async pay(e) {
    await request(`/orders/${e.currentTarget.dataset.id}/pay?buyerId=${app.globalData.user.userId}`, { method: 'POST' });
    this.load();
  },
  async receive(e) {
    await request(`/orders/${e.currentTarget.dataset.id}/receive?buyerId=${app.globalData.user.userId}`, { method: 'POST' });
    this.load();
  },
  viewDetail(e) {
    wx.navigateTo({ url: `/pages/order-detail/index?id=${e.currentTarget.dataset.id}` });
  },
  goHome() { wx.switchTab({ url: '/pages/home/index' }); }
});
