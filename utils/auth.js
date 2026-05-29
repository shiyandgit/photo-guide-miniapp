const app = getApp();

// 登录
const login = () => {
  return app.login();
};

// 获取 Token
const getToken = () => {
  return wx.getStorageSync('token');
};

// 是否已登录
const isLoggedIn = () => {
  return !!wx.getStorageSync('token');
};

// 退出登录
const logout = () => {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  app.globalData.token = null;
  app.globalData.userInfo = null;
};

// 获取用户信息
const getUserInfo = () => {
  return wx.getStorageSync('userInfo');
};

module.exports = {
  login,
  getToken,
  isLoggedIn,
  logout,
  getUserInfo
};
