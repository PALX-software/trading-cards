'use client'

import { useMemo } from 'react'
import { STICKER_CATALOG, TEAM_CODES, getCatalogByTeam } from '@/lib/catalog'
import type { StickerDef } from '@/lib/catalog'
import StickerSlot from './StickerSlot'

interface AlbumGridProps {
  userStickers: Map<string, number> // sticker_number → quantity
  filterTeam?: string // 'ALL' or undefined → show all; otherwise filter to this team
  onStickerClick?: (sticker: StickerDef, owned: boolean, quantity: number) => void
}

export default function AlbumGrid({ userStickers, filterTeam, onStickerClick }: AlbumGridProps) {
  const sections = useMemo(() => {
    // Choose which stickers to show
    const catalog =
      !filterTeam || filterTeam === 'ALL'
        ? STICKER_CATALOG
        : getCatalogByTeam(filterTeam)

    // Group by section
    const map = new Map<string, StickerDef[]>()
    for (const s of catalog) {
      const sec = s.section
      if (!map.has(sec)) map.set(sec, [])
      map.get(sec)!.push(s)
    }

    // Put SPECIAL at the end
    const entries = Array.from(map.entries())
    entries.sort(([a], [b]) => {
      if (a === 'SPECIAL') return 1
      if (b === 'SPECIAL') return -1
      return a.localeCompare(b)
    })

    return entries
  }, [filterTeam])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {sections.map(([section, stickers]) => {
        const teamCode = TEAM_CODES[section] ?? section
        const ownedInSection = stickers.filter(s => (userStickers.get(s.number) ?? 0) > 0).length

        return (
          <div key={section}>
            {/* Section header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--gold)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {section === 'SPECIAL' ? '⭐ ESPECIALES' : `${teamCode} — ${section}`}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span
                style={{
                  fontSize: '0.7rem',
                  color: ownedInSection === stickers.length ? 'var(--emerald)' : 'var(--text-muted)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {ownedInSection}/{stickers.length}
              </span>
            </div>

            {/* Sticker grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {stickers.map(sticker => {
                const quantity = userStickers.get(sticker.number) ?? 0
                const owned = quantity > 0
                return (
                  <StickerSlot
                    key={sticker.number}
                    sticker={sticker}
                    quantity={quantity}
                    onClick={
                      onStickerClick
                        ? () => onStickerClick(sticker, owned, quantity)
                        : undefined
                    }
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
