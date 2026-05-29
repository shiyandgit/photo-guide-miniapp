const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, data } = event

  switch (action) {
    case 'analyzePhoto':
      return await analyzePhoto(wxContext.OPENID, data)
    case 'getAnalysisHistory':
      return await getAnalysisHistory(wxContext.OPENID)
    default:
      return { code: 400, message: '未知操作' }
  }
}

// AI分析照片
async function analyzePhoto(openid, data) {
  try {
    const { fileID, scene } = data

    // 获取用户配置的API Key
    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    if (userRes.data.length === 0) {
      return { code: 401, message: '用户未登录' }
    }

    const user = userRes.data[0]
    const apiKeys = user.apiKeys || {}

    // 这里应该调用实际的AI API（如豆包、通义千问等）
    // 由于云函数环境限制，这里返回模拟数据
    // 实际使用时需要配置HTTP请求调用AI API

    const mockResult = {
      scene: scene || '通用场景',
      suggestions: [
        '建议使用三分法构图，将主体放在交叉点上',
        '光线角度可以调整，避免逆光造成主体过暗',
        '背景可以适当虚化，突出主体'
      ],
      score: 75,
      composition: '三分法',
      lighting: '自然光',
      style: '日系清新'
    }

    // 保存分析记录
    await db.collection('ai_records').add({
      data: {
        openid: openid,
        fileID: fileID,
        scene: scene,
        result: mockResult,
        createTime: db.serverDate()
      }
    })

    return { code: 200, data: mockResult }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

// 获取分析历史
async function getAnalysisHistory(openid) {
  try {
    const res = await db.collection('ai_records')
      .where({ openid: openid })
      .orderBy('createTime', 'desc')
      .limit(20)
      .get()

    return { code: 200, data: res.data }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
