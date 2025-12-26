-- ============================================
-- ENUMS für Musicify
-- ============================================

-- Benutzerrollen
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'DIRECTOR', 'ADMIN');

-- Director Badges
CREATE TYPE director_badge AS ENUM ('VERIFIED', 'TOP_SELLER', 'PREMIUM');

-- Lizenztypen
CREATE TYPE license_type AS ENUM ('PERSONAL', 'COMMERCIAL', 'ENTERPRISE', 'EXCLUSIVE');

-- Musik Status
CREATE TYPE music_status AS ENUM ('ACTIVE', 'INACTIVE', 'EXCLUSIVE_SOLD');

-- Order Status
CREATE TYPE order_status AS ENUM (
  'PENDING',           -- Auftrag erstellt, wartet auf Angebot
  'OFFER_PENDING',     -- Angebot abgegeben, wartet auf Annahme
  'OFFER_ACCEPTED',    -- Angebot angenommen, Produktion startet
  'IN_PROGRESS',       -- In Arbeit
  'REVISION_REQUESTED', -- Revision angefragt
  'READY_FOR_PAYMENT', -- Fertig, bereit zur Zahlung
  'PAID',              -- Bezahlt
  'COMPLETED',         -- Abgeschlossen
  'CANCELLED',         -- Storniert
  'DISPUTED'           -- Streitfall
);

-- Zahlungsmodell
CREATE TYPE payment_model AS ENUM ('PAY_ON_COMPLETION', 'PARTIAL_PAYMENT');

-- Zahlungsstatus
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Zahlungsmethode
CREATE TYPE payment_method AS ENUM ('CREDIT_CARD', 'PAYPAL');

-- Genehmigungsstatus
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Ticket Status
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- Ticket Typ
CREATE TYPE ticket_type AS ENUM ('GENERAL', 'DISPUTE', 'REFUND', 'TECHNICAL', 'OTHER');

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

