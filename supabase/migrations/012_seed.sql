-- ============================================
-- SEED DATA (Beispieldaten für Entwicklung)
-- ============================================

-- Hinweis: Diese Datei nur in der Entwicklung verwenden!
-- In Produktion werden User über Clerk erstellt.

-- Genre/Mood/UseCase Konstanten für Filter
-- (Diese könnten auch in einer Referenztabelle gespeichert werden)

-- ============================================
-- TEST USER (nur für Entwicklung)
-- ============================================

-- Diese werden normalerweise über Clerk Webhooks erstellt:

-- Admin User
INSERT INTO users (clerk_id, email, name, role) 
VALUES ('clerk_admin_test_123', 'admin@musicify.de', 'Admin User', 'ADMIN')
ON CONFLICT (clerk_id) DO NOTHING;

-- Customer User
INSERT INTO users (clerk_id, email, name, role) 
VALUES ('clerk_customer_test_123', 'customer@example.com', 'Test Customer', 'CUSTOMER')
ON CONFLICT (clerk_id) DO NOTHING;

-- Director User
INSERT INTO users (clerk_id, email, name, role) 
VALUES ('clerk_director_test_123', 'director@example.com', 'Max Müller', 'DIRECTOR')
ON CONFLICT (clerk_id) DO NOTHING;

-- Customer Profile
INSERT INTO customer_profiles (user_id)
SELECT id FROM users WHERE clerk_id = 'clerk_customer_test_123'
ON CONFLICT (user_id) DO NOTHING;

-- Director Profile
INSERT INTO director_profiles (
  user_id,
  bio,
  specialization,
  price_range_min,
  price_range_max,
  is_verified,
  is_active,
  languages,
  experience
)
SELECT 
  id,
  'Professioneller Komponist mit 10+ Jahren Erfahrung in Film- und Werbemusik. Spezialisiert auf emotionale Orchestrierungen und moderne elektronische Produktionen.',
  ARRAY['Cinematic', 'Electronic', 'Orchestral'],
  200.00,
  2000.00,
  TRUE,
  TRUE,
  ARRAY['Deutsch', 'English'],
  '10+ Jahre Erfahrung in Film- und Werbemusik'
FROM users WHERE clerk_id = 'clerk_director_test_123'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- SAMPLE MUSIC
-- ============================================

INSERT INTO music (
  title,
  description,
  duration,
  bpm,
  key,
  price,
  audio_url,
  preview_url,
  cover_image,
  license_type,
  status,
  price_personal,
  price_commercial,
  price_enterprise,
  price_exclusive,
  genre,
  subgenre,
  mood,
  use_case,
  structure,
  tags,
  director_id
)
SELECT
  'Epic Cinematic Adventure',
  'Ein kraftvoller orchestraler Track perfekt für Trailer, Filmszenen und dramatische Momente. Mit schweren Percussion, Streichern und Blechbläsern.',
  180,
  120,
  'D Minor',
  149.00,
  'https://example.com/audio/epic-cinematic.mp3',
  'https://example.com/audio/epic-cinematic-preview.mp3',
  'https://example.com/covers/epic-cinematic.jpg',
  'COMMERCIAL',
  'ACTIVE',
  49.00,
  149.00,
  499.00,
  2999.00,
  'Cinematic',
  'Orchestral',
  'Epic',
  'Film/Trailer',
  'Intro-Build-Climax-Outro',
  ARRAY['orchestral', 'epic', 'trailer', 'dramatic', 'powerful'],
  (SELECT id FROM director_profiles WHERE user_id = (SELECT id FROM users WHERE clerk_id = 'clerk_director_test_123'))
ON CONFLICT DO NOTHING;

INSERT INTO music (
  title,
  description,
  duration,
  bpm,
  key,
  price,
  audio_url,
  preview_url,
  cover_image,
  license_type,
  status,
  price_personal,
  price_commercial,
  price_enterprise,
  price_exclusive,
  genre,
  subgenre,
  mood,
  use_case,
  structure,
  tags,
  director_id
)
SELECT
  'Corporate Success',
  'Motivierende und positive Unternehmensmusik mit inspirierenden Melodien. Ideal für Präsentationen, Imagefilme und Werbung.',
  150,
  110,
  'C Major',
  99.00,
  'https://example.com/audio/corporate-success.mp3',
  'https://example.com/audio/corporate-success-preview.mp3',
  'https://example.com/covers/corporate-success.jpg',
  'COMMERCIAL',
  'ACTIVE',
  29.00,
  99.00,
  299.00,
  1499.00,
  'Corporate',
  'Motivational',
  'Uplifting',
  'Advertising',
  'Intro-Verse-Chorus-Outro',
  ARRAY['corporate', 'business', 'motivational', 'uplifting', 'positive'],
  (SELECT id FROM director_profiles WHERE user_id = (SELECT id FROM users WHERE clerk_id = 'clerk_director_test_123'))
ON CONFLICT DO NOTHING;

INSERT INTO music (
  title,
  description,
  duration,
  bpm,
  key,
  price,
  audio_url,
  preview_url,
  cover_image,
  license_type,
  status,
  price_personal,
  price_commercial,
  price_enterprise,
  price_exclusive,
  genre,
  subgenre,
  mood,
  use_case,
  structure,
  tags,
  director_id
)
SELECT
  'Electronic Dreams',
  'Moderner Electronic-Track mit pulsierenden Synths und treibenden Beats. Perfekt für Tech-Videos, Gaming Content und moderne Werbung.',
  210,
  128,
  'A Minor',
  79.00,
  'https://example.com/audio/electronic-dreams.mp3',
  'https://example.com/audio/electronic-dreams-preview.mp3',
  'https://example.com/covers/electronic-dreams.jpg',
  'COMMERCIAL',
  'ACTIVE',
  19.00,
  79.00,
  249.00,
  999.00,
  'Electronic',
  'Synthwave',
  'Energetic',
  'Gaming',
  'Intro-Drop-Breakdown-Drop-Outro',
  ARRAY['electronic', 'synthwave', 'tech', 'modern', 'gaming'],
  (SELECT id FROM director_profiles WHERE user_id = (SELECT id FROM users WHERE clerk_id = 'clerk_director_test_123'))
ON CONFLICT DO NOTHING;

-- ============================================
-- MUSIC APPROVALS (alle genehmigt)
-- ============================================

INSERT INTO music_approvals (music_id, status, reviewed_by)
SELECT id, 'APPROVED', 'system'
FROM music
WHERE NOT EXISTS (
  SELECT 1 FROM music_approvals WHERE music_id = music.id
);

-- ============================================
-- DIRECTOR VERIFICATION
-- ============================================

INSERT INTO director_verifications (director_id, status, reviewed_by, review_note)
SELECT 
  id,
  'APPROVED',
  'system',
  'Automatisch genehmigt für Entwicklung'
FROM director_profiles
WHERE NOT EXISTS (
  SELECT 1 FROM director_verifications WHERE director_id = director_profiles.id
);

