const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { id: null, productTitle: '九成新 Java 课程教材', rating: 5, content: '商品与描述一致，线下交接顺利。' },
  onLoad(query) { this.setData({ id: query.id }); },
  rate(e) {
    this.setData({ rating: Number(e.currentTarget.dataset.rating) });
  },
  onContent(e) { this.setData({ content: e.detail.value }); },
  async submit() {
    await request('/reviews', {
      method: 'POST',
      data: {
        orderId: this.data.id,
        reviewerId: app.globalData.user.userId,
        rating: this.data.rating,
        content: this.data.content
      }
    });
    wx.showToast({ title: '评价提交成功' });
    wx.navigateBack();
  }
});
