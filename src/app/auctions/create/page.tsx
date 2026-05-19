'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import type { Card, Profile } from '@/lib/types'
import { PRICING, RARITY_LABELS, VERIFICATION_ADDRESS } from '@/lib/types'
import { Gavel, ArrowLeft, CreditCard, Package, MapPin, TrendingUp, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const DURATION_OPTIONS = [3, 5, 7, 14, 21, 30]

type Step = 'card' | 'details' | 'confirm'

export default function CreateAuctionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<Profile | null>(null)
  const [myCards, setMyCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>('card')

  const [form, setForm] = useState({
    cardId: '',
    title: '',
    description: '',
    startingPrice: '50',
    minBidIncrement: '10',
    buyNowPrice: '',
    durationDays: 7,
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
        showToast('Necesitas una membresía para crear subastas', 'error')
        router.push('/auth/register')
        return
      }
      setUser(profile)

      const { data: cards } = await supabase
        .from('cards')
        .select('*')
        .eq('owner_id', authUser.id)
        .eq('is_for_auction', false)

      setMyCards(cards || [])
    })
  }, [])

  const handleCardStepSubmit = () => {
    if (!form.cardId) { showToast('Selecciona una tarjeta', 'error'); return }
    setStep('details')
  }

  const handleDetailsStepSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { showToast('El título es obligatorio', 'error'); return }
    if (!form.startingPrice || parseFloat(form.startingPrice) < 1) {
      showToast('El precio inicial debe ser mayor a $0', 'error'); return
    }
    setStep('confirm')
  }

  const handleCreateAndPay = async () => {
    if (!user) return
    setLoading(true)

    const now = new Date()
    const startsAt = now.toISOString()
    const endsAt = new Date(now.getTime() + form.durationDays * 86400 * 1000).toISOString()

    // 1. Create draft auction
    const { data: auction, error } = await supabase.from('auctions').insert({
      card_id: form.cardId,
      seller_id: user.id,
      title: form.title,
      description: form.description || null,
      starting_price: parseFloat(form.startingPrice),
      current_price: parseFloat(form.startingPrice),
      min_bid_increment: parseFloat(form.minBidIncrement),
      buy_now_price: form.buyNowPrice ? parseFloat(form.buyNowPrice) : null,
      creation_fee_paid: false,
      status: 'draft',
      starts_at: startsAt,
      ends_at: endsAt,
      duration_days: form.durationDays,
      commission_pct: 10,
      shipping_address: VERIFICATION_ADDRESS.full,
    }).select().single()

    if (error) { showToast(error.message, 'error'); setLoading(false); return }

    // 2. Create MP preference and redirect
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'auction_creation', referenceId: auction.id }),
    })
    const { init_point } = await res.json()
    window.location.href = init_point
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
  const startingPriceNum = parseFloat(form.startingPrice) || 0
  const commissionAmount = (startingPriceNum * 0.1).toFixed(2)
  const sellerReceives = (startingPriceNum * 0.9).toFixed(2)
  const endsOnDate = new Date(Date.now() + form.durationDays * 86400 * 1000)

  const stepLabels: Record<Step, string> = {
    card: '1. Tarjeta',
    details: '2. Detalles',
    confirm: '3. Confirmar',
  }
  const stepOrder: Step[] = ['card', 'details', 'confirm']
  const currentStepIndex = stepOrder.indexOf(step)

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="page-header">
          <div className="container-main">
            <Link href="/auctions" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
              <ArrowLeft size={14} /> Volver
            </Link>
            <h1 className="page-title">
              <Gavel size={28} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Crear <span className="gradient-text">Subasta</span>
            </h1>
            <p className="page-subtitle">
              Publica tu tarjeta FIFA World Cup en subasta — cuota de creación: ${PRICING.AUCTION_CREATION_FEE} MXN
            </p>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {stepOrder.map((s, i) => (
                <div
                  key={s}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    fontWeight: i <= currentStepIndex ? 700 : 400,
                    color: i <= currentStepIndex ? 'var(--gold)' : 'var(--text-muted)',
                  }}
                >
                  {i < currentStepIndex
                    ? <CheckCircle size={14} />
                    : <span style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: i === currentStepIndex ? 'var(--gold)' : 'var(--border)',
                        color: i === currentStepIndex ? '#000' : 'var(--text-muted)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700,
                      }}>{i + 1}</span>
                  }
                  {stepLabels[s]}
                  {i < stepOrder.length - 1 && (
                    <span style={{ color: 'var(--border)', marginLeft: '0.25rem' }}>›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '2rem' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>

            {/* ── STEP 1: Card selection ── */}
            {step === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card">
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Package size={18} style={{ color: 'var(--gold)' }} />
                    Selecciona la tarjeta a subastar
                  </h2>

                  {myCards.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      <p>No tienes tarjetas disponibles para subastar.</p>
                      <Link href="/dashboard/cards/add" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                        Agregar tarjeta
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
                          <div style={{ fontSize: '0.6rem', color: 'var(--gold)', marginTop: '0.25rem' }}>{RARITY_LABELS[card.rarity]}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleCardStepSubmit}
                  disabled={!form.cardId}
                >
                  Continuar a detalles →
                </button>
              </div>
            )}

            {/* ── STEP 2: Auction details ── */}
            {step === 'details' && (
              <form onSubmit={handleDetailsStepSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Verification notice */}
                <div className="card-gold" style={{
                  padding: '1.25rem 1.5rem',
                  borderLeft: '4px solid var(--gold)',
                }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold)' }}>
                    <Package size={16} />
                    Verificación obligatoria
                  </h3>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                    Tu tarjeta debe ser enviada <strong>ANTES</strong> de que la subasta se active.
                  </p>
                  <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.875rem 1rem',
                    marginBottom: '0.875rem',
                    fontSize: '0.85rem',
                    lineHeight: 1.7,
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <MapPin size={15} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: '0.15rem' }}>Dirección de verificación:</div>
                        <div>{VERIFICATION_ADDRESS.street}</div>
                        <div>{VERIFICATION_ADDRESS.neighborhood}</div>
                        <div>{VERIFICATION_ADDRESS.city}, C.P. {VERIFICATION_ADDRESS.zipCode}</div>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Una vez recibida y verificada, tu subasta se activará automáticamente.
                    Te notificaremos por correo cuando la tarjeta sea recibida.
                  </p>
                </div>

                {/* Commission disclosure */}
                <div className="card" style={{
                  padding: '1.25rem 1.5rem',
                  borderLeft: '4px solid var(--border)',
                }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-secondary)' }}>
                    <TrendingUp size={15} />
                    Comisión de la plataforma
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                    La plataforma retiene el <strong style={{ color: 'var(--text-secondary)' }}>10%</strong> del precio final de la subasta.
                    El envío de la tarjeta al ganador también corre a cargo de la plataforma.
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Ejemplo: Si tu subasta cierra en <strong style={{ color: 'var(--text-secondary)' }}>$500 MXN</strong>, recibirás <strong style={{ color: 'var(--gold)' }}>$450 MXN</strong>.
                  </p>
                </div>

                {/* Form fields */}
                <div className="card">
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Gavel size={18} style={{ color: 'var(--gold)' }} />
                    Detalles de la subasta
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="auction-title">Título de la subasta</label>
                      <input
                        id="auction-title"
                        type="text"
                        className="form-input"
                        placeholder="ej. Messi Legendary Gem Mint 2022"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="auction-description">Descripción (opcional)</label>
                      <textarea
                        id="auction-description"
                        className="form-input"
                        placeholder="Describe el estado de la tarjeta, autenticidad, etc."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        rows={3}
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="auction-starting-price">Precio inicial (MXN)</label>
                        <input
                          id="auction-starting-price"
                          type="number"
                          className="form-input"
                          value={form.startingPrice}
                          onChange={e => setForm({ ...form, startingPrice: e.target.value })}
                          min="1"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="auction-min-increment">Incremento mínimo (MXN)</label>
                        <input
                          id="auction-min-increment"
                          type="number"
                          className="form-input"
                          value={form.minBidIncrement}
                          onChange={e => setForm({ ...form, minBidIncrement: e.target.value })}
                          min="1"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="auction-buy-now">Precio fijo (opcional)</label>
                        <input
                          id="auction-buy-now"
                          type="number"
                          className="form-input"
                          placeholder="Dejar vacío para desactivar"
                          value={form.buyNowPrice}
                          onChange={e => setForm({ ...form, buyNowPrice: e.target.value })}
                          min="1"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Duration selector */}
                    <div className="form-group">
                      <label className="form-label">Duración de la subasta</label>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        {DURATION_OPTIONS.map(days => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setForm({ ...form, durationDays: days })}
                            style={{
                              padding: '0.4rem 0.9rem',
                              borderRadius: '9999px',
                              fontSize: '0.82rem',
                              fontWeight: form.durationDays === days ? 700 : 400,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              background: form.durationDays === days ? 'var(--gold)' : 'transparent',
                              color: form.durationDays === days ? '#000' : 'var(--text-secondary)',
                              border: form.durationDays === days ? 'none' : '1px solid var(--border)',
                            }}
                          >
                            {days} días
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setStep('card')}
                  >
                    <ArrowLeft size={14} /> Volver
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ flex: 2 }}
                  >
                    Continuar a confirmación →
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 3: Confirm & pay ── */}
            {step === 'confirm' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card-gold" style={{ padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <CreditCard size={20} style={{ color: 'var(--gold)' }} />
                    Confirmar y pagar
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
                      Resumen de la subasta
                    </h3>

                    {selectedCard && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Tarjeta</span>
                        <span style={{ fontWeight: 600 }}>{selectedCard.player_name} · {selectedCard.team} {selectedCard.year}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Título</span>
                      <span style={{ fontWeight: 600 }}>{form.title}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Precio inicial</span>
                      <span>${startingPriceNum.toFixed(2)} MXN</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Duración</span>
                      <span>{form.durationDays} días · termina el {endsOnDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>

                    <div className="divider" style={{ margin: '0.75rem 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Comisión plataforma (10%)</span>
                      <span style={{ color: 'var(--text-muted)' }}>−${commissionAmount} MXN al precio base</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Recibirías al precio base</span>
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>${sellerReceives} MXN</span>
                    </div>

                    <div className="divider" style={{ margin: '0.75rem 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                      <span>Cuota de creación</span>
                      <span className="gradient-text">${PRICING.AUCTION_CREATION_FEE} MXN</span>
                    </div>
                  </div>

                  {/* MercadoPago CTA */}
                  <div className="glass-gold" style={{ padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--gold)' }}>Pago seguro vía MercadoPago.</strong>{' '}
                    Serás redirigido a la plataforma de pago. Una vez confirmado el pago y verificada tu tarjeta, la subasta se activará automáticamente.
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                      disabled={loading}
                    >
                      <ArrowLeft size={14} /> Volver
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateAndPay}
                      className="btn btn-primary"
                      style={{ flex: 2 }}
                      disabled={loading}
                      id="auction-pay-create-btn"
                    >
                      {loading
                        ? 'Procesando...'
                        : `Pagar $${PRICING.AUCTION_CREATION_FEE} MXN con MercadoPago`}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </>
  )
}
