Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', icon: '🏠', text: '首页' },
      { pagePath: '/pages/search/search', icon: '🔍', text: '搜索' },
      { pagePath: '/pages/ai-analyze/ai-analyze', icon: '🤖', text: 'AI评析' },
      { pagePath: '/pages/mine/mine', icon: '👤', text: '我的' }
    ]
  },

  methods: {
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset
      wx.switchTab({ url: path })
    }
  }
})
