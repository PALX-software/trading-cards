'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import type { Card, Profile } from '@/lib/types'
import { PRICING, RARITY_LABELS, WORLD_CUP_TEAMS } from '@/lib/types'
import { Gavel, ArrowLeft, CreditCard, Package } from 'lucide-react'
import Link from 'next/link'

export default function CreateAuctionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<Profile | null>(null)
  const [myCards, setMyCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'payment'>('form')

  const [form, setForm] = useState({
    cardId: '',
    title: '',
    description: '',
    startingPrice: '50',
    minBidIncrement: '10',
    buyNowPrice: '',
    startsAt: '',
    endsAt: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (!profile?.membership_paid) {
        showToast('You need a membership to create auctions', 'error')
        router.push('/auth/register')
        return
      }
      setUser(profile)

      // Load user's cards that are not already in an auction
      const { data: cards } = await supabase
        .from('cards')
        .select('*')
        .eq('owner_id', authUser.id)
        .eq('is_for_auction', false)

      setMyCards(cards || [])
    })
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.cardId) { showToast('Please select a card', 'error'); return }
    if (!form.startsAt || !form.endsAt) { showToast('Please set start and end dates', 'error'); return }
    if (new Date(form.endsAt) <= new Date(form.startsAt)) {
      showToast('End date must be after start date', 'error')
      return
    }
    setStep('payment')
  }

  const handleCreateAuction = async () => {
    if (!user) return
    setLoading(true)

    // Record auction creation fee
    const { error: payError } = await supabase.from('payments').insert({
      user_id: user.id,
      type: 'auction_creation',
      amount: PRICING.AUCTION_CREATION_FEE,
      status: 'completed',
      payment_method: 'simulated',
    })

    if (payError) {
      showToast('Payment failed. Try again.', 'error')
      setLoading(false)
      return
    }

    // Create auction
    const { data: auction, error: auctionError } = await supabase.from('auctions').insert({
      card_id: form.cardId,
      seller_id: user.id,
      title: form.title,
      description: form.description || null,
      starting_price: parseFloat(form.startingPrice),
      current_price: parseFloat(form.startingPrice),
      min_bid_increment: parseFloat(form.minBidIncrement),
      buy_now_price: form.buyNowPrice ? parseFloat(form.buyNowPrice) : null,
      creation_fee_paid: true,
      status: 'active',
      starts_at: form.startsAt,
      ends_at: form.endsAt,
    }).select().single()

    if (auctionError) {
      showToast(auctionError.message, 'error')
      setLoading(false)
      return
    }

    // Mark card as in auction
    await supabase.from('cards').update({ is_for_auction: true }).eq('id', form.cardId)

    showToast('Auction created successfully! 🔨', 'success')
    router.push(`/auctions/${auction.id}`)
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div className="skeleton" style={{ width: '200px', height: '40px' }} />
        </div>
      </>
    )
  }

  const selectedCard = myCards.find(c => c.id === form.cardId)

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="page-header">
          <div className="container-main">
            <Link href="/auctions" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
              <ArrowLeft size={14} /> Back
            </Link>
            <h1 className="page-title">
              🔨 Create <span className="gradient-text">Auction</span>
            </h1>
            <p className="page-subtitle">
              List your FIFA World Cup trading card for auction — creation fee: ${PRICING.AUCTION_CREATION_FEE} MXN
            </p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '2rem' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {step === 'form' && (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Card selection */}
                <div className="card">
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Package size={18} style={{ color: 'var(--gold)' }} />
                    Select Card to Auction
                  </h2>

                  {myCards.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      <p>You don't have any cards available for auction.</p>
                      <Link href="/dashboard/cards/add" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                        Add a Card
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                      {myCards.map(card => (
                        <div
                          key={card.id}
                          onClick={() => setForm({ ...form, cardId: card.id })}
                          style={{
                            border: `2px solid ${form.cardId === card.id ? 'var(--gold)' : 'var(--border)'}`,
                            borderRadius: '0.75rem',
                            padding: '0.75rem',
                            cursor: 'pointer',
                            background: form.cardId === card.id ? 'rgba(245,158,11,0.05)' : 'transparent',
                            transition: 'all 0.2s ease',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>⚽</div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>{card.player_name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{card.team}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{card.year}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auction details */}
                <div className="card">
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Gavel size={18} style={{ color: 'var(--gold)' }} />
                    Auction Details
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Auction Title</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Messi Legendary Gem Mint 2022"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                        id="auction-title"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description (optional)</label>
                      <textarea
                        className="form-input"
                        placeholder="Describe the card condition, authenticity, etc."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        rows={3}
                        style={{ resize: 'vertical' }}
                        id="auction-description"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Starting Price (MXN)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={form.startingPrice}
                          onChange={e => setForm({ ...form, startingPrice: e.target.value })}
                          min="1"
                          step="0.01"
                          required
                          id="auction-starting-price"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Min Increment (MXN)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={form.minBidIncrement}
                          onChange={e => setForm({ ...form, minBidIncrement: e.target.value })}
                          min="1"
                          step="0.01"
                          required
                          id="auction-min-increment"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Buy Now Price (optional)</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Leave empty to disable"
                          value={form.buyNowPrice}
                          onChange={e => setForm({ ...form, buyNowPrice: e.target.value })}
                          min="1"
                          step="0.01"
                          id="auction-buy-now"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Start Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={form.startsAt}
                          onChange={e => setForm({ ...form, startsAt: e.target.value })}
                          required
                          id="auction-starts-at"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={form.endsAt}
                          onChange={e => setForm({ ...form, endsAt: e.target.value })}
                          required
                          id="auction-ends-at"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  id="auction-continue-btn"
                >
                  Continue to Payment →
                </button>
              </form>
            )}

            {step === 'payment' && (
              <div className="card-gold" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  <CreditCard size={20} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--gold)' }} />
                  Confirm & Pay Auction Fee
                </h2>

                {/* Summary */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}>
                  <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                    Auction Summary
                  </h3>
                  {selectedCard && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span>{selectedCard.player_name} · {selectedCard.team} {selectedCard.year}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Starting price</span>
                    <span>${parseFloat(form.startingPrice).toFixed(2)} MXN</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Duration</span>
                    <span>{form.startsAt ? new Date(form.startsAt).toLocaleDateString() : ''} → {form.endsAt ? new Date(form.endsAt).toLocaleDateString() : ''}</span>
                  </div>
                  <div className="divider" style={{ margin: '0.75rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                    <span>Auction Creation Fee</span>
                    <span className="gradient-text">${PRICING.AUCTION_CREATION_FEE} MXN</span>
                  </div>
                </div>

                <div className="glass-gold" style={{ padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  🔒 <strong style={{ color: 'var(--gold)' }}>Simulated Payment</strong> — In production, integrate Stripe, Conekta, or MercadoPago.
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setStep('form')}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateAuction}
                    className="btn btn-primary"
                    style={{ flex: 2 }}
                    disabled={loading}
                    id="auction-pay-create-btn"
                  >
                    {loading ? 'Creating...' : `Pay $${PRICING.AUCTION_CREATION_FEE} MXN & Create Auction`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
