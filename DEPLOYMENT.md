# MusicHub 生产环境部署指南

## 环境准备

### 1. 数据库设置

确保您的 MySQL 数据库已正确配置：

```bash
# 1. 创建数据库
mysql -u root -p
CREATE DATABASE musicHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. 创建用户（如果需要）
CREATE USER 'musichub_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON musicHub.* TO 'musichub_user'@'%';
FLUSH PRIVILEGES;
```

### 2. 环境变量配置

创建 `.env.local` 文件并配置以下变量：

```bash
# 数据库配置
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_secure_database_password
DB_NAME=musicHub
DB_DIALECT=mysql

# JWT 配置（必须更改为强密码）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# 邮件配置（用于邮箱验证和密码重置）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@your-domain.com
```

### 3. 数据库初始化

```bash
# 安装依赖
npm install

# 运行数据库初始化脚本
npm run setup-db

# 或者直接运行 SQL 初始化
mysql -u your_user -p musicHub < database/init.sql
```

## 部署步骤

### 1. 构建应用

```bash
# 安装生产依赖
npm ci --only=production

# 构建 Next.js 应用
npm run build
```

### 2. 启动应用

```bash
# 生产模式启动
npm start

# 或使用 PM2 进程管理
pm2 start npm --name "musichub" -- start
```

## 安全检查清单

### 1. 数据库安全

- [ ] 使用强密码
- [ ] 限制数据库访问权限
- [ ] 启用 SSL 连接（如果可能）
- [ ] 定期备份数据库

### 2. 应用安全

- [ ] 更改默认 JWT 密钥
- [ ] 启用 HTTPS
- [ ] 配置适当的 CORS 策略
- [ ] 启用速率限制
- [ ] 配置日志记录

### 3. 环境变量

- [ ] 所有敏感信息都已设置为环境变量
- [ ] 生产环境不暴露调试信息
- [ ] API 密钥和令牌已正确配置

## 功能验证

### 1. 用户认证功能测试

```bash
# 测试注册
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'

# 测试登录
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# 测试获取用户信息
curl -X GET https://your-domain.com/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. 密码重置功能测试

```bash
# 测试忘记密码
curl -X POST https://your-domain.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# 测试重置密码
curl -X POST https://your-domain.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "password": "NewPass123",
    "confirmPassword": "NewPass123"
  }'
```

### 3. 邮箱验证功能测试

```bash
# 测试邮箱验证
curl -X POST https://your-domain.com/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_VERIFICATION_TOKEN"
  }'

# 测试重发验证邮件
curl -X POST https://your-domain.com/api/auth/resend-verification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 监控和维护

### 1. 日志监控

- 监控应用错误日志
- 监控数据库连接状态
- 监控 API 响应时间

### 2. 性能优化

- 启用 Next.js 静态资源缓存
- 配置 CDN（如果需要）
- 优化数据库查询

### 3. 定期维护

- 定期更新依赖包
- 定期备份数据库
- 监控磁盘空间和内存使用

## 故障排除

### 常见问题

1. **数据库连接失败**

   - 检查数据库服务是否运行
   - 验证连接配置是否正确
   - 检查防火墙设置

2. **JWT 认证失败**

   - 确认 JWT_SECRET 配置正确
   - 检查令牌是否过期
   - 验证 Authorization 头格式

3. **邮件发送失败**
   - 检查 SMTP 配置
   - 验证邮箱服务商设置
   - 确认应用密码配置

### 日志查看

```bash
# 查看应用日志
pm2 logs musichub

# 查看 Next.js 构建日志
npm run build

# 查看数据库日志
tail -f /var/log/mysql/error.log
```

## 备份策略

### 数据库备份

```bash
# 创建定期备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$DATE.sql
```

### 应用备份

```bash
# 备份应用文件和配置
tar -czf musichub_backup_$(date +%Y%m%d).tar.gz \
  /path/to/musichub \
  --exclude=node_modules \
  --exclude=.next
```

## 更新部署

```bash
# 1. 备份当前版本
git tag v$(date +%Y%m%d)

# 2. 拉取最新代码
git pull origin main

# 3. 安装新依赖
npm ci

# 4. 构建新版本
npm run build

# 5. 重启应用
pm2 restart musichub
```
