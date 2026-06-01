const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { id: null, remark: '' },
  onLoad(query) { this.setData({ id: query.id }); },
  onRemark(e) { this.setData({ remark: e.detail.value }); },
  async agreeRefund() {
    await request(`/orders/${this.data.id}/refund?sellerId=${app.globalData.user.userId}`, {
      method: 'POST',
      data: { approved: true, remark: this.data.remark }
    });
    wx.showToast({ title: '已同意退款' });
    wx.navigateBack();
  },
  async rejectRefund() {
    wx.showToast({ title: '已拒绝退款并记录原因', icon: 'none' });
    wx.navigateBack();
  }
});
