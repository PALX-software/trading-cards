-- Migration v5: per-auction entry fee
-- Run this in the Supabase SQL Editor

ALTER TABLE auctions
  ADD COLUMN IF NOT EXISTS entry_fee NUMERIC(10,2) NOT NULL DEFAULT 10;

COMMENT ON COLUMN auctions.entry_fee IS 'Amount (MXN) participants must pay to enter the auction room and bid.';
