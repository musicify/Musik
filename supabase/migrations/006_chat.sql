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

