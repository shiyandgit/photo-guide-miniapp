const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const action = event.action || 'login'
  const data = event.data || {}

  switch (action) {
    case 'login':
      return await login(openid)
    case 'getUserInfo':
      return await getUserInfo(openid)
    case 'getApiKeyStatus':
      return await getApiKeyStatus(openid)
    case 'saveApiKey':
      return await saveApiKey(openid, data)
    case 'deleteApiKey':
      return await deleteApiKey(openid)
    default:
      return { code: 400, message: '未知操作' }
  }
}

async function login(openid) {
  try {
    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    let user = null

    if (userRes.data.length === 0) {
      const newUser = {
        openid: openid,
        nickname: '摄影新手',
        avatar: '',
        role: 'user',
        apiKeys: {},
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }

      const addRes = await db.collection('users').add({
        data: newUser
      })

      user = { ...newUser, _id: addRes._id }
    } else {
      user = userRes.data[0]
    }

    return {
      code: 200,
      data: {
        token: openid,
        userId: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

async function getUserInfo(openid) {
  try {
    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    if (userRes.data.length === 0) {
      return { code: 404, message: '用户不存在' }
    }

    const user = userRes.data[0]
    return {
      code: 200,
      data: {
        userId: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

async function getApiKeyStatus(openid) {
  try {
    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    if (userRes.data.length === 0) {
      return { code: 200, data: { hasKey: false } }
    }

    const apiKeys = userRes.data[0].apiKeys || {}
    const provider = apiKeys.provider || ''
    const apiKey = apiKeys.apiKey || ''

    return {
      code: 200,
      data: {
        hasKey: !!apiKey,
        provider: provider,
        maskedKey: apiKey ? apiKey.substring(0, 6) + '****' + apiKey.substring(apiKey.length - 4) : ''
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

async function saveApiKey(openid, data) {
  try {
    const { provider, apiKey } = data

    if (!provider || !apiKey) {
      return { code: 400, message: '参数不完整' }
    }

    await db.collection('users').where({
      openid: openid
    }).update({
      data: {
        apiKeys: {
          provider: provider,
          apiKey: apiKey
        },
        updateTime: db.serverDate()
      }
    })

    return { code: 200, message: '保存成功' }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

async function deleteApiKey(openid) {
  try {
    await db.collection('users').where({
      openid: openid
    }).update({
      data: {
        apiKeys: {},
        updateTime: db.serverDate()
      }
    })

    return { code: 200, message: '删除成功' }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
