const app = getApp()

const checkLogin = () => {
  const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
  return !!userInfo
}

const requireLogin = (callback) => {
  if (checkLogin()) {
    callback && callback()
    return true
  }

  wx.showModal({
    title: '提示',
    content: '请先登录',
    confirmText: '去登录',
    success: (res) => {
      if (res.confirm) {
        wx.switchTab({ url: '/pages/mine/mine' })
      }
    }
  })
  return false
}

module.exports = { checkLogin, requireLogin }
