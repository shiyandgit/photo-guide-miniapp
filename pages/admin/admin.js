const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    loading: true,
    guides: []
  },

  onLoad() {
    this.loadAllGuides()
  },

  async loadAllGuides() {
    this.setData({ loading: true })
    try {
      const guides = await api.guide.adminGetAllGuides()
      this.setData({ guides })
    } catch (err) {
      util.showError('加载失败')
    } finally {
      this.setData({ loading: false })
    }
  },

  viewGuide(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/guide-detail/guide-detail?id=${id}` })
  },

  deleteGuide(e) {
    const { id, title } = e.currentTarget.dataset
    wx.showModal({
      title: '删除攻略',
      content: `确定要删除「${title}」吗？此操作不可恢复。`,
      confirmColor: '#f44336',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.guide.adminDeleteGuide(id)
            util.showSuccess('已删除')
            this.loadAllGuides()
          } catch (err) {
            util.showError(err)
          }
        }
      }
    })
  },

  refresh() {
    this.loadAllGuides()
  }
})
