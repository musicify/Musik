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

