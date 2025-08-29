# MusicHub 认证系统

这个文档详细说明了 MusicHub 平台完整的用户认证系统实现。

## 🚀 功能概览

### ✅ 已实现的功能

1. **用户注册**

   - 用户名、邮箱、密码验证
   - 密码强度检查（大小写字母 + 数字，最少 8 位）
   - 邮箱格式验证
   - 用户名唯一性检查
   - 邮箱唯一性检查
   - 密码加密存储（bcrypt，12 轮加盐）

2. **用户登录**

   - 邮箱/密码验证
   - JWT token 生成
   - 自动登录状态保持
   - 安全的会话管理

3. **密码重置**

   - 忘记密码申请
   - 安全的重置令牌生成
   - 密码重置页面
   - 密码强度二次验证

4. **邮箱验证**

   - 注册时发送验证邮件
   - 邮箱验证页面
   - 重新发送验证邮件
   - 验证状态管理

5. **会话管理**

   - JWT token 验证
   - 自动令牌刷新
   - 安全登出
   - 跨设备会话控制

6. **安全特性**
   - SQL 注入防护（Sequelize ORM）
   - XSS 攻击防护
   - CSRF 攻击防护
   - 安全的密码存储
   - 输入数据验证和清理

## 🗄️ 数据库设计

### 用户表 (users)

```sql
- id: 主键
- username: 用户名（唯一）
- email: 邮箱（唯一）
- password_hash: 加密后的密码
- avatar_url: 头像URL
- bio: 个人简介
- website: 个人网站
- is_verified: 邮箱验证状态
- is_active: 账户激活状态
- 统计字段: followers_count, following_count, works_count, performances_count
- 时间戳: created_at, updated_at
```

## 🛡️ 安全实现

### 密码安全

- 使用 bcrypt 进行密码哈希
- 12 轮加盐确保安全性
- 密码强度验证（大小写字母 + 数字）
- 最少 8 个字符长度要求

### JWT 安全

- 强随机密钥
- 7 天过期时间
- 安全的令牌验证
- 自动令牌撤销

### 输入验证

- 使用 Joi 进行数据验证
- 前端和后端双重验证
- SQL 注入防护
- XSS 攻击防护

## 🔌 API 端点

### 认证相关

```
POST /api/auth/register     - 用户注册
POST /api/auth/login        - 用户登录
GET  /api/auth/me          - 获取当前用户信息
```

### 密码管理

```
POST /api/auth/forgot-password    - 申请密码重置
POST /api/auth/reset-password     - 执行密码重置
```

### 邮箱验证

```
POST /api/auth/verify-email       - 验证邮箱
POST /api/auth/resend-verification - 重发验证邮件
```

## 🎨 前端页面

### 认证页面

- `/auth/login` - 登录页面
- `/auth/register` - 注册页面
- `/auth/forgot-password` - 忘记密码页面
- `/auth/reset-password` - 重置密码页面
- `/auth/verify-email` - 邮箱验证页面

### UI 特性

- 响应式设计
- 美观的表单验证
- 实时错误提示
- 加载状态指示
- 密码可见性切换
- Toast 通知消息

## 🧪 测试和验证

### 自动化测试

```bash
# 运行认证功能测试
npm run test:auth
```

### 手动测试场景

1. 新用户注册流程
2. 现有用户登录
3. 密码重置流程
4. 邮箱验证流程
5. 错误处理验证
6. 安全性测试

## 🚀 部署指南

### 环境变量配置

```bash
# 必须配置的环境变量
DB_HOST=数据库主机
DB_USER=数据库用户
DB_PASSWORD=数据库密码
DB_NAME=musicHub
JWT_SECRET=强随机密钥
NEXT_PUBLIC_APP_URL=应用域名
```

### 数据库初始化

```bash
# 初始化数据库结构
npm run setup-db

# 或手动执行 SQL
mysql -u username -p musicHub < database/init.sql
```

### 生产部署步骤

1. 设置环境变量
2. 初始化数据库
3. 构建应用: `npm run build`
4. 启动服务: `npm start`
5. 运行测试: `npm run test:auth`

## 📋 生产环境检查清单

### 安全检查

- [ ] JWT 密钥已更改为强随机值
- [ ] 数据库密码足够强
- [ ] HTTPS 已启用
- [ ] 环境变量已正确配置
- [ ] 调试信息已关闭

### 功能检查

- [ ] 用户注册正常工作
- [ ] 用户登录正常工作
- [ ] 密码重置正常工作
- [ ] 邮箱验证正常工作
- [ ] 会话管理正常工作

### 性能检查

- [ ] 数据库连接池配置
- [ ] JWT 令牌过期时间合理
- [ ] API 响应时间可接受
- [ ] 静态资源缓存已启用

## 🔄 更新和维护

### 定期任务

- 更新依赖包
- 检查安全漏洞
- 备份数据库
- 监控日志错误

### 扩展功能

- OAuth 第三方登录（微信、QQ）
- 双因素认证（2FA）
- 登录历史记录
- 设备管理
- 邮件通知系统

## 📞 支持和帮助

### 常见问题

1. **数据库连接失败**: 检查数据库配置和网络连接
2. **JWT 验证失败**: 确认密钥配置和令牌格式
3. **邮件发送失败**: 配置 SMTP 设置
4. **注册失败**: 检查数据验证和唯一性约束

### 错误排查

```bash
# 查看应用日志
npm run dev  # 开发环境
pm2 logs     # 生产环境

# 测试数据库连接
npm run db:sync

# 验证 API 功能
npm run test:auth
```

---

**🎵 MusicHub** - 让音乐创作更简单，让分享更美好！
