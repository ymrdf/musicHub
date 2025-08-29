-- 初始化数据文件
USE musicHub;

-- 插入分类数据
-- 曲种分类
INSERT INTO categories (name, type, description, sort_order) VALUES
('古典音乐', 'genre', '古典音乐作品', 1),
('流行音乐', 'genre', '流行音乐作品', 2),
('摇滚音乐', 'genre', '摇滚音乐作品', 3),
('爵士音乐', 'genre', '爵士音乐作品', 4),
('电子音乐', 'genre', '电子音乐作品', 5),
('民族音乐', 'genre', '民族音乐作品', 6),
('说唱音乐', 'genre', '说唱音乐作品', 7),
('乡村音乐', 'genre', '乡村音乐作品', 8),
('蓝调音乐', 'genre', '蓝调音乐作品', 9),
('新世纪音乐', 'genre', '新世纪音乐作品', 10);

-- 乐器分类
INSERT INTO categories (name, type, description, sort_order) VALUES
('钢琴', 'instrument', '钢琴演奏作品', 1),
('吉他', 'instrument', '吉他演奏作品', 2),
('小提琴', 'instrument', '小提琴演奏作品', 3),
('大提琴', 'instrument', '大提琴演奏作品', 4),
('萨克斯', 'instrument', '萨克斯演奏作品', 5),
('长笛', 'instrument', '长笛演奏作品', 6),
('鼓', 'instrument', '鼓演奏作品', 7),
('贝斯', 'instrument', '贝斯演奏作品', 8),
('二胡', 'instrument', '二胡演奏作品', 9),
('古筝', 'instrument', '古筝演奏作品', 10),
('琵琶', 'instrument', '琵琶演奏作品', 11),
('竹笛', 'instrument', '竹笛演奏作品', 12),
('合唱', 'instrument', '合唱作品', 13),
('交响乐', 'instrument', '交响乐作品', 14),
('室内乐', 'instrument', '室内乐作品', 15);

-- 用途分类
INSERT INTO categories (name, type, description, sort_order) VALUES
('练习', 'purpose', '练习用途的音乐作品', 1),
('表演', 'purpose', '表演用途的音乐作品', 2),
('创作', 'purpose', '创作参考的音乐作品', 3),
('教学', 'purpose', '教学用途的音乐作品', 4),
('娱乐', 'purpose', '娱乐用途的音乐作品', 5),
('比赛', 'purpose', '比赛用途的音乐作品', 6),
('背景音乐', 'purpose', '背景音乐作品', 7),
('冥想', 'purpose', '冥想放松音乐', 8);

-- 插入常用标签
INSERT INTO tags (name, color) VALUES
('原创', '#ff6b6b'),
('改编', '#4ecdc4'),
('简单', '#45b7d1'),
('复杂', '#f9ca24'),
('抒情', '#f0932b'),
('激昂', '#eb4d4b'),
('舒缓', '#6c5ce7'),
('动感', '#a29bfe'),
('忧郁', '#2d3436'),
('欢快', '#00b894'),
('史诗', '#e84393'),
('浪漫', '#fd79a8'),
('神秘', '#636e72'),
('energetic', '#00cec9'),
('peaceful', '#55a3ff'),
('melancholic', '#a29bfe'),
('uplifting', '#fdcb6e'),
('dark', '#2d3436'),
('bright', '#ffeaa7'),
('experimental', '#fd79a8');

-- 插入系统配置
INSERT INTO system_configs (config_key, config_value, description) VALUES
('site_name', 'MusicHub', '网站名称'),
('site_description', '原创音乐分享平台', '网站描述'),
('max_file_size_mb', '100', '最大文件上传大小(MB)'),
('allowed_audio_formats', 'mp3,wav,flac', '允许的音频格式'),
('allowed_document_formats', 'pdf', '允许的文档格式'),
('allowed_midi_formats', 'mid,midi', '允许的MIDI格式'),
('trending_cache_hours', '6', '热榜缓存时间(小时)'),
('max_tags_per_work', '10', '每个作品最大标签数'),
('max_comment_length', '1000', '评论最大长度'),
('enable_user_registration', 'true', '是否开放用户注册'),
('enable_file_upload', 'true', '是否启用文件上传'),
('default_user_avatar', '/images/default-avatar.png', '默认用户头像'),
('pagination_size', '20', '分页大小'),
('search_results_limit', '50', '搜索结果限制'),
('trending_days_range', '7', '热榜统计天数范围');

-- 创建管理员用户（密码：admin123）
INSERT INTO users (username, email, password_hash, bio, is_verified, is_active) VALUES
('admin', 'admin@musichub.com', '$2b$10$X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0', '系统管理员', true, true);

-- 创建示例用户
INSERT INTO users (username, email, password_hash, bio, is_verified, is_active) VALUES
('composer01', 'composer01@example.com', '$2b$10$X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0', '独立音乐创作者，专注于钢琴和弦乐编曲', true, true),
('pianist_mike', 'mike@example.com', '$2b$10$X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0', '古典钢琴演奏者，喜欢演奏和分享音乐', true, true),
('guitarist_jane', 'jane@example.com', '$2b$10$X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0', '吉他手，擅长指弹和古典吉他', true, true),
('singer_lisa', 'lisa@example.com', '$2b$10$X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0X8PQQzY5VQ3f0', '歌手兼作词人，喜欢创作流行和民谣', true, true);

