'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import CountdownTimer from '@/components/CountdownTimer'
import TradingCard from '@/components/TradingCard'
import type { Auction, Bid, Profile } from '@/lib/types'
import { PRICING, RARITY_LABELS, CONDITION_LABELS } from '@/lib/types'
import { Gavel, TrendingUp, Users, Trophy, ArrowLeft, MessageSquare } from 'lucide-react'
import Chat from '@/components/Chat'
import Link from 'next/link'
import { format } from 'date-fns'

export default function AuctionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const auctionId = params.id as string

  const [auction, setAuction] = useState<Auction | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [user, setUser] = useState<Profile | null>(null)
  const [isParticipant, setIsParticipant] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [bidding, setBidding] = useState(false)

  const fetchAuction = useCallback(async () => {
    const { data } = await supabase
      .from('auctions')
      .select('*, card:cards(*), seller:profiles(username, avatar_url), winner:profiles!auctions_winner_id_fkey(username)')
      .eq('id', auctionId)
      .single()

    if (!data) { router.push('/auctions'); return }
    setAuction(data as Auction)

    const { data: bidsData } = await supabase
      .from('bids')
      .select('*, bidder:profiles(username, avatar_url)')
      .eq('auction_id', auctionId)
      .order('amount', { ascending: false })
      .limit(20)

    setBids((bidsData as Bid[]) || [])
    setLoading(false)
  }, [auctionId])

  useEffect(() => {
    fetchAuction()

    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
        setUser(profileData)

        const { data: part } = await supabase
          .from('auction_participants')
          .select('id')
          .eq('auction_id', auctionId)
          .eq('user_id', authUser.id)
          .eq('entry_fee_paid', true)
          .single()

        setIsParticipant(!!part)
      }
    })
  }, [auctionId])

  // Realtime bid updates
  useEffect(() => {
    const channel = supabase
      .channel(`auction-${auctionId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'bids',
        filter: `auction_id=eq.${auctionId}`,
      }, () => {
        fetchAuction()
        showToast('New bid placed! 🔥', 'info')
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [auctionId, fetchAuction])

  const handleBid = async () => {
    if (!user || !auction) return
    const amount = parseFloat(bidAmount)

    if (isNaN(amount) || amount <= auction.current_price) {
      showToast(`Bid must be higher than $${auction.current_price.toFixed(2)} MXN`, 'error')
      return
    }

    if (amount < auction.current_price + auction.min_bid_increment) {
      showToast(`Minimum bid increment: $${auction.min_bid_increment} MXN`, 'error')
      return
    }

    setBidding(true)

    const { error } = await supabase.from('bids').insert({
      auction_id: auction.id,
      bidder_id: user.id,
      amount,
    })

    if (error) {
      showToast(error.message || 'Failed to place bid', 'error')
    } else {
      showToast(`Bid of $${amount.toFixed(2)} MXN placed! 🎯`, 'success')
      setBidAmount('')
      fetchAuction()
    }

    setBidding(false)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div className="skeleton" style={{ width: '200px', height: '40px' }} />
        </div>
      </>
    )
  }

  if (!auction) return null

  const isEnded = auction.status === 'ended'
  const minBid = auction.current_price + auction.min_bid_increment

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="container-main" style={{ paddingTop: '2rem' }}>
          <Link href="/auctions" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
            <ArrowLeft size={14} /> Back to Auctions
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
            {/* Left: Card */}
            <div style={{ position: 'sticky', top: '5rem' }}>
              {auction.card && (
                <div style={{ maxWidth: '280px' }}>
                  <TradingCard card={auction.card} />
                </div>
              )}

              {/* Card details */}
              {auction.card && (
                <div className="card" style={{ marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Card Details
                  </h3>
                  {[
                    ['Player', auction.card.player_name],
                    ['Team', auction.card.team],
                    ['Year', auction.card.year],
                    ['Series', auction.card.series || '—'],
                    ['Rarity', RARITY_LABELS[auction.card.rarity]],
                    ['Condition', CONDITION_LABELS[auction.card.condition]],
                    ['Card #', auction.card.card_number || '—'],
                  ].map(([label, value]) => (
                    <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Auction info + bidding */}
            <div>
              {/* Title & status */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className={`badge ${isEnded ? 'badge-red' : 'badge-green'}`}>
                  {isEnded ? '✓ Auction Ended' : '⚡ Live Auction'}
                </span>
                {isParticipant && <span className="badge badge-gold">✓ You're In</span>}
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {auction.title}
              </h1>

              {auction.description && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {auction.description}
                </p>
              )}

              {/* Pricing stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="stat-card">
                  <div className="stat-value gradient-text">${auction.current_price.toFixed(2)}</div>
                  <div className="stat-label">Current Bid</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--sapphire)' }}>{bids.length}</div>
                  <div className="stat-label">Total Bids</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--violet)', fontSize: '1.25rem' }}>
                    ${auction.starting_price.toFixed(2)}
                  </div>
                  <div className="stat-label">Starting Price</div>
                </div>
              </div>

              {/* Countdown */}
              {!isEnded && (
                <div className="card-gold" style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ⏱ Ends in
                  </p>
                  <CountdownTimer endsAt={auction.ends_at} onEnd={fetchAuction} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                    {format(new Date(auction.ends_at), 'PPp')}
                  </p>
                </div>
              )}

              {/* Winner announcement */}
              {isEnded && auction.winner && (
                <div className="card-gold" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <Trophy size={32} style={{ color: 'var(--gold)', margin: '0 auto 0.75rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                    🏆 Auction Won!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Won by <strong style={{ color: 'var(--gold)' }}>@{(auction.winner as any)?.username}</strong>
                    {' '}for <strong>${auction.current_price.toFixed(2)} MXN</strong>
                  </p>
                </div>
              )}

              {/* Bid form */}
              {!isEnded && isParticipant && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Place Your Bid
                  </h3>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: '1rem', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--gold)',
                        fontWeight: 700,
                      }}>$</span>
                      <input
                        type="number"
                        className="form-input"
                        placeholder={`Min: ${minBid.toFixed(2)}`}
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}
                        min={minBid}
                        step="0.01"
                        style={{ paddingLeft: '2rem' }}
                        id="bid-amount-input"
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleBid}
                      disabled={bidding || !bidAmount}
                      id="place-bid-btn"
                    >
                      <Gavel size={16} />
                      {bidding ? 'Placing...' : 'Place Bid'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Minimum increment: ${auction.min_bid_increment.toFixed(2)} MXN ·
                    {' '}Min bid: <strong style={{ color: 'var(--gold)' }}>${minBid.toFixed(2)} MXN</strong>
                  </p>

                  {auction.buy_now_price && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <button className="btn btn-ghost" style={{ width: '100%' }}>
                        ⚡ Buy Now — ${auction.buy_now_price.toFixed(2)} MXN
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Join CTA for non-participants */}
              {!isEnded && !isParticipant && (
                <div className="card-gold" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <Gavel size={28} style={{ color: 'var(--gold)', margin: '0 auto 0.75rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Join to Start Bidding
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    One-time entry fee of <strong style={{ color: 'var(--gold)' }}>${PRICING.AUCTION_ENTRY_FEE} MXN</strong> per auction.
                    Place unlimited bids once inside.
                  </p>
                  <Link href="/auctions" className="btn btn-primary" style={{ width: '100%' }}>
                    <Users size={16} />
                    Join for ${PRICING.AUCTION_ENTRY_FEE} MXN
                  </Link>
                </div>
              )}

              {/* Bid History */}
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} style={{ color: 'var(--gold)' }} />
                  Bid History
                </h3>
                {bids.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                    No bids yet. Be the first!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {bids.map((bid, idx) => (
                      <div key={bid.id} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem', borderRadius: '0.625rem',
                        background: idx === 0 ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)',
                        border: idx === 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                      }}>
                        <div className="avatar" style={{ width: '2rem', height: '2rem', fontSize: '0.75rem' }}>
                          {(bid.bidder as any)?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            @{(bid.bidder as any)?.username || 'Anonymous'}
                          </span>
                          {idx === 0 && (
                            <span className="badge badge-gold" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>
                              🏆 Highest
                            </span>
                          )}
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {format(new Date(bid.created_at), 'MMM d, HH:mm')}
                          </div>
                        </div>
                        <div style={{
                          fontWeight: 800,
                          color: idx === 0 ? 'var(--gold)' : 'var(--text-primary)',
                          fontSize: idx === 0 ? '1.1rem' : '0.95rem',
                        }}>
                          ${bid.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coordination Chat (seller + winner after auction ends) */}
              {auction.status === 'ended' && user && (user.id === auction.seller_id || user.id === auction.winner_id) && (
                <div style={{ marginTop: '2rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={18} style={{ color: 'var(--gold)' }} />
                    Chat de Coordinación
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Coordina con la otra parte cómo enviar la estampa.
                  </p>
                  <Chat
                    roomType="auction"
                    roomId={auction.id}
                    currentUserId={user.id}
                    otherUserName={
                      user.id === auction.seller_id
                        ? (auction.winner as any)?.username
                        : (auction.seller as any)?.username
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
