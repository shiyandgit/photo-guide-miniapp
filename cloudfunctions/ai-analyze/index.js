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

async function analyzePhoto(openid, data) {
  try {
    const { fileID, scene } = data

    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    if (userRes.data.length === 0) {
      return { code: 401, message: '用户未登录' }
    }

    const user = userRes.data[0]
    const apiKeys = user.apiKeys || {}

    const mockResult = {
      scene: scene || '通用场景',
      score: 75,
      composition: '三分法',
      lighting: '自然光',
      style: '日系清新',
      suggestionText: '1. 构图建议：建议使用三分法构图，将主体放在画面的交叉点上，可以让画面更加平衡和有层次感。\n\n2. 光线建议：当前光线角度可以调整，避免逆光造成主体过暗。建议在黄金时刻（日出后/日落前1小时）拍摄。\n\n3. 背景建议：背景可以适当虚化，突出主体。可以尝试使用人像模式或大光圈拍摄。',
      promptText: 'A beautiful photograph with natural lighting, soft bokeh background, golden hour warmth, rule of thirds composition, cinematic color grading, shallow depth of field, professional photography style',
      aiModel: '模拟分析 (Mock)'
    }

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
