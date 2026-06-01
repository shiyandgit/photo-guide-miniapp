App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-d7gbglwc4912d7cab', // TODO: 替换为你的云开发环境ID，在云开发控制台顶部查看
        traceUser: true
      })
    }

    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
  },

  // 全局登录方法
  async login() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: {}
      })

      if (res.result.code === 200) {
        const data = res.result.data
        this.globalData.userInfo = data
        wx.setStorageSync('userInfo', data)
        return data
      } else {
        throw new Error(res.result.message)
      }
    } catch (err) {
      console.error('登录失败:', err)
      throw err
    }
  }
})
