# 协作编辑功能说明

## 功能概述

本平台实现了类似 GitHub 的协作编辑功能，允许用户对音乐作品进行协作贡献。用户可以对感兴趣的作品提交 MIDI 文件修改，作品所有者可以审核并接受这些修改。

## 核心功能

### 1. 提交协作请求

- 用户可以对允许协作的作品提交 MIDI 文件修改
- 需要填写请求标题、描述、提交信息和变更摘要
- 支持 MIDI 文件上传（最大 10MB）

### 2. 审核协作请求

- 作品所有者可以查看所有提交的协作请求
- 可以接受或拒绝协作请求
- 可以添加审核意见

### 3. 版本历史管理

- 平台保存所有版本历史
- 显示每个版本的详细信息
- 支持版本下载

## 数据库表结构

### work_versions（作品版本表）

```sql
CREATE TABLE work_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL,
    version_number VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    commit_message TEXT,
    midi_file_path VARCHAR(500),
    midi_file_size BIGINT,
    changes_summary TEXT,
    is_merged BOOLEAN DEFAULT FALSE,
    merged_at TIMESTAMP NULL,
    merged_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### pull_requests（协作请求表）

```sql
CREATE TABLE pull_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL,
    version_id INT NOT NULL,
    requester_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('pending', 'approved', 'rejected', 'merged') DEFAULT 'pending',
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    review_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API 端点

### 1. 获取协作请求列表

```
GET /api/works/{workId}/collaborations
```

### 2. 提交协作请求

```
POST /api/works/{workId}/collaborations/submit
Content-Type: multipart/form-data

参数:
- title: 请求标题
- description: 请求描述
- commitMessage: 提交信息
- changesSummary: 变更摘要
- midiFile: MIDI文件
```

### 3. 处理协作请求

```
PUT /api/works/{workId}/collaborations/{prId}

参数:
- action: "approve" | "reject"
- reviewComment: 审核意见
```

### 4. 获取版本历史

```
GET /api/works/{workId}/versions
```

## 前端组件

### 1. CollaborationList

显示作品的协作请求列表，支持审核操作。

### 2. VersionHistory

显示作品的版本历史，支持版本下载。

### 3. CollaborationModal

提交协作请求的模态框组件。

## 使用流程

### 对于贡献者：

1. 浏览作品页面
2. 点击"提交协作"按钮
3. 填写协作请求信息
4. 上传修改后的 MIDI 文件
5. 提交请求

### 对于作品所有者：

1. 在作品页面查看协作请求
2. 审核每个请求的内容
3. 选择接受或拒绝
4. 添加审核意见（可选）

## 权限控制

- 只有作品所有者可以审核协作请求
- 只有允许协作的作品才能接收协作请求
- 用户不能对自己的作品提交协作请求
- 需要登录才能使用协作功能

## 文件上传

- 支持 MIDI 文件格式
- 文件大小限制：10MB
- 文件存储在 `uploads/midi/` 目录
- 自动生成唯一文件名

## 测试

运行测试脚本：

```bash
node scripts/test-collaboration.js
```

## 注意事项

1. 确保数据库表已正确创建
2. 检查文件上传目录权限
3. 验证认证系统正常工作
4. 测试文件上传功能

## 未来扩展

- 支持分支管理
- 添加代码审查功能
- 支持合并冲突解决
- 添加协作统计功能
