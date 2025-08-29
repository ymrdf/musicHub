-- 插入分类数据

-- 曲种分类
INSERT INTO categories (name, type, description, sort_order, is_active) VALUES
('古典音乐', 'genre', '包括交响乐、协奏曲、奏鸣曲等古典作品', 1, 1),
('流行音乐', 'genre', '现代流行音乐作品', 2, 1),
('摇滚音乐', 'genre', '摇滚风格的音乐作品', 3, 1),
('爵士音乐', 'genre', '爵士风格的音乐作品', 4, 1),
('民族音乐', 'genre', '各民族传统音乐', 5, 1),
('电子音乐', 'genre', '电子合成器音乐', 6, 1),
('蓝调音乐', 'genre', '蓝调风格的音乐', 7, 1),
('乡村音乐', 'genre', '乡村风格的音乐', 8, 1),
('新世纪音乐', 'genre', '新世纪风格的冥想音乐', 9, 1),
('世界音乐', 'genre', '世界各地的传统音乐', 10, 1);

-- 乐器分类
INSERT INTO categories (name, type, description, sort_order, is_active) VALUES
('钢琴', 'instrument', '钢琴独奏或钢琴为主的作品', 1, 1),
('吉他', 'instrument', '古典吉他、民谣吉他、电吉他', 2, 1),
('小提琴', 'instrument', '小提琴独奏或小提琴为主的作品', 3, 1),
('大提琴', 'instrument', '大提琴独奏或大提琴为主的作品', 4, 1),
('长笛', 'instrument', '长笛独奏或长笛为主的作品', 5, 1),
('萨克斯', 'instrument', '萨克斯风独奏或萨克斯为主的作品', 6, 1),
('架子鼓', 'instrument', '打击乐器为主的作品', 7, 1),
('二胡', 'instrument', '二胡独奏或二胡为主的作品', 8, 1),
('古筝', 'instrument', '古筝独奏或古筝为主的作品', 9, 1),
('合唱', 'instrument', '人声合唱作品', 10, 1),
('管弦乐', 'instrument', '管弦乐队作品', 11, 1),
('室内乐', 'instrument', '小型器乐组合', 12, 1);

-- 用途分类
INSERT INTO categories (name, type, description, sort_order, is_active) VALUES
('练习曲', 'purpose', '用于技巧练习的作品', 1, 1),
('表演曲', 'purpose', '适合舞台表演的作品', 2, 1),
('教学曲', 'purpose', '用于音乐教学的作品', 3, 1),
('考级曲', 'purpose', '音乐考级使用的作品', 4, 1),
('比赛曲', 'purpose', '音乐比赛使用的作品', 5, 1),
('背景音乐', 'purpose', '适合作为背景音乐的作品', 6, 1),
('影视配乐', 'purpose', '影视作品配乐', 7, 1),
('游戏音乐', 'purpose', '游戏背景音乐', 8, 1),
('冥想音乐', 'purpose', '适合冥想放松的音乐', 9, 1),
('儿歌', 'purpose', '适合儿童的音乐作品', 10, 1);

-- 插入一些常用标签
INSERT INTO tags (name, usage_count, color) VALUES
('原创', 0, '#007bff'),
('改编', 0, '#28a745'),
('初学者', 0, '#ffc107'),
('中级', 0, '#fd7e14'),
('高级', 0, '#dc3545'),
('温柔', 0, '#e83e8c'),
('激昂', 0, '#20c997'),
('忧伤', 0, '#6f42c1'),
('欢快', 0, '#17a2b8'),
('浪漫', 0, '#f8f9fa'),
('怀旧', 0, '#6c757d'),
('现代', 0, '#343a40'),
('古典', 0, '#495057'),
('实验', 0, '#f8d7da'),
('简单', 0, '#d4edda'),
('复杂', 0, '#d1ecf1'),
('和谐', 0, '#fff3cd'),
('节奏感强', 0, '#f0f0f0'),
('旋律优美', 0, '#e2e3e5'),
('技巧性强', 0, '#d6d8db');

-- 插入系统配置
INSERT INTO system_configs (config_key, config_value, description) VALUES
('max_file_size_pdf', '20971520', 'PDF文件最大大小(字节)'),
('max_file_size_midi', '5242880', 'MIDI文件最大大小(字节)'),
('max_file_size_audio', '52428800', '音频文件最大大小(字节)'),
('max_tags_per_work', '10', '每个作品最多标签数'),
('trending_update_interval', '3600', '热榜更新间隔(秒)'),
('email_verification_required', 'false', '是否需要邮箱验证'),
('work_auto_approval', 'true', '作品是否自动审核通过'),
('comment_auto_approval', 'true', '评论是否自动审核通过');