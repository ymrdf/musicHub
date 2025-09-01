# 发现音乐页面更新说明

## 更新概述

根据用户需求，发现音乐页面已从混合展示（作品+演奏）改为专注于音乐播放体验，只展示演奏和演唱内容。

## 主要变更

### 1. 内容展示变更

- **之前**：同时展示作品（乐谱/MIDI）和演奏（音频）
- **现在**：只展示演奏和演唱（可播放的音频内容）

### 2. 功能简化

- **移除**：作品类型筛选选项
- **移除**：作品收藏功能
- **移除**：作品相关统计（收藏数、浏览数）
- **保留**：演奏点赞、播放、评论功能

### 3. 排序选项优化

- **移除**：收藏数排序（适用于作品）
- **移除**：浏览数排序（适用于作品）
- **保留**：最新、点赞数、播放数排序

### 4. 用户体验提升

- **专注音乐**：用户可以直接播放音乐，无需先查看乐谱
- **简化界面**：减少不必要的选项，界面更清晰
- **快速发现**：专注于可播放的音乐内容

## 技术实现

### API 调用变更

```typescript
// 之前：同时调用两个 API
const [worksResponse, performancesResponse] = await Promise.all([
  fetch(`/api/works?${params.toString()}`),
  fetch(`/api/performances?${params.toString()}`),
]);

// 现在：只调用演奏 API
const performancesResponse = await fetch(
  `/api/performances?${params.toString()}`
);
```

### 数据结构简化

```typescript
// 移除了作品相关的字段
interface DiscoverItem {
  // 移除：starsCount, viewsCount, pdfFilePath, midiFilePath, isStarred
  // 保留：likesCount, playsCount, audioFilePath, isLiked
}
```

### 组件逻辑优化

- 移除了作品和演奏的类型判断
- 简化了播放按钮逻辑
- 统一了统计信息显示

## 用户价值

### 1. 更好的音乐发现体验

- 用户可以直接播放音乐，无需先下载乐谱
- 专注于音频内容，符合音乐爱好者的使用习惯

### 2. 简化的操作流程

- 减少了不必要的选项和功能
- 界面更清晰，操作更直观

### 3. 符合音乐平台定位

- 类似网易云音乐、Spotify 的发现页体验
- 专注于音乐播放和发现

## 兼容性说明

### 现有功能保持不变

- 演奏详情页功能完整
- 作品详情页功能完整
- 用户可以在其他页面查看乐谱

### 导航更新

- 发现音乐：专注于音乐播放
- 作品列表：查看乐谱和 MIDI（如果需要）

## 后续优化建议

### 1. 播放体验优化

- 添加播放列表功能
- 支持连续播放
- 添加播放历史记录

### 2. 推荐算法

- 基于用户喜好的个性化推荐
- 热门演奏推荐
- 相似音乐推荐

### 3. 社交功能

- 分享功能
- 评论和讨论
- 关注创作者

## 筛选功能修复

### 问题描述

用户反馈页面上的筛选功能不起作用。

### 问题原因

- 演奏 API 不支持通过作品分类进行筛选
- 搜索参数的中文字符编码问题

### 解决方案

1. **API 增强**：更新了 `/api/performances` API，支持通过关联作品进行分类筛选
2. **编码修复**：修复了前端搜索参数的中文字符编码问题
3. **功能完善**：现在支持以下筛选功能：
   - 流派筛选（genreId）
   - 乐器筛选（instrumentId）
   - 用途筛选（purposeId）
   - 搜索功能（search）
   - 排序功能（sortBy, sortOrder）

### 技术实现

```typescript
// API 筛选逻辑
const workWhere: any = {};
if (genreId) workWhere.genreId = parseInt(genreId);
if (instrumentId) workWhere.instrumentId = parseInt(instrumentId);
if (purposeId) workWhere.purposeId = parseInt(purposeId);
if (search && search.trim()) {
  workWhere[Op.or] = [
    { title: { [Op.like]: `%${search.trim()}%` } },
    { description: { [Op.like]: `%${search.trim()}%` } },
  ];
}

// 前端编码修复
if (searchQuery) params.append("search", encodeURIComponent(searchQuery));
```

## 总结

这次更新让发现音乐页面更加专注于音乐播放体验，符合用户"只想听音乐"的需求。页面现在更像一个专业的音乐发现平台，用户可以轻松发现和播放优秀的演奏演绎。

### 功能验证

- ✅ 流派筛选：正常工作
- ✅ 乐器筛选：正常工作
- ✅ 用途筛选：正常工作
- ✅ 搜索功能：正常工作（支持中英文）
- ✅ 排序功能：正常工作
- ✅ 音频播放：正常工作
