const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  console.log('收到event:', JSON.stringify(event))
  var wxContext = cloud.getWXContext()
  var action = event.action
  var data = event.data
  console.log('action值:', action, '类型:', typeof action)

  switch (action) {
    case 'getHotGuides':
      return await getHotGuides(data)
    case 'getGuideDetail':
      return await getGuideDetail(data)
    case 'searchGuides':
      return await searchGuides(data)
    case 'getMyFavorites':
      return await getMyFavorites(wxContext.OPENID)
    case 'toggleFavorite':
      return await toggleFavorite(wxContext.OPENID, data)
    case 'getMyHistory':
      return await getMyHistory(wxContext.OPENID)
    case 'addHistory':
      return await addHistory(wxContext.OPENID, data)
    default:
      return { code: 400, message: '未知操作' }
  }
}

// 获取热门攻略
async function getHotGuides(data) {
  try {
    var limit = (data && data.limit) ? data.limit : 10
    var res = await db.collection('guides')
      .where({
        status: 'approved'
      })
      .orderBy('viewCount', 'desc')
      .limit(limit)
      .get()

    return { code: 200, data: res.data }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

// 获取攻略详情
async function getGuideDetail(data) {
  try {
    var guideId = data.guideId
    var res = await db.collection('guides').doc(guideId).get()

    // 增加浏览量
    await db.collection('guides').doc(guideId).update({
      data: {
        viewCount: _.inc(1)
      }
    })

    return { code: 200, data: res.data }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

// 搜索攻略
async function searchGuides(data) {
  try {
    var keyword = data.keyword
    var scene = data.scene
    var page = data.page || 1
    var pageSize = data.pageSize || 10

    var query = db.collection('guides').where({
      status: 'approved'
    })

    if (scene) {
      query = query.where({ scene: scene })
    }

    if (keyword) {
      query = query.where({
        title: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      })
    }

    var countRes = await query.count()
    var total = countRes.total

    var res = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('createTime', 'desc')
      .get()

    return {
      code: 200,
      data: {
        list: res.data,
        total: total,
        page: page,
        pageSize: pageSize
      }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

// 获取我的收藏
async function getMyFavorites(openid) {
  try {
    var res = await db.collection('favorites')
      .where({ openid: openid })
      .orderBy('createTime', 'desc')
      .get()

    // 关联查询攻略详情
    var guides = []
    for (var i = 0; i < res.data.length; i++) {
      try {
        var guideRes = await db.collection('guides').doc(res.data[i].guideId).get()
        guides.push(guideRes.data)
      } catch (e) {
        // 攻略可能已删除，跳过
      }
    }

    return { code: 200, data: guides }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

// 切换收藏状态
async function toggleFavorite(openid, data) {
  try {
    var guideId = data.guideId
    var existing = await db.collection('favorites')
      .where({
        openid: openid,
        guideId: guideId
      })
      .get()

    if (existing.data.length > 0) {
      // 取消收藏
      await db.collection('favorites').doc(existing.data[0]._id).remove()
      return { code: 200, data: { isFavorite: false } }
    } else {
      // 添加收藏
      await db.collection('favorites').add({
        data: {
          openid: openid,
          guideId: guideId,
          createTime: db.serverDate()
        }
      })
      return { code: 200, data: { isFavorite: true } }
    }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

// 获取浏览历史
async function getMyHistory(openid) {
  try {
    var res = await db.collection('history')
      .where({ openid: openid })
      .orderBy('viewTime', 'desc')
      .limit(50)
      .get()

    // 关联查询攻略详情
    var guides = []
    for (var i = 0; i < res.data.length; i++) {
      try {
        var guideRes = await db.collection('guides').doc(res.data[i].guideId).get()
        guides.push(guideRes.data)
      } catch (e) {
        // 攻略可能已删除，跳过
      }
    }

    return { code: 200, data: guides }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}

// 添加浏览历史
async function addHistory(openid, data) {
  try {
    var guideId = data.guideId

    // 检查是否已存在
    var existing = await db.collection('history')
      .where({
        openid: openid,
        guideId: guideId
      })
      .get()

    if (existing.data.length > 0) {
      // 更新时间
      await db.collection('history').doc(existing.data[0]._id).update({
        data: { viewTime: db.serverDate() }
      })
    } else {
      // 添加新记录
      await db.collection('history').add({
        data: {
          openid: openid,
          guideId: guideId,
          viewTime: db.serverDate()
        }
      })
    }

    return { code: 200, message: 'ok' }
  } catch (err) {
    return { code: 500, message: err.message }
  }
}
