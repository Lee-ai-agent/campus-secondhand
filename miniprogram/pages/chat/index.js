const app = getApp();
const { request } = require('../../utils/api');

Page({
  data: {
    id: null,
    messages: [],
    contactName: '',
    draft: '',
    myId: null,
    productId: null,
    sellerId: null,
    productTitle: '',
    productPrice: 0,
    pendingOrder: null
  },
  onLoad(query) {
    this.setData({
      id: query.id || null,
      myId: app.globalData?.user?.userId,
      productId: query.productId ? Number(query.productId) : null,
      sellerId: query.sellerId ? Number(query.sellerId) : null,
      productTitle: query.productTitle || '',
      productPrice: query.productPrice || 0
    });
    this.loadMessages();
  },
  async loadMessages() {
    if (!app.globalData?.user?.userId) return;
    if (!this.data.id) {
      this.setData({ messages: [] });
      return;
    }
    const msgs = await request(`/messages/${this.data.id}?userId=${app.globalData.user.userId}`);
    this.setData({ messages: msgs || [] });
    if (msgs && msgs.length > 0 && !this.data.contactName) {
      const otherId = msgs[0].senderId === this.data.myId ? msgs[0].receiverId : msgs[0].senderId;
      this.setData({ contactName: '同学' });
    }
  },
  onDraft(e) { this.setData({ draft: e.detail.value }); },
  async sendMessage() {
    if (!this.data.draft.trim()) return;
    if (!this.data.sellerId && !this.data.id) {
      wx.showToast({ title: '缺少联系人', icon: 'none' });
      return;
    }
    const saved = await request('/messages', {
      method: 'POST',
      data: {
        conversationId: this.data.id ? Number(this.data.id) : undefined,
        senderId: this.data.myId,
        receiverId: this.data.sellerId || 3,
        relatedType: this.data.productId ? 'product' : 'wanted',
        productId: this.data.productId,
        content: this.data.draft
      }
    });
    this.setData({
      id: saved.conversationId,
      messages: [...this.data.messages, saved],
      draft: ''
    });
  },
  async createPendingOrder() {
    if (!app.hasSession()) {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }
    if (!this.data.productId) return;
    const path = this.data.id ? `/messages/${this.data.id}/orders` : '/orders/direct';
    const order = await request(path, {
      method: 'POST',
      data: {
        buyerId: app.globalData.user.userId,
        productId: this.data.productId,
        quantity: 1,
        receiverName: '李同学',
        receiverPhone: '13800000001',
        receiverAddress: '北区 3 栋 502'
      }
    });
    this.setData({ pendingOrder: order });
    wx.showToast({ title: '待付款订单已生成' });
  },
  async payPendingOrder() {
    if (!this.data.pendingOrder) return;
    const path = this.data.id
      ? `/messages/${this.data.id}/orders/${this.data.pendingOrder.id}/pay?buyerId=${app.globalData.user.userId}`
      : `/orders/${this.data.pendingOrder.id}/pay?buyerId=${app.globalData.user.userId}`;
    const order = await request(path, { method: 'PUT' });
    this.setData({ pendingOrder: order });
    wx.showToast({ title: '支付成功' });
  },
  goDetail() {
    if (!this.data.productId) return;
    wx.navigateTo({ url: `/pages/detail/index?id=${this.data.productId}` });
  },
  showEmoji() {
    wx.showToast({ title: '表情功能开发中', icon: 'none' });
  },
  showAttachment() {
    wx.showActionSheet({
      itemList: ['相册', '拍照'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '相册功能开发中', icon: 'none' });
        } else if (res.tapIndex === 1) {
          wx.showToast({ title: '拍照功能开发中', icon: 'none' });
        }
      }
    });
  }
});
