const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: {
    productTitle: '九成新 Java 课程教材',
    totalPrice: 28,
    remark: '',
    orderId: null
  },
  onLoad(query) {
    if (query.id) {
      this.setData({ orderId: query.id });
    }
    if (query.price) {
      this.setData({ totalPrice: Number(query.price) });
    }
  },
  onRemark(e) { this.setData({ remark: e.detail.value }); },
  async submitOrder() {
    if (!app.hasSession()) {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }
    await request('/orders', {
      method: 'POST',
      data: {
        buyerId: app.globalData.user.userId,
        productId: Number(this.data.orderId || 1),
        quantity: 1,
        receiverName: '李同学',
        receiverPhone: '13800000000',
        receiverAddress: '东区 3 栋 501'
      }
    });
    wx.showToast({ title: '订单已提交' });
    wx.navigateTo({ url: '/pages/orders/index' });
  },
  goAddress() { wx.navigateTo({ url: '/pages/address/index' }); }
});
