const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: {
    order: null,
    statusText: {
      pending_payment: '待付款',
      pending_shipment: '待发货',
      pending_receipt: '待收货',
      completed: '已完成',
      cancelled: '已取消',
      after_sale: '售后中'
    }
  },
  onLoad(query) {
    this.setData({ id: query.id });
    this.load();
  },
  async load() {
    this.setData({ order: await request(`/orders/${this.data.id}?userId=${app.globalData.user.userId}`) });
  },
  async pay() {
    await request(`/orders/${this.data.id}/pay?buyerId=${app.globalData.user.userId}`, { method: 'PUT' });
    this.load();
  },
  async receive() {
    await request(`/orders/${this.data.id}/confirm?buyerId=${app.globalData.user.userId}`, { method: 'PUT' });
    this.load();
  },
  goReview() {
    wx.navigateTo({ url: `/pages/review/index?id=${this.data.id}` });
  }
});
