const { hasSession, normalizeSession } = require('./utils/session');

const initialSession = normalizeSession(
  wx.getStorageSync('user') || null,
  wx.getStorageSync('token') || ''
);

if (!hasSession(initialSession)) {
  wx.removeStorageSync('user');
  wx.removeStorageSync('token');
}

App({
  globalData: {
    apiBase: 'http://localhost:8080/api',
    user: initialSession.user,
    token: initialSession.token
  },
  hasSession() {
    return hasSession(this.globalData);
  },
  setSession(session) {
    this.globalData.user = session;
    this.globalData.token = session.token;
    wx.setStorageSync('user', session);
    wx.setStorageSync('token', session.token);
  },
  clearSession() {
    this.globalData.user = null;
    this.globalData.token = '';
    wx.removeStorageSync('user');
    wx.removeStorageSync('token');
  }
});
