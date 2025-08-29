-- 创建musicHub数据库
CREATE DATABASE IF NOT EXISTS musicHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE musicHub;

-- 1. 用户表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介',
    website VARCHAR(200) COMMENT '个人网站',
    is_verified BOOLEAN DEFAULT FALSE COMMENT '是否已验证',
    is_active BOOLEAN DEFAULT TRUE COMMENT '账户是否激活',
    followers_count INT DEFAULT 0 COMMENT '粉丝数',
    following_count INT DEFAULT 0 COMMENT '关注数',
    works_count INT DEFAULT 0 COMMENT '作品数',
    performances_count INT DEFAULT 0 COMMENT '演奏数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='用户表';

-- 2. 用户关注表
CREATE TABLE user_follows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL COMMENT '关注者ID',
    following_id INT NOT NULL COMMENT '被关注者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
    
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id),
    INDEX idx_follower (follower_id),
    INDEX idx_following (following_id)
) ENGINE=InnoDB COMMENT='用户关注关系表';

-- 3. 分类字典表
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称',
    type ENUM('genre', 'instrument', 'purpose') NOT NULL COMMENT '分类类型：曲种/乐器/用途',
    description TEXT COMMENT '分类描述',
    sort_order INT DEFAULT 0 COMMENT '排序权重',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_type (type),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB COMMENT='分类字典表';

-- 4. 标签字典表
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE COMMENT '标签名称',
    usage_count INT DEFAULT 0 COMMENT '使用次数',
    color VARCHAR(7) DEFAULT '#007bff' COMMENT '标签颜色',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_name (name),
    INDEX idx_usage_count (usage_count)
) ENGINE=InnoDB COMMENT='标签字典表';

