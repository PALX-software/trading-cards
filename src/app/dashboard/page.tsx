'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import TradingCard from '@/components/TradingCard'
import ToastContainer from '@/components/Toast'
import AlbumGrid from '@/components/AlbumGrid'
import type { Card, Auction, Payment, Profile } from '@/lib/types'
import { PRICING } from '@/lib/types'
import { STICKER_CATALOG, TOTAL_STICKERS, TEAM_CODES, CATALOG_MAP } from '@/lib/catalog'
import { useI18n } from '@/lib/i18n'
import {
  Package, Gavel, CreditCard,
  Plus, TrendingUp, Trophy, ShoppingBag,
  BookOpen, Copy, RefreshCw, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

type TabId = 'overview' | 'album' | 'duplicates' | 'trades' | 'auctions' | 'payments'

// Pre-compute all unique team names from catalog for team filter
const CATALOG_TEAMS: string[] = (() => {
  const seen = new Set<string>()
  for (const s of STICKER_CATALOG) {
    if (s.team !== 'FIFA') seen.add(s.team)
  }
  return Array.from(seen).sort()
})()

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { lang } = useI18n()

  const [user, setUser] = useState<Profile | null>(null)
  const [myCards, setMyCards] = useState<Card[]>([])
  const [myAuctions, setMyAuctions] = useState<Auction[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [rawStickers, setRawStickers] = useState<{ sticker_number: string; quantity: number }[]>([])
  const [tab, setTab] = useState<TabId>('overview')
  const [loading, setLoading] = useState(true)
  const [albumTeamFilter, setAlbumTeamFilter] = useState<string>('ALL')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { router.push('/auth/login'); return }

      const [profileRes, cardsRes, auctionsRes, paymentsRes, stickerRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', authUser.id).single(),
        supabase.from('cards').select('*').eq('owner_id', authUser.id).order('created_at', { ascending: false }),
        supabase.from('auctions').select('*, card:cards(*), bids(id)').eq('seller_id', authUser.id).order('created_at', { ascending: false }),
        supabase.from('payments').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }),
        supabase.from('user_stickers').select('sticker_number, quantity').eq('user_id', authUser.id),
      ])

      setUser(profileRes.data)
      setMyCards(cardsRes.data || [])
      setMyAuctions(auctionsRes.data || [])
      setPayments(paymentsRes.data || [])
      setRawStickers(stickerRes.data || [])
      setLoading(false)
    })
  }, [])

  // Build sticker map
  const stickerMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of rawStickers) {
      m.set(s.sticker_number, s.quantity)
    }
    return m
  }, [rawStickers])

  // Derived sticker stats
  const ownedCount = rawStickers.length
  const completionPct = Math.round((ownedCount / TOTAL_STICKERS) * 100)
  const duplicates = rawStickers.filter(s => s.quantity > 1)

  // Team breakdown for overview
  const teamBreakdown = useMemo(() => {
    return CATALOG_TEAMS.map(team => {
      const teamStickers = STICKER_CATALOG.filter(s => s.team === team)
      const owned = teamStickers.filter(s => (stickerMap.get(s.number) ?? 0) > 0).length
      return { team, owned, total: teamStickers.length }
    })
  }, [stickerMap])

  const circumference = 283
  const offset = circumference - (completionPct / 100) * circumference

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Trophy size={40} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>
              {lang === 'es' ? 'Cargando tu colección...' : 'Loading your collection...'}
            </p>
          </div>
        </div>
      </>
    )
  }

  if (!user) return null

  const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const activeAuctions = myAuctions.filter(a => a.status === 'active').length
  const cardsForSale = myCards.filter(c => c.is_for_sale).length

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: lang === 'es' ? '◎ Resumen' : '◎ Overview' },
    { id: 'album', label: '📒 Álbum' },
    { id: 'duplicates', label: '🔁 Repetidas' },
    { id: 'trades', label: '🔄 Intercambios' },
    { id: 'auctions', label: '🔨 Subastas' },
    { id: 'payments', label: lang === 'es' ? '💳 Pagos' : '💳 Payments' },
  ]

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        {/* Header */}
        <div className="page-header">
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="avatar" style={{ width: '3.5rem', height: '3.5rem', fontSize: '1.25rem' }}>
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {lang === 'es' ? 'Bienvenido, ' : 'Welcome back, '}
                  <span className="gradient-text">@{user.username}</span>
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  {user.membership_paid && (
                    <span className="badge badge-gold">✦ {lang === 'es' ? 'Miembro' : 'Member'}</span>
                  )}
                  <span className="badge badge-blue">
                    <Package size={12} /> {myCards.length} {lang === 'es' ? 'tarjetas' : 'cards'}
                  </span>
                  <span className="badge badge-green">
                    <BookOpen size={12} /> {ownedCount}/{TOTAL_STICKERS} {lang === 'es' ? 'estampas' : 'stickers'}
                  </span>
                  <span className="badge badge-purple">
                    <Gavel size={12} /> {myAuctions.length} {lang === 'es' ? 'subastas' : 'auctions'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '1.5rem' }}>
          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                className={`tab ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
                id={`dashboard-tab-${id}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ================================================================
              OVERVIEW TAB
              ================================================================ */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Stats grid — sticker stats first, then existing */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {/* NEW: Total stickers */}
                <div className="stat-card">
                  <BookOpen size={20} style={{ color: 'var(--emerald)', margin: '0 auto 0.5rem' }} />
                  <div className="stat-value" style={{ color: 'var(--emerald)', fontSize: '1.5rem' }}>
                    {ownedCount}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/{TOTAL_STICKERS}</span>
                  </div>
                  <div className="stat-label">{lang === 'es' ? 'Estampas' : 'Stickers'}</div>
                </div>

                {/* NEW: Duplicates */}
                <div className="stat-card">
                  <Copy size={20} style={{ color: 'var(--crimson)', margin: '0 auto 0.5rem' }} />
                  <div className="stat-value" style={{ color: 'var(--crimson)' }}>{duplicates.length}</div>
                  <div className="stat-label">{lang === 'es' ? 'Repetidas' : 'Duplicates'}</div>
                </div>

                {/* Existing stats */}
                <div className="stat-card">
                  <Package size={20} style={{ color: 'var(--sapphire)', margin: '0 auto 0.5rem' }} />
                  <div className="stat-value" style={{ color: 'var(--sapphire)' }}>{myCards.length}</div>
                  <div className="stat-label">{lang === 'es' ? 'Total Tarjetas' : 'Total Cards'}</div>
                </div>

                <div className="stat-card">
                  <ShoppingBag size={20} style={{ color: 'var(--emerald)', margin: '0 auto 0.5rem' }} />
                  <div className="stat-value" style={{ color: 'var(--emerald)' }}>{cardsForSale}</div>
                  <div className="stat-label">{lang === 'es' ? 'En Venta' : 'Cards For Sale'}</div>
                </div>

                <div className="stat-card">
                  <Gavel size={20} style={{ color: 'var(--gold)', margin: '0 auto 0.5rem' }} />
                  <div className="stat-value" style={{ color: 'var(--gold)' }}>{activeAuctions}</div>
                  <div className="stat-label">{lang === 'es' ? 'Subastas Activas' : 'Active Auctions'}</div>
                </div>

                <div className="stat-card">
                  <CreditCard size={20} style={{ color: 'var(--violet)', margin: '0 auto 0.5rem' }} />
                  <div className="stat-value" style={{ color: 'var(--violet)', fontSize: '1.4rem' }}>
                    ${totalSpent.toFixed(0)}
                  </div>
                  <div className="stat-label">{lang === 'es' ? 'Total Gastado MXN' : 'Total Spent MXN'}</div>
                </div>
              </div>

              {/* Album completion section */}
              <div className="card">
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                  {lang === 'es' ? '📒 Progreso del Álbum' : '📒 Album Progress'}
                </h2>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* SVG circle progress */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <svg width="120" height="120" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={completionPct === 100 ? 'var(--emerald)' : 'var(--gold)'}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                      />
                      <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill={completionPct === 100 ? 'var(--emerald)' : 'var(--gold)'}>
                        {completionPct}%
                      </text>
                      <text x="50" y="60" textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                        completado
                      </text>
                    </svg>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      {ownedCount} / {TOTAL_STICKERS} {lang === 'es' ? 'estampas' : 'stickers'}
                    </p>
                    <Link
                      href="/dashboard/album"
                      className="btn btn-ghost btn-sm"
                      style={{ marginTop: '0.75rem', display: 'inline-flex' }}
                    >
                      {lang === 'es' ? 'Ver álbum completo' : 'View full album'} <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Team breakdown grid */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {lang === 'es' ? 'Por Equipo' : 'By Team'}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
                      {teamBreakdown.slice(0, 16).map(({ team, owned, total }) => {
                        const pct = Math.round((owned / total) * 100)
                        const code = TEAM_CODES[team] ?? team.slice(0, 3).toUpperCase()
                        return (
                          <div key={team} style={{ padding: '0.375rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                {code}
                              </span>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                {owned}/{total}
                              </span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${pct}%`,
                                  background: pct === 100 ? 'var(--emerald)' : 'var(--gold)',
                                  borderRadius: '2px',
                                  transition: 'width 0.4s ease',
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {teamBreakdown.length > 16 && (
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        +{teamBreakdown.length - 16} {lang === 'es' ? 'equipos más' : 'more teams'}…
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Membership status */}
              {!user.membership_paid && (
                <div className="card-gold" style={{ textAlign: 'center', padding: '2rem' }}>
                  <Trophy size={32} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {lang === 'es' ? 'Activa tu Membresía' : 'Activate Your Membership'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {lang === 'es'
                      ? `Paga $${PRICING.MEMBERSHIP_FEE} MXN una sola vez para acceso completo al marketplace`
                      : `Pay $${PRICING.MEMBERSHIP_FEE} MXN once to unlock full marketplace access`}
                  </p>
                  <Link href="/auth/register" className="btn btn-primary">
                    {lang === 'es' ? 'Obtener Membresía' : 'Get Membership'} — ${PRICING.MEMBERSHIP_FEE} MXN
                  </Link>
                </div>
              )}

              {/* Quick actions */}
              <div className="card">
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  {lang === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <Link href="/dashboard/album" className="btn btn-ghost">
                    <BookOpen size={16} /> {lang === 'es' ? 'Ver Álbum' : 'View Album'}
                  </Link>
                  <Link href="/dashboard/cards/add" className="btn btn-secondary">
                    <Plus size={16} /> {lang === 'es' ? 'Agregar Tarjeta' : 'Add New Card'}
                  </Link>
                  <Link href="/auctions/create" className="btn btn-ghost">
                    <Gavel size={16} /> {lang === 'es' ? 'Crear Subasta' : 'Create Auction'}
                  </Link>
                  <Link href="/marketplace" className="btn btn-secondary">
                    <ShoppingBag size={16} /> {lang === 'es' ? 'Explorar Mercado' : 'Browse Market'}
                  </Link>
                  <Link href="/auctions" className="btn btn-secondary">
                    <TrendingUp size={16} /> {lang === 'es' ? 'Ver Subastas' : 'View Auctions'}
                  </Link>
                  <Link href="/trades" className="btn btn-secondary">
                    <RefreshCw size={16} /> {lang === 'es' ? 'Intercambios' : 'Trades'}
                  </Link>
                </div>
              </div>

              {/* Recent cards */}
              {myCards.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    {lang === 'es' ? 'Tarjetas Recientes FIFA WC' : 'Recent FIFA WC Cards'}
                  </h2>
                  <div className="cards-grid">
                    {myCards.slice(0, 4).map(card => (
                      <TradingCard key={card.id} card={card} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              ALBUM TAB
              ================================================================ */}
          {tab === 'album' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {lang === 'es' ? 'Mi Álbum de Estampas' : 'My Sticker Album'}
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    {ownedCount}/{TOTAL_STICKERS} · {completionPct}%
                  </span>
                </h2>
                <Link href="/dashboard/album" className="btn btn-ghost btn-sm">
                  {lang === 'es' ? 'Vista completa' : 'Full view'} <ArrowRight size={14} />
                </Link>
              </div>

              {/* Team filter buttons */}
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button
                  className={`btn btn-sm ${albumTeamFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAlbumTeamFilter('ALL')}
                >
                  {lang === 'es' ? 'Todos' : 'All'}
                </button>
                {CATALOG_TEAMS.map(team => {
                  const code = TEAM_CODES[team] ?? team.slice(0, 3).toUpperCase()
                  return (
                    <button
                      key={team}
                      className={`btn btn-sm ${albumTeamFilter === team ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAlbumTeamFilter(team)}
                      title={team}
                    >
                      {code}
                    </button>
                  )
                })}
                <button
                  className={`btn btn-sm ${albumTeamFilter === 'FIFA' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAlbumTeamFilter('FIFA')}
                >
                  ⭐ {lang === 'es' ? 'Especiales' : 'Special'}
                </button>
              </div>

              <AlbumGrid
                userStickers={stickerMap}
                filterTeam={albumTeamFilter}
              />
            </div>
          )}

          {/* ================================================================
              DUPLICATES TAB
              ================================================================ */}
          {tab === 'duplicates' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {lang === 'es' ? 'Estampas Repetidas' : 'Duplicate Stickers'}
                  {duplicates.length > 0 && (
                    <span className="badge badge-red" style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                      {duplicates.length}
                    </span>
                  )}
                </h2>
              </div>

              {duplicates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <Copy size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    {lang === 'es' ? 'No tienes estampas repetidas aún' : "You don't have any duplicate stickers yet"}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {lang === 'es' ? 'Abre sobres para obtener más estampas' : 'Open packs to get more stickers'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {duplicates.map(s => {
                    const info = CATALOG_MAP.get(s.sticker_number)
                    const teamCode = info ? (TEAM_CODES[info.team] ?? info.team.slice(0, 3).toUpperCase()) : '???'

                    return (
                      <div
                        key={s.sticker_number}
                        className="card"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem 1.25rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        {/* Sticker number badge */}
                        <span className="badge badge-blue" style={{ fontSize: '0.8rem', fontFamily: 'monospace', flexShrink: 0 }}>
                          #{s.sticker_number}
                        </span>

                        {/* Player info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {info?.player_name ?? s.sticker_number}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                            {info?.team ?? '—'} · {teamCode} · {info?.sticker_type}
                          </div>
                        </div>

                        {/* Quantity badge */}
                        <span className="badge badge-gold" style={{ fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>
                          ×{s.quantity}
                        </span>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                          <Link
                            href={`/trades/new?sticker=${s.sticker_number}`}
                            className="btn btn-secondary btn-sm"
                          >
                            🔄 {lang === 'es' ? 'Intercambiar' : 'Trade'}
                          </Link>
                          <Link
                            href={`/auctions/create?sticker=${s.sticker_number}`}
                            className="btn btn-ghost btn-sm"
                          >
                            🔨 {lang === 'es' ? 'Subastar' : 'Auction'}
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TRADES TAB (placeholder)
              ================================================================ */}
          {tab === 'trades' && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <RefreshCw size={48} style={{ color: 'var(--emerald)', margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                {lang === 'es' ? 'Centro de Intercambios' : 'Trade Center'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', maxWidth: '420px', margin: '0 auto 1rem' }}>
                {lang === 'es'
                  ? 'Intercambia tus estampas repetidas con otros coleccionistas. Busca quién tiene lo que necesitas y ofrece lo que te sobra.'
                  : 'Trade your duplicate stickers with other collectors. Find who has what you need and offer what you have extra.'}
              </p>

              {duplicates.length > 0 && (
                <p style={{ fontSize: '0.85rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>
                  {lang === 'es'
                    ? `Tienes ${duplicates.length} estampa${duplicates.length > 1 ? 's' : ''} repetida${duplicates.length > 1 ? 's' : ''} disponible${duplicates.length > 1 ? 's' : ''} para intercambiar`
                    : `You have ${duplicates.length} duplicate sticker${duplicates.length > 1 ? 's' : ''} available to trade`}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/trades" className="btn btn-primary">
                  <RefreshCw size={16} /> {lang === 'es' ? 'Ir a Intercambios' : 'Go to Trades'} <ArrowRight size={16} />
                </Link>
                {duplicates.length > 0 && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setTab('duplicates')}
                  >
                    {lang === 'es' ? 'Ver mis repetidas' : 'View my duplicates'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              AUCTIONS TAB (unchanged)
              ================================================================ */}
          {tab === 'auctions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {lang === 'es' ? 'Mis Subastas' : 'My Auctions'} ({myAuctions.length})
                </h2>
                <Link href="/auctions/create" className="btn btn-primary btn-sm">
                  <Plus size={14} /> {lang === 'es' ? 'Nueva Subasta' : 'New Auction'}
                </Link>
              </div>
              {myAuctions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <Gavel size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {lang === 'es'
                      ? `Sin subastas todavía. Crea una por $${PRICING.AUCTION_CREATION_FEE} MXN por tarjeta.`
                      : `No auctions yet. Create one for $${PRICING.AUCTION_CREATION_FEE} MXN per card.`}
                  </p>
                  <Link href="/auctions/create" className="btn btn-primary">
                    <Gavel size={16} /> {lang === 'es' ? 'Crear Subasta' : 'Create Auction'}
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myAuctions.map(auction => (
                    <Link key={auction.id} href={`/auctions/${auction.id}`} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span className={`badge ${auction.status === 'active' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                              {auction.status === 'active' ? '⚡ Live' : auction.status}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{auction.title}</h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {lang === 'es' ? 'Creado' : 'Created'} {format(new Date(auction.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold)' }}>
                              ${auction.current_price.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {lang === 'es' ? 'Oferta Actual' : 'Current Bid'}
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                              {(auction.bids as any[])?.length || 0}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {lang === 'es' ? 'Ofertas' : 'Bids'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              PAYMENTS TAB (unchanged)
              ================================================================ */}
          {tab === 'payments' && (
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {lang === 'es' ? 'Historial de Pagos' : 'Payment History'}
              </h2>
              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                  <CreditCard size={48} style={{ margin: '0 auto 1rem' }} />
                  <p>{lang === 'es' ? 'Sin historial de pagos todavía.' : 'No payment history yet.'}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {payments.map(payment => (
                    <div key={payment.id} className="card" style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', padding: '1rem 1.5rem', flexWrap: 'wrap', gap: '0.5rem',
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                          {{
                            'membership': '🎫 Platform Membership',
                            'auction_creation': '🔨 Auction Creation Fee',
                            'auction_entry': '🎯 Auction Entry Fee',
                            'trade_search': '🔍 Trade Search Fee',
                            'trade_accept': '🤝 Trade Accept Fee',
                          }[payment.type] ?? payment.type}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {format(new Date(payment.created_at), 'MMM d, yyyy HH:mm')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span className={`badge ${payment.status === 'completed' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                          {payment.status}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--gold)' }}>
                          ${payment.amount.toFixed(2)} MXN
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