-- ============================================
-- CUSTOM MUSIC ORDERS
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  director_id UUID REFERENCES director_profiles(id) ON DELETE SET NULL,
  status order_status DEFAULT 'PENDING' NOT NULL,
  
  -- Order Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  "references" TEXT,                    -- "references" ist reserviertes Wort, daher Anführungszeichen
  notes TEXT,
  budget DECIMAL(10,2),
  
  -- Filter/Requirements
  genre TEXT,
  subgenre TEXT,
  style TEXT,
  era TEXT,
  culture TEXT,
  mood TEXT,
  use_case TEXT,
  structure TEXT,
  
  -- Offer Details
  offered_price DECIMAL(10,2),
  production_time INTEGER,             -- in Tagen
  offer_accepted_at TIMESTAMPTZ,
  payment_model payment_model DEFAULT 'PAY_ON_COMPLETION' NOT NULL,
  
  -- Revisions
  included_revisions INTEGER DEFAULT 2 NOT NULL,
  used_revisions INTEGER DEFAULT 0 NOT NULL,
  max_revisions INTEGER DEFAULT 3 NOT NULL,
  
  -- Final Delivery
  final_music_url TEXT,
  final_music_id UUID REFERENCES music(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indizes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_director_id ON orders(director_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ORDER HISTORY (Status-Verlauf)
-- ============================================

CREATE TABLE order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  message TEXT,
  changed_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_order_history_order_id ON order_history(order_id);
CREATE INDEX idx_order_history_created_at ON order_history(created_at);

-- ============================================
-- ORDER ITEMS (gekaufte Musik pro Bestellung)
-- ============================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  music_id UUID NOT NULL REFERENCES music(id) ON DELETE RESTRICT,
  license_type license_type NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_music_id ON order_items(music_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Customers können ihre eigenen Orders sehen
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (
    customer_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Directors können ihre zugewiesenen Orders sehen
CREATE POLICY "Directors can view assigned orders"
  ON orders FOR SELECT
  USING (
    director_id IN (
      SELECT dp.id FROM director_profiles dp
      JOIN users u ON dp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Customers können Orders erstellen
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    customer_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Customers können ihre Orders updaten (vor Angebot)
CREATE POLICY "Customers can update pending orders"
  ON orders FOR UPDATE
  USING (
    customer_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
    AND status IN ('PENDING', 'OFFER_PENDING')
  );

-- Directors können zugewiesene Orders updaten
CREATE POLICY "Directors can update assigned orders"
  ON orders FOR UPDATE
  USING (
    director_id IN (
      SELECT dp.id FROM director_profiles dp
      JOIN users u ON dp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Order History
CREATE POLICY "Users can view own order history"
  ON order_history FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
    )
    OR
    order_id IN (
      SELECT o.id FROM orders o
      JOIN director_profiles dp ON o.director_id = dp.id
      JOIN users u ON dp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Order Items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
    )
  );

-- Admins können alles
CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all order history"
  ON order_history FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

-- Service Role
CREATE POLICY "Service role full access orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access order_history"
  ON order_history FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access order_items"
  ON order_items FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTION: Order Number Generator
-- ============================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- ============================================
-- CHAT SYSTEM
-- ============================================

CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_chats_order_id ON chats(order_id);

CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CHAT MESSAGES
-- ============================================

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,          -- audio, image, document, etc.
  is_system_message BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- ============================================
-- CHAT PARTICIPANTS
-- ============================================

CREATE TABLE chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(chat_id, user_id)
);

CREATE INDEX idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- Chats: Nur Teilnehmer können sehen
CREATE POLICY "Participants can view chat"
  ON chats FOR SELECT
  USING (
    id IN (
      SELECT cp.chat_id FROM chat_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Chat Messages: Nur Teilnehmer können sehen
CREATE POLICY "Participants can view messages"
  ON chat_messages FOR SELECT
  USING (
    chat_id IN (
      SELECT cp.chat_id FROM chat_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Chat Messages: Teilnehmer können senden
CREATE POLICY "Participants can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    chat_id IN (
      SELECT cp.chat_id FROM chat_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
    AND
    sender_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Chat Participants: Können ihre Teilnahme sehen
CREATE POLICY "Participants can view participants"
  ON chat_participants FOR SELECT
  USING (
    chat_id IN (
      SELECT cp.chat_id FROM chat_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE u.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Admins können alles
CREATE POLICY "Admins can manage all chats"
  ON chats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all messages"
  ON chat_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all participants"
  ON chat_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

-- Service Role
CREATE POLICY "Service role full access chats"
  ON chats FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access chat_messages"
  ON chat_messages FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access chat_participants"
  ON chat_participants FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- REALTIME SUBSCRIPTION
-- ============================================

-- Aktiviere Realtime für Chat Messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- ============================================
-- SHOPPING CART
-- ============================================

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  music_id UUID REFERENCES music(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,  -- Für Custom Music Orders
  license_type license_type DEFAULT 'COMMERCIAL' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ein Benutzer kann dasselbe Musikstück nicht mehrfach hinzufügen
  UNIQUE(user_id, music_id),
  
  -- Entweder music_id oder order_id muss gesetzt sein
  CONSTRAINT cart_item_type CHECK (
    (music_id IS NOT NULL AND order_id IS NULL) OR
    (music_id IS NULL AND order_id IS NOT NULL)
  )
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_music_id ON cart_items(music_id);
CREATE INDEX idx_cart_items_order_id ON cart_items(order_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Benutzer können nur ihren eigenen Warenkorb sehen
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Benutzer können Items zu ihrem Warenkorb hinzufügen
CREATE POLICY "Users can add to own cart"
  ON cart_items FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Benutzer können ihre Warenkorb-Items updaten
CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Benutzer können ihre Warenkorb-Items löschen
CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Service Role
CREATE POLICY "Service role full access cart_items"
  ON cart_items FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- INVOICES (Rechnungen)
-- ============================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0 NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status payment_status DEFAULT 'PENDING' NOT NULL,
  payment_method payment_method,
  stripe_payment_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_order_id ON invoices(order_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC);

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INVOICE ITEMS
-- ============================================

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  music_id UUID REFERENCES music(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  license_type license_type NOT NULL
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_music_id ON invoice_items(music_id);
CREATE INDEX idx_invoice_items_order_id ON invoice_items(order_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Benutzer können ihre eigenen Rechnungen sehen
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Benutzer können ihre eigenen Invoice Items sehen
CREATE POLICY "Users can view own invoice items"
  ON invoice_items FOR SELECT
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    )
  );

-- Admins können alles
CREATE POLICY "Admins can manage all invoices"
  ON invoices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all invoice items"
  ON invoice_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

-- Service Role
CREATE POLICY "Service role full access invoices"
  ON invoices FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access invoice_items"
  ON invoice_items FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTION: Invoice Number Generator
-- ============================================

CREATE SEQUENCE invoice_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL)
  EXECUTE FUNCTION generate_invoice_number();

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

-- ============================================
-- SUPPORT TICKETS / DISPUTES
-- ============================================

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type ticket_type DEFAULT 'GENERAL' NOT NULL,
  status ticket_status DEFAULT 'OPEN' NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_order_id ON support_tickets(order_id);
CREATE INDEX idx_support_tickets_ticket_number ON support_tickets(ticket_number);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_type ON support_tickets(type);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TICKET MESSAGES
-- ============================================

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_sender_id ON ticket_messages(sender_id);
CREATE INDEX idx_ticket_messages_created_at ON ticket_messages(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Benutzer können ihre eigenen Tickets sehen
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Benutzer können Tickets erstellen
CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Benutzer können ihre eigenen Ticket Messages sehen
CREATE POLICY "Users can view own ticket messages"
  ON ticket_messages FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM support_tickets WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    )
  );

-- Benutzer können Nachrichten zu ihren Tickets senden
CREATE POLICY "Users can send ticket messages"
  ON ticket_messages FOR INSERT
  WITH CHECK (
    ticket_id IN (
      SELECT id FROM support_tickets WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    )
    AND
    sender_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Admins können alles
CREATE POLICY "Admins can manage all tickets"
  ON support_tickets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all ticket messages"
  ON ticket_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE clerk_id = auth.jwt() ->> 'sub' AND role = 'ADMIN'
    )
  );

-- Service Role
CREATE POLICY "Service role full access support_tickets"
  ON support_tickets FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access ticket_messages"
  ON ticket_messages FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTION: Ticket Number Generator
-- ============================================

CREATE SEQUENCE ticket_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('ticket_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL)
  EXECUTE FUNCTION generate_ticket_number();

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

