const api = require('../../utils/api')
const util = require('../../utils/util')
const sampleData = require('../../utils/sample-data')

Page({
  data: {
    guide: {},
    sceneTags: [],
    styleTags: [],
    isFavorited: false,
    loading: false,
    errorMessage: ''
  },

  onLoad(options) {
    if (options.id) {
      this.loadGuide(options.id)
    }
  },

  async loadGuide(id) {
    this.setData({ loading: true, errorMessage: '' })
    try {
      const guide = await api.guide.getDetail(id)
      this.applyGuide(guide)

      // 添加浏览历史
      api.guide.addHistory(id)
    } catch (err) {
      const guide = sampleData.findSampleGuide(id)
      if (guide) {
        this.applyGuide(guide, '云函数暂不可用，正在展示本地示例内容')
      } else {
        util.showError(err)
      }
    } finally {
      this.setData({ loading: false })
    }
  },

  applyGuide(guide, errorMessage) {
    const sceneTags = guide.sceneTags ? JSON.parse(guide.sceneTags) : []
    const styleTags = guide.styleTags ? JSON.parse(guide.styleTags) : []

    this.setData({
      guide,
      sceneTags,
      styleTags,
      isFavorited: guide.isFavorited || false,
      errorMessage: errorMessage || ''
    })

    wx.setNavigationBarTitle({ title: guide.title })
  },

  previewCover() {
    if (this.data.guide.coverImage) {
      util.previewImages([this.data.guide.coverImage])
    }
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url
    util.previewImages(this.data.guide.images, url)
  },

  async toggleFavorite() {
    try {
      const result = await api.guide.toggleFavorite(this.data.guide._id)
      this.setData({ isFavorited: result.isFavorite })
      util.showSuccess(result.isFavorite ? '已收藏' : '已取消收藏')
    } catch (err) {
      util.showError(err)
    }
  },

  onShareAppMessage() {
    return {
      title: this.data.guide.title,
      path: `/pages/guide-detail/guide-detail?id=${this.data.guide._id}`,
      imageUrl: this.data.guide.coverImage
    }
  }
})
