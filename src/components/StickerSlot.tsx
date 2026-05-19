'use client'

import type { StickerDef } from '@/lib/catalog'
import { TEAM_CODES } from '@/lib/catalog'

interface StickerSlotProps {
  sticker: StickerDef
  quantity: number // 0 = missing, 1 = owned, 2+ = duplicate
  onClick?: () => void
}

const TYPE_BORDER: Record<StickerDef['sticker_type'], string> = {
  logo: '1px solid var(--gold)',
  badge: '1px solid var(--sapphire)',
  special: '1px solid var(--violet)',
  player: '1px solid var(--emerald)',
}

const TYPE_BG: Record<StickerDef['sticker_type'], string> = {
  logo: 'linear-gradient(145deg, rgba(245,158,11,0.15), rgba(17,24,39,1))',
  badge: 'linear-gradient(145deg, rgba(59,130,246,0.12), rgba(17,24,39,1))',
  special: 'linear-gradient(145deg, rgba(139,92,246,0.15), rgba(17,24,39,1))',
  player: 'linear-gradient(145deg, rgba(16,185,129,0.12), rgba(17,24,39,1))',
}

export default function StickerSlot({ sticker, quantity, onClick }: StickerSlotProps) {
  const missing = quantity === 0
  const isDuplicate = quantity >= 2
  const teamCode = TEAM_CODES[sticker.team] ?? sticker.team.slice(0, 3).toUpperCase()

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '80px',
    height: '100px',
    borderRadius: '8px',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    overflow: 'hidden',
    flexShrink: 0,
    ...(missing
      ? {
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: 0.4,
        }
      : {
          background: TYPE_BG[sticker.sticker_type],
          border: TYPE_BORDER[sticker.sticker_type],
          boxShadow: isDuplicate
            ? '0 0 8px rgba(239,68,68,0.25)'
            : '0 2px 8px rgba(0,0,0,0.3)',
        }),
  }

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={e => {
        if (onClick) {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'scale(1.08)'
          el.style.boxShadow = missing
            ? 'none'
            : '0 4px 16px rgba(0,0,0,0.5)'
        }
      }}
      onMouseLeave={e => {
        if (onClick) {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'scale(1)'
          el.style.boxShadow = isDuplicate
            ? '0 0 8px rgba(239,68,68,0.25)'
            : missing
            ? 'none'
            : '0 2px 8px rgba(0,0,0,0.3)'
        }
      }}
      title={missing ? `#${sticker.number} — missing` : `${sticker.player_name} (${teamCode}) ×${quantity}`}
    >
      {/* Duplicate badge */}
      {isDuplicate && (
        <div
          style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            background: 'var(--crimson)',
            color: '#fff',
            fontSize: '0.6rem',
            fontWeight: 800,
            borderRadius: '999px',
            padding: '1px 4px',
            lineHeight: 1.4,
            zIndex: 2,
          }}
        >
          ×{quantity}
        </div>
      )}

      {/* Sticker number */}
      <div
        style={{
          fontSize: '0.55rem',
          fontWeight: 700,
          color: missing ? 'var(--text-muted)' : 'var(--text-secondary)',
          letterSpacing: '0.03em',
          alignSelf: 'flex-start',
          lineHeight: 1,
        }}
      >
        {sticker.number}
      </div>

      {/* Center: icon or player initial */}
      <div
        style={{
          fontSize: missing ? '1.4rem' : '1.1rem',
          lineHeight: 1,
          color: missing ? 'var(--text-muted)' : 'var(--text-primary)',
          textAlign: 'center',
        }}
      >
        {missing ? '?' : sticker.sticker_type === 'logo' ? '🏆' : sticker.sticker_type === 'badge' ? '🛡️' : sticker.sticker_type === 'special' ? '⭐' : '⚽'}
      </div>

      {/* Player name */}
      <div
        style={{
          fontSize: '0.52rem',
          fontWeight: 600,
          color: missing ? 'var(--text-muted)' : 'var(--text-primary)',
          textAlign: 'center',
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          wordBreak: 'break-word',
          width: '100%',
        }}
      >
        {missing ? '???' : sticker.player_name}
      </div>

      {/* Team code */}
      <div
        style={{
          fontSize: '0.5rem',
          color: missing ? 'var(--text-muted)' : 'var(--text-secondary)',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
          alignSelf: 'flex-end',
        }}
      >
        {missing ? '---' : teamCode}
      </div>
    </div>
  )
}
