-- ============================================================
-- Schema v4: Superadmin system
-- ============================================================

-- Add is_admin flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Set the superadmin
UPDATE profiles SET is_admin = TRUE
WHERE id = (SELECT id FROM auth.users WHERE email = 'joseluispalillero@gmail.com');

-- ============================================================
-- RLS: admins can read all profiles, payments, trades, auctions
-- ============================================================

-- Drop existing policies that might conflict before recreating
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can read all payments" ON payments;
DROP POLICY IF EXISTS "Admins can read all auctions" ON auctions;
DROP POLICY IF EXISTS "Admins can read all trades" ON trades;

-- Admins can read all profiles; regular users can only read their own
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)
    OR auth.uid() = id
  );

-- Admins can read all payments
CREATE POLICY "Admins can read all payments" ON payments
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)
    OR auth.uid() = user_id
  );

-- Admins can update any profile (for balance / membership / is_admin changes)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)
    OR auth.uid() = id
  );

-- Admins can read all auctions
CREATE POLICY "Admins can read all auctions" ON auctions
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)
    OR auth.uid() = seller_id
    OR auth.uid() = winner_id
  );

-- Admins can update any auction (force-close)
DROP POLICY IF EXISTS "Admins can update all auctions" ON auctions;
CREATE POLICY "Admins can update all auctions" ON auctions
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)
    OR auth.uid() = seller_id
  );

-- Admins can read all trades
CREATE POLICY "Admins can read all trades" ON trades
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = TRUE)
    OR auth.uid() = proposer_id
  );
