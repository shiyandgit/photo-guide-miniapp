const api = require('../../utils/api')
const util = require('../../utils/util')
const sampleData = require('../../utils/sample-data')

Page({
  data: {
    keyword: '',
    scene: '',
    contentType: 0,
    page: 1,
    pageSize: 10,
    guides: [],
    searched: false,
    loading: false,
    noMore: false,
    errorMessage: '',
    hotKeywords: ['日落', '咖啡馆', '街头', '海滩', '花海', '夜景'],
    searchHistory: []
  },

  onLoad(options) {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ searchHistory: history })
    if (options.scene) {
      this.setData({ scene: options.scene, keyword: options.scene })
      this.doSearch()
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    const app = getApp()
    if (app.globalData.searchScene) {
      const scene = app.globalData.searchScene
      app.globalData.searchScene = null
      this.setData({ scene, keyword: scene })
      this.doSearch()
    }
  },

  onPullDownRefresh() {
    if (this.data.searched) {
      this.setData({ page: 1, guides: [], noMore: false })
      this.searchGuides().then(() => { wx.stopPullDownRefresh() })
    } else {
      wx.stopPullDownRefresh()
    }
  },

  onReachBottom() {
    if (this.data.searched && !this.data.loading && !this.data.noMore) {
      this.setData({ page: this.data.page + 1 })
      this.searchGuides()
    }
  },

  onInput(e) { this.setData({ keyword: e.detail.value }) },

  doSearch() {
    if (!this.data.keyword.trim()) return
    const history = this.data.searchHistory.filter(k => k !== this.data.keyword)
    history.unshift(this.data.keyword)
    const newHistory = history.slice(0, 10)
    this.setData({ page: 1, guides: [], noMore: false, searched: true, searchHistory: newHistory })
    wx.setStorageSync('searchHistory', newHistory)
    this.searchGuides()
  },

  searchKeyword(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.doSearch()
  },

  clearHistory() {
    this.setData({ searchHistory: [] })
    wx.removeStorageSync('searchHistory')
  },

  setContentType(e) {
    const type = parseInt(e.currentTarget.dataset.type)
    this.setData({ contentType: type, page: 1, guides: [], noMore: false })
    this.searchGuides()
  },

  async searchGuides() {
    this.setData({ loading: true, errorMessage: '' })
    try {
      const params = {
        keyword: this.data.keyword,
        contentType: this.data.contentType,
        page: this.data.page,
        pageSize: this.data.pageSize
      }
      if (this.data.scene) params.scene = this.data.scene

      const result = await api.guide.search(params)
      const newGuides = this.data.page === 1 ? result.list : [...this.data.guides, ...result.list]
      this.setData({ guides: newGuides, noMore: newGuides.length >= result.total })
    } catch (err) {
      const allFallback = sampleData.searchSampleGuides({
        keyword: this.data.keyword,
        scene: this.data.scene,
        contentType: this.data.contentType
      })
      const start = (this.data.page - 1) * this.data.pageSize
      const pageList = allFallback.slice(start, start + this.data.pageSize)
      const newGuides = this.data.page === 1 ? pageList : [...this.data.guides, ...pageList]
      this.setData({
        guides: newGuides,
        noMore: newGuides.length >= allFallback.length,
        errorMessage: '云函数暂不可用，正在展示本地示例内容'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  goDetail(e) {
    const id = e.detail.id || e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: `/pages/guide-detail/guide-detail?id=${id}` })
  }
})
