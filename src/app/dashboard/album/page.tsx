'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import AlbumGrid from '@/components/AlbumGrid'
import { STICKER_CATALOG, TOTAL_STICKERS, TEAM_CODES } from '@/lib/catalog'
import type { StickerDef } from '@/lib/catalog'
import { BookOpen, ChevronLeft, Trophy } from 'lucide-react'

// Deduplicate sections in sidebar order
const ALL_SECTIONS: string[] = (() => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const s of STICKER_CATALOG) {
    if (!seen.has(s.section)) {
      seen.add(s.section)
      result.push(s.section)
    }
  }
  result.sort((a, b) => {
    if (a === 'SPECIAL') return 1
    if (b === 'SPECIAL') return -1
    return a.localeCompare(b)
  })
  return result
})()

export default function AlbumPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [rawStickers, setRawStickers] = useState<{ sticker_number: string; quantity: number }[]>([])
  const [activeSection, setActiveSection] = useState<string>(ALL_SECTIONS[0] ?? '')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { router.push('/auth/login'); return }

      const { data } = await supabase
        .from('user_stickers')
        .select('sticker_number, quantity')
        .eq('user_id', authUser.id)

      setRawStickers(data || [])
      setLoading(false)
    })
  }, [])

  const stickerMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of rawStickers) {
      m.set(s.sticker_number, s.quantity)
    }
    return m
  }, [rawStickers])

  const ownedCount = rawStickers.length
  const completionPct = Math.round((ownedCount / TOTAL_STICKERS) * 100)

  const circumference = 283
  const offset = circumference - (completionPct / 100) * circumference

  const scrollToSection = (section: string) => {
    setActiveSection(section)
    const el = sectionRefs.current[section]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <BookOpen size={40} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Cargando álbum...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        {/* Breadcrumb + stats bar */}
        <div className="page-header" style={{ paddingBottom: '1.25rem' }}>
          <div className="container-main">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Dashboard</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)' }}>Álbum</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn btn-secondary btn-sm">
                <ChevronLeft size={14} /> Volver
              </Link>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                📒 <span className="gradient-text">Álbum FIFA World Cup 2026</span>
              </h1>

              {/* Compact stats */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald)' }}>{ownedCount}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Obtenidas</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{TOTAL_STICKERS}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold)' }}>{completionPct}%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Completado</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* Sidebar */}
            <aside
              style={{
                width: '160px',
                flexShrink: 0,
                position: 'sticky',
                top: '5rem',
                maxHeight: 'calc(100vh - 6rem)',
                overflowY: 'auto',
              }}
            >
              <div className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {/* SVG ring in sidebar */}
                <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--gold)">
                      {completionPct}%
                    </text>
                  </svg>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{ownedCount}/{TOTAL_STICKERS}</div>
                </div>

                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.5rem' }} />

                {ALL_SECTIONS.map(section => {
                  const teamCode = TEAM_CODES[section] ?? section.slice(0, 3)
                  const isActive = activeSection === section
                  return (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.3rem 0.5rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: isActive ? 700 : 500,
                        background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
                        color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {section === 'SPECIAL' ? '⭐ ESPECIALES' : `${teamCode} ${section}`}
                    </button>
                  )
                })}
              </div>
            </aside>

            {/* Main album area */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {ALL_SECTIONS.map(section => {
                const stickersInSection = STICKER_CATALOG.filter(s => s.section === section)
                const ownedInSection = stickersInSection.filter(s => (stickerMap.get(s.number) ?? 0) > 0).length
                const teamCode = TEAM_CODES[section] ?? section

                return (
                  <div
                    key={section}
                    ref={el => { sectionRefs.current[section] = el }}
                    style={{ marginBottom: '3rem', scrollMarginTop: '5.5rem' }}
                  >
                    {/* Sticky section header */}
                    <div
                      style={{
                        position: 'sticky',
                        top: '4.25rem',
                        zIndex: 10,
                        background: 'var(--bg-primary)',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid var(--border)',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold)' }}>
                        {section === 'SPECIAL' ? '⭐ ESPECIALES' : `${teamCode} — ${section}`}
                      </span>
                      <span className={`badge ${ownedInSection === stickersInSection.length ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.7rem' }}>
                        {ownedInSection}/{stickersInSection.length}
                      </span>
                    </div>

                    {/* Grid for this section only */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                        gap: '0.5rem',
                      }}
                    >
                      {stickersInSection.map(sticker => {
                        const quantity = stickerMap.get(sticker.number) ?? 0
                        return (
                          <div key={sticker.number} style={{ display: 'flex', justifyContent: 'center' }}>
                            {/* Import lazily here to avoid circular issues — just inline the logic */}
                            <StickerSlotInline sticker={sticker} quantity={quantity} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// Inline minimal sticker slot to avoid extra import complexity in this page
function StickerSlotInline({ sticker, quantity }: { sticker: StickerDef; quantity: number }) {
  const missing = quantity === 0
  const isDuplicate = quantity >= 2
  const teamCode = TEAM_CODES[sticker.team] ?? sticker.team.slice(0, 3).toUpperCase()

  const TYPE_BG: Record<string, string> = {
    logo: 'linear-gradient(145deg, rgba(245,158,11,0.15), rgba(17,24,39,1))',
    badge: 'linear-gradient(145deg, rgba(59,130,246,0.12), rgba(17,24,39,1))',
    special: 'linear-gradient(145deg, rgba(139,92,246,0.15), rgba(17,24,39,1))',
    player: 'linear-gradient(145deg, rgba(16,185,129,0.12), rgba(17,24,39,1))',
  }
  const TYPE_BORDER: Record<string, string> = {
    logo: '1px solid var(--gold)',
    badge: '1px solid var(--sapphire)',
    special: '1px solid var(--violet)',
    player: '1px solid var(--emerald)',
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '80px',
        height: '100px',
        borderRadius: '8px',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        flexShrink: 0,
        ...(missing
          ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0.4 }
          : { background: TYPE_BG[sticker.sticker_type] ?? TYPE_BG.player, border: TYPE_BORDER[sticker.sticker_type] ?? TYPE_BORDER.player }),
      }}
      title={missing ? `#${sticker.number} — faltante` : `${sticker.player_name} ×${quantity}`}
    >
      {isDuplicate && (
        <div style={{ position: 'absolute', top: '3px', right: '3px', background: 'var(--crimson)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, borderRadius: '999px', padding: '1px 4px', lineHeight: 1.4, zIndex: 2 }}>
          ×{quantity}
        </div>
      )}
      <div style={{ fontSize: '0.55rem', fontWeight: 700, color: missing ? 'var(--text-muted)' : 'var(--text-secondary)', alignSelf: 'flex-start', lineHeight: 1 }}>
        {sticker.number}
      </div>
      <div style={{ fontSize: missing ? '1.4rem' : '1.1rem', lineHeight: 1, textAlign: 'center' }}>
        {missing ? '?' : sticker.sticker_type === 'logo' ? '🏆' : sticker.sticker_type === 'badge' ? '🛡️' : sticker.sticker_type === 'special' ? '⭐' : '⚽'}
      </div>
      <div style={{ fontSize: '0.52rem', fontWeight: 600, color: missing ? 'var(--text-muted)' : 'var(--text-primary)', textAlign: 'center', lineHeight: 1.2, overflow: 'hidden', wordBreak: 'break-word', width: '100%', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
        {missing ? '???' : sticker.player_name}
      </div>
      <div style={{ fontSize: '0.5rem', color: missing ? 'var(--text-muted)' : 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' as const, alignSelf: 'flex-end' }}>
        {missing ? '---' : teamCode}
      </div>
    </div>
  )
}
