'use client'

import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import { STICKER_CATALOG, TOTAL_STICKERS, TEAM_CODES } from '@/lib/catalog'
import type { StickerDef } from '@/lib/catalog'
import { BookOpen, ChevronLeft, Plus, Minus, ArrowLeftRight, X, Check } from 'lucide-react'

const ALL_SECTIONS: string[] = (() => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const s of STICKER_CATALOG) {
    if (!seen.has(s.section)) { seen.add(s.section); result.push(s.section) }
  }
  result.sort((a, b) => {
    if (a === 'SPECIAL') return 1
    if (b === 'SPECIAL') return -1
    return a.localeCompare(b)
  })
  return result
})()

const TYPE_BG: Record<string, string> = {
  logo:    'linear-gradient(145deg, rgba(245,158,11,0.18), rgba(17,24,39,1))',
  badge:   'linear-gradient(145deg, rgba(59,130,246,0.15), rgba(17,24,39,1))',
  special: 'linear-gradient(145deg, rgba(139,92,246,0.18), rgba(17,24,39,1))',
  player:  'linear-gradient(145deg, rgba(16,185,129,0.15), rgba(17,24,39,1))',
}
const TYPE_BORDER: Record<string, string> = {
  logo:    '1px solid var(--gold)',
  badge:   '1px solid var(--sapphire)',
  special: '1px solid var(--violet)',
  player:  '1px solid var(--emerald)',
}

interface Selected { sticker: StickerDef; quantity: number }

