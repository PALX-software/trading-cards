export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Rarity = 'common' | 'uncommon' | 'rare' | 'ultra_rare' | 'legendary'
export type Condition = 'poor' | 'fair' | 'good' | 'very_good' | 'excellent' | 'mint' | 'gem_mint'
export type AuctionStatus = 'draft' | 'active' | 'ended' | 'cancelled'
export type TransactionType = 'purchase' | 'auction_win' | 'membership' | 'auction_fee' | 'auction_bid'
export type PaymentType = 'membership' | 'auction_creation' | 'auction_entry' | 'trade_search' | 'trade_accept'

export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  membership_paid: boolean
  membership_paid_at: string | null
  balance: number
  created_at: string
  updated_at: string
}

export interface Card {
  id: string
  owner_id: string | null
  title: string
  description: string | null
  player_name: string
  team: string
  year: number
  card_number: string | null
  series: string | null
  rarity: Rarity
  condition: Condition
  image_url: string | null
  price: number | null
  is_for_sale: boolean
  is_for_auction: boolean
  created_at: string
  updated_at: string
  // Joined
  owner?: Profile
}

export interface Auction {
  id: string
  card_id: string
  seller_id: string
  title: string
  description: string | null
  starting_price: number
  current_price: number
  min_bid_increment: number
  buy_now_price: number | null
  creation_fee_paid: boolean
  status: AuctionStatus
  winner_id: string | null
  starts_at: string
  ends_at: string
  duration_days: number
  card_shipped: boolean
  card_verified: boolean
  tracking_number: string | null
  commission_pct: number
  shipping_address: string | null
  created_at: string
  updated_at: string
  // Joined
  card?: Card
  seller?: Profile
  winner?: Profile
  bids?: Bid[]
  participants_count?: number
}

export interface Bid {
  id: string
  auction_id: string
  bidder_id: string
  amount: number
  is_winning: boolean
  created_at: string
  // Joined
  bidder?: Profile
}

export interface Payment {
  id: string
  user_id: string
  type: PaymentType
  amount: number
  reference_id: string | null
  status: 'pending' | 'completed' | 'failed'
  payment_method: string
  created_at: string
}

export interface AuctionParticipant {
  id: string
  auction_id: string
  user_id: string
  entry_fee_paid: boolean
  joined_at: string
}

// Pricing constants (MXN)
export const PRICING = {
  MEMBERSHIP_FEE: 100,
  AUCTION_CREATION_FEE: 50,
  AUCTION_ENTRY_FEE: 10,
  TRADE_SEARCH_FEE: 50,
  TRADE_ACCEPT_FEE: 20,
} as const

export const VERIFICATION_ADDRESS = {
  street: 'Calle 30 Número 19',
  neighborhood: 'Zona Cementos Atoyac',
  city: 'Puebla, Puebla',
  zipCode: '72023',
  full: 'Calle 30 Número 19, Zona Cementos Atoyac, Puebla, Puebla, C.P. 72023',
} as const

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  ultra_rare: 'Ultra Rare',
  legendary: 'Legendary',
}

export const CONDITION_LABELS: Record<Condition, string> = {
  poor: 'Poor',
  fair: 'Fair',
  good: 'Good',
  very_good: 'Very Good',
  excellent: 'Excellent',
  mint: 'Mint',
  gem_mint: 'Gem Mint',
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  ultra_rare: '#a855f7',
  legendary: '#f59e0b',
}

export interface StickerCatalog {
  number: string
  player_name: string
  team: string
  section: string
  sticker_type: 'player' | 'logo' | 'badge' | 'special'
  image_url: string | null
}

export interface UserSticker {
  id: string
  user_id: string
  sticker_number: string
  quantity: number
  created_at: string
  sticker?: StickerCatalog
}

export type TradeStatus = 'searching' | 'pending' | 'accepted' | 'completed' | 'cancelled'
export type TradeInvitationStatus = 'pending' | 'accepted' | 'declined'

export interface Trade {
  id: string
  proposer_id: string
  offered_sticker: string
  wanted_sticker: string
  search_fee_paid: boolean
  status: TradeStatus
  created_at: string
  updated_at: string
  proposer?: Profile
  offered?: StickerCatalog
  wanted?: StickerCatalog
  invitations?: TradeInvitation[]
}

export interface TradeInvitation {
  id: string
  trade_id: string
  proposer_id: string
  invited_user_id: string
  status: TradeInvitationStatus
  acceptance_fee_paid: boolean
  created_at: string
  trade?: Trade
  proposer?: Profile
  invited_user?: Profile
}

export interface Message {
  id: string
  room_type: 'auction' | 'trade'
  room_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: Profile
}

export const WORLD_CUP_TEAMS = [
  'Argentina', 'Brazil', 'France', 'Germany', 'Spain', 'England',
  'Italy', 'Portugal', 'Netherlands', 'Belgium', 'Croatia', 'Uruguay',
  'Mexico', 'USA', 'Japan', 'South Korea', 'Morocco', 'Senegal',
  'Australia', 'Denmark', 'Switzerland', 'Poland', 'Ecuador', 'Cameroon',
  'Canada', 'Ghana', 'Qatar', 'Serbia', 'Tunisia', 'Iran', 'Saudi Arabia', 'Wales',
]
