const app = getApp()

const callFunction = (name, action, data = {}) => {
  return new Promise((resolve, reject) => {
    console.log(`[API] 调用云函数: ${name}, action: ${action}`, data)
    wx.cloud.callFunction({
      name: name,
      data: { action: action, data: data },
      success: (res) => {
        console.log(`[API] ${name}.${action} 返回:`, JSON.stringify(res.result))
        if (res.result && res.result.code === 200) {
          resolve(res.result.data)
        } else {
          console.error(`[API] ${name}.${action} 业务错误:`, res.result)
          reject((res.result && res.result.message) || '请求失败')
        }
      },
      fail: (err) => {
        console.error(`[API] ${name}.${action} 调用失败:`, err)
        reject(err.errMsg || '云函数调用失败')
      }
    })
  })
}

const user = {
  login: () => callFunction('user', 'login'),
  getUserInfo: () => callFunction('user', 'getUserInfo'),
  getApiKeyStatus: () => callFunction('user', 'getApiKeyStatus'),
  saveApiKey: (provider, apiKey) => callFunction('user', 'saveApiKey', { provider, apiKey }),
  deleteApiKey: () => callFunction('user', 'deleteApiKey')
}

const guide = {
  getHot: (limit = 10) => callFunction('guide', 'getHotGuides', { limit }),
  getDetail: (guideId) => callFunction('guide', 'getGuideDetail', { guideId }),
  search: (params) => callFunction('guide', 'searchGuides', params),
  getMyFavorites: () => callFunction('guide', 'getMyFavorites'),
  toggleFavorite: (guideId) => callFunction('guide', 'toggleFavorite', { guideId }),
  getMyHistory: () => callFunction('guide', 'getMyHistory'),
  addHistory: (guideId) => callFunction('guide', 'addHistory', { guideId }),
  submitGuide: (data) => callFunction('guide', 'submitGuide', data),
  updateGuide: (guideId, data) => callFunction('guide', 'updateGuide', { guideId, ...data }),
  deleteGuide: (guideId) => callFunction('guide', 'deleteGuide', { guideId }),
  getMyContributions: () => callFunction('guide', 'getMyContributions'),
  getMyOpenId: () => callFunction('guide', 'getMyOpenId'),
  adminGetAllGuides: () => callFunction('guide', 'adminGetAllGuides'),
  adminDeleteGuide: (guideId) => callFunction('guide', 'deleteGuide', { guideId })
}

const ai = {
  analyzePhoto: (fileID, scene) => callFunction('ai-analyze', 'analyzePhoto', { fileID, scene }),
  getHistory: () => callFunction('ai-analyze', 'getAnalysisHistory')
}

const uploadFile = (filePath, cloudPath) => {
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: (res) => { resolve(res.fileID) },
      fail: (err) => { reject(err.errMsg || '上传失败') }
    })
  })
}

module.exports = { callFunction, user, guide, ai, uploadFile }
