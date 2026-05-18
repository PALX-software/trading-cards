-- ============================================================
-- FIFA World Cup Trading Cards Marketplace - Supabase Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Extended user profile with payment status
-- ============================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  membership_paid BOOLEAN DEFAULT FALSE,
  membership_paid_at TIMESTAMPTZ,
  balance NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- CARDS TABLE
-- FIFA World Cup trading cards catalog
-- ============================================================
CREATE TABLE cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  player_name TEXT NOT NULL,
  team TEXT NOT NULL,
  year INTEGER NOT NULL,
  card_number TEXT,
  series TEXT,
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'ultra_rare', 'legendary')) DEFAULT 'common',
  condition TEXT CHECK (condition IN ('poor', 'fair', 'good', 'very_good', 'excellent', 'mint', 'gem_mint')) DEFAULT 'good',
  image_url TEXT,
  price NUMERIC(10,2),
  is_for_sale BOOLEAN DEFAULT FALSE,
  is_for_auction BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cards" ON cards FOR SELECT USING (TRUE);
CREATE POLICY "Owners can insert cards" ON cards FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update cards" ON cards FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete cards" ON cards FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================
-- TRANSACTIONS TABLE
-- Purchase history
-- ============================================================
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT CHECK (type IN ('purchase', 'auction_win', 'membership', 'auction_fee', 'auction_bid')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can insert transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ============================================================
-- AUCTIONS TABLE
-- 50 MXN to create, 10 MXN to join
-- ============================================================
CREATE TABLE auctions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  starting_price NUMERIC(10,2) NOT NULL DEFAULT 10.00,
  current_price NUMERIC(10,2) NOT NULL DEFAULT 10.00,
  min_bid_increment NUMERIC(10,2) DEFAULT 5.00,
  buy_now_price NUMERIC(10,2),
  creation_fee_paid BOOLEAN DEFAULT FALSE,  -- 50 MXN fee
  status TEXT CHECK (status IN ('draft', 'active', 'ended', 'cancelled')) DEFAULT 'draft',
  winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active auctions" ON auctions FOR SELECT USING (TRUE);
CREATE POLICY "Sellers can insert auctions" ON auctions FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own auctions" ON auctions FOR UPDATE USING (auth.uid() = seller_id);

-- ============================================================
-- AUCTION PARTICIPANTS TABLE
-- 10 MXN to join an auction
-- ============================================================
CREATE TABLE auction_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  entry_fee_paid BOOLEAN DEFAULT FALSE,  -- 10 MXN fee
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(auction_id, user_id)
);

ALTER TABLE auction_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view auction participants" ON auction_participants FOR SELECT USING (TRUE);
CREATE POLICY "Users can join auctions" ON auction_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- BIDS TABLE
-- Bids placed in auctions
-- ============================================================
CREATE TABLE bids (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
  bidder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  is_winning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bids" ON bids FOR SELECT USING (TRUE);
CREATE POLICY "Participants can place bids" ON bids FOR INSERT
  WITH CHECK (
    auth.uid() = bidder_id AND
    EXISTS (
      SELECT 1 FROM auction_participants
      WHERE auction_id = bids.auction_id AND user_id = auth.uid() AND entry_fee_paid = TRUE
    )
  );

-- ============================================================
-- PAYMENTS TABLE
-- Track all fee payments
-- ============================================================
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  type TEXT CHECK (type IN ('membership', 'auction_creation', 'auction_entry')) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  reference_id UUID,  -- auction_id or null for membership
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  payment_method TEXT DEFAULT 'simulated',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update current_price when bid is placed
CREATE OR REPLACE FUNCTION update_auction_price()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark previous winning bids as not winning
  UPDATE bids SET is_winning = FALSE
  WHERE auction_id = NEW.auction_id AND id != NEW.id;

  -- Mark this bid as winning
  UPDATE bids SET is_winning = TRUE WHERE id = NEW.id;

  -- Update auction current price
  UPDATE auctions SET current_price = NEW.amount, updated_at = NOW()
  WHERE id = NEW.auction_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_bid_placed
  AFTER INSERT ON bids
  FOR EACH ROW EXECUTE FUNCTION update_auction_price();

-- Update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA - Sample FIFA World Cup Cards
-- ============================================================

-- Note: Run this after creating a test user
-- INSERT INTO cards (owner_id, title, player_name, team, year, series, rarity, condition, price, is_for_sale, image_url)
-- VALUES (...)
