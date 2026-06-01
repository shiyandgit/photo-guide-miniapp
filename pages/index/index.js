const api = require('../../utils/api')
const util = require('../../utils/util')
const sampleData = require('../../utils/sample-data')

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
    loading: false,
    initialLoading: true,
    errorMessage: ''
  },

  onLoad() { this.loadData() },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  onPullDownRefresh() {
    this.loadData().then(() => { wx.stopPullDownRefresh() })
  },

  async loadData() {
    this.setData({ loading: true, errorMessage: '' })
    try {
      const hotGuides = await api.guide.getHot(10)
      if (!hotGuides || hotGuides.length === 0) return
      this.setData({ hotGuides, banners: hotGuides.slice(0, 3) })
    } catch (err) {
      const fallbackGuides = sampleData.getSampleGuides(10)
      this.setData({
        hotGuides: fallbackGuides,
        banners: fallbackGuides.slice(0, 3),
        errorMessage: '云函数暂不可用，正在展示本地示例内容'
      })
    } finally {
      this.setData({ loading: false, initialLoading: false })
    }
  },

  goSearch() { wx.switchTab({ url: '/pages/search/search' }) },

  goSceneSearch(e) {
    const scene = e.currentTarget.dataset.scene
    const app = getApp()
    app.globalData.searchScene = scene
    wx.switchTab({ url: '/pages/search/search' })
  },

  goDetail(e) {
    const id = e.detail.id || e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: `/pages/guide-detail/guide-detail?id=${id}` })
  }
})
