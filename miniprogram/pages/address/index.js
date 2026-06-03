Page({
  data: { name: '李同学', phone: '13800000000', address: '东区 3 栋 501' },
  onName(e) { this.setData({ name: e.detail.value }); },
  onPhone(e) { this.setData({ phone: e.detail.value }); },
  onAddress(e) { this.setData({ address: e.detail.value }); },
  saveAddress() {
    if (!this.data.name.trim()) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return; }
    if (!this.data.phone.trim() || !/^\d{11}$/.test(this.data.phone)) { wx.showToast({ title: '请输入有效手机号', icon: 'none' }); return; }
    if (!this.data.address.trim()) { wx.showToast({ title: '请输入详细地址', icon: 'none' }); return; }
    wx.showToast({ title: '地址已保存' });
  }
});
