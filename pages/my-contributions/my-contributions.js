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
      const guides = await api.guide.getMyContributions()
      this.setData({ guides })
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

  editGuide(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/contribute/contribute?id=${id}`
    })
  },

  deleteGuide(e) {
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${title}」吗？删除后无法恢复。`,
      confirmColor: '#f44336',
      success: async (res) => {
        if (!res.confirm) return
        try {
          await api.guide.deleteGuide(id)
          util.showSuccess('已删除')
          this.loadContributions()
        } catch (err) {
          util.showError(err)
        }
      }
    })
  },

  goContribute() {
    wx.navigateTo({
      url: '/pages/contribute/contribute'
    })
  }
})
