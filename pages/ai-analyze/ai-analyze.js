const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    photoPath: '',
    analyzing: false,
    result: null,
    currentTab: 'suggestion'
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

  goHistory() {
    wx.navigateTo({ url: '/pages/my-history/my-history' })
  }
})
