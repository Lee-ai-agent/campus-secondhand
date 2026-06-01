const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { items: [], totalPrice: 0 },
  onShow() {
    if (!app.hasSession()) {
      this.setData({ items: [], totalPrice: 0 });
      return;
    }
    this.load();
  },
  async load() {
    const items = await request(`/cart?userId=${app.globalData.user.userId}`);
    this.setData({ items: items || [], totalPrice: this.calcTotal(items || []) });
  },
  calcTotal(items) {
    return items.filter(i => i.checked !== false).reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  },
  async remove(e) {
    await request(`/cart/items/${e.currentTarget.dataset.id}`, { method: 'DELETE' });
    this.load();
  },
  increase(e) {
    const items = this.data.items.map(i =>
      i.id === e.currentTarget.dataset.id ? { ...i, quantity: i.quantity + 1 } : i
    );
    this.setData({ items, totalPrice: this.calcTotal(items) });
  },
  decrease(e) {
    const items = this.data.items.map(i =>
      i.id === e.currentTarget.dataset.id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
    );
    this.setData({ items, totalPrice: this.calcTotal(items) });
  },
  checkout() {
    wx.navigateTo({ url: '/pages/confirm/index' });
  },
  goHome() { wx.switchTab({ url: '/pages/home/index' }); }
});
