-- ============================================
-- USEFUL VIEWS
-- ============================================

-- View: Director mit User-Info
CREATE OR REPLACE VIEW directors_with_user AS
SELECT 
  dp.*,
  u.email,
  u.name,
  u.image,
  u.clerk_id
FROM director_profiles dp
JOIN users u ON dp.user_id = u.id
WHERE dp.is_active = TRUE;

-- View: Music mit Director-Info
CREATE OR REPLACE VIEW music_with_director AS
SELECT 
  m.*,
  dp.bio as director_bio,
  dp.rating as director_rating,
  dp.badges as director_badges,
  u.name as director_name,
  u.image as director_image
FROM music m
LEFT JOIN director_profiles dp ON m.director_id = dp.id
LEFT JOIN users u ON dp.user_id = u.id
WHERE m.status = 'ACTIVE';

-- View: Orders mit Customer und Director Info
CREATE OR REPLACE VIEW orders_detailed AS
SELECT 
  o.*,
  c.name as customer_name,
  c.email as customer_email,
  c.image as customer_image,
  du.name as director_name,
  du.email as director_email,
  dp.rating as director_rating
FROM orders o
JOIN users c ON o.customer_id = c.id
LEFT JOIN director_profiles dp ON o.director_id = dp.id
LEFT JOIN users du ON dp.user_id = du.id;

-- ============================================
-- USEFUL FUNCTIONS
-- ============================================