export default function AlbumPage() {
  const router  = useRouter()
  const supabase = createClient()

  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [userId,   setUserId]   = useState<string | null>(null)
  const [rawStickers, setRawStickers] = useState<{ sticker_number: string; quantity: number }[]>([])
  const [selected, setSelected] = useState<Selected | null>(null)
  const [activeSection, setActiveSection] = useState<string>(ALL_SECTIONS[0] ?? '')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { router.push('/auth/login'); return }
      setUserId(authUser.id)
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
    for (const s of rawStickers) m.set(s.sticker_number, s.quantity)
    return m
  }, [rawStickers])

  const ownedCount    = rawStickers.reduce((acc, s) => acc + (s.quantity > 0 ? 1 : 0), 0)
  const dupCount      = rawStickers.reduce((acc, s) => acc + Math.max(0, s.quantity - 1), 0)
  const completionPct = Math.round((ownedCount / TOTAL_STICKERS) * 100)
  const circumference = 283
  const offset        = circumference - (completionPct / 100) * circumference

  // ── Supabase mutations ───────────────────────────────────────────────────

  const mutate = useCallback((number: string, newQty: number) => {
    setRawStickers(prev => {
      const exists = prev.find(s => s.sticker_number === number)
      if (newQty <= 0) return prev.filter(s => s.sticker_number !== number)
      if (exists)      return prev.map(s => s.sticker_number === number ? { ...s, quantity: newQty } : s)
      return [...prev, { sticker_number: number, quantity: newQty }]
    })
    if (selected?.sticker.number === number) {
      setSelected(prev => prev ? { ...prev, quantity: newQty } : null)
      if (newQty <= 0) setSelected(null)
    }
  }, [selected])

  const markOwned = useCallback(async (sticker: StickerDef) => {
    if (!userId) return
    setSaving(true)
    mutate(sticker.number, 1)
    const { error } = await supabase.from('user_stickers').upsert(
      { user_id: userId, sticker_number: sticker.number, quantity: 1 },
      { onConflict: 'user_id,sticker_number' }
    )
    if (error) { showToast('Error al guardar', 'error'); mutate(sticker.number, 0) }
    else showToast(`✓ ${sticker.player_name} agregada`, 'success')
    setSaving(false)
  }, [userId, mutate])

  const addDuplicate = useCallback(async (sticker: StickerDef, currentQty: number) => {
    if (!userId) return
    setSaving(true)
    const newQty = currentQty + 1
    mutate(sticker.number, newQty)
    const { error } = await supabase.from('user_stickers')
      .update({ quantity: newQty })
      .eq('user_id', userId)
      .eq('sticker_number', sticker.number)
    if (error) { showToast('Error al guardar', 'error'); mutate(sticker.number, currentQty) }
    else showToast(`＋ Repetida registrada (×${newQty})`, 'success')
    setSaving(false)
  }, [userId, mutate])

  const removeOne = useCallback(async (sticker: StickerDef, currentQty: number) => {
    if (!userId) return
    setSaving(true)
    const newQty = currentQty - 1
    mutate(sticker.number, newQty)
    const { error } = newQty === 0
      ? await supabase.from('user_stickers').delete().eq('user_id', userId).eq('sticker_number', sticker.number)
      : await supabase.from('user_stickers').update({ quantity: newQty }).eq('user_id', userId).eq('sticker_number', sticker.number)
    if (error) { showToast('Error al guardar', 'error'); mutate(sticker.number, currentQty) }
    else showToast(newQty === 0 ? `Estampa quitada del álbum` : `Repetida reducida (×${newQty})`, 'info')
    setSaving(false)
  }, [userId, mutate])

  const handleStickerClick = useCallback((sticker: StickerDef, quantity: number) => {
    setSelected({ sticker, quantity })
  }, [])

  const scrollToSection = (section: string) => {
    setActiveSection(section)
    sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) return (
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

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>

        {/* Header */}
        <div className="page-header" style={{ paddingBottom: '1.25rem' }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Dashboard</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)' }}>Álbum</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn btn-secondary btn-sm"><ChevronLeft size={14} /> Volver</Link>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>📒 <span className="gradient-text">Álbum FIFA World Cup 2026</span></h1>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {[
                  { value: ownedCount,    label: 'Obtenidas', color: 'var(--emerald)' },
                  { value: dupCount,      label: 'Repetidas',  color: 'var(--crimson)' },
                  { value: TOTAL_STICKERS, label: 'Total',      color: 'var(--text-secondary)' },
                  { value: `${completionPct}%`, label: 'Completado', color: 'var(--gold)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint */}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              Toca cualquier estampa para marcarla como obtenida, agregar repetidas o iniciar un intercambio.
            </p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

            {/* Sidebar */}
            <aside style={{ width: '160px', flexShrink: 0, position: 'sticky', top: '5rem', maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}>
              <div className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--gold)" strokeWidth="8"
                      strokeDasharray={circumference} strokeDashoffset={offset}
                      strokeLinecap="round" transform="rotate(-90 50 50)" />
                    <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--gold)">{completionPct}%</text>
                  </svg>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{ownedCount}/{TOTAL_STICKERS}</div>
                </div>
                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.5rem' }} />
                {ALL_SECTIONS.map(section => {
                  const stickersInSection = STICKER_CATALOG.filter(s => s.section === section)
                  const ownedInSection    = stickersInSection.filter(s => (stickerMap.get(s.number) ?? 0) > 0).length
                  const teamCode          = TEAM_CODES[section] ?? section.slice(0, 3)
                  const isActive          = activeSection === section
                  return (
                    <button key={section} onClick={() => scrollToSection(section)} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      width: '100%', padding: '0.3rem 0.5rem', borderRadius: '0.375rem', border: 'none',
                      cursor: 'pointer', fontSize: '0.7rem', fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
                      color: isActive ? 'var(--gold)' : 'var(--text-secondary)', transition: 'all 0.15s ease',
                    }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {section === 'SPECIAL' ? '⭐ ESPECIALES' : `${teamCode} ${section}`}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: ownedInSection === stickersInSection.length ? 'var(--emerald)' : 'var(--text-muted)', flexShrink: 0, marginLeft: '4px' }}>
                        {ownedInSection}/{stickersInSection.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </aside>

            {/* Main album */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {ALL_SECTIONS.map(section => {
                const stickersInSection = STICKER_CATALOG.filter(s => s.section === section)
                const ownedInSection    = stickersInSection.filter(s => (stickerMap.get(s.number) ?? 0) > 0).length
                const teamCode          = TEAM_CODES[section] ?? section
                return (
                  <div key={section} ref={el => { sectionRefs.current[section] = el }} style={{ marginBottom: '3rem', scrollMarginTop: '5.5rem' }}>
                    <div style={{ position: 'sticky', top: '4.25rem', zIndex: 10, background: 'var(--bg-primary)', paddingTop: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold)' }}>
                        {section === 'SPECIAL' ? '⭐ ESPECIALES' : `${teamCode} — ${section}`}
                      </span>
                      <span className={`badge ${ownedInSection === stickersInSection.length ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.7rem' }}>
                        {ownedInSection}/{stickersInSection.length}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
                      {stickersInSection.map(sticker => {
                        const quantity   = stickerMap.get(sticker.number) ?? 0
                        const isSelected = selected?.sticker.number === sticker.number
                        const missing    = quantity === 0
                        return (
                          <StickerCard
                            key={sticker.number}
                            sticker={sticker}
                            quantity={quantity}
                            isSelected={isSelected}
                            onClick={() => handleStickerClick(sticker, quantity)}
                          />
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

      {/* ── Action panel (bottom sheet) ──────────────────────────────────── */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}
        >
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelected(null)} />

          {/* Panel */}
          <div style={{ position: 'relative', zIndex: 1, background: 'var(--bg-card)', borderTop: '1px solid var(--border-gold)', borderRadius: '1rem 1rem 0 0', padding: '1.5rem', maxWidth: '560px', width: '100%', margin: '0 auto' }}>

            {/* Close */}
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
              <X size={20} />
            </button>

            {/* Sticker info */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              {/* Mini sticker preview */}
              <div style={{
                width: '64px', height: '80px', borderRadius: '8px', flexShrink: 0, padding: '5px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                background: selected.quantity === 0 ? 'rgba(255,255,255,0.04)' : (TYPE_BG[selected.sticker.sticker_type] ?? TYPE_BG.player),
                border: selected.quantity === 0 ? '1px solid rgba(255,255,255,0.1)' : (TYPE_BORDER[selected.sticker.sticker_type] ?? TYPE_BORDER.player),
              }}>
                <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--text-secondary)', alignSelf: 'flex-start' }}>{selected.sticker.number}</span>
                <span style={{ fontSize: '1.5rem' }}>{selected.sticker.sticker_type === 'logo' ? '🏆' : selected.sticker.sticker_type === 'badge' ? '🛡️' : selected.sticker.sticker_type === 'special' ? '⭐' : '⚽'}</span>
                <span style={{ fontSize: '0.42rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-word', width: '100%' }}>{selected.sticker.player_name}</span>
              </div>

              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{selected.sticker.player_name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>#{selected.sticker.number} · {selected.sticker.team} · {selected.sticker.section}</div>
                {selected.quantity === 0 && <div style={{ marginTop: '0.5rem' }}><span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>No la tienes</span></div>}
                {selected.quantity === 1 && <div style={{ marginTop: '0.5rem' }}><span className="badge badge-green" style={{ fontSize: '0.7rem' }}>✓ En tu álbum</span></div>}
                {selected.quantity >= 2 && <div style={{ marginTop: '0.5rem' }}><span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(239,68,68,0.15)', color: 'var(--crimson)' }}>×{selected.quantity} — tienes repetidas</span></div>}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {selected.quantity === 0 ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={saving}
                  onClick={() => markOwned(selected.sticker)}
                >
                  <Check size={16} />
                  {saving ? 'Guardando...' : '¡La tengo! Agregar al álbum'}
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={saving}
                    onClick={() => addDuplicate(selected.sticker, selected.quantity)}
                  >
                    <Plus size={16} />
                    {saving ? 'Guardando...' : `Tengo otra repetida (quedarían ×${selected.quantity + 1})`}
                  </button>

                  {selected.quantity >= 2 && (
                    <Link
                      href={`/trades/new?sticker=${selected.sticker.number}`}
                      className="btn"
                      style={{ width: '100%', justifyContent: 'center', background: 'rgba(16,185,129,0.12)', color: 'var(--emerald)', border: '1px solid rgba(16,185,129,0.25)' }}
                      onClick={() => setSelected(null)}
                    >
                      <ArrowLeftRight size={16} />
                      Buscar intercambio con esta repetida
                    </Link>
                  )}

                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', color: 'var(--crimson)', borderColor: 'rgba(239,68,68,0.2)' }}
                    disabled={saving}
                    onClick={() => removeOne(selected.sticker, selected.quantity)}
                  >
                    <Minus size={16} />
                    {saving ? 'Guardando...' : selected.quantity === 1 ? 'Quitar del álbum' : 'Quitar una repetida'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Sticker card component ────────────────────────────────────────────────

function StickerCard({ sticker, quantity, isSelected, onClick }: {
  sticker: StickerDef
  quantity: number
  isSelected: boolean
  onClick: () => void
}) {
  const missing     = quantity === 0
  const isDuplicate = quantity >= 2
  const teamCode    = TEAM_CODES[sticker.team] ?? sticker.team.slice(0, 3).toUpperCase()

  return (
    <div
      onClick={onClick}
      title={missing ? `#${sticker.number} — faltante` : `${sticker.player_name} ×${quantity}`}
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
        cursor: 'pointer',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease',
        overflow: 'hidden',
        flexShrink: 0,
        outline: isSelected ? '2px solid var(--gold)' : 'none',
        outlineOffset: '2px',
        ...(missing
          ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0.45 }
          : { background: TYPE_BG[sticker.sticker_type] ?? TYPE_BG.player, border: TYPE_BORDER[sticker.sticker_type] ?? TYPE_BORDER.player, opacity: 1 }
        ),
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'scale(1.08)'
        el.style.opacity = '1'
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'scale(1)'
        el.style.opacity = missing ? '0.45' : '1'
        el.style.boxShadow = isDuplicate ? '0 0 8px rgba(239,68,68,0.25)' : missing ? 'none' : '0 2px 8px rgba(0,0,0,0.3)'
      }}
    >
      {/* Duplicate badge */}
      {isDuplicate && (
        <div style={{ position: 'absolute', top: '3px', right: '3px', background: 'var(--crimson)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, borderRadius: '999px', padding: '1px 4px', lineHeight: 1.4, zIndex: 2 }}>
          ×{quantity}
        </div>
      )}
      {/* Owned checkmark */}
      {quantity === 1 && (
        <div style={{ position: 'absolute', top: '3px', right: '3px', background: 'var(--emerald)', color: '#fff', fontSize: '0.55rem', fontWeight: 800, borderRadius: '999px', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          ✓
        </div>
      )}
      <div style={{ fontSize: '0.55rem', fontWeight: 700, color: missing ? 'var(--text-muted)' : 'var(--text-secondary)', alignSelf: 'flex-start', lineHeight: 1 }}>{sticker.number}</div>
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
