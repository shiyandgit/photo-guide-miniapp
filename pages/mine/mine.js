const api = require('../../utils/api')
const util = require('../../utils/util')
const app = getApp()

const ADMIN_OPENID = 'ohA1n3V1p4S_Ih1q9-FX8FonG9hY'

Page({
  data: {
    isLoggedIn: false,
    isAdmin: false,
    userInfo: {}
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    this.checkLoginStatus()
  },

  async showOpenId() {
    try {
      const res = await api.guide.getMyOpenId()
      wx.setClipboardData({
        data: res.openid,
        success: () => {
          wx.showModal({
            title: '你的 OpenID',
            content: res.openid,
            showCancel: false,
            confirmText: '已复制'
          })
        }
      })
    } catch (err) {
      util.showError('获取失败')
    }
  },

  checkLoginStatus() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    this.setData({
      isLoggedIn: !!userInfo,
      userInfo: userInfo || {}
    })
    if (userInfo) {
      this.checkAdmin()
    }
  },

  async checkAdmin() {
    try {
      const res = await api.guide.getMyOpenId()
      this.setData({ isAdmin: res.openid === ADMIN_OPENID })
    } catch (err) {
      this.setData({ isAdmin: false })
    }
  },

  async login() {
    try {
      util.showLoading('登录中...')
      const data = await app.login()
      this.setData({
        isLoggedIn: true,
        userInfo: data
      })
      this.checkAdmin()
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
            isAdmin: false,
            userInfo: {}
          })
          util.showSuccess('已退出登录')
        }
      }
    })
  }
})
