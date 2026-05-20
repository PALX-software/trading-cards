import { describe, it, expect } from 'vitest'
import { PRICING } from '@/lib/types'
import type { PaymentType } from '@/lib/types'

describe('PRICING constants', () => {
  it('PRICING.TRADE_SEARCH_FEE === 50', () => {
    expect(PRICING.TRADE_SEARCH_FEE).toBe(50)
  })

  it('PRICING.TRADE_ACCEPT_FEE === 20', () => {
    expect(PRICING.TRADE_ACCEPT_FEE).toBe(20)
  })

  it('PRICING.MEMBERSHIP_FEE exists and is a number', () => {
    expect(typeof PRICING.MEMBERSHIP_FEE).toBe('number')
    expect(PRICING.MEMBERSHIP_FEE).toBeGreaterThan(0)
  })

  it('PRICING.AUCTION_ENTRY_FEE exists and is a number', () => {
    expect(typeof PRICING.AUCTION_ENTRY_FEE).toBe('number')
    expect(PRICING.AUCTION_ENTRY_FEE).toBeGreaterThan(0)
  })

  it('PRICING.AUCTION_CREATION_FEE exists and is a number', () => {
    expect(typeof PRICING.AUCTION_CREATION_FEE).toBe('number')
    expect(PRICING.AUCTION_CREATION_FEE).toBeGreaterThan(0)
  })

  it('all pricing values are positive integers', () => {
    for (const value of Object.values(PRICING)) {
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThan(0)
    }
  })
})

describe('PaymentType values', () => {
  it('valid PaymentType string values can be assigned', () => {
    const validTypes: PaymentType[] = [
      'membership',
      'auction_creation',
      'auction_entry',
      'trade_search',
      'trade_accept',
    ]
    for (const t of validTypes) {
      expect(typeof t).toBe('string')
      expect(t.length).toBeGreaterThan(0)
    }
  })

  it('membership is a valid PaymentType string', () => {
    const t: PaymentType = 'membership'
    expect(t).toBe('membership')
  })

  it('trade_search is a valid PaymentType string', () => {
    const t: PaymentType = 'trade_search'
    expect(t).toBe('trade_search')
  })

  it('trade_accept is a valid PaymentType string', () => {
    const t: PaymentType = 'trade_accept'
    expect(t).toBe('trade_accept')
  })

  it('auction_creation is a valid PaymentType string', () => {
    const t: PaymentType = 'auction_creation'
    expect(t).toBe('auction_creation')
  })

  it('auction_entry is a valid PaymentType string', () => {
    const t: PaymentType = 'auction_entry'
    expect(t).toBe('auction_entry')
  })
})
