'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import TradingCard from '@/components/TradingCard'
import ToastContainer, { showToast } from '@/components/Toast'
import type { Card, Auction, Payment, Profile } from '@/lib/types'
import { PRICING } from '@/lib/types'
import {
  LayoutDashboard, Package, Gavel, CreditCard,
  Plus, TrendingUp, Trophy, ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<Profile | null>(null)
  const [myCards, setMyCards] = useState<Card[]>([])
  const [myAuctions, setMyAuctions] = useState<Auction[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tab, setTab] = useState<'overview' | 'cards' | 'auctions' | 'payments'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { router.push('/auth/login'); return }

      const [profileRes, cardsRes, auctionsRes, paymentsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', authUser.id).single(),
        supabase.from('cards').select('*').eq('owner_id', authUser.id).order('created_at', { ascending: false }),
        supabase.from('auctions').select('*, card:cards(*), bids(id)').eq('seller_id', authUser.id).order('created_at', { ascending: false }),
        supabase.from('payments').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }),
      ])

      setUser(profileRes.data)
      setMyCards(cardsRes.data || [])
      setMyAuctions(auctionsRes.data || [])
      setPayments(paymentsRes.data || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Trophy size={40} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading your collection...</p>
          </div>
        </div>
      </>
    )
  }

  if (!user) return null

  const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const activeAuctions = myAuctions.filter(a => a.status === 'active').length
  const cardsForSale = myCards.filter(c => c.is_for_sale).length

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
                  Welcome back, <span className="gradient-text">@{user.username}</span>
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  {user.membership_paid && (
                    <span className="badge badge-gold">✦ Member</span>
                  )}
                  <span className="badge badge-blue">
                    <Package size={12} /> {myCards.length} cards
                  </span>
                  <span className="badge badge-purple">
                    <Gavel size={12} /> {myAuctions.length} auctions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '1.5rem' }}>
          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: '2rem' }}>
            {[
              { id: 'overview', label: '◎ Overview', icon: LayoutDashboard },
              { id: 'cards', label: '⚽ My Cards', icon: Package },
              { id: 'auctions', label: '🔨 My Auctions', icon: Gavel },
              { id: 'payments', label: '💳 Payments', icon: CreditCard },
            ].map(({ id, label }) => (
              <button
                key={id}
                className={`tab ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id as typeof tab)}
                id={`dashboard-tab-${id}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Total Cards', value: myCards.length, icon: Package, color: 'var(--sapphire)' },
                  { label: 'Cards For Sale', value: cardsForSale, icon: ShoppingBag, color: 'var(--emerald)' },
                  { label: 'Active Auctions', value: activeAuctions, icon: Gavel, color: 'var(--gold)' },
                  { label: 'Total Spent', value: `$${totalSpent.toFixed(0)} MXN`, icon: CreditCard, color: 'var(--violet)' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="stat-card">
                    <Icon size={20} style={{ color, margin: '0 auto 0.5rem' }} />
                    <div className="stat-value" style={{ color }}>{value}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                ))}
              </div>

              {/* Membership status */}
              {!user.membership_paid && (
                <div className="card-gold" style={{ textAlign: 'center', padding: '2rem' }}>
                  <Trophy size={32} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Activate Your Membership
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Pay ${PRICING.MEMBERSHIP_FEE} MXN once to unlock full marketplace access
                  </p>
                  <Link href="/auth/register" className="btn btn-primary">
                    Get Membership — ${PRICING.MEMBERSHIP_FEE} MXN
                  </Link>
                </div>
              )}

              {/* Quick actions */}
              <div className="card">
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <Link href="/dashboard/cards/add" className="btn btn-secondary">
                    <Plus size={16} /> Add New Card
                  </Link>
                  <Link href="/auctions/create" className="btn btn-ghost">
                    <Gavel size={16} /> Create Auction
                  </Link>
                  <Link href="/marketplace" className="btn btn-secondary">
                    <ShoppingBag size={16} /> Browse Market
                  </Link>
                  <Link href="/auctions" className="btn btn-secondary">
                    <TrendingUp size={16} /> View Auctions
                  </Link>
                </div>
              </div>

              {/* Recent cards */}
              {myCards.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Recent FIFA WC Cards
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

          {/* CARDS TAB */}
          {tab === 'cards' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  My FIFA World Cup Cards ({myCards.length})
                </h2>
                <Link href="/dashboard/cards/add" className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add Card
                </Link>
              </div>
              {myCards.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <Package size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    You haven't added any FIFA World Cup trading cards yet.
                  </p>
                  <Link href="/dashboard/cards/add" className="btn btn-primary">
                    <Plus size={16} /> Add Your First Card
                  </Link>
                </div>
              ) : (
                <div className="cards-grid">
                  {myCards.map(card => (
                    <TradingCard key={card.id} card={card} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AUCTIONS TAB */}
          {tab === 'auctions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  My Auctions ({myAuctions.length})
                </h2>
                <Link href="/auctions/create" className="btn btn-primary btn-sm">
                  <Plus size={14} /> New Auction
                </Link>
              </div>
              {myAuctions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <Gavel size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    No auctions yet. Create one for ${PRICING.AUCTION_CREATION_FEE} MXN per card.
                  </p>
                  <Link href="/auctions/create" className="btn btn-primary">
                    <Gavel size={16} /> Create Auction
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
                            Created {format(new Date(auction.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold)' }}>
                              ${auction.current_price.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current Bid</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                              {(auction.bids as any[])?.length || 0}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bids</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {tab === 'payments' && (
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Payment History
              </h2>
              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                  <CreditCard size={48} style={{ margin: '0 auto 1rem' }} />
                  <p>No payment history yet.</p>
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
                          }[payment.type]}
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
