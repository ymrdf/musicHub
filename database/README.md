# 数据库说明文档

## 数据库配置

### 连接信息

- **主机**: 127.0.0.1
- **用户名**: admin
- **密码**: ymrdf
- **数据库名**: musicHub
- **方言**: mysql

### 环境配置文件 (.env)

```env
DB_HOST=127.0.0.1
DB_USER=admin
DB_PASSWORD=ymrdf
DB_NAME=musicHub
DB_DIALECT=mysql
DB_PORT=3306
```

## 数据库初始化

### 1. 创建数据库和表结构

```bash
mysql -u admin -p < database/init.sql
```

### 2. 插入初始数据

```bash
mysql -u admin -p < database/seed.sql
```

### 3. 或者一次性执行

```bash
mysql -u admin -p -e "source database/init.sql; source database/seed.sql;"
```

## 数据库表结构概览

### 核心表

#### 1. 用户系统

- `users` - 用户基本信息
- `user_follows` - 用户关注关系

#### 2. 内容分类

- `categories` - 分类字典（曲种/乐器/用途）
- `tags` - 标签字典

#### 3. 音乐作品

- `works` - 音乐作品主表
- `work_tags` - 作品标签关联
- `work_stars` - 作品收藏
- `work_versions` - 作品版本历史

#### 4. 协作功能

- `pull_requests` - 协作请求（类似 GitHub PR）

#### 5. 歌词系统

- `lyrics` - 歌词内容

#### 6. 演奏/演唱

- `performances` - 演奏演唱记录
- `performance_likes` - 演奏点赞

#### 7. 评论系统

- `comments` - 评论内容（支持多态关联）
- `comment_likes` - 评论点赞

#### 8. 辅助表

- `trending_cache` - 热榜缓存
- `system_configs` - 系统配置

## 主要功能说明

### 1. 多态评论系统

评论表支持对作品、演奏、歌词进行评论：

- `commentable_type`: 'work', 'performance', 'lyrics'
- `commentable_id`: 对应的记录 ID

### 2. 版本控制

类似 Git 的版本管理：

- `work_versions` 记录每次 MIDI 文件的修改
- `pull_requests` 处理协作请求

### 3. 分类系统

三维度分类：

- 曲种 (genre): 古典、流行、摇滚等
- 乐器 (instrument): 钢琴、吉他、小提琴等
- 用途 (purpose): 练习、表演、创作等

### 4. 热榜算法

基于以下因素计算热度分数：

- Stars 收藏数
- 点赞数
- 评论数
- 播放次数
- 时间衰减

### 5. 文件存储

文件路径存储在数据库中，实际文件存储在本地文件系统：

- PDF 乐谱: `/uploads/scores/`
- MIDI 文件: `/uploads/midi/`
- 音频文件: `/uploads/audio/`

## 索引策略

### 主要索引

- 用户名和邮箱的唯一索引
- 外键关联的索引
- 统计字段的索引（用于排序）
- 时间字段的索引
- 全文搜索索引（标题、描述、内容）

### 复合索引

- 评论的多态关联索引
- 热榜的类型和时间周期复合索引
- 关注关系的唯一复合索引

## 数据完整性

### 外键约束

所有表间关系都设置了外键约束，确保数据一致性。

### 级联删除

- 用户删除时，级联删除其作品、评论、关注关系等
- 作品删除时，级联删除相关的演奏、评论、收藏等

### 软删除考虑

部分重要数据（如作品、演奏）可能需要软删除机制，可通过添加 `deleted_at` 字段实现。

## 性能优化建议

### 1. 分页查询

使用 LIMIT 和 OFFSET 进行分页，建议配合时间戳游标。

### 2. 缓存策略

- 热榜数据定期更新缓存
- 用户统计数据可适当延迟更新
- 分类和标签数据可长期缓存

### 3. 读写分离

考虑使用读写分离架构，统计类查询使用只读从库。

### 4. 分表考虑

当数据量增长时，可考虑：

- 按时间分表（评论、播放记录等）
- 按用户分表（大量用户数据时）
