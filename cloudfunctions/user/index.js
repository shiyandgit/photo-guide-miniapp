const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 用户登录
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 查找用户
    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    let user = null

    if (userRes.data.length === 0) {
      // 新用户，创建记录
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
        token: openid, // 简单使用openid作为token
        userId: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role
      }
    }
  } catch (err) {
    return {
      code: 500,
      message: err.message
    }
  }
}
