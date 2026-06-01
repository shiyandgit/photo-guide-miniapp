const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    hasApiKey: false,
    platformName: '',
    photoPath: '',
    analyzing: false,
    result: null,
    currentTab: 'suggestion'
  },

  onLoad() {
    this.loadApiKeyStatus()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  async loadApiKeyStatus() {
    try {
      const status = await api.user.getApiKeyStatus()
      this.setData({
        hasApiKey: status.hasKey,
        platformName: status.provider === 'doubao' ? '豆包' : status.provider === 'tongyi' ? '通义千问' : ''
      })
    } catch (err) {
      console.error('加载 API Key 状态失败', err)
    }
  },

  goApiSettings() {
    wx.navigateTo({ url: '/pages/api-settings/api-settings' })
  },

  choosePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          photoPath: res.tempFiles[0].tempFilePath,
          result: null
        })
      }
    })
  },

  async startAnalysis() {
    if (!this.data.photoPath) {
      util.showError('请先选择照片')
      return
    }

    this.setData({ analyzing: true, result: null })

    try {
      wx.showLoading({ title: 'AI 正在分析...', mask: true })

      // 上传图片到云存储
      const timestamp = Date.now()
      const cloudPath = `analyze/${timestamp}.jpg`
      const fileID = await api.uploadFile(this.data.photoPath, cloudPath)

      // 调用AI分析云函数
      const result = await api.ai.analyzePhoto(fileID, '通用场景')

      this.setData({
        result,
        currentTab: 'suggestion'
      })
    } catch (err) {
      util.showError(err)
    } finally {
      this.setData({ analyzing: false })
      wx.hideLoading()
    }
  },

  switchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.tab })
  },

  copyPrompt() {
    if (!this.data.result || !this.data.result.promptText) return
    wx.setClipboardData({
      data: this.data.result.promptText,
      success: () => {
        util.showSuccess('已复制')
      }
    })
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/my-history/my-history' })
  }
})
