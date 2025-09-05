-- Genre Categories
INSERT INTO categories (name, type, description, sort_order, is_active) VALUES
('Classical', 'genre', 'Symphonies, concertos, sonatas and other classical works', 1, 1),
('Pop', 'genre', 'Modern popular music', 2, 1),
('Rock', 'genre', 'Rock style music works', 3, 1),
('Jazz', 'genre', 'Jazz style music works', 4, 1),
('Blues', 'genre', 'Blues style music works', 5, 1),
('Country', 'genre', 'Country style music works', 6, 1),
('Electronic', 'genre', 'Electronic and synthesized music', 7, 1),
('Hip Hop', 'genre', 'Rap, trap and hip hop music', 8, 1),
('R&B / Soul', 'genre', 'Rhythm and Blues, Soul music', 9, 1),
('Folk', 'genre', 'Traditional and folk-inspired music', 10, 1),
('World Music', 'genre', 'Traditional and contemporary music from around the world', 11, 1),
('New Age', 'genre', 'Meditative and atmospheric music', 12, 1);

-- Instrument Categories
INSERT INTO categories (name, type, description, sort_order, is_active) VALUES
('Piano', 'instrument', 'Solo piano or piano-led works', 1, 1),
('Guitar', 'instrument', 'Classical, acoustic and electric guitar', 2, 1),
('Violin', 'instrument', 'Solo violin or violin-led works', 3, 1),
('Cello', 'instrument', 'Solo cello or cello-led works', 4, 1),
('Flute', 'instrument', 'Solo flute or flute-led works', 5, 1),
('Saxophone', 'instrument', 'Solo saxophone or saxophone-led works', 6, 1),
('Drums', 'instrument', 'Drum kit and percussion works', 7, 1),
('Bass', 'instrument', 'Electric or acoustic bass', 8, 1),
('Orchestra', 'instrument', 'Full orchestral works', 9, 1),
('Choir', 'instrument', 'Vocal choir works', 10, 1),
('Chamber Music', 'instrument', 'Small instrumental ensembles', 11, 1),
('Trumpet', 'instrument', 'Solo trumpet or trumpet-led works', 12, 1);

-- Purpose Categories
INSERT INTO categories (name, type, description, sort_order, is_active) VALUES
('Practice Piece', 'purpose', 'Works designed for skill practice', 1, 1),
('Performance Piece', 'purpose', 'Suitable for stage performance', 2, 1),
('Teaching Material', 'purpose', 'Music for teaching and learning', 3, 1),
('Exam Piece', 'purpose', 'Used for music examinations', 4, 1),
('Competition Piece', 'purpose', 'Used for competitions', 5, 1),
('Background Music', 'purpose', 'Suitable as background music', 6, 1),
('Film Score', 'purpose', 'Music for films and TV', 7, 1),
('Game Music', 'purpose', 'Music for video games', 8, 1),
('Meditation Music', 'purpose', 'Music for relaxation and meditation', 9, 1),
('Children’s Song', 'purpose', 'Music for children', 10, 1);

-- Common Tags
INSERT INTO tags (name, usage_count, color) VALUES
('Original', 0, '#007bff'),
('Arrangement', 0, '#28a745'),
('Beginner', 0, '#ffc107'),
('Intermediate', 0, '#fd7e14'),
('Advanced', 0, '#dc3545'),
('Gentle', 0, '#e83e8c'),
('Energetic', 0, '#20c997'),
('Melancholy', 0, '#6f42c1'),
('Cheerful', 0, '#17a2b8'),
('Romantic', 0, '#f8f9fa'),
('Nostalgic', 0, '#6c757d'),
('Modern', 0, '#343a40'),
('Classical', 0, '#495057'),
('Experimental', 0, '#f8d7da'),
('Simple', 0, '#d4edda'),
('Complex', 0, '#d1ecf1'),
('Harmonic', 0, '#fff3cd'),
('Rhythmic', 0, '#f0f0f0'),
('Melodic', 0, '#e2e3e5'),
('Technical', 0, '#d6d8db');

-- System Configurations
INSERT INTO system_configs (config_key, config_value, description) VALUES
('max_file_size_pdf', '20971520', 'Maximum PDF file size in bytes'),
('max_file_size_midi', '5242880', 'Maximum MIDI file size in bytes'),
('max_file_size_audio', '52428800', 'Maximum audio file size in bytes'),
('max_tags_per_work', '10', 'Maximum number of tags per work'),
('trending_update_interval', '3600', 'Trending update interval in seconds'),
('email_verification_required', 'true', 'Require email verification for new users'),
('work_auto_approval', 'false', 'Require manual review for new works'),
('comment_auto_approval', 'true', 'Comments auto-approved by default');