-- 更新用户统计
UPDATE users SET followers_count = 10, following_count = 5, works_count = 3, performances_count = 2 WHERE username = 'composer01';
UPDATE users SET followers_count = 8, following_count = 12, works_count = 0, performances_count = 5 WHERE username = 'pianist_mike';
UPDATE users SET followers_count = 15, following_count = 8, works_count = 2, performances_count = 4 WHERE username = 'guitarist_jane';
UPDATE users SET followers_count = 20, following_count = 15, works_count = 1, performances_count = 8 WHERE username = 'singer_lisa';

-- 创建示例关注关系
INSERT INTO user_follows (follower_id, following_id) VALUES
(2, 1), -- composer01 关注 admin
(3, 1), -- pianist_mike 关注 admin  
(4, 1), -- guitarist_jane 关注 admin
(5, 1), -- singer_lisa 关注 admin
(3, 2), -- pianist_mike 关注 composer01
(4, 2), -- guitarist_jane 关注 composer01
(5, 2), -- singer_lisa 关注 composer01
(2, 3), -- composer01 关注 pianist_mike
(5, 3), -- singer_lisa 关注 pianist_mike
(2, 4), -- composer01 关注 guitarist_jane
(3, 4), -- pianist_mike 关注 guitarist_jane
(2, 5), -- composer01 关注 singer_lisa
(3, 5), -- pianist_mike 关注 singer_lisa
(4, 5); -- guitarist_jane 关注 singer_lisa

-- 创建示例作品
INSERT INTO works (title, description, user_id, genre_id, instrument_id, purpose_id, is_public, allow_collaboration) VALUES
('春日序曲', '一首描绘春天美景的钢琴曲，适合初学者练习', 2, 1, 1, 1, true, true),
('流年如梦', '抒情的吉他独奏曲，表达对时光流逝的感慨', 4, 2, 2, 2, true, true),
('夜空下的思考', '现代风格的小提琴协奏曲片段', 2, 1, 3, 3, true, false),
('青春节拍', '充满活力的流行歌曲，带有简单的和弦进行', 5, 2, 1, 5, true, true);

-- 更新作品统计
UPDATE works SET stars_count = 15, performances_count = 3, comments_count = 8, views_count = 120 WHERE id = 1;
UPDATE works SET stars_count = 22, performances_count = 5, comments_count = 12, views_count = 180 WHERE id = 2;
UPDATE works SET stars_count = 8, performances_count = 1, comments_count = 3, views_count = 65 WHERE id = 3;
UPDATE works SET stars_count = 30, performances_count = 8, comments_count = 15, views_count = 250 WHERE id = 4;

-- 为作品添加标签
INSERT INTO work_tags (work_id, tag_id) VALUES
(1, 1), -- 春日序曲 - 原创
(1, 3), -- 春日序曲 - 简单
(1, 5), -- 春日序曲 - 抒情
(1, 8), -- 春日序曲 - 舒缓
(2, 1), -- 流年如梦 - 原创
(2, 5), -- 流年如梦 - 抒情
(2, 9), -- 流年如梦 - 忧郁
(2, 12), -- 流年如梦 - 浪漫
(3, 1), -- 夜空下的思考 - 原创
(3, 4), -- 夜空下的思考 - 复杂
(3, 13), -- 夜空下的思考 - 神秘
(4, 1), -- 青春节拍 - 原创
(4, 3), -- 青春节拍 - 简单
(4, 10), -- 青春节拍 - 欢快
(4, 7); -- 青春节拍 - 动感

-- 创建作品收藏
INSERT INTO work_stars (work_id, user_id) VALUES
(1, 3), (1, 4), (1, 5), -- 春日序曲的收藏
(2, 1), (2, 3), (2, 5), -- 流年如梦的收藏
(3, 1), (3, 4), -- 夜空下的思考的收藏
(4, 1), (4, 2), (4, 3), (4, 4); -- 青春节拍的收藏

