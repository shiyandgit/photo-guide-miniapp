const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    title: '',
    contentType: 0,
    difficulty: 0,
    content: '',
    coverImage: '',
    images: [],
    sceneTags: [
      { name: '景点', selected: false },
      { name: 'KTV', selected: false },
      { name: '餐厅', selected: false },
      { name: '咖啡馆', selected: false },
      { name: '海滩', selected: false },
      { name: '博物馆', selected: false },
      { name: '街头', selected: false },
      { name: '花海', selected: false }
    ],
    submitting: false
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  setContentType(e) {
    this.setData({ contentType: parseInt(e.currentTarget.dataset.type) })
  },

  setDifficulty(e) {
    this.setData({ difficulty: parseInt(e.currentTarget.dataset.level) })
  },

  toggleSceneTag(e) {
    const index = e.currentTarget.dataset.index
    const key = `sceneTags[${index}].selected`
    this.setData({
      [key]: !this.data.sceneTags[index].selected
    })
  },

  chooseCover() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        this.setData({ coverImage: res.tempFiles[0].tempFilePath })
      }
    })
  },

  addImage() {
    const remaining = 9 - this.data.images.length
    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({
          images: [...this.data.images, ...newImages]
        })
      }
    })
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  async submit() {
    // 表单校验
    if (!this.data.title.trim()) {
      util.showError('请输入标题')
      return
    }
    if (this.data.title.length < 2 || this.data.title.length > 30) {
      util.showError('标题长度为2-30个字符')
      return
    }
    if (!this.data.contentType) {
      util.showError('请选择内容类型')
      return
    }
    if (!this.data.difficulty) {
      util.showError('请选择难度等级')
      return
    }
    if (this.data.content.length < 50) {
      util.showError('正文内容至少50个字符')
      return
    }
    if (!this.data.coverImage) {
      util.showError('请上传封面图')
      return
    }

    this.setData({ submitting: true })

    try {
      // 上传封面图
      util.showLoading('上传图片中...')
      const timestamp = Date.now()
      const coverCloudPath = `guides/${timestamp}/cover.jpg`
      const coverFileID = await api.uploadFile(this.data.coverImage, coverCloudPath)

      // 上传配图
      const imageFileIDs = []
      for (let i = 0; i < this.data.images.length; i++) {
        const imageCloudPath = `guides}/${timestamp}/image_${i}.jpg`
        const fileID = await api.uploadFile(this.data.images[i], imageCloudPath)
        imageFileIDs.push(fileID)
      }

      // 获取选中的场景标签
      const sceneTags = this.data.sceneTags
        .filter(t => t.selected)
        .map(t => t.name)

      // TODO: 需要添加提交攻略的云函数
      util.showSuccess('提交成功')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      util.showError(err)
    } finally {
      this.setData({ submitting: false })
      util.hideLoading()
    }
  }
})
