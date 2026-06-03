const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: {
    orders: [],
    statusText: {
      pending_payment: '待付款',
      pending_shipment: '待发货',
      pending_receipt: '待收货',
      completed: '已完成',
      cancelled: '已取消',
      after_sale: '售后中',
      refunded: '退款完成'
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
    await request(`/orders/${e.currentTarget.dataset.id}/pay?buyerId=${app.globalData.user.userId}`, { method: 'PUT' });
    this.load();
  },
  async receive(e) {
    await request(`/orders/${e.currentTarget.dataset.id}/confirm?buyerId=${app.globalData.user.userId}`, { method: 'PUT' });
    this.load();
  },
  viewDetail(e) {
    wx.navigateTo({ url: `/pages/order-detail/index?id=${e.currentTarget.dataset.id}` });
  },
  goHome() { wx.switchTab({ url: '/pages/home/index' }); }
});
