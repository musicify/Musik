-- ============================================
-- MUSIC CATALOG
-- ============================================

CREATE TABLE music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL,           -- in Sekunden
  bpm INTEGER,                         -- Beats per minute
  key TEXT,                            -- Musical key (z.B. "C Major")
  price DECIMAL(10,2) NOT NULL,
  audio_url TEXT NOT NULL,             -- S3/Cloudinary URL
  preview_url TEXT,                    -- Preview Snippet URL
  waveform_data TEXT,                  -- JSON Waveform Daten für Visualisierung
  cover_image TEXT,
  license_type license_type DEFAULT 'COMMERCIAL' NOT NULL,
  status music_status DEFAULT 'ACTIVE' NOT NULL,
  
  -- Preise pro Lizenztyp
  price_personal DECIMAL(10,2),
  price_commercial DECIMAL(10,2),
  price_enterprise DECIMAL(10,2),
  price_exclusive DECIMAL(10,2),
  
  -- Metadaten/Filter
  genre TEXT NOT NULL,
  subgenre TEXT,
  style TEXT,
  era TEXT,                            -- Epoche
  culture TEXT,
  mood TEXT,                           -- Stimmung
  use_case TEXT,                       -- Verwendungszweck
  structure TEXT,
  tags TEXT[] DEFAULT '{}',            -- Zusätzliche suchbare Tags
  
  -- Relations
  director_id UUID REFERENCES director_profiles(id) ON DELETE SET NULL,
  
  -- Stats
  play_count INTEGER DEFAULT 0 NOT NULL,
  purchase_count INTEGER DEFAULT 0 NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indizes für Performance
CREATE INDEX idx_music_director_id ON music(director_id);
CREATE INDEX idx_music_status ON music(status);
CREATE INDEX idx_music_genre ON music(genre);
CREATE INDEX idx_music_mood ON music(mood);
CREATE INDEX idx_music_use_case ON music(use_case);
CREATE INDEX idx_music_license_type ON music(license_type);
CREATE INDEX idx_music_price ON music(price);
CREATE INDEX idx_music_created_at ON music(created_at DESC);

-- Full-text search Index
CREATE INDEX idx_music_search ON music USING GIN (
  to_tsvector('german', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(genre, ''))
);

CREATE TRIGGER update_music_updated_at
  BEFORE UPDATE ON music
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MUSIC APPROVAL (Admin Freigabe)
-- ============================================

CREATE TABLE music_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  music_id UUID UNIQUE NOT NULL REFERENCES music(id) ON DELETE CASCADE,
  status approval_status DEFAULT 'PENDING' NOT NULL,
  reviewed_by TEXT,
  review_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_music_approvals_music_id ON music_approvals(music_id);
CREATE INDEX idx_music_approvals_status ON music_approvals(status);

CREATE TRIGGER update_music_approvals_updated_at
  BEFORE UPDATE ON music_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE music ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_approvals ENABLE ROW LEVEL SECURITY;

-- Jeder kann aktive Musik sehen
CREATE POLICY "Anyone can view active music"
  ON music FOR SELECT
  USING (status = 'ACTIVE');

-- Directors können ihre eigene Musik verwalten
CREATE POLICY "Directors can manage own music"
  ON music FOR ALL
  USING (
    director_id IN (
      SELECT dp.id FROM director_profiles dp
      JOIN users u ON dp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Directors können Musik erstellen
CREATE POLICY "Directors can insert music"
  ON music FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM director_profiles dp
      JOIN users u ON dp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Admins können alles
CREATE POLICY "Admins can manage all music"
  ON music FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all approvals"
  ON music_approvals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

-- Service Role
CREATE POLICY "Service role full access music"
  ON music FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access music_approvals"
  ON music_approvals FOR ALL
  USING (auth.role() = 'service_role');