-- 创建歌词
INSERT INTO lyrics (work_id, user_id, title, content, language) VALUES
(4, 5, '青春节拍（歌词版）', 
'[第一段]
青春的脚步轻快
梦想在心中澎湃
每一个明天都充满期待
让我们一起舞动起来

[副歌]
这是我们的节拍
青春永远不会离开
用音乐点亮未来
让快乐永远存在

[第二段]
时光荏苒不停歇
回忆如花般绽放
纵然岁月会改变
友谊的歌声永远嘹亮

[副歌]
这是我们的节拍
青春永远不会离开
用音乐点亮未来
让快乐永远存在', 'zh');

-- 更新歌词统计
UPDATE lyrics SET likes_count = 12, performances_count = 3 WHERE id = 1;

-- 创建演奏/演唱记录
INSERT INTO performances (work_id, user_id, lyrics_id, title, description, type, instrument, is_public) VALUES
(1, 3, NULL, '春日序曲 - 钢琴演奏', '在家中录制的钢琴演奏版本', 'instrumental', '钢琴', true),
(2, 3, NULL, '流年如梦 - 钢琴改编', '将吉他曲改编为钢琴版本', 'instrumental', '钢琴', true),
(4, 5, 1, '青春节拍 - 原唱版', '原创歌曲的演唱版本', 'vocal', '人声', true),
(1, 4, NULL, '春日序曲 - 吉他指弹', '吉他指弹改编版本', 'instrumental', '吉他', true),
(4, 3, 1, '青春节拍 - 钢琴伴奏版', '钢琴伴奏的演唱版本', 'vocal', '钢琴+人声', true);

-- 更新演奏统计
UPDATE performances SET likes_count = 18, comments_count = 6, plays_count = 89 WHERE id = 1;
UPDATE performances SET likes_count = 12, comments_count = 4, plays_count = 67 WHERE id = 2;
UPDATE performances SET likes_count = 25, comments_count = 10, plays_count = 156 WHERE id = 3;
UPDATE performances SET likes_count = 15, comments_count = 7, plays_count = 78 WHERE id = 4;
UPDATE performances SET likes_count = 20, comments_count = 8, plays_count = 112 WHERE id = 5;

-- 创建演奏点赞
INSERT INTO performance_likes (performance_id, user_id) VALUES
(1, 1), (1, 2), (1, 4), (1, 5), -- 春日序曲钢琴演奏的点赞
(2, 1), (2, 4), (2, 5), -- 流年如梦钢琴改编的点赞
(3, 1), (3, 2), (3, 3), (3, 4), -- 青春节拍原唱的点赞
(4, 1), (4, 2), (4, 3), (4, 5), -- 春日序曲吉他版的点赞
(5, 1), (5, 2), (5, 4); -- 青春节拍钢琴伴奏的点赞

-- 创建评论
INSERT INTO comments (user_id, commentable_type, commentable_id, content) VALUES
(3, 'work', 1, '这首曲子真的很美，旋律很抓人，适合初学者练习！'),
(4, 'work', 1, '和弦进行很舒服，已经开始练习了'),
(5, 'work', 1, '想为这首曲子填词，可以吗？'),
(1, 'work', 2, '吉他的音色处理得很好，情感表达到位'),
(3, 'work', 2, '这个指法有点难度，但是效果很棒'),
(2, 'work', 4, '很有活力的歌曲，已经收藏了！'),
(3, 'performance', 1, '演奏得很流畅，技巧很娴熟'),
(2, 'performance', 3, '歌声很有感染力，喜欢这个版本'),
(4, 'performance', 4, '吉他改编版很有创意，给了我新的灵感'),
(1, 'lyrics', 1, '歌词写得很青春，很有正能量');

-- 更新评论统计
UPDATE comments SET likes_count = 5 WHERE id = 1;
UPDATE comments SET likes_count = 3 WHERE id = 2;
UPDATE comments SET likes_count = 2 WHERE id = 3;
UPDATE comments SET likes_count = 7 WHERE id = 4;
UPDATE comments SET likes_count = 4 WHERE id = 5;
UPDATE comments SET likes_count = 8 WHERE id = 6;
UPDATE comments SET likes_count = 6 WHERE id = 7;
UPDATE comments SET likes_count = 9 WHERE id = 8;
UPDATE comments SET likes_count = 4 WHERE id = 9;
UPDATE comments SET likes_count = 3 WHERE id = 10;

-- 创建评论点赞
INSERT INTO comment_likes (comment_id, user_id) VALUES
(1, 1), (1, 2), (1, 4), (1, 5), -- 对第一条评论的点赞
(4, 1), (4, 2), (4, 3), (4, 5), -- 对第四条评论的点赞
(6, 1), (6, 3), (6, 4), (6, 5), -- 对第六条评论的点赞
(8, 1), (8, 2), (8, 3), (8, 4); -- 对第八条评论的点赞

-- 创建热榜缓存数据
INSERT INTO trending_cache (type, item_id, score, rank_position, time_period) VALUES
-- 周榜作品
('work', 4, 95.5, 1, 'weekly'), -- 青春节拍
('work', 2, 87.2, 2, 'weekly'), -- 流年如梦
('work', 1, 76.8, 3, 'weekly'), -- 春日序曲
('work', 3, 65.3, 4, 'weekly'), -- 夜空下的思考

-- 周榜演奏
('performance', 3, 92.1, 1, 'weekly'), -- 青春节拍原唱
('performance', 5, 88.7, 2, 'weekly'), -- 青春节拍钢琴伴奏
('performance', 1, 81.4, 3, 'weekly'), -- 春日序曲钢琴演奏
('performance', 4, 76.9, 4, 'weekly'), -- 春日序曲吉他版
('performance', 2, 72.3, 5, 'weekly'); -- 流年如梦钢琴改编
