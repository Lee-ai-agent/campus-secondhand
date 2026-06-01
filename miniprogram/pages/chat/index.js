const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: { id: null, messages: [], contactName: '', draft: '', myId: null },
  onLoad(query) {
    this.setData({ id: query.id, myId: app.globalData?.user?.userId });
    this.load();
  },
  async load() {
    const msgs = await request(`/messages?userId=${app.globalData.user.userId}`);
    this.setData({ messages: msgs || [] });
  },
  onDraft(e) { this.setData({ draft: e.detail.value }); },
  async sendMessage() {
    if (!this.data.draft.trim()) return;
    const newMsg = {
      id: Date.now(),
      content: this.data.draft,
      senderId: this.data.myId,
      sentAt: new Date().toISOString()
    };
    this.setData({
      messages: [...this.data.messages, newMsg],
      draft: ''
    });
  }
});
