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

