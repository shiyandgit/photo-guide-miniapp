const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const defaultGuides = [
  {
    _id: 'sample-sunset',
    title: '海边日落拍照技巧',
    summary: '抓住黄金时刻、前景层次和剪影，让普通海边照片更有电影感。',
    content: '<p>海边日落最重要的是<strong>提前到场</strong>。日落前 30 分钟到日落后 15 分钟，光线柔和，天空色彩也最丰富。</p><p><strong>构图技巧</strong>：把地平线放在画面上三分之一或下三分之一，不要正好切在中间。可以用礁石、贝壳、浪花做人像或天空的前景。</p><p><strong>人像拍摄</strong>：让人物侧身看向海面，保留一些剪影；手机拍摄时轻点天空压低曝光，晚霞会更有层次。</p>',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    coverColor: '#FF8A65',
    scene: '海滩',
    sceneTags: '["海滩","日落","海边"]',
    styleTags: '["唯美","暖色调","自然"]',
    contentType: 1,
    difficulty: 1,
    viewCount: 256,
    favoriteCount: 38
  },
  {
    _id: 'sample-cafe',
    title: '咖啡馆文艺照片怎么拍',
    summary: '用窗边自然光、桌面道具和浅景深，拍出松弛的生活感。',
    content: '<p>咖啡馆最适合利用<strong>窗边侧光</strong>。让光从人物侧面进入，脸部会有自然明暗，画面比顶光更柔和。</p><p><strong>道具选择</strong>：桌上的咖啡杯、甜点、书本、花束都可以做道具。不要把所有东西摆满，保留一点桌面留白会更舒服。</p><p><strong>特写拍摄</strong>：靠近咖啡拉花、书页翻动或手部动作，背景稍微虚化，照片会更有故事感。</p>',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    coverColor: '#8D6E63',
    scene: '咖啡馆',
    sceneTags: '["咖啡馆","室内","文艺"]',
    styleTags: '["文艺","复古","暖色调"]',
    contentType: 1,
    difficulty: 2,
    viewCount: 189,
    favoriteCount: 24
  },
  {
    _id: 'sample-street',
    title: '街头摄影入门指南',
    summary: '观察光影、等待瞬间，用城市线条组织画面。',
    content: '<p>街头摄影不急着按快门。先观察<strong>人流方向、建筑线条和光影位置</strong>，再等一个合适的人或动作进入画面。</p><p><strong>构图元素</strong>：可以利用斑马线、楼梯、橱窗反射、墙面阴影来制造秩序感。画面越复杂，越需要一个清楚的主体。</p><p><strong>手机设置</strong>：建议开启网格线，降低一点曝光，保住高光细节。黑白处理也很适合强化街头照片的纪实感。</p>',
    coverImage: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&q=80',
    coverColor: '#546E7A',
    scene: '街头',
    sceneTags: '["街头","城市","纪实"]',
    styleTags: '["黑白","纪实","抓拍"]',
    contentType: 1,
    difficulty: 3,
    viewCount: 342,
    favoriteCount: 51
  },
  {
    _id: 'guide-citynight-001',
    title: '城市夜景天际线怎么拍才震撼',
    summary: '选对机位、控制曝光和白平衡，手机也能拍出大片感的城市夜景。',
    content: '<p>拍城市夜景最关键的是<strong>选对时间</strong>。不要等天完全黑，日落后 20-40 分钟的"蓝调时刻"天空还有层次，灯光刚亮，这时候拍出来的天际线最有质感。</p><p><strong>机位选择</strong>：找高处俯拍是经典方案。天台、山顶观景台、高层酒店窗边都可以。如果没有高处，江边、湖面倒影也是好选择，水面会让画面多一倍的灯光层次。</p><p><strong>手机设置</strong>：打开专业模式，ISO 调到 100-200，快门 1-2 秒（需要三脚架或靠在栏杆上稳定）。白平衡偏冷一点，天空会更蓝。对焦拉到无穷远，保证建筑清晰。</p><p><strong>构图技巧</strong>：用引导线把视线引向天际线主体。河流、桥梁、道路都是天然的引导线。画面上方留一些天空，下方留一些前景，不要把建筑切在正中间。</p><p>后期可以把暗部稍微压一点，高光不要过曝，适当加一点清晰度和去雾，城市夜景的通透感就出来了。</p>',
    coverImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
    coverColor: '#1A237E',
    scene: '城市',
    sceneTags: '["城市","夜景","天际线","建筑"]',
    styleTags: '["震撼","蓝调","长曝光","大气"]',
    contentType: 1,
    difficulty: 2,
    viewCount: 520,
    favoriteCount: 87
  },
  {
    _id: 'guide-rainstreet-002',
    title: '雨天街拍：把坏天气变成好照片',
    summary: '雨天的反射、水滴和朦胧感，是晴天拍不出的独特氛围。',
    content: '<p>很多人下雨就收起相机，其实雨天是街拍的宝藏天气。地面的积水能反射霓虹灯和招牌，画面一下子就有电影感。</p><p><strong>必拍元素</strong>：①积水倒影——蹲低拍摄，把地面当镜子；②雨伞和行人——从高处俯拍，五颜六色的雨伞像流动的色块；③玻璃上的雨珠——隔着咖啡馆窗户拍街景，前景的水珠自然虚化。</p><p><strong>保护设备</strong>：手机套个透明防水袋，或者在屋檐下拍摄。镜头上沾了水滴不要擦，有时候水滴自带柔焦效果，反而好看。</p><p><strong>曝光技巧</strong>：雨天光线暗，但不要疯狂拉高 ISO。可以适当降低快门速度到 1/60 秒，让雨丝拉成线条，画面更有动感。如果要定格雨滴，快门至少 1/500 秒以上。</p><p><strong>后期方向</strong>：压低高光、提亮暗部，保留更多细节。色调偏青偏冷，加一点颗粒感，就有日系电影的味道了。</p>',
    coverImage: 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?w=800&q=80',
    coverColor: '#37474F',
    scene: '街头',
    sceneTags: '["雨天","街拍","城市","氛围"]',
    styleTags: '["电影感","日系","冷色调","纪实"]',
    contentType: 1,
    difficulty: 2,
    viewCount: 380,
    favoriteCount: 62
  },
  {
    _id: 'guide-bookstore-003',
    title: '书店拍照指南：文艺感拉满的5个技巧',
    summary: '利用书架纵深、暖色灯光和阅读姿态，拍出安静又有故事感的书店照片。',
    content: '<p>书店是天然的摄影棚。大面积的书架做背景，暖色灯光自带氛围，怎么拍都不容易翻车。</p><p><strong>构图核心</strong>：利用书架的<strong>纵深感</strong>。让人物站在书架通道中间，镜头正对通道拍摄，两侧书架自然形成引导线，画面有很强的透视感。</p><p><strong>动作引导</strong>：不要让人物呆站着。可以：①从书架上抽一本书，侧身翻看；②坐在地上靠着书架阅读；③踮脚够高处的书（抓拍）；④双手捧书，微微低头。这些动作都比"看镜头微笑"更有故事感。</p><p><strong>光线利用</strong>：书店通常是暖色顶光，容易在脸上形成阴影。让人物靠近窗户或台灯位置，用侧光补亮脸部。如果没有自然光，手机开人像模式自带补光。</p><p><strong>细节特写</strong>：拍一些空镜——翻开的书页、手指划过文字、书脊排列、咖啡杯放在书旁。这些特写可以和人像拼成一组图文，发小红书特别好看。</p>',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
    coverColor: '#4E342E',
    scene: '书店',
    sceneTags: '["书店","室内","文艺","阅读"]',
    styleTags: '["文艺","暖色调","安静","日系"]',
    contentType: 1,
    difficulty: 1,
    viewCount: 410,
    favoriteCount: 73
  },
  {
    _id: 'guide-concert-004',
    title: '演唱会拍照全攻略：从入场到返图',
    summary: '舞台灯光复杂、距离远、不能开闪光灯——掌握这些技巧照样出片。',
    content: '<p>演唱会拍照是最考验手机摄影的场景之一。光线复杂、距离远、不能用闪光灯，但拍好了效果特别炸。</p><p><strong>位置选择</strong>：内场前排拍人像特写，看台高处拍全景氛围。如果只能选一个，看台的位置反而更容易出片——能拍到舞台全貌和观众灯海。</p><p><strong>手机设置</strong>：关掉闪光灯（演唱会禁用）。打开专业模式：ISO 自动上限设 3200，快门 1/125 秒以上（防止手抖糊片）。对焦模式选连续对焦，跟着舞台上的歌手走。</p><p><strong>抓拍时机</strong>：①歌手张嘴唱歌的瞬间（表情最有张力）；②舞台喷烟、喷火、彩带的高潮时刻；③观众亮起手机灯的万人灯海画面；④散场时的舞台空镜。</p><p><strong>注意事项</strong>：不要一直举着手机拍，影响旁边的人也影响自己的体验。挑几首喜欢的歌认真拍，其余时间享受现场。拍完及时整理，演唱会照片噪点多是正常的，后期适当降噪但不要过度磨皮，保留现场的粗粝感反而更真实。</p>',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    coverColor: '#D32F2F',
    scene: '演唱会',
    sceneTags: '["演唱会","音乐节","舞台","灯光"]',
    styleTags: '["氛围感","炫酷","高对比","抓拍"]',
    contentType: 2,
    difficulty: 3,
    viewCount: 650,
    favoriteCount: 112
  },
  {
    _id: 'guide-picnic-005',
    title: '公园野餐人像：轻松拍出朋友圈高赞照片',
    summary: '道具摆放、光线角度和自然互动，让野餐照片不像是摆拍的。',
    content: '<p>野餐拍照最容易踩的坑是：东西摆了一地，拍出来像杂货铺。关键在于<strong>做减法</strong>和<strong>抓互动</strong>。</p><p><strong>道具选择</strong>：一块素色野餐垫（米白或格子最百搭）、一束花、一本书、水果篮、法棍面包。颜色控制在 3-4 种以内，不要五颜六色。道具不要摆满，留出 30% 的空白区域。</p><p><strong>光线方向</strong>：最佳时间是上午 9-10 点或下午 4-5 点，太阳角度低，光线柔和。让光线从侧面或侧后方打过来，人物头发会有一圈金色轮廓光，特别好看。正午顶光会让脸上有难看的阴影，尽量避开。</p><p><strong>拍摄角度</strong>：①俯拍全景——站在高处拍整个野餐布置；②平拍人像——和人物坐同一高度，用食物或花束做前景虚化；③低角度仰拍——从草地上往上拍，天空和树叶做背景，画面干净。</p><p><strong>动作引导</strong>：让模特做"正在做的事"——倒果汁、切水果、翻书、躺下看天空。抓拍比摆拍自然 10 倍。可以连拍一组，选表情最放松的那张。</p>',
    coverImage: 'https://images.unsplash.com/photo-1529543544282-ea754076a360?w=800&q=80',
    coverColor: '#66BB6A',
    scene: '公园',
    sceneTags: '["公园","野餐","户外","人像"]',
    styleTags: '["清新","自然","日系","暖色调"]',
    contentType: 2,
    difficulty: 1,
    viewCount: 480,
    favoriteCount: 95
  },
  {
    _id: 'guide-snow-006',
    title: '雪景人像：冬天也能拍出温柔感',
    summary: '利用雪地反光、暖色穿搭和呼出的白气，拍出冬日限定的浪漫照片。',
    content: '<p>雪天拍照最大的优势是<strong>天然反光板</strong>。雪地会把光线均匀反射到人物脸上，几乎不需要补光，皮肤就会很通透。</p><p><strong>穿搭建议</strong>：穿红色、酒红、焦糖色等暖色系大衣或围巾，和白色雪地形成强烈对比。避免穿白色，会和背景融为一体。</p><p><strong>拍摄时机</strong>：下雪时拍最出片。雪花落在头发和睫毛上特别好看。如果是晴天雪后，选择上午 9-10 点或下午 3-4 点，侧光会让雪地有层次。</p><p><strong>创意玩法</strong>：①抓一把雪撒向空中，连拍捕捉雪花飘落；②让人物哈气，拍出白色的雾气；③躺在雪地上俯拍，用广角镜头会更有冲击力。</p><p><strong>设备保护</strong>：低温会加速电池消耗，多带一块备用电池放在贴身口袋保暖。从室外回到室内时，先把相机放在密封袋里，防止结露。</p>',
    coverImage: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80',
    coverColor: '#B3E5FC',
    scene: '雪景',
    sceneTags: '["雪景","冬天","户外","人像"]',
    styleTags: '["温柔","清新","冬日","浪漫"]',
    contentType: 2,
    difficulty: 2,
    viewCount: 380,
    favoriteCount: 68
  },
  {
    _id: 'guide-campus-007',
    title: '校园人像：把青春感拍进照片里',
    summary: '操场、教室、林荫道，校园里的每个角落都是天然摄影棚。',
    content: '<p>校园拍照的核心是<strong>青春感和故事感</strong>。不要刻意摆拍，让人物做"正在做的事"，照片会更自然。</p><p><strong>经典场景</strong>：①操场跑道——逆光拍摄跑步或走路的剪影；②教室窗边——阳光透过窗帘洒在课桌上，人物低头看书；③林荫道——树叶间漏下的光斑打在脸上；④图书馆书架——利用纵深感构图。</p><p><strong>时间选择</strong>：下午 4-5 点的体育课时间，操场上有运动的身影和金色的光线。放学后的空教室也很适合拍照，光线安静又柔和。</p><p><strong>道具利用</strong>：书包、课本、自行车、篮球、耳机都是校园感的元素。让人物背着书包走在路上，或者骑自行车回头看，抓拍比摆拍更有青春的味道。</p><p><strong>后期方向</strong>：色调偏青偏绿，降低一点饱和度，加一点胶片颗粒感，就有日系校园电影的感觉了。</p>',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80',
    coverColor: '#81C784',
    scene: '校园',
    sceneTags: '["校园","青春","教室","操场"]',
    styleTags: '["青春","日系","清新","胶片"]',
    contentType: 2,
    difficulty: 1,
    viewCount: 420,
    favoriteCount: 89
  },
  {
    _id: 'guide-chinese-008',
    title: '古风人像拍照指南：怎么拍才不像游客照',
    summary: '选对服装、利用建筑线条和光影，让古建筑前的照片有韵味。',
    content: '<p>古风照片最怕拍成"到此一游"。关键在于<strong>融入环境</strong>而不是站在环境前面。</p><p><strong>服装选择</strong>：汉服、旗袍或素色棉麻服装都可以。颜色以白、米、淡蓝、暗红为主，避免荧光色和现代印花。发型可以盘起来或扎低马尾，配一些简单的发饰。</p><p><strong>构图技巧</strong>：①利用门框、窗框做画中画构图；②站在回廊或长廊中间，用透视感引导视线；③利用建筑的对称性，人物放在中轴线上；④拍局部特写——手拿团扇、侧脸轮廓、衣袖飘动。</p><p><strong>光线利用</strong>：阴天比晴天更适合古风拍摄，光线均匀不会有硬阴影。如果是晴天，利用屋檐下的阴影区域，或者透过窗棂的光影打在脸上。</p><p><strong>动作引导</strong>：让人物缓缓走动、低头抚琴、侧身倚柱、抬头望天。动作要慢，表情要静，不要笑得太灿烂，保持一种"岁月静好"的氛围感。</p>',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    coverColor: '#8D6E63',
    scene: '古建筑',
    sceneTags: '["古建筑","汉服","中式","园林"]',
    styleTags: '["古风","典雅","中国风","文艺"]',
    contentType: 1,
    difficulty: 2,
    viewCount: 510,
    favoriteCount: 102
  },
  {
    _id: 'guide-pet-009',
    title: '宠物摄影入门：拍出猫狗最萌的瞬间',
    summary: '降低视角、利用玩具引导和连拍捕捉，让宠物照片生动起来。',
    content: '<p>宠物摄影最重要的原则是<strong>降低视角</strong>。蹲下来甚至趴下来，和宠物平视拍摄，照片会更有代入感和亲密感。</p><p><strong>吸引注意力</strong>：用零食、玩具或发出奇怪的声音吸引宠物看向镜头。可以让另一个人在你身后逗它，这样宠物的眼神方向正好对着相机。</p><p><strong>抓拍时机</strong>：①打哈欠的瞬间（特别可爱）；②歪头看你的样子；③奔跑跳跃的动态；④睡觉时的安静画面；⑤和主人互动的温馨时刻。这些都需要连拍，从几十张里选一张最好的。</p><p><strong>光线选择</strong>：自然光最好。让宠物在窗边或户外阳光下拍摄，避免闪光灯（会吓到它们，也容易出现红眼）。</p><p><strong>背景处理</strong>：选择简洁的背景，避免杂物抢镜。人像模式的虚化效果很适合宠物特写，能突出毛发的质感和眼神的灵动。</p>',
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    coverColor: '#FFB74D',
    scene: '宠物',
    sceneTags: '["宠物","猫","狗","室内"]',
    styleTags: '["可爱","温馨","自然","抓拍"]',
    contentType: 1,
    difficulty: 2,
    viewCount: 580,
    favoriteCount: 134
  },
  {
    _id: 'guide-subway-010',
    title: '地铁站街拍：通勤路上也能出大片',
    summary: '利用地铁的线条、灯光和动态感，把日常通勤变成城市摄影。',
    content: '<p>地铁站是被严重低估的摄影场景。<strong>对称的通道、流动的人群、冷暖交织的灯光</strong>，随手一拍就有城市电影感。</p><p><strong>最佳拍摄点</strong>：①站台层——利用列车进站的动态模糊做背景；②换乘通道——长长的自动扶梯和灯箱广告是天然的引导线；③闸机口——人流穿梭，抓拍匆忙的背影；④车窗反光——透过车窗拍对面站台的人物，有朦胧的层次感。</p><p><strong>光线特点</strong>：地铁站通常是冷色荧光灯，但广告灯箱会打出暖色光。利用这种冷暖对比，让人物站在暖色灯箱旁边，背景保持冷调，主体会很突出。</p><p><strong>拍摄技巧</strong>：快门速度 1/30-1/60 秒，可以让移动的人群产生动态模糊，而站立的人物保持清晰，动静对比很有张力。</p><p><strong>注意事项</strong>：注意不要影响其他乘客，避开高峰时段。有些城市的地铁站禁止商业拍摄，个人随拍一般没问题。</p>',
    coverImage: 'https://images.unsplash.com/photo-1515165076831-77937fa1bd13?w=800&q=80',
    coverColor: '#455A64',
    scene: '地铁',
    sceneTags: '["地铁","城市","通勤","室内"]',
    styleTags: '["城市","冷色调","纪实","电影感"]',
    contentType: 1,
    difficulty: 3,
    viewCount: 340,
    favoriteCount: 71
  },
  {
    _id: 'guide-rooftop-011',
    title: '天台人像：城市上空的浪漫时刻',
    summary: '利用天台的开阔视野、黄昏光线和城市背景，拍出电影感十足的照片。',
    content: '<p>天台拍照最大的优势是<strong>开阔的视野和干净的背景</strong>。没有杂物干扰，天空和城市天际线就是最好的背景板。</p><p><strong>最佳时间</strong>：日落前 1 小时到达，从金色时刻拍到蓝调时刻。黄昏的光线从侧面打过来，人物轮廓会有漂亮的金色边缘。</p><p><strong>构图技巧</strong>：①人物背对夕阳拍剪影，只保留轮廓；②利用天台的围栏、管道、楼梯做前景，增加层次感；③让人物站在天台边缘（注意安全），用广角镜头拍出天空占 2/3 的大气画面。</p><p><strong>穿搭建议</strong>：穿飘逸的裙子或大衣，风一吹衣角飞扬，画面更有动感。颜色以白、米、红为主，和天空形成对比。</p><p><strong>安全提醒</strong>：天台拍照一定要注意安全，不要靠近没有护栏的边缘，不要在大风天去天台。</p>',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    coverColor: '#FF7043',
    scene: '天台',
    sceneTags: '["天台","楼顶","城市","黄昏"]',
    styleTags: '["浪漫","电影感","大气","剪影"]',
    contentType: 2,
    difficulty: 2,
    viewCount: 460,
    favoriteCount: 88
  },
  {
    _id: 'guide-amusement-012',
    title: '游乐园拍照指南：把快乐定格在画面里',
    summary: '旋转木马、摩天轮、彩色灯光，游乐园是天然的梦幻摄影棚。',
    content: '<p>游乐园的色彩和灯光是<strong>天然的滤镜</strong>。不需要后期调色，现场拍出来就有童话感。</p><p><strong>必拍场景</strong>：①旋转木马——用慢快门拍出旋转的光影拖尾；②摩天轮——在轿厢里拍人像，窗外是城市夜景；③彩色灯串——让人物站在灯串中间，暖色光打在脸上；④棉花糖/气棒——拿在手里当道具，颜色鲜艳又可爱。</p><p><strong>拍摄技巧</strong>：夜景模式很重要。游乐园的灯光复杂，手机开夜景模式可以保留更多细节。如果要拍旋转木马的动态模糊，快门 1/15-1/30 秒，人物保持不动，木马会自然模糊。</p><p><strong>互动抓拍</strong>：不要让人物呆站着看镜头。抓拍她坐过山车时的尖叫声、吃棉花糖时的笑脸、赢了游戏时的欢呼，这些真实的表情比摆拍好看 100 倍。</p><p><strong>后期方向</strong>：色调偏暖偏粉，加一点柔光效果，就有日系少女漫画的感觉了。</p>',
    coverImage: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&q=80',
    coverColor: '#F48FB1',
    scene: '游乐园',
    sceneTags: '["游乐园","主题公园","旋转木马","夜景"]',
    styleTags: '["梦幻","童话","彩色","欢乐"]',
    contentType: 2,
    difficulty: 2,
    viewCount: 520,
    favoriteCount: 105
  },
  {
    _id: 'guide-car-013',
    title: '车内人像：小空间也能拍出大片感',
    summary: '利用车窗光线、后视镜和方向盘，把车内变成移动摄影棚。',
    content: '<p>车内是被忽略的摄影场景。<strong>封闭空间+自然光</strong>的组合，其实特别适合拍人像特写。</p><p><strong>光线利用</strong>：把车停在树荫下或建筑物旁边，让光线从车窗侧面进入。不要在正午阳光直射时拍，光线太硬。阴天或傍晚的散射光最柔和。</p><p><strong>经典机位</strong>：①副驾驶视角——从驾驶位拍副驾的人，车窗做背景；②后视镜——拍后视镜里的人脸反射，有种偷拍的自然感；③方向盘——人物手握方向盘，看向窗外，有种"在路上"的感觉；④车窗框——利用车窗框做画中画构图。</p><p><strong>道具利用</strong>：咖啡杯、墨镜、耳机、地图、零食都是车内拍照的好道具。让人物假装在看手机、听音乐、吃东西，抓拍比摆拍自然。</p><p><strong>创意玩法</strong>：雨天在车里拍，车窗上的雨滴做前景虚化，窗外的世界变成朦胧的色块，特别有氛围感。</p>',
    coverImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
    coverColor: '#78909C',
    scene: '车内',
    sceneTags: '["车内","汽车","自驾","公路"]',
    styleTags: '["文艺","公路","自由","氛围感"]',
    contentType: 1,
    difficulty: 1,
    viewCount: 390,
    favoriteCount: 76
  },
  {
    _id: 'guide-industrial-014',
    title: '工业风人像：废弃工厂也能拍出高级感',
    summary: '利用钢筋水泥、铁锈纹理和硬核光线，拍出冷酷又高级的工业风照片。',
    content: '<p>工业风照片的核心是<strong>粗犷和冷酷</strong>。水泥墙、铁锈管道、斑驳的地面，这些"不完美"的元素反而能衬托出人物的精致。</p><p><strong>选址建议</strong>：废弃工厂、旧仓库、停车场、建筑工地（需征得同意）、创意园区。选择有大面积水泥墙或铁锈金属的区域。</p><p><strong>穿搭搭配</strong>：黑色皮衣、牛仔、工装裤、马丁靴都是工业风的标配。妆容偏冷调，口红选深色系。避免穿得太甜美，会和环境不搭。</p><p><strong>光线特点</strong>：工业场景通常有从天窗或高处窗户洒下的顶光，光线硬朗。利用这种光线拍出强烈的明暗对比，人物脸部一半亮一半暗，特别有戏剧感。</p><p><strong>构图技巧</strong>：①利用对称的钢梁或管道做引导线；②人物站在画面很小的位置，大面积留白给环境，有种"渺小感"；③拍局部特写——手扶铁栏杆、脚踩碎石、侧脸靠墙。</p>',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    coverColor: '#455A64',
    scene: '工厂',
    sceneTags: '["工厂","废墟","工业","硬核"]',
    styleTags: '["冷酷","高级","暗黑","质感"]',
    contentType: 1,
    difficulty: 3,
    viewCount: 310,
    favoriteCount: 64
  },
  {
    _id: 'guide-botanical-015',
    title: '植物园人像：在绿色世界里拍出治愈系照片',
    summary: '利用热带植物、玻璃温室和自然光影，拍出清新又有氧气感的植物园照片。',
    content: '<p>植物园是<strong>天然的绿色摄影棚</strong>。大面积的绿植做背景，光线透过树叶洒下来，怎么拍都有氧气感。</p><p><strong>场景选择</strong>：①热带温室——巨大的龟背竹、芭蕉叶做背景，有种在东南亚的感觉；②仙人掌区——沙漠感的背景，适合拍酷一点的照片；③花园区——五颜六色的花丛做前景虚化；④林荫道——树叶间漏下的光斑打在脸上。</p><p><strong>拍摄技巧</strong>：利用植物的叶子做天然的前景框架。让一片大叶子挡住镜头一角，人物在中间，画面会有"偷窥感"的层次。</p><p><strong>穿搭建议</strong>：白色或浅色系衣服最百搭，和绿色背景形成清新对比。碎花裙也很适合，但要注意花色不要和背景的花太接近。</p><p><strong>后期方向</strong>：色调偏绿偏青，降低一点饱和度，提亮暗部，加一点胶片感，就有日系治愈系的感觉了。</p>',
    coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    coverColor: '#66BB6A',
    scene: '植物园',
    sceneTags: '["植物园","温室","热带","绿色"]',
    styleTags: '["清新","治愈","自然","氧气感"]',
    contentType: 2,
    difficulty: 1,
    viewCount: 440,
    favoriteCount: 92
  },
  {
    _id: 'emergency-backlight-001',
    title: '逆光拍人脸黑？3步搞定',
    summary: '太阳在背后，人脸变成剪影——不用换位置，调一下就能拍。',
    content: '<p><strong>问题</strong>：逆光拍照，背景很亮，人脸全黑。</p><p><strong>第1步：开HDR</strong><br>打开手机相机的HDR模式（一般在顶部或设置里）。HDR会自动提亮暗部，压住高光，人脸和天空都能看清。</p><p><strong>第2步：点脸对焦+曝光补偿</strong><br>屏幕上点一下人脸的位置，手机会自动以脸部亮度为基准曝光。如果还是暗，按住人脸图标不放，出现小太阳后往上滑，手动提亮 <strong>+1 ~ +1.5 EV</strong>。</p><p><strong>第3步：找反光</strong><br>让人物站在浅色墙壁、地面或白色衣服的人旁边，光线会自然反射到脸上。没有反光面的话，用白纸或白色塑料袋举在脸下方，效果一样。</p><p><strong>参数速查</strong>：曝光补偿 +1~+1.5 EV | ISO自动 | 点测光模式</p><p><strong>速查口诀</strong>：开HDR → 点脸提亮 → 找反光。</p>',
    coverImage: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=800&q=80',
    coverColor: '#FFA726',
    scene: '通用',
    sceneTags: '["逆光","通用","户外","人像"]',
    styleTags: '["应急","速查","实用"]',
    contentType: 2,
    difficulty: 1,
    viewCount: 890,
    favoriteCount: 234
  },
  {
    _id: 'emergency-crowd-002',
    title: '人太多拍不清主体？这样避开人群',
    summary: '景点人山人海，不用等人散，换个角度就能拍出空无一人的效果。',
    content: '<p><strong>问题</strong>：景区人太多，拍出来全是路人甲。</p><p><strong>第1步：仰拍</strong><br>把手机放低，镜头朝上拍。人物站在画面下方 1/3，上方是天空或建筑顶部。路人自然就被"切"出画面了。</p><p><strong>第2步：大光圈虚化</strong><br>打开人像模式，对焦在人物身上，背景的路人会自动模糊成色块。离人物越近、离路人越远，虚化效果越好。专业模式下，<strong>光圈调到 f/1.8~f/2.8</strong>（数值越小虚化越强）。</p><p><strong>第3步：等空档</strong><br>观察人群流动规律，等一波人走过、下一波还没来的 2-3 秒空档，连拍抢拍。早起（7-8点）或傍晚人最少。</p><p><strong>参数速查</strong>：人像模式 | 光圈 f/1.8~f/2.8 | ISO 100~200 | 快门 1/125s+</p><p><strong>速查口诀</strong>：仰拍 → 人像模式 → 抓空档。</p>',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    coverColor: '#42A5F5',
    scene: '通用',
    sceneTags: '["旅行","景点","通用","人群"]',
    styleTags: '["应急","速查","实用"]',
    contentType: 2,
    difficulty: 1,
    viewCount: 760,
    favoriteCount: 198
  },
  {
    _id: 'emergency-dark-003',
    title: '光线太暗拍糊了？暗光拍照急救',
    summary: '餐厅、酒吧、夜晚，光线不够也能拍出清晰照片。',
    content: '<p><strong>问题</strong>：光线暗，照片全是噪点，或者手抖拍糊了。</p><p><strong>第1步：开夜景模式</strong><br>现在大部分手机都有夜景模式（一般在"更多"或顶部图标里）。夜景模式会连续拍多张合成，噪点少、画面亮。拍照时保持 2-3 秒不动。</p><p><strong>第2步：找光源+调参数</strong><br>不要在黑暗的地方硬拍。让人物靠近灯、屏幕、蜡烛、窗户等光源。专业模式下：<strong>ISO 800~1600</strong>（再高噪点太多），<strong>快门 1/30s~1/60s</strong>（再慢容易手抖）。</p><p><strong>第3步：靠稳</strong><br>没有三脚架的话，把手机靠在桌子、墙壁、栏杆上稳定。或者双手夹紧手机，手肘顶住身体，按下快门后保持 1 秒不动。</p><p><strong>参数速查</strong>：夜景模式 | ISO 800~1600 | 快门 1/30s~1/60s | 白平衡自动</p><p><strong>速查口诀</strong>：夜景模式 → 找光源 → 靠稳。</p>',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    coverColor: '#7E57C2',
    scene: '通用',
    sceneTags: '["暗光","夜景","餐厅","通用"]',
    styleTags: '["应急","速查","实用"]',
    contentType: 2,
    difficulty: 1,
    viewCount: 680,
    favoriteCount: 176
  },
  {
    _id: 'guide-params-016',
    title: '手机摄影参数速查表：曝光、ISO、快门一看就懂',
    summary: '专业模式里的参数太多看不懂？这张表帮你5分钟搞懂核心参数。',
    content: '<p><strong>曝光补偿（EV）</strong>：控制画面明暗。数值范围一般 -2 到 +2。<br>• 拍白色物体（雪地、白墙）：+1 ~ +2 EV，否则会拍灰<br>• 拍黑色物体（黑色衣服、夜景）：-1 ~ -2 EV，否则会过曝<br>• <strong>口诀：白加黑减</strong></p><p><strong>ISO（感光度）</strong>：控制传感器对光线的敏感程度。<br>• 白天户外：ISO 50-100（画质最细腻）<br>• 室内/阴天：ISO 200-400<br>• 夜晚/暗光：ISO 800-1600（噪点会增加）<br>• <strong>原则：能低则低</strong>，ISO越高画面越粗糙</p><p><strong>快门速度（S）</strong>：控制曝光时间长短。<br>• 抓拍运动/宠物：1/500s 以上，定格瞬间<br>• 日常人像：1/60s ~ 1/250s<br>• 流水丝绸效果：1s ~ 4s（需三脚架）<br>• 车轨/光绘：8s ~ 30s（需三脚架）<br>• <strong>原则：动快静慢</strong></p><p><strong>白平衡（WB/K）</strong>：控制画面冷暖色调。<br>• 自动（AWB）：大部分场景够用<br>• 日光：5200K（标准白）<br>• 阴天：6000-7000K（偏暖黄）<br>• 钨丝灯：3200K（偏暖橙）<br>• 荧光灯：4000K（偏冷白）<br>• <strong>手动调节</strong>：数值越低越冷蓝，越高越暖黄</p><p><strong>对比度</strong>：控制明暗差异大小。<br>• 高对比度：黑白分明，画面更有冲击力，适合建筑、街拍<br>• 低对比度：明暗过渡柔和，画面更温柔，适合日系、人像<br>• 后期调整：Snapseed→工具→调整图片→对比度</p><p><strong>饱和度</strong>：控制颜色鲜艳程度。<br>• 高饱和度：颜色更鲜艳，适合美食、花卉<br>• 低饱和度：颜色更淡雅，适合文艺、复古风格<br>• 注意：过高会失真，建议 +10~+30 即可</p><p><strong>对焦模式</strong>：<br>• 单点对焦：点屏幕选择对焦点，适合静态主体<br>• 连续对焦：相机会持续追踪主体，适合运动场景<br>• 手动对焦：滑动调节，适合微距或创意拍摄</p>',
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    coverColor: '#263238',
    scene: '通用',
    sceneTags: '["参数","基础","通用","入门"]',
    styleTags: '["速查","基础","实用","干货"]',
    contentType: 1,
    difficulty: 1,
    viewCount: 1200,
    favoriteCount: 356
  }
]

exports.main = async () => {
  try {
    let created = 0

    for (let i = 0; i < defaultGuides.length; i++) {
      const item = Object.assign({}, defaultGuides[i], {
        images: defaultGuides[i].images || [],
        status: 'approved',
        authorId: 'system',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      })
      if (!item.coverImage) item.coverImage = ''
      const id = item._id
      delete item._id

      await db.collection('guides').doc(id).set({ data: item })
      created += 1
    }

    return {
      code: 200,
      message: created > 0 ? '示例攻略初始化完成' : '示例攻略已存在',
      data: { created }
    }
  } catch (err) {
    return {
      code: 500,
      message: err.message
    }
  }
}
