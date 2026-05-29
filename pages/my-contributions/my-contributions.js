const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    guides: [],
    loading: false
  },

  onLoad() {
    this.loadContributions()
  },

  onPullDownRefresh() {
    this.setData({ guides: [] })
    this.loadContributions().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadContributions() {
    this.setData({ loading: true })
    try {
      // TODO: 需要添加获取用户贡献的云函数
      this.setData({ guides: [] })
    } catch (err) {
      util.showError(err)
    } finally {
      this.setData({ loading: false })
    }
  },

  goDetail(e) {
    const id = e.detail.id || e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({
      url: `/pages/guide-detail/guide-detail?id=${id}`
    })
  },

  goContribute() {
    wx.navigateTo({
      url: '/pages/contribute/contribute'
    })
  }
})
