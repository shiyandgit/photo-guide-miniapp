const api = require('../../utils/api')
const util = require('../../utils/util')
const app = getApp()

Page({
  data: {
    isLoggedIn: false,
    userInfo: {}
  },

  onShow() {
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    this.setData({
      isLoggedIn: !!userInfo,
      userInfo: userInfo || {}
    })
  },

  async login() {
    try {
      util.showLoading('登录中...')
      const data = await app.login()
      this.setData({
        isLoggedIn: true,
        userInfo: data
      })
      util.showSuccess('登录成功')
    } catch (err) {
      util.showError(err)
    } finally {
      util.hideLoading()
    }
  },

  goPage(e) {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            this.login()
          }
        }
      })
      return
    }

    const url = e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },

  showAbout() {
    wx.showModal({
      title: '关于「摄影苦手」',
      content: '版本：1.0.0\n\n「摄影苦手」是一款面向大众拍照爱好者的小程序，帮助你快速获取拍照灵感与技巧。\n\n品牌 Logo：「寺言」',
      showCancel: false
    })
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          app.globalData.userInfo = null
          this.setData({
            isLoggedIn: false,
            userInfo: {}
          })
          util.showSuccess('已退出登录')
        }
      }
    })
  }
})