-- Function: Get User by Clerk ID
CREATE OR REPLACE FUNCTION get_user_by_clerk_id(p_clerk_id TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  image TEXT,
  role user_role,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.name, u.image, u.role, u.created_at
  FROM users u
  WHERE u.clerk_id = p_clerk_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create or Update User from Clerk Webhook
CREATE OR REPLACE FUNCTION upsert_user_from_clerk(
  p_clerk_id TEXT,
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_image TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  INSERT INTO users (clerk_id, email, name, image)
  VALUES (p_clerk_id, p_email, p_name, p_image)
  ON CONFLICT (clerk_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    image = COALESCE(EXCLUDED.image, users.image),
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create Customer Profile
CREATE OR REPLACE FUNCTION create_customer_profile(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  INSERT INTO customer_profiles (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO v_profile_id;
  
  RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create Director Profile
CREATE OR REPLACE FUNCTION create_director_profile(
  p_user_id UUID,
  p_bio TEXT DEFAULT NULL,
  p_specialization TEXT[] DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  -- Update user role to DIRECTOR
  UPDATE users SET role = 'DIRECTOR' WHERE id = p_user_id;
  
  INSERT INTO director_profiles (user_id, bio, specialization)
  VALUES (p_user_id, p_bio, p_specialization)
  ON CONFLICT (user_id) DO UPDATE SET
    bio = COALESCE(EXCLUDED.bio, director_profiles.bio),
    specialization = COALESCE(EXCLUDED.specialization, director_profiles.specialization),
    updated_at = NOW()
  RETURNING id INTO v_profile_id;
  
  -- Create verification entry
  INSERT INTO director_verifications (director_id)
  VALUES (v_profile_id)
  ON CONFLICT (director_id) DO NOTHING;
  
  RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get Cart Total
CREATE OR REPLACE FUNCTION get_cart_total(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_total DECIMAL;
BEGIN
  SELECT COALESCE(SUM(
    CASE ci.license_type
      WHEN 'PERSONAL' THEN COALESCE(m.price_personal, m.price)
      WHEN 'COMMERCIAL' THEN COALESCE(m.price_commercial, m.price)
      WHEN 'ENTERPRISE' THEN COALESCE(m.price_enterprise, m.price)
      WHEN 'EXCLUSIVE' THEN COALESCE(m.price_exclusive, m.price)
      ELSE m.price
    END
  ), 0) INTO v_total
  FROM cart_items ci
  LEFT JOIN music m ON ci.music_id = m.id
  LEFT JOIN orders o ON ci.order_id = o.id
  WHERE ci.user_id = p_user_id;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Increment Music Play Count
CREATE OR REPLACE FUNCTION increment_play_count(p_music_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE music
  SET play_count = play_count + 1
  WHERE id = p_music_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update Director Stats
CREATE OR REPLACE FUNCTION update_director_stats(p_director_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE director_profiles
  SET
    total_projects = (
      SELECT COUNT(*) FROM orders WHERE director_id = p_director_id AND status = 'COMPLETED'
    ),
    total_earnings = (
      SELECT COALESCE(SUM(offered_price), 0) FROM orders WHERE director_id = p_director_id AND status = 'COMPLETED'
    ),
    completion_rate = (
      SELECT 
        CASE 
          WHEN COUNT(*) = 0 THEN NULL
          ELSE (COUNT(*) FILTER (WHERE status = 'COMPLETED')::DECIMAL / COUNT(*)::DECIMAL) * 100
        END
      FROM orders WHERE director_id = p_director_id AND status IN ('COMPLETED', 'CANCELLED')
    ),
    updated_at = NOW()
  WHERE id = p_director_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Search Music (Full-Text)
CREATE OR REPLACE FUNCTION search_music(
  p_query TEXT,
  p_genre TEXT DEFAULT NULL,
  p_mood TEXT DEFAULT NULL,
  p_use_case TEXT DEFAULT NULL,
  p_price_min DECIMAL DEFAULT NULL,
  p_price_max DECIMAL DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  duration INTEGER,
  price DECIMAL,
  audio_url TEXT,
  preview_url TEXT,
  cover_image TEXT,
  genre TEXT,
  mood TEXT,
  director_name TEXT,
  director_image TEXT,
  play_count INTEGER,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.description,
    m.duration,
    m.price,
    m.audio_url,
    m.preview_url,
    m.cover_image,
    m.genre,
    m.mood,
    u.name as director_name,
    u.image as director_image,
    m.play_count,
    ts_rank(
      to_tsvector('german', coalesce(m.title, '') || ' ' || coalesce(m.description, '')),
      plainto_tsquery('german', p_query)
    ) as rank
  FROM music m
  LEFT JOIN director_profiles dp ON m.director_id = dp.id
  LEFT JOIN users u ON dp.user_id = u.id
  WHERE m.status = 'ACTIVE'
    AND (p_query IS NULL OR p_query = '' OR 
         to_tsvector('german', coalesce(m.title, '') || ' ' || coalesce(m.description, '')) @@ plainto_tsquery('german', p_query))
    AND (p_genre IS NULL OR m.genre = p_genre)
    AND (p_mood IS NULL OR m.mood = p_mood)
    AND (p_use_case IS NULL OR m.use_case = p_use_case)
    AND (p_price_min IS NULL OR m.price >= p_price_min)
    AND (p_price_max IS NULL OR m.price <= p_price_max)
  ORDER BY rank DESC, m.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ADMIN STATS FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM users),
    'total_customers', (SELECT COUNT(*) FROM users WHERE role = 'CUSTOMER'),
    'total_directors', (SELECT COUNT(*) FROM users WHERE role = 'DIRECTOR'),
    'verified_directors', (SELECT COUNT(*) FROM director_profiles WHERE is_verified = TRUE),
    'pending_verifications', (SELECT COUNT(*) FROM director_verifications WHERE status = 'PENDING'),
    'total_music', (SELECT COUNT(*) FROM music),
    'active_music', (SELECT COUNT(*) FROM music WHERE status = 'ACTIVE'),
    'pending_approvals', (SELECT COUNT(*) FROM music_approvals WHERE status = 'PENDING'),
    'total_orders', (SELECT COUNT(*) FROM orders),
    'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'PENDING'),
    'completed_orders', (SELECT COUNT(*) FROM orders WHERE status = 'COMPLETED'),
    'total_revenue', (SELECT COALESCE(SUM(total), 0) FROM invoices WHERE status = 'COMPLETED'),
    'open_tickets', (SELECT COUNT(*) FROM support_tickets WHERE status = 'OPEN')
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

