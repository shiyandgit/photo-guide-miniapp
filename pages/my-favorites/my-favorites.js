const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    guides: [],
    loading: false
  },

  onLoad() {
    this.loadFavorites()
  },

  onPullDownRefresh() {
    this.setData({ guides: [] })
    this.loadFavorites().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadFavorites() {
    this.setData({ loading: true })
    try {
      const favorites = await api.guide.getMyFavorites()
      this.setData({
        guides: favorites || []
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
