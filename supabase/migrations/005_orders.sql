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

