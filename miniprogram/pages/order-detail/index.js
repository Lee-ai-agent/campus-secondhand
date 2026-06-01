const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: {
    order: null,
    statusText: {
      PENDING_PAYMENT: '待付款',
      PENDING_SHIPMENT: '待发货',
      PENDING_RECEIPT: '待收货',
      COMPLETED: '已完成',
      CANCELLED: '已取消',
      AFTER_SALE: '售后中'
    }
  },
  onLoad(query) {
    this.setData({ id: query.id });
    this.load();
  },
  async load() {
    this.setData({ order: await request(`/orders/${this.data.id}`) });
  },
  async pay() {
    await request(`/orders/${this.data.id}/pay?buyerId=${app.globalData.user.userId}`, { method: 'POST' });
    this.load();
  },
  async receive() {
    await request(`/orders/${this.data.id}/receive?buyerId=${app.globalData.user.userId}`, { method: 'POST' });
    this.load();
  },
  goReview() {
    wx.navigateTo({ url: `/pages/review/index?id=${this.data.id}` });
  }
});
