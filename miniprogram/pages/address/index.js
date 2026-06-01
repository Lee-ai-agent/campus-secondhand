Page({
  data: { name: '李同学', phone: '13800000000', address: '东区 3 栋 501' },
  onName(e) { this.setData({ name: e.detail.value }); },
  onPhone(e) { this.setData({ phone: e.detail.value }); },
  onAddress(e) { this.setData({ address: e.detail.value }); },
  saveAddress() {
    wx.showToast({ title: '地址已保存' });
  }
});
