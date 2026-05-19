-- ============================================================
-- FIFA WC 2026 Trading Cards — Schema v2 Migration
-- Run this AFTER schema.sql
-- ============================================================

-- ============================================================
-- STICKER CATALOG (static FIFA WC 2026 reference)
-- ============================================================
CREATE TABLE IF NOT EXISTS sticker_catalog (
  number TEXT PRIMARY KEY,
  player_name TEXT NOT NULL,
  team TEXT NOT NULL,
  section TEXT NOT NULL,
  sticker_type TEXT CHECK (sticker_type IN ('player','logo','badge','special')) DEFAULT 'player',
  image_url TEXT
);

ALTER TABLE sticker_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read catalog" ON sticker_catalog FOR SELECT USING (TRUE);

-- ============================================================
-- USER STICKERS (album ownership)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_stickers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sticker_number TEXT REFERENCES sticker_catalog(number) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sticker_number)
);

ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own stickers" ON user_stickers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own stickers" ON user_stickers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own stickers" ON user_stickers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own stickers" ON user_stickers FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- TRADES
-- ============================================================
CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proposer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  offered_sticker TEXT REFERENCES sticker_catalog(number) NOT NULL,
  wanted_sticker TEXT REFERENCES sticker_catalog(number) NOT NULL,
  search_fee_paid BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('searching','pending','accepted','completed','cancelled')) DEFAULT 'searching',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view trades" ON trades FOR SELECT USING (TRUE);
CREATE POLICY "Proposers create trades" ON trades FOR INSERT WITH CHECK (auth.uid() = proposer_id);
CREATE POLICY "Proposers update own trades" ON trades FOR UPDATE USING (auth.uid() = proposer_id);

CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRADE INVITATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS trade_invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE NOT NULL,
  proposer_id UUID REFERENCES profiles(id) NOT NULL,
  invited_user_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT CHECK (status IN ('pending','accepted','declined')) DEFAULT 'pending',
  acceptance_fee_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trade_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties can view trade invitations" ON trade_invitations FOR SELECT
  USING (auth.uid() = invited_user_id OR auth.uid() = proposer_id);
CREATE POLICY "Proposers create invitations" ON trade_invitations FOR INSERT
  WITH CHECK (auth.uid() = proposer_id);
CREATE POLICY "Invited users update invitations" ON trade_invitations FOR UPDATE
  USING (auth.uid() = invited_user_id OR auth.uid() = proposer_id);

-- ============================================================
-- MESSAGES (chat rooms for auctions and accepted trades)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_type TEXT CHECK (room_type IN ('auction','trade')) NOT NULL,
  room_id UUID NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read messages" ON messages FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- ============================================================
-- ALTER EXISTING TABLES
-- ============================================================

-- Update payments.type CHECK to include new types (requires recreating constraint)
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_type_check;
ALTER TABLE payments ADD CONSTRAINT payments_type_check
  CHECK (type IN ('membership', 'auction_creation', 'auction_entry', 'trade_search', 'trade_accept'));
