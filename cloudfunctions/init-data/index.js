const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 初始化测试数据
exports.main = async (event, context) => {
  try {
    // 添加测试攻略
    const testGuides = [
      {
        title: '海边日落拍照技巧',
        content: `海边日落是最美的拍摄场景之一，掌握以下技巧让你的照片更出彩：

1. **选择黄金时刻**
日落前30分钟和日落后15分钟是最佳拍摄时间，此时光线柔和，色彩丰富。

2. **使用三分法构图**
将地平线放在画面三分之一处，可以是上三分之一或下三分之一，避免将地平线放在正中间。

3. **注意白平衡设置**
将白平衡设置为"阴天"或"阴影"模式，可以让日落的暖色调更加明显。

4. **利用前景增加层次**
寻找礁石、贝壳、海浪等作为前景，增加画面的层次感和深度。

5. **尝试剪影效果**
让人物或物体成为剪影，配合绚丽的天空，效果非常震撼。`,
        coverImage: '',
        images: [],
        scene: '海滩',
        sceneTags: '["海滩","日落","海边"]',
        styleTags: '["唯美","暖色调","自然"]',
        contentType: 1,
        difficulty: 1,
        viewCount: 256,
        status: 'approved',
        authorId: 'system',
        createTime: db.serverDate()
      },
      {
        title: '咖啡馆文艺照片怎么拍',
        content: `咖啡馆是拍摄文艺照片的绝佳场所，以下技巧帮你拍出氛围感：

1. **利用自然光**
选择靠窗的位置，利用侧光或逆光拍摄，营造柔和的光影效果。

2. **注意背景虚化**
使用大光圈（f/2.8或更大）虚化背景，突出主体，营造梦幻感。

3. **善用道具**
咖啡杯、书本、花束等都是很好的道具，可以增加画面的故事感。

4. **拍摄细节**
特写咖啡拉花、甜点纹理、书页翻动等细节，展现生活美学。

5. **调整色调**
后期可以降低饱和度，增加暖色调，营造复古文艺的氛围。`,
        coverImage: '',
        images: [],
        scene: '咖啡馆',
        sceneTags: '["咖啡馆","室内","文艺"]',
        styleTags: '["文艺","复古","暖色调"]',
        contentType: 1,
        difficulty: 2,
        viewCount: 189,
        status: 'approved',
        authorId: 'system',
        createTime: db.serverDate()
      },
      {
        title: '街头摄影入门指南',
        content: `街头摄影充满魅力，记录城市中真实的人间百态：

1. **保持低调**
使用小相机或手机，避免引起注意。穿着融入环境，动作自然。

2. **预判精彩瞬间**
观察人流动向，预判可能出现的精彩画面，提前做好准备。

3. **善用几何构图**
利用建筑线条、光影对比、重复图案等元素，创造视觉冲击力。

4. **捕捉情绪**
关注人物的表情和肢体语言，捕捉真实的情感瞬间。

5. **后期处理**
黑白处理可以增强街头摄影的纪实感，突出光影和构图。`,
        coverImage: '',
        images: [],
        scene: '街头',
        sceneTags: '["街头","城市","纪实"]',
        styleTags: '["黑白","纪实","抓拍"]',
        contentType: 1,
        difficulty: 3,
        viewCount: 342,
        status: 'approved',
        authorId: 'system',
        createTime: db.serverDate()
      }
    ]

    // 批量添加攻略
    for (const guide of testGuides) {
      await db.collection('guides').add({ data: guide })
    }

    return {
      code: 200,
      message: '测试数据初始化成功',
      data: {
        guidesCount: testGuides.length
      }
    }
  } catch (err) {
    return {
      code: 500,
      message: err.message
    }
  }
}
