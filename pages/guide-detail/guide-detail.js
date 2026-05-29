const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    guide: {},
    sceneTags: [],
    styleTags: [],
    isFavorited: false,
    loading: false
  },

  onLoad(options) {
    if (options.id) {
      this.loadGuide(options.id)
    }
  },

  async loadGuide(id) {
    this.setData({ loading: true })
    try {
      const guide = await api.guide.getDetail(id)
      const sceneTags = guide.sceneTags ? JSON.parse(guide.sceneTags) : []
      const styleTags = guide.styleTags ? JSON.parse(guide.styleTags) : []

      this.setData({
        guide,
        sceneTags,
        styleTags,
        isFavorited: guide.isFavorited || false
      })

      // 添加浏览历史
      api.guide.addHistory(id)

      // 设置标题
      wx.setNavigationBarTitle({ title: guide.title })
    } catch (err) {
      util.showError(err)
    } finally {
      this.setData({ loading: false })
    }
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
