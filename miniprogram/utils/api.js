function compactRequestData(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== null && value !== undefined)
  );
}

function request(path, options = {}) {
  const app = getApp();
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.apiBase}${path}`,
      method: options.method || 'GET',
      data: compactRequestData(options.data || {}),
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.token ? `Bearer ${app.globalData.token}` : ''
      },
      success(res) {
        const body = res.data || {};
        if (body.code === 0) {
          resolve(body.data);
          return;
        }
        wx.showToast({ title: body.message || '请求失败', icon: 'none' });
        reject(new Error(body.message || '请求失败'));
      },
      fail(err) {
        wx.showToast({ title: '后端服务未启动', icon: 'none' });
        reject(err);
      }
    });
  });
}

module.exports = { compactRequestData, request };
