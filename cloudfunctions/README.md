# 微信云开发配置指南

## 1. 开通云开发

1. 在微信开发者工具中，点击「云开发」按钮
2. 开通云开发，创建一个环境（如 `photo-guide-prod`）
3. 记录环境ID

## 2. 修改环境ID

打开 `photo-guide-miniapp/app.js`，将 `your-env-id` 替换为你的云开发环境ID：

```javascript
wx.cloud.init({
  env: 'photo-guide-prod', // 替换为你的环境ID
  traceUser: true
})
```

## 3. 创建数据库集合

在云开发控制台「数据库」中创建以下集合：

| 集合名 | 说明 | 权限 |
|--------|------|------|
| `users` | 用户表 | 仅创建者可读写 |
| `guides` | 攻略表 | 所有用户可读，仅创建者可写 |
| `favorites` | 收藏表 | 仅创建者可读写 |
| `history` | 浏览历史 | 仅创建者可读写 |
| `ai_records` | AI分析记录 | 仅创建者可读写 |

## 4. 上传云函数

在微信开发者工具中：

1. 右键点击 `cloudfunctions/user` → 「上传并部署：云端安装依赖」
2. 右键点击 `cloudfunctions/guide` → 「上传并部署：云端安装依赖」
3. 右键点击 `cloudfunctions/ai-analyze` → 「上传并部署：云端安装依赖」

## 5. 添加测试数据

在云开发控制台「数据库」→ `guides` 集合中添加记录：

```json
{
  "title": "海边日落拍照技巧",
  "content": "1. 选择黄金时刻：日落前30分钟光线最柔和...\n2. 使用三分法构图...\n3. 注意白平衡设置...",
  "coverImage": "cloud://xxx/guides/sunset.jpg",
  "scene": "海滩",
  "sceneTags": "[\"海滩\",\"日落\"]",
  "styleTags": "[\"唯美\",\"暖色调\"]",
  "contentType": 1,
  "difficulty": 1,
  "viewCount": 100,
  "status": "approved",
  "createTime": "2024-01-01T00:00:00Z"
}
```

## 6. 数据结构说明

### users 集合
```json
{
  "_id": "自动生成",
  "openid": "微信openid",
  "nickname": "用户昵称",
  "avatar": "头像URL",
  "role": "user",
  "apiKeys": {},
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

### guides 集合
```json
{
  "_id": "自动生成",
  "title": "攻略标题",
  "content": "攻略内容",
  "coverImage": "封面图fileID",
  "images": ["图片fileID数组"],
  "scene": "场景分类",
  "sceneTags": "JSON字符串",
  "styleTags": "JSON字符串",
  "contentType": 1,
  "difficulty": 1,
  "viewCount": 0,
  "status": "approved",
  "authorId": "作者openid",
  "createTime": "创建时间"
}
```

### favorites 集合
```json
{
  "_id": "自动生成",
  "openid": "用户openid",
  "guideId": "攻略ID",
  "createTime": "收藏时间"
}
```

### history 集合
```json
{
  "_id": "自动生成",
  "openid": "用户openid",
  "guideId": "攻略ID",
  "viewTime": "浏览时间"
}
```

### ai_records 集合
```json
{
  "_id": "自动生成",
  "openid": "用户openid",
  "fileID": "图片fileID",
  "scene": "场景",
  "result": {
    "scene": "场景",
    "suggestions": ["建议1", "建议2"],
    "score": 75,
    "composition": "构图",
    "lighting": "光线",
    "style": "风格"
  },
  "createTime": "分析时间"
}
```

## 7. 常见问题

### Q: 云函数调用失败
A: 检查云函数是否已上传部署，环境ID是否正确

### Q: 数据库操作失败
A: 检查数据库集合权限设置，确保用户有读写权限

### Q: 图片上传失败
A: 检查云存储是否开通，文件大小是否超限（单文件最大50MB）

## 8. 后续优化

- [ ] 添加攻略提交云函数
- [ ] 添加用户贡献查询云函数
- [ ] 集成真实AI API（豆包/通义千问）
- [ ] 添加搜索热词功能
- [ ] 添加攻略审核功能
