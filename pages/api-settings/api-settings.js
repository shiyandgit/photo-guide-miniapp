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
    doubaoTutorial: '<h2>豆包 API Key 获取步骤</h2><p>1. 访问火山引擎控制台</p><p>2. 注册并完成实名认证</p><p>3. 进入「豆包大模型」服务</p><p>4. 创建 API Key 并复制</p><p>注意：豆包提供充足的免费额度，适合个人开发者使用。</p>',
    tongyiTutorial: '<h2>通义千问 API Key 获取步骤</h2><p>1. 访问阿里云控制台</p><p>2. 搜索「通义千问」服务</p><p>3. 开通服务并创建 API Key</p><p>4. 复制 API Key 到本应用</p><p>注意：通义千问视觉理解能力强，适合图片分析场景。</p>'
  },

  onLoad() {
    this.loadStatus();
  },

  async loadStatus() {
    try {
      const status = await api.user.getApiKeyStatus();
      this.setData({
        hasKey: status.hasKey,
        platformName: status.provider === 'doubao' ? '豆包' : status.provider === 'tongyi' ? '通义千问' : '',
        maskedKey: status.maskedKey || ''
      });
    } catch (err) {
      console.error('加载状态失败', err);
    }
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
      await api.user.saveApiKey(this.data.selectedPlatform, this.data.apiKey);

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
            await api.user.deleteApiKey();
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
