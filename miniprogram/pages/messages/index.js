const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { messages: [] },
  onShow() {
    if (!app.hasSession()) {
      this.setData({ messages: [] });
      return;
    }
    this.load();
  },
  async load() {
    this.setData({ messages: await request(`/messages?userId=${app.globalData.user.userId}`) });
  },
  openChat(e) {
    const id = Number(e.currentTarget.dataset.id);
    const item = this.data.messages.find(m => m.conversationId === id);
    let url = `/pages/chat/index?id=${id}`;
    if (item && item.productId) {
      url += `&productId=${item.productId}`;
    }
    wx.navigateTo({ url });
  },
  showActions(e) {
    const id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['置顶', '删除'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '已置顶', icon: 'none' });
        } else if (res.tapIndex === 1) {
          wx.showToast({ title: '已删除', icon: 'none' });
        }
      }
    });
  }
});
