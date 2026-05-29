const api = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    hasKey: false,
    platformName: '',
    maskedKey: '',
    showForm: false,
    selectedPlatform: '',
    apiKey: '',
    verifying: false,
    errorMsg: '',
    showDoubaoTutorial: false,
    showTongyiTutorial: false,
    doubaoTutorial: '',
    tongyiTutorial: ''
  },

  onLoad() {
    this.loadStatus();
    this.loadTutorials();
  },

  async loadStatus() {
    try {
      const status = await api.request({ url: '/api/user/api-key' });
      this.setData({
        hasKey: status.hasKey,
        platformName: status.provider === 'doubao' ? '豆包' : status.provider === 'tongyi' ? '通义千问' : '',
        maskedKey: status.maskedKey || ''
      });
    } catch (err) {
      console.error('加载状态失败', err);
    }
  },

  async loadTutorials() {
    try {
      const doubao = await api.request({ url: '/api/ai/tutorial/doubao' });
      const tongyi = await api.request({ url: '/api/ai/tutorial/tongyi' });
      this.setData({
        doubaoTutorial: this.markdownToHtml(doubao),
        tongyiTutorial: this.markdownToHtml(tongyi)
      });
    } catch (err) {
      console.error('加载教程失败', err);
    }
  },

  markdownToHtml(md) {
    // 简单的 Markdown 转 HTML
    return md
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br/>');
  },

  selectPlatform(e) {
    this.setData({
      selectedPlatform: e.currentTarget.dataset.platform,
      errorMsg: ''
    });
  },

  onKeyInput(e) {
    this.setData({
      apiKey: e.detail.value,
      errorMsg: ''
    });
  },

  async verifyAndSave() {
    if (!this.data.selectedPlatform) {
      this.setData({ errorMsg: '请选择平台' });
      return;
    }
    if (!this.data.apiKey) {
      this.setData({ errorMsg: '请输入 API Key' });
      return;
    }

    this.setData({ verifying: true, errorMsg: '' });

    try {
      // 先验证
      const isValid = await api.request({
        url: '/api/user/api-key/verify',
        method: 'POST',
        data: {
          provider: this.data.selectedPlatform,
          apiKey: this.data.apiKey
        }
      });

      if (!isValid) {
        this.setData({ errorMsg: 'API Key 验证失败，请检查后重试' });
        return;
      }

      // 保存
      await api.request({
        url: '/api/user/api-key',
        method: 'POST',
        data: {
          provider: this.data.selectedPlatform,
          apiKey: this.data.apiKey
        }
      });

      util.showSuccess('配置成功');
      this.setData({
        showForm: false,
        apiKey: ''
      });
      this.loadStatus();
    } catch (err) {
      this.setData({ errorMsg: err });
    } finally {
      this.setData({ verifying: false });
    }
  },

  showChangeForm() {
    this.setData({
      showForm: true,
      selectedPlatform: '',
      apiKey: '',
      errorMsg: ''
    });
  },

  deleteKey() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除 API Key 配置吗？删除后将无法使用 AI 评析功能。',
      confirmColor: '#f44336',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.request({
              url: '/api/user/api-key',
              method: 'DELETE'
            });
            util.showSuccess('已删除');
            this.loadStatus();
          } catch (err) {
            util.showError(err);
          }
        }
      }
    });
  },

  toggleTutorial(e) {
    const provider = e.currentTarget.dataset.provider;
    if (provider === 'doubao') {
      this.setData({ showDoubaoTutorial: !this.data.showDoubaoTutorial });
    } else {
      this.setData({ showTongyiTutorial: !this.data.showTongyiTutorial });
    }
  }
});
