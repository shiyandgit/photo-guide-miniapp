const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    editId: '',
    editMode: false,
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

  onLoad(options) {
    if (options.id) {
      this.setData({ editId: options.id, editMode: true })
      wx.setNavigationBarTitle({ title: '编辑投稿' })
      this.loadGuideForEdit(options.id)
    }
  },

  async loadGuideForEdit(id) {
    try {
      util.showLoading('加载中...')
      const guide = await api.guide.getDetail(id)
      const sceneTags = this.data.sceneTags.map(tag => ({
        ...tag,
        selected: (guide.sceneTags || []).indexOf(tag.name) >= 0
      }))
      this.setData({
        title: guide.title || '',
        contentType: guide.contentType || 0,
        difficulty: guide.difficulty || 0,
        content: guide.content || '',
        coverImage: guide.coverImage || '',
        images: guide.images || [],
        sceneTags
      })
    } catch (err) {
      util.showError('加载攻略失败')
      setTimeout(() => wx.navigateBack(), 1500)
    } finally {
      util.hideLoading()
    }
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
      util.showLoading(this.data.editMode ? '保存中...' : '上传图片中...')

      // 获取选中的场景标签
      const sceneTags = this.data.sceneTags
        .filter(t => t.selected)
        .map(t => t.name)

      // 判断是否需要上传新图片（本地临时路径需要上传，已有的云端 fileID 不需要）
      let coverFileID = this.data.coverImage
      if (this.data.coverImage.indexOf('tmp') >= 0 || this.data.coverImage.indexOf('temp') >= 0) {
        const timestamp = Date.now()
        coverFileID = await api.uploadFile(this.data.coverImage, `guides/${timestamp}/cover.jpg`)
      }

      const imageFileIDs = []
      for (let i = 0; i < this.data.images.length; i++) {
        const img = this.data.images[i]
        if (img.indexOf('tmp') >= 0 || img.indexOf('temp') >= 0) {
          const timestamp = Date.now()
          const fileID = await api.uploadFile(img, `guides/${timestamp}/image_${i}.jpg`)
          imageFileIDs.push(fileID)
        } else {
          imageFileIDs.push(img)
        }
      }

      if (this.data.editMode) {
        // 更新攻略
        await api.guide.updateGuide(this.data.editId, {
          title: this.data.title,
          content: this.data.content,
          contentType: this.data.contentType,
          difficulty: this.data.difficulty,
          coverImage: coverFileID,
          images: imageFileIDs,
          sceneTags
        })
        util.showSuccess('保存成功')
      } else {
        // 新建攻略
        await api.guide.submitGuide({
          title: this.data.title,
          content: this.data.content,
          contentType: this.data.contentType,
          difficulty: this.data.difficulty,
          coverImage: coverFileID,
          images: imageFileIDs,
          sceneTags
        })
        util.showSuccess('发布成功，攻略已可见')
      }

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
