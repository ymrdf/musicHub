# MusicHub - 原创音乐分享平台

一个面向音乐创作者的原创音乐分享平台，类似于音乐界的 GitHub。支持乐谱分享、协作创作、演奏演唱和社区互动。

## 🎵 项目特点

- **GitHub 式的音乐创作**: 支持版本管理、协作请求、Fork 等功能
- **多格式支持**: PDF 乐谱、MIDI 文件、音频文件
- **社区互动**: 评论、点赞、收藏、关注
- **演奏演唱**: 用户可上传自己的演奏/演唱作品
- **热榜系统**: 发现热门作品和演奏
- **实时音频播放**: 内置音频播放器支持 MP3/WAV

## 🚀 技术栈

### 后端

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **数据库**: MySQL + Sequelize ORM
- **认证**: JWT
- **文件上传**: Multer + 本地存储

### 前端

- **框架**: React 18 + Next.js 14
- **样式**: Tailwind CSS
- **状态管理**: React Context + SWR
- **表单**: React Hook Form
- **图标**: Heroicons
- **通知**: React Hot Toast

### 开发工具

- **类型检查**: TypeScript
- **代码规范**: ESLint
- **包管理**: npm

## 📦 安装和运行

### 环境要求

- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

### 1. 克隆项目

```bash
git clone <repository-url>
cd musicHub-code
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `env.example` 文件为 `.env.local` 并填写配置：

```bash
cp env.example .env.local
```

环境变量说明：

```env
# 数据库配置
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=ymrdf
DB_NAME=musicHub

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-for-music-hub-platform-2024
JWT_EXPIRES_IN=7d

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 初始化数据库

```bash
# 创建数据库（确保 MySQL 已启动）
mysql -u root -p < database/init.sql

# 可选：插入示例数据
mysql -u root -p musicHub < database/seed.sql
```

### 5. 创建上传目录

```bash
mkdir -p uploads/{audio,pdf,midi,avatars}
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 📁 项目结构

```
musicHub-code/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/               # API 路由
│   │   ├── auth/              # 认证页面
│   │   ├── works/             # 作品相关页面
│   │   ├── performances/      # 演奏页面
│   │   ├── discover/          # 发现页面
│   │   └── trending/          # 热榜页面
│   ├── components/            # React 组件
│   │   ├── layout/           # 布局组件
│   │   ├── ui/               # UI 组件
│   │   ├── forms/            # 表单组件
│   │   └── music/            # 音乐相关组件
│   ├── lib/                   # 核心库
│   │   ├── database.ts       # 数据库连接
│   │   ├── models/           # 数据模型
│   │   ├── auth.ts           # 认证逻辑
│   │   └── upload.ts         # 文件上传
│   ├── hooks/                 # React Hooks
│   ├── utils/                 # 工具函数
│   └── types/                 # TypeScript 类型定义
├── database/                  # 数据库相关
│   ├── init.sql              # 数据库初始化脚本
│   └── seed.sql              # 示例数据
├── uploads/                   # 文件上传目录
└── public/                    # 静态资源
```

## 🎯 核心功能

### 1. 用户系统

- [x] 用户注册/登录 (JWT)
- [x] 用户资料管理
- [x] 关注/粉丝系统

### 2. 作品管理

- [x] 上传 PDF 乐谱和 MIDI 文件
- [x] 作品分类和标签
- [x] 作品收藏 (Star)
- [x] 评论系统
- [ ] 版本管理
- [ ] 协作请求 (Pull Request)

### 3. 演奏演唱

- [x] 音频文件上传
- [x] 音频播放器
- [x] 演奏列表
- [x] 点赞和评论

### 4. 歌词功能

- [x] 歌词创建和编辑
- [x] 歌词与演唱关联
- [x] 歌词评论

### 5. 发现和热榜

- [x] 作品分类浏览
- [ ] 搜索功能
- [ ] 热榜算法
- [x] 推荐系统

### 6. 社区互动

- [x] 评论和回复
- [x] 点赞和收藏
- [x] 用户主页
- [x] 关注动态

## 🔧 开发说明

### API 路由结构

```
/api/
├── auth/                      # 认证相关
│   ├── login                 # 登录
│   ├── register              # 注册
│   └── me                    # 获取当前用户
├── works/                     # 作品相关
├── performances/              # 演奏相关
├── users/                     # 用户相关
└── upload/                    # 文件上传
```

### 数据库模型

主要数据表：

- `users` - 用户表
- `works` - 作品表
- `performances` - 演奏表
- `lyrics` - 歌词表
- `comments` - 评论表
- `categories` - 分类表
- `tags` - 标签表
- `work_stars` - 作品收藏表
- `performance_likes` - 演奏点赞表

### 认证机制

- 使用 JWT Token 进行身份验证
- Token 存储在 localStorage 中
- 支持自动刷新和过期处理

## 🎨 UI/UX 设计

### 设计原则

- **简洁美观**: 采用现代化的扁平设计
- **响应式**: 支持桌面端和移动端
- **易用性**: 直观的交互设计
- **音乐主题**: 音乐相关的图标和色彩

### 主题色彩

- 主色调: `#0ea5e9` (天空蓝)
- 辅助色: `#f1681f` (橙色)
- 成功色: `#10b981` (绿色)
- 错误色: `#ef4444` (红色)

## 📝 待开发功能

- [ ] 搜索功能
- [ ] 高级过滤
- [ ] 实时通知
- [ ] 私信系统
- [ ] 音乐编辑器
- [ ] 移动端应用
- [ ] 社交分享
- [ ] 数据分析

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 📞 联系我们

- 项目主页: https://github.com/your-username/musicHub-code
- 问题反馈: https://github.com/your-username/musicHub-code/issues
- 邮箱: contact@musichub.com

---

🎵 **让音乐连接世界，让创作改变生活！** 🎵
