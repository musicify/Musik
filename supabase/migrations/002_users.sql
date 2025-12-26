-- ============================================
-- USER TABLE (mit Clerk Integration)
-- ============================================
-- Clerk verwaltet die Authentifizierung, aber wir brauchen
-- eine User-Tabelle für App-spezifische Daten und Relations

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,  -- Clerk User ID
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  role user_role DEFAULT 'CUSTOMER' NOT NULL,
  email_verified TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index für schnelle Clerk ID Lookups
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users können ihr eigenes Profil lesen
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (clerk_id = auth.jwt() ->> 'sub');

-- Users können ihr eigenes Profil updaten
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (clerk_id = auth.jwt() ->> 'sub');

-- Admins können alle User sehen
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

-- Service Role kann alles (für Backend-Operationen)
CREATE POLICY "Service role has full access"
  ON users FOR ALL
  USING (auth.role() = 'service_role');

