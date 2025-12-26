-- ============================================
-- DOWNLOADS
-- ============================================

CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  music_id UUID REFERENCES music(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  license_type license_type NOT NULL,
  download_url TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_music_id ON downloads(music_id);
CREATE INDEX idx_downloads_order_id ON downloads(order_id);
CREATE INDEX idx_downloads_created_at ON downloads(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Benutzer können ihre eigenen Downloads sehen
CREATE POLICY "Users can view own downloads"
  ON downloads FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Admins können alles
CREATE POLICY "Admins can manage all downloads"
  ON downloads FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

-- Service Role
CREATE POLICY "Service role full access downloads"
  ON downloads FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTION: Increment Download Count
-- ============================================

CREATE OR REPLACE FUNCTION increment_download_count(download_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE downloads
  SET download_count = download_count + 1
  WHERE id = download_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

