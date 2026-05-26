'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer from '@/components/Toast'
import TradingCard from '@/components/TradingCard'
import CountdownTimer from '@/components/CountdownTimer'
import type { Card, Auction } from '@/lib/types'
import { PRICING } from '@/lib/types'
import { useI18n } from '@/lib/i18n'
import {
  Trophy, Gavel, ShoppingBag, Shield, Star,
  ArrowRight, Zap, Users, TrendingUp
} from 'lucide-react'

export default function HomePage() {
  const supabase = createClient()
  const { lang } = useI18n()
  const [featuredCards, setFeaturedCards] = useState<Card[]>([])
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([])
  const [stats, setStats] = useState({ cards: 0, auctions: 0, users: 0 })

  useEffect(() => {
    // Load featured cards
    supabase
      .from('cards')
      .select('*, owner:profiles(username, avatar_url)')
      .in('rarity', ['legendary', 'ultra_rare', 'rare'])
      .limit(6)
      .then(({ data }) => setFeaturedCards(data || []))

    // Load live auctions
    supabase
      .from('auctions')
      .select('*, card:cards(*), seller:profiles(username)')
      .eq('status', 'active')
      .order('ends_at', { ascending: true })
      .limit(3)
      .then(({ data }) => setLiveAuctions(data || []))

    // Load stats
    Promise.all([
      supabase.from('cards').select('id', { count: 'exact', head: true }),
      supabase.from('auctions').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]).then(([cards, auctions, users]) => {
      setStats({
        cards: cards.count || 0,
        auctions: auctions.count || 0,
        users: users.count || 0,
      })
    })
  }, [])

  return (
    <>
      <Navbar />
      <ToastContainer />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="container-main" style={{ position: 'relative', zIndex: 1, width: '100%', padding: '6rem 1.5rem' }}>
          <div style={{ maxWidth: '700px' }}>
            {/* Badge */}
            <div className="badge badge-gold" style={{ marginBottom: '1.5rem', fontSize: '0.8rem' }}>
              <Trophy size={12} /> {lang === 'es' ? 'Tarjetas FIFA World Cup' : 'FIFA World Cup Trading Cards'}
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              {lang === 'es' ? 'Colecciona a los' : "Collect the World's"}
              <br />
              <span className="gradient-text">{lang === 'es' ? 'Mejores Jugadores' : 'Greatest Players'}</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '540px', lineHeight: 1.7 }}>
              {lang === 'es'
                ? 'Compra, vende y subasta tarjetas de fútbol de la Copa del Mundo. Consigue artículos raros de los mejores jugadores del mundo.'
                : 'Buy, sell, and auction FIFA World Cup soccer cards from legendary tournaments. Own rare collectibles of the world\'s best players.'}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/marketplace" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} />
                {lang === 'es' ? 'Explorar Mercado' : 'Browse Marketplace'}
                <ArrowRight size={16} />
              </Link>
              <Link href="/auctions" className="btn btn-secondary btn-lg">
                <Gavel size={18} />
                {lang === 'es' ? 'Subastas en Vivo' : 'Live Auctions'}
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              {[
                { label: lang === 'es' ? 'Tarjetas Listadas' : 'Cards Listed', value: stats.cards || '1,200+', icon: Star },
                { label: lang === 'es' ? 'Subastas Activas' : 'Live Auctions', value: stats.auctions || '48', icon: Gavel },
                { label: lang === 'es' ? 'Coleccionistas' : 'Collectors', value: stats.users || '5,000+', icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Icon size={16} style={{ color: 'var(--gold)' }} />
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE AUCTIONS DASHBOARD */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border)', background: 'rgba(245,158,11,0.02)' }}>
        <div className="container-main">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--crimson)', boxShadow: '0 0 8px var(--crimson)', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--crimson)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>En Vivo</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                🔨 {lang === 'es' ? 'Subastas Activas' : 'Live Auctions'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {lang === 'es' ? 'Únete y compite por estas tarjetas exclusivas del Mundial 2026' : 'Join and bid on these exclusive World Cup 2026 cards'}
              </p>
            </div>
            <Link href="/auctions" className="btn btn-ghost">
              {lang === 'es' ? 'Ver todas' : 'View all'} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Auctions list or empty state */}
          {liveAuctions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Gavel size={40} style={{ margin: '0 auto 1rem' }} />
              <p>{lang === 'es' ? 'No hay subastas activas en este momento.' : 'No active auctions right now.'}</p>
              <Link href="/auth/register" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                {lang === 'es' ? 'Crear una subasta' : 'Create an auction'}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {liveAuctions.map(auction => {
                const card = auction.card
                const rarityColors: Record<string, string> = {
                  legendary: 'var(--gold)', ultra_rare: 'var(--violet)', rare: 'var(--sapphire)', uncommon: 'var(--emerald)', common: 'var(--text-muted)'
                }
                const borderColor = rarityColors[card?.rarity || 'common']
                return (
                  <div key={auction.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderLeft: `3px solid ${borderColor}`, flexWrap: 'wrap' }}>
                    {/* Card avatar */}
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', background: `${borderColor}20`, border: `1px solid ${borderColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                      ⚽
                    </div>

                    {/* Card info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{card?.year}</span>
                        <span className="badge" style={{ fontSize: '0.65rem' }}>{card?.rarity?.replace('_', ' ')}</span>
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {card?.player_name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{card?.team} · {lang === 'es' ? 'Vendido por' : 'by'} @{(auction as any).seller?.username}</p>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>{lang === 'es' ? 'Puja actual' : 'Current bid'}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>${auction.current_price.toFixed(0)} MXN</div>
                    </div>

                    {/* Countdown */}
                    <div style={{ flexShrink: 0 }}>
                      <CountdownTimer endsAt={auction.ends_at} />
                    </div>

                    {/* CTA */}
                    <Link href={`/auctions/${auction.id}`} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                      {lang === 'es' ? 'Pujar →' : 'Bid →'}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          {/* Join CTA */}
          <div className="card-gold" style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              ¿Quieres pujar? Primero necesitas una cuenta
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Únete gratis, activa tu membresía por $30 MXN y accede a todas las subastas del Mundial 2026
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/register" className="btn btn-primary">
                Crear cuenta — Gratis <ArrowRight size={16} />
              </Link>
              <Link href="/auth/login" className="btn btn-secondary">
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {lang === 'es' ? 'Precios' : 'Simple, Transparent'} <span className="gradient-text">{lang === 'es' ? 'Transparentes' : 'Pricing'}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {lang === 'es' ? 'Todos los precios en Pesos Mexicanos (MXN)' : 'All prices in Mexican Pesos (MXN)'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {/* Membership */}
            <div className="pricing-card featured">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎫</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{lang === 'es' ? 'Membresía' : 'Platform Membership'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {lang === 'es'
                  ? 'Pago único para acceder al mercado completo, comprar tarjetas y participar en subastas.'
                  : 'One-time fee to access the full marketplace, buy cards, and participate in auctions.'}
              </p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="pricing-currency">$</span>
                <span className="pricing-amount gradient-text">{PRICING.MEMBERSHIP_FEE}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.25rem' }}>MXN / {lang === 'es' ? 'único pago' : 'once'}</span>
              </div>
              <Link href="/auth/register" className="btn btn-primary" style={{ width: '100%' }}>
                {lang === 'es' ? 'Obtener Membresía' : 'Get Membership'}
              </Link>
            </div>

            {/* Auction Creation */}
            <div className="pricing-card">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔨</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{lang === 'es' ? 'Crear Subasta' : 'Create an Auction'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {lang === 'es'
                  ? 'Pon en subasta cualquier tarjeta FIFA World Cup. Pago por tarjeta subastada.'
                  : 'List any FIFA World Cup soccer card for auction. Paid per card auctioned.'}
              </p>
              <div style={{ marginBottom: '0.5rem' }}>
                <span className="pricing-currency">$</span>
                <span className="pricing-amount" style={{ color: 'var(--sapphire)' }}>{PRICING.AUCTION_CREATION_FEE}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.25rem' }}>MXN / {lang === 'es' ? 'tarjeta' : 'card'}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                + 10% comisión sobre el precio final de subasta
              </p>
              <Link href="/auctions/create" className="btn btn-secondary" style={{ width: '100%' }}>
                {lang === 'es' ? 'Crear Subasta' : 'Create Auction'}
              </Link>
            </div>

            {/* Auction Entry */}
            <div className="pricing-card">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{lang === 'es' ? 'Ingresar a Subasta' : 'Join an Auction'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {lang === 'es'
                  ? 'Costo de entrada por sala de subasta. Pujas ilimitadas una vez dentro.'
                  : 'Entry fee per auction room. Place unlimited bids once you\'re in.'}
              </p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="pricing-currency">$</span>
                <span className="pricing-amount" style={{ color: 'var(--violet)' }}>{PRICING.AUCTION_ENTRY_FEE}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.25rem' }}>MXN / {lang === 'es' ? 'subasta' : 'auction'}</span>
              </div>
              <Link href="/auctions" className="btn btn-secondary" style={{ width: '100%' }}>
                {lang === 'es' ? 'Ver Subastas' : 'Browse Auctions'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARDS */}
      {featuredCards.length > 0 && (
        <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
          <div className="container-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  🔥 {lang === 'es' ? 'Tarjetas Destacadas' : 'Featured Cards'}
                </h2>
              </div>
              <Link href="/marketplace" className="btn btn-ghost">
                {lang === 'es' ? 'Ver todas' : 'View all'} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="cards-grid">
              {featuredCards.map(card => (
                <TradingCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div className="container-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Trophy size={16} style={{ color: 'var(--gold)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>FIFA World Cup Trading Cards</span>
          </div>
          <p>{lang === 'es' ? 'El mejor mercado de tarjetas del mundial' : 'The premier marketplace for FIFA World Cup soccer cards collectibles'}</p>
          <p style={{ marginTop: '0.5rem' }}>© {new Date().getFullYear()} — Powered by Supabase</p>
        </div>
      </footer>
    </>
  )
}
