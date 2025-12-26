-- ============================================
-- CUSTOMER PROFILE
-- ============================================

CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_customer_profiles_user_id ON customer_profiles(user_id);

CREATE TRIGGER update_customer_profiles_updated_at
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DIRECTOR PROFILE
-- ============================================

CREATE TABLE director_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  specialization TEXT[] DEFAULT '{}',
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  badges director_badge[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  portfolio_tracks TEXT[] DEFAULT '{}',  -- URLs zu Portfolio Tracks
  website TEXT,
  social_links TEXT[] DEFAULT '{}',
  experience TEXT,
  equipment TEXT,
  languages TEXT[] DEFAULT '{}',
  
  -- Performance Metriken
  avg_response_time INTEGER,     -- in Stunden
  completion_rate DECIMAL(5,2),  -- Prozent
  avg_delivery_time INTEGER,     -- in Stunden
  revision_rate DECIMAL(5,2),    -- Prozent
  total_projects INTEGER DEFAULT 0 NOT NULL,
  total_earnings DECIMAL(12,2) DEFAULT 0 NOT NULL,
  rating DECIMAL(3,2),           -- 1-5 Sterne
  review_count INTEGER DEFAULT 0 NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_director_profiles_user_id ON director_profiles(user_id);
CREATE INDEX idx_director_profiles_is_verified ON director_profiles(is_verified);
CREATE INDEX idx_director_profiles_is_active ON director_profiles(is_active);
CREATE INDEX idx_director_profiles_rating ON director_profiles(rating);

CREATE TRIGGER update_director_profiles_updated_at
  BEFORE UPDATE ON director_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DIRECTOR VERIFICATION
-- ============================================

CREATE TABLE director_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  director_id UUID UNIQUE NOT NULL REFERENCES director_profiles(id) ON DELETE CASCADE,
  status approval_status DEFAULT 'PENDING' NOT NULL,
  portfolio_review TEXT,
  reviewed_by TEXT,  -- User ID des Admin
  review_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_director_verifications_director_id ON director_verifications(director_id);
CREATE INDEX idx_director_verifications_status ON director_verifications(status);

CREATE TRIGGER update_director_verifications_updated_at
  BEFORE UPDATE ON director_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE director_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE director_verifications ENABLE ROW LEVEL SECURITY;

-- Customer Profiles
CREATE POLICY "Users can view own customer profile"
  ON customer_profiles FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "Users can update own customer profile"
  ON customer_profiles FOR UPDATE
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Director Profiles - öffentlich lesbar
CREATE POLICY "Anyone can view active director profiles"
  ON director_profiles FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Directors can update own profile"
  ON director_profiles FOR UPDATE
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Admins können alles
CREATE POLICY "Admins can manage all profiles"
  ON customer_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all director profiles"
  ON director_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all verifications"
  ON director_verifications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

-- Service Role
CREATE POLICY "Service role full access customer_profiles"
  ON customer_profiles FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access director_profiles"
  ON director_profiles FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access director_verifications"
  ON director_verifications FOR ALL
  USING (auth.role() = 'service_role');