-- 5. 音乐作品表
CREATE TABLE works (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '作品标题',
    description TEXT COMMENT '作品描述',
    user_id INT NOT NULL COMMENT '创作者ID',
    
    -- 文件信息
    pdf_file_path VARCHAR(500) COMMENT 'PDF乐谱文件路径',
    midi_file_path VARCHAR(500) COMMENT 'MIDI文件路径',
    pdf_file_size BIGINT COMMENT 'PDF文件大小(字节)',
    midi_file_size BIGINT COMMENT 'MIDI文件大小(字节)',
    
    -- 分类信息
    genre_id INT COMMENT '曲种分类ID',
    instrument_id INT COMMENT '乐器分类ID',
    purpose_id INT COMMENT '用途分类ID',
    
    -- 统计信息
    stars_count INT DEFAULT 0 COMMENT '收藏数',
    performances_count INT DEFAULT 0 COMMENT '演奏数',
    comments_count INT DEFAULT 0 COMMENT '评论数',
    views_count INT DEFAULT 0 COMMENT '浏览数',
    
    -- 元数据
    is_public BOOLEAN DEFAULT TRUE COMMENT '是否公开',
    allow_collaboration BOOLEAN DEFAULT TRUE COMMENT '是否允许协作',
    license VARCHAR(50) DEFAULT 'CC BY-SA 4.0' COMMENT '许可证',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (instrument_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (purpose_id) REFERENCES categories(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_genre_id (genre_id),
    INDEX idx_instrument_id (instrument_id),
    INDEX idx_purpose_id (purpose_id),
    INDEX idx_stars_count (stars_count),
    INDEX idx_created_at (created_at),
    INDEX idx_is_public (is_public),
    FULLTEXT idx_title_desc (title, description)
) ENGINE=InnoDB COMMENT='音乐作品表';

-- 6. 作品标签关联表
CREATE TABLE work_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL COMMENT '作品ID',
    tag_id INT NOT NULL COMMENT '标签ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_work_tag (work_id, tag_id),
    INDEX idx_work_id (work_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB COMMENT='作品标签关联表';

-- 7. 作品收藏表
CREATE TABLE work_stars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL COMMENT '作品ID',
    user_id INT NOT NULL COMMENT '用户ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
    
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_work_star (work_id, user_id),
    INDEX idx_work_id (work_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='作品收藏表';

-- 8. 作品版本历史表
CREATE TABLE work_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL COMMENT '作品ID',
    version_number VARCHAR(20) NOT NULL COMMENT '版本号',
    user_id INT NOT NULL COMMENT '提交者ID',
    commit_message TEXT COMMENT '提交信息',
    
    -- 版本文件
    midi_file_path VARCHAR(500) COMMENT 'MIDI文件路径',
    midi_file_size BIGINT COMMENT 'MIDI文件大小',
    
    -- 变更信息
    changes_summary TEXT COMMENT '变更摘要',
    is_merged BOOLEAN DEFAULT FALSE COMMENT '是否已合并',
    merged_at TIMESTAMP NULL COMMENT '合并时间',
    merged_by INT COMMENT '合并者ID',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (merged_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_work_id (work_id),
    INDEX idx_user_id (user_id),
    INDEX idx_version_number (version_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='作品版本历史表';

-- 9. 协作请求表（Pull Request）
CREATE TABLE pull_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL COMMENT '作品ID',
    version_id INT NOT NULL COMMENT '版本ID',
    requester_id INT NOT NULL COMMENT '请求者ID',
    title VARCHAR(200) NOT NULL COMMENT '请求标题',
    description TEXT COMMENT '请求描述',
    
    status ENUM('pending', 'approved', 'rejected', 'merged') DEFAULT 'pending' COMMENT '状态',
    reviewed_by INT COMMENT '审核者ID',
    reviewed_at TIMESTAMP NULL COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
    FOREIGN KEY (version_id) REFERENCES work_versions(id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_work_id (work_id),
    INDEX idx_requester_id (requester_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='协作请求表';

-- 10. 歌词表
CREATE TABLE lyrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL COMMENT '作品ID',
    user_id INT NOT NULL COMMENT '作词者ID',
    title VARCHAR(200) NOT NULL COMMENT '歌词标题',
    content TEXT NOT NULL COMMENT '歌词内容',
    language VARCHAR(10) DEFAULT 'zh' COMMENT '语言',
    
    -- 统计信息
    likes_count INT DEFAULT 0 COMMENT '点赞数',
    performances_count INT DEFAULT 0 COMMENT '演唱数',
    
    is_public BOOLEAN DEFAULT TRUE COMMENT '是否公开',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_work_id (work_id),
    INDEX idx_user_id (user_id),
    INDEX idx_likes_count (likes_count),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_title_content (title, content)
) ENGINE=InnoDB COMMENT='歌词表';

-- 11. 演奏/演唱表
CREATE TABLE performances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL COMMENT '作品ID',
    user_id INT NOT NULL COMMENT '演奏者ID',
    lyrics_id INT COMMENT '关联歌词ID（演唱时）',
    
    title VARCHAR(200) NOT NULL COMMENT '演奏标题',
    description TEXT COMMENT '演奏描述',
    
    -- 文件信息
    audio_file_path VARCHAR(500) NOT NULL COMMENT '音频文件路径',
    audio_file_size BIGINT COMMENT '音频文件大小',
    duration INT COMMENT '时长（秒）',
    file_format VARCHAR(10) COMMENT '文件格式(mp3/wav)',
    
    -- 类型
    type ENUM('instrumental', 'vocal') NOT NULL COMMENT '类型：器乐/声乐',
    instrument VARCHAR(50) COMMENT '使用乐器',
    
    -- 统计信息
    likes_count INT DEFAULT 0 COMMENT '点赞数',
    comments_count INT DEFAULT 0 COMMENT '评论数',
    plays_count INT DEFAULT 0 COMMENT '播放次数',
    
    is_public BOOLEAN DEFAULT TRUE COMMENT '是否公开',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lyrics_id) REFERENCES lyrics(id) ON DELETE SET NULL,
    
    INDEX idx_work_id (work_id),
    INDEX idx_user_id (user_id),
    INDEX idx_lyrics_id (lyrics_id),
    INDEX idx_type (type),
    INDEX idx_likes_count (likes_count),
    INDEX idx_plays_count (plays_count),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_title_desc (title, description)
) ENGINE=InnoDB COMMENT='演奏演唱表';

-- 12. 演奏点赞表
CREATE TABLE performance_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    performance_id INT NOT NULL COMMENT '演奏ID',
    user_id INT NOT NULL COMMENT '用户ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
    
    FOREIGN KEY (performance_id) REFERENCES performances(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_performance_like (performance_id, user_id),
    INDEX idx_performance_id (performance_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='演奏点赞表';

-- 13. 评论表
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '评论者ID',
    
    -- 评论目标（多态关联）
    commentable_type ENUM('work', 'performance', 'lyrics') NOT NULL COMMENT '评论类型',
    commentable_id INT NOT NULL COMMENT '评论目标ID',
    
    content TEXT NOT NULL COMMENT '评论内容',
    parent_id INT COMMENT '父评论ID（回复）',
    
    -- 统计信息
    likes_count INT DEFAULT 0 COMMENT '点赞数',
    replies_count INT DEFAULT 0 COMMENT '回复数',
    
    is_public BOOLEAN DEFAULT TRUE COMMENT '是否公开',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_commentable (commentable_type, commentable_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_content (content)
) ENGINE=InnoDB COMMENT='评论表';

-- 14. 评论点赞表
CREATE TABLE comment_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL COMMENT '评论ID',
    user_id INT NOT NULL COMMENT '用户ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
    
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_comment_like (comment_id, user_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB COMMENT='评论点赞表';

-- 15. 热榜缓存表
CREATE TABLE trending_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('work', 'performance') NOT NULL COMMENT '类型',
    item_id INT NOT NULL COMMENT '项目ID',
    score DECIMAL(10,2) NOT NULL COMMENT '热度分数',
    rank_position INT NOT NULL COMMENT '排名位置',
    time_period ENUM('daily', 'weekly', 'monthly') NOT NULL COMMENT '时间周期',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_type_period (type, time_period),
    INDEX idx_rank (rank_position),
    INDEX idx_score (score DESC),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB COMMENT='热榜缓存表';

-- 16. 系统配置表
CREATE TABLE system_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    description TEXT COMMENT '配置描述',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB COMMENT='系统配置表';
