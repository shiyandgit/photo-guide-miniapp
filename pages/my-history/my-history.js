const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    guides: [],
    loading: false
  },

  onLoad() {
    this.loadHistory()
  },

  onPullDownRefresh() {
    this.setData({ guides: [] })
    this.loadHistory().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadHistory() {
    this.setData({ loading: true })
    try {
      const history = await api.guide.getMyHistory()
      this.setData({
        guides: history || []
      })
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
  }
})
