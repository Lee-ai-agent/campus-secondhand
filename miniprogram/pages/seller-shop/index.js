Page({
  data: { intro: '', phone: '', pickup: '' },
  onIntro(e) { this.setData({ intro: e.detail.value }); },
  onPhone(e) { this.setData({ phone: e.detail.value }); },
  onPickup(e) { this.setData({ pickup: e.detail.value }); },
  save() {
    wx.showToast({ title: '店铺资料已保存' });
  }
});
