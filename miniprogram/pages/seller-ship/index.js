const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { id: null, trackingNo: '', pickupNote: '东区图书馆 18:30 自提', remark: '' },
  onLoad(query) { this.setData({ id: query.id }); },
  onTracking(e) { this.setData({ trackingNo: e.detail.value }); },
  onPickupNote(e) { this.setData({ pickupNote: e.detail.value }); },
  onRemark(e) { this.setData({ remark: e.detail.value }); },
  async submitShip() {
    await request(`/orders/${this.data.id}/ship?sellerId=${app.globalData.user.userId}`, {
      method: 'POST',
      data: { shippingMethod: 'PICKUP', pickupNote: this.data.pickupNote || '校内当面交接' }
    });
    wx.showToast({ title: '发货成功' });
    wx.navigateBack();
  }
});
