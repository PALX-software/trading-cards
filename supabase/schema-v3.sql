-- ============================================================
-- FIFA WC 2026 Trading Cards — Schema v3 Migration
-- Run AFTER schema.sql and schema-v2.sql
-- ============================================================

ALTER TABLE auctions ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 7;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS card_shipped BOOLEAN DEFAULT FALSE;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS card_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS commission_pct NUMERIC DEFAULT 10;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS shipping_address TEXT DEFAULT 'Calle 30 Número 19, Zona Cementos Atoyac, Puebla, Puebla, C.P. 72023';

-- Allow sellers to update their own auctions (tracking_number, card_shipped)
-- policy already exists on auction UPDATE; no change needed

-- Index for verified auctions
CREATE INDEX IF NOT EXISTS idx_auctions_card_verified ON auctions(card_verified);
