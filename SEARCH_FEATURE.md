# 搜索功能实现说明

## 功能概述

根据 PRD 文档要求，我们实现了完整的搜索功能，支持搜索作品、用户和演奏，并提供实时搜索建议。

## 实现的功能

### 1. 搜索 API (`/api/search`)

- **支持搜索类型**：

  - `all`: 综合搜索（作品、用户、演奏）
  - `works`: 仅搜索作品
  - `users`: 仅搜索用户
  - `performances`: 仅搜索演奏

- **搜索字段**：

  - 作品：标题、描述
  - 用户：用户名、个人简介
  - 演奏：标题、描述、乐器

- **API 参数**：
  - `q`: 搜索关键词（必需）
  - `type`: 搜索类型（可选，默认为 all）
  - `page`: 页码（可选，默认为 1）
  - `limit`: 每页数量（可选，默认为 10，最大 50）

### 2. 搜索页面 (`/search`)

- **功能特性**：

  - 支持按类型筛选搜索结果
  - 分页显示搜索结果
  - 美观的卡片式布局
  - 显示搜索结果统计信息

- **搜索类型选择**：
  - 全部：显示所有类型的搜索结果
  - 作品：仅显示作品结果
  - 用户：仅显示用户结果
  - 演奏：仅显示演奏结果

### 3. 搜索建议组件

- **实时搜索建议**：

  - 输入时自动获取搜索建议
  - 防抖处理（300ms 延迟）
  - 最多显示 8 个建议

- **搜索历史**：

  - 自动保存最近 5 次搜索
  - 本地存储，跨会话保持

- **建议类型**：
  - 作品建议：显示标题和作者
  - 用户建议：显示用户名和简介
  - 演奏建议：显示标题和演奏者

### 4. Header 搜索集成

- **搜索框功能**：

  - 实时搜索建议
  - 点击外部自动关闭建议
  - 支持回车搜索

- **移动端适配**：
  - 响应式设计
  - 移动端友好的搜索体验

## 技术实现

### 后端实现

```typescript
// 搜索API路由
GET /api/search?q=关键词&type=类型&page=页码&limit=数量

// 支持的搜索类型
type SearchType = 'all' | 'works' | 'users' | 'performances';

// 返回数据结构
interface SearchResult {
  query: string;
  type: string;
  results: {
    works?: PaginatedResponse<Work>;
    users?: PaginatedResponse<User>;
    performances?: PaginatedResponse<Performance>;
  };
}
```

### 前端实现

```typescript
// 搜索页面组件
<SearchPage />

// 搜索建议组件
<SearchSuggestions
  query={searchQuery}
  isVisible={showSuggestions}
  onSelect={handleSuggestionSelect}
  onClose={() => setShowSuggestions(false)}
/>
```

### 数据库查询

使用 Sequelize 的模糊查询功能：

```typescript
// 作品搜索
where: {
  [Op.and]: [
    { isPublic: true },
    {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
      ],
    },
  ],
}

// 用户搜索
where: {
  [Op.and]: [
    { isActive: true },
    {
      [Op.or]: [
        { username: { [Op.like]: `%${query}%` } },
        { bio: { [Op.like]: `%${query}%` } },
      ],
    },
  ],
}
```

## 使用示例

### 1. 基本搜索

```
GET /api/search?q=钢琴
```

### 2. 按类型搜索

```
GET /api/search?q=钢琴&type=works
GET /api/search?q=钢琴&type=users
GET /api/search?q=钢琴&type=performances
```

### 3. 分页搜索

```
GET /api/search?q=钢琴&type=all&page=2&limit=20
```

### 4. 前端使用

```typescript
// 搜索作品
const searchWorks = async (query: string) => {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&type=works`
  );
  const data = await response.json();
  return data.data.results.works;
};

// 综合搜索
const searchAll = async (query: string) => {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&type=all`
  );
  const data = await response.json();
  return data.data.results;
};
```

## 性能优化

### 1. 数据库优化

- 在搜索字段上建立索引
- 使用 LIMIT 限制返回数量
- 只查询必要的字段

### 2. 前端优化

- 搜索建议防抖处理
- 分页加载减少初始加载时间
- 本地缓存搜索历史

### 3. 用户体验优化

- 实时搜索建议
- 加载状态提示
- 错误处理和友好提示

## 测试

运行搜索功能测试：

```bash
node scripts/test-search.js
```

## 未来改进

1. **高级搜索**：

   - 支持多关键词搜索
   - 支持搜索过滤条件（时间范围、分类等）
   - 支持搜索排序选项

2. **搜索优化**：

   - 集成全文搜索引擎（如 Elasticsearch）
   - 支持拼音搜索
   - 支持模糊匹配

3. **用户体验**：
   - 搜索热词推荐
   - 搜索历史管理
   - 搜索结果的个性化排序

## 相关文件

- `src/app/api/search/route.ts` - 搜索 API 实现
- `src/app/search/page.tsx` - 搜索页面
- `src/components/SearchSuggestions.tsx` - 搜索建议组件
- `src/components/layout/Header.tsx` - Header 搜索集成
- `scripts/test-search.js` - 搜索功能测试脚本
