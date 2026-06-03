const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: {
    productId: null,
    productTitle: '九成新 Java 课程教材',
    pickupLocation: '东区 3 栋 501',
    totalPrice: 28,
    remark: '',
    receiverName: '李同学',
    receiverPhone: '13800000000',
    receiverAddress: '东区 3 栋 501'
  },
  onLoad(query) {
    this.setData({
      productId: query.productId ? Number(query.productId) : null,
      productTitle: query.title ? decodeURIComponent(query.title) : this.data.productTitle,
      pickupLocation: query.pickup ? decodeURIComponent(query.pickup) : this.data.pickupLocation,
      totalPrice: query.price ? Number(query.price) : this.data.totalPrice
    });
  },
  onRemark(e) { this.setData({ remark: e.detail.value }); },
  async submitOrder() {
    if (!app.hasSession()) {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }
    if (!this.data.productId) {
      wx.showToast({ title: '缺少商品信息', icon: 'none' });
      return;
    }
    const order = await request('/orders/direct', {
      method: 'POST',
      data: {
        buyerId: app.globalData.user.userId,
        productId: this.data.productId,
        quantity: 1,
        receiverName: this.data.receiverName,
        receiverPhone: this.data.receiverPhone,
        receiverAddress: this.data.receiverAddress
      }
    });
    wx.showToast({ title: '待付款订单已生成' });
    wx.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` });
  },
  goAddress() { wx.navigateTo({ url: '/pages/address/index' }); }
});
