const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    banners: [],
    scenes: [
      { name: '景点', icon: '🏔️' },
      { name: 'KTV', icon: '🎤' },
      { name: '餐厅', icon: '🍽️' },
      { name: '咖啡馆', icon: '☕' },
      { name: '海滩', icon: '🏖️' },
      { name: '博物馆', icon: '🏛️' },
      { name: '街头', icon: '📸' },
      { name: '花海', icon: '🌸' }
    ],
    hotGuides: [],
    loading: false
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    // 刷新数据
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadData() {
    this.setData({ loading: true })
    try {
      const hotGuides = await api.guide.getHot(10)
      this.setData({
        hotGuides: hotGuides || [],
        banners: (hotGuides || []).slice(0, 3)
      })
    } catch (err) {
      util.showError(err)
    } finally {
      this.setData({ loading: false })
    }
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/search' })
  },

  goSceneSearch(e) {
    const scene = e.currentTarget.dataset.scene
    const app = getApp()
    app.globalData.searchScene = scene
    wx.switchTab({ url: '/pages/search/search' })
  },

  goDetail(e) {
    const id = e.detail.id || e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({
      url: `/pages/guide-detail/guide-detail?id=${id}`
    })
  }
})
