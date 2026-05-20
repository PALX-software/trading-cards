import { describe, it, expect } from 'vitest'
import {
  STICKER_CATALOG,
  CATALOG_MAP,
  ALL_SECTIONS,
  getCatalogByTeam,
} from '@/lib/catalog'

describe('STICKER_CATALOG', () => {
  it('has exactly 980 stickers', () => {
    expect(STICKER_CATALOG.length).toBe(980)
  })

  it('has no duplicate numbers', () => {
    const numbers = STICKER_CATALOG.map((s) => s.number)
    const unique = new Set(numbers)
    expect(unique.size).toBe(numbers.length)
  })

  it('every entry has required fields', () => {
    for (const sticker of STICKER_CATALOG) {
      expect(sticker.number).toBeTruthy()
      expect(sticker.player_name).toBeTruthy()
      expect(sticker.team).toBeTruthy()
      expect(sticker.section).toBeTruthy()
      expect(sticker.sticker_type).toBeTruthy()
    }
  })

  it('sticker_type is one of the valid values', () => {
    const validTypes = new Set(['player', 'badge', 'logo', 'special'])
    for (const sticker of STICKER_CATALOG) {
      expect(validTypes.has(sticker.sticker_type)).toBe(true)
    }
  })

  it('numbers are sequential from 001 to 980 with no gaps', () => {
    const numbers = STICKER_CATALOG.map((s) => parseInt(s.number, 10)).sort((a, b) => a - b)
    for (let i = 0; i < 980; i++) {
      expect(numbers[i]).toBe(i + 1)
    }
  })

  it('numbers are zero-padded strings', () => {
    const first = STICKER_CATALOG[0]
    expect(first.number).toBe('001')
    const last = STICKER_CATALOG[979]
    expect(last.number).toBe('980')
  })
})

describe('getCatalogByTeam', () => {
  it('returns 18 stickers for Mexico', () => {
    expect(getCatalogByTeam('Mexico').length).toBe(18)
  })

  it('returns 18 stickers for Argentina', () => {
    expect(getCatalogByTeam('Argentina').length).toBe(18)
  })

  it('returns empty array for unknown team', () => {
    expect(getCatalogByTeam('NonExistentTeam')).toHaveLength(0)
  })

  it('returns stickers only belonging to the requested team section', () => {
    const mexicoStickers = getCatalogByTeam('Mexico')
    for (const s of mexicoStickers) {
      expect(s.section).toBe('Mexico')
    }
  })
})

describe('CATALOG_MAP', () => {
  it('has size 980', () => {
    expect(CATALOG_MAP.size).toBe(980)
  })

  it('can look up sticker by zero-padded number', () => {
    const s = CATALOG_MAP.get('001')
    expect(s).toBeDefined()
    expect(s!.number).toBe('001')
  })

  it('returns undefined for non-existent number', () => {
    expect(CATALOG_MAP.get('980')).toBeDefined() // 980 is the last sticker
    expect(CATALOG_MAP.get('000')).toBeUndefined()
    expect(CATALOG_MAP.get('981')).toBeUndefined()
  })
})

describe('ALL_SECTIONS', () => {
  it('includes Introducción', () => {
    expect(ALL_SECTIONS).toContain('Introducción')
  })

  it('includes Mexico', () => {
    expect(ALL_SECTIONS).toContain('Mexico')
  })

  it('includes Argentina', () => {
    expect(ALL_SECTIONS).toContain('Argentina')
  })

  it('includes Estrellas del Torneo', () => {
    expect(ALL_SECTIONS).toContain('Estrellas del Torneo')
  })

  it('includes Glorias Mundialistas', () => {
    expect(ALL_SECTIONS).toContain('Glorias Mundialistas')
  })

  it('has no duplicate sections', () => {
    const unique = new Set(ALL_SECTIONS)
    expect(unique.size).toBe(ALL_SECTIONS.length)
  })
})

describe('badge stickers', () => {
  const badgeStickers = STICKER_CATALOG.filter((s) => s.sticker_type === 'badge')

  it('has badge stickers', () => {
    expect(badgeStickers.length).toBeGreaterThan(0)
  })

  it('every badge sticker has player_name containing Crest, Escudo, or Badge', () => {
    for (const s of badgeStickers) {
      const name = s.player_name
      const hasBadgeKeyword =
        name.includes('Crest') || name.includes('Escudo') || name.includes('Badge')
      expect(hasBadgeKeyword, `Badge sticker "${name}" (${s.number}) missing keyword`).toBe(true)
    }
  })
})

describe('team stickers section consistency', () => {
  it('stickers with a team name have section equal to their team name', () => {
    const teamStickers = STICKER_CATALOG.filter(
      (s) => s.sticker_type === 'player' || s.sticker_type === 'badge' || s.sticker_type === 'logo'
    )
    for (const s of teamStickers) {
      expect(s.section).toBe(s.team)
    }
  })
})
