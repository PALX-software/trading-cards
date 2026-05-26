'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import type { Profile } from '@/lib/types'
import { PRICING } from '@/lib/types'
import { STICKER_CATALOG } from '@/lib/catalog'
import type { StickerDef } from '@/lib/catalog'
import { Gavel, ArrowLeft, CreditCard, Package, TrendingUp, CheckCircle, Search, Check } from 'lucide-react'
import Link from 'next/link'

const DURATION_OPTIONS = [1, 3, 5, 7, 14, 21, 30]
const ENTRY_FEE_OPTIONS = [5, 10, 15, 20, 30, 50]

type Step = 'sticker' | 'details' | 'confirm'

interface DupSticker {
  sticker_number: string
  quantity: number
  sticker: StickerDef | null
}

function stickerRarity(type: string | undefined) {
  if (type === 'special') return 'legendary'
  if (type === 'logo')    return 'rare'
  if (type === 'badge')   return 'uncommon'
  return 'common'
}

export default function CreateAuctionPage() {
  const router  = useRouter()
  const supabase = createClient()
  const [user,       setUser]       = useState<Profile | null>(null)
  const [dupStickers, setDupStickers] = useState<DupSticker[]>([])
  const [loading,    setLoading]    = useState(false)
  const [step,       setStep]       = useState<Step>('sticker')

  const [selectedNumber, setSelectedNumber] = useState<string>('')
  const [search,         setSearch]         = useState<string>('')

  const [form, setForm] = useState({
    title:           '',
    description:     '',
    startingPrice:   '50',
    minBidIncrement: '10',
    buyNowPrice:     '',
    durationDays:    7,
    entryFee:        PRICING.AUCTION_ENTRY_FEE as number,
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', authUser.id).single()

      if (!profile?.membership_paid && !profile?.is_admin) {
        showToast('Necesitas una membresía para crear subastas', 'error')
        router.push('/auth/register')
        return
      }
      setUser(profile)

      const { data: dupes } = await supabase
        .from('user_stickers')
        .select('sticker_number, quantity, sticker:sticker_catalog(*)')
        .eq('user_id', authUser.id)
        .gt('quantity', 1)

      setDupStickers((dupes as any[])?.map(d => ({
        sticker_number: d.sticker_number,
        quantity:       d.quantity,
        sticker:        d.sticker as StickerDef | null,
      })) || [])
    }
    init()
  }, [])

  const selectedSticker = useMemo(
    () => dupStickers.find(d => d.sticker_number === selectedNumber)?.sticker ?? null,
    [selectedNumber, dupStickers]
  )

  const filteredDupes = useMemo<DupSticker[]>(() => {
    if (!search.trim()) return dupStickers
    const q = search.toLowerCase()
    return dupStickers.filter(d =>
      d.sticker?.player_name.toLowerCase().includes(q) ||
      d.sticker?.team.toLowerCase().includes(q) ||
      d.sticker_number.includes(q)
    )
  }, [search, dupStickers])

  const handleStickerStepSubmit = () => {
    if (!selectedNumber) { showToast('Selecciona una estampa', 'error'); return }
    if (selectedSticker && !form.title) {
      setForm(f => ({ ...f, title: `${selectedSticker.player_name} — ${selectedSticker.team} WC 2026` }))
    }
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
    if (!user || !selectedSticker) return
    setLoading(true)

    // Auto-create a card entry from sticker data so existing auction system works
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .insert({
        owner_id:    user.id,
        player_name: selectedSticker.player_name,
        team:        selectedSticker.team,
        year:        2026,
        card_number: selectedSticker.number,
        series:      'Panini FIFA WC 2026',
        rarity:      stickerRarity(selectedSticker.sticker_type),
        condition:   'good',
        title:       form.title,
        description: form.description || null,
        image_url:   selectedSticker.image_url || null,
        is_for_sale:    false,
        is_for_auction: true,
      })
      .select('id')
      .single()

    if (cardError) { showToast(cardError.message, 'error'); setLoading(false); return }

    const now     = new Date()
    const endsAt  = new Date(now.getTime() + form.durationDays * 86400 * 1000).toISOString()

    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .insert({
        card_id:          card.id,
        seller_id:        user.id,
        title:            form.title,
        description:      form.description || null,
        starting_price:   parseFloat(form.startingPrice),
        current_price:    parseFloat(form.startingPrice),
        min_bid_increment: parseFloat(form.minBidIncrement),
        buy_now_price:    form.buyNowPrice ? parseFloat(form.buyNowPrice) : null,
        entry_fee:        form.entryFee,
        creation_fee_paid: false,
        status:           'draft',
        starts_at:        now.toISOString(),
        ends_at:          endsAt,
        duration_days:    form.durationDays,
        commission_pct:   10,
      })
      .select('id')
      .single()

    if (auctionError) {
      // Roll back card if auction failed
      await supabase.from('cards').delete().eq('id', card.id)
      showToast(auctionError.message, 'error')
      setLoading(false)
      return
    }

    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'auction_creation', referenceId: auction.id }),
    })
    const { init_point, error: payError } = await res.json()
    if (payError) {
      showToast(payError, 'error')
      setLoading(false)
      return
    }
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

  const startingPriceNum  = parseFloat(form.startingPrice) || 0
  const commissionAmount  = (startingPriceNum * 0.1).toFixed(2)
  const sellerReceives    = (startingPriceNum * 0.9).toFixed(2)
  const endsOnDate        = new Date(Date.now() + form.durationDays * 86400 * 1000)

  const stepLabels: Record<Step, string> = {
    sticker: '1. Estampa',
    details: '2. Detalles',
    confirm: '3. Confirmar',
  }
  const stepOrder: Step[] = ['sticker', 'details', 'confirm']
  const currentStepIndex  = stepOrder.indexOf(step)

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
              Subasta una de tus estampas duplicadas — cuota de creación: ${PRICING.AUCTION_CREATION_FEE} MXN
            </p>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {stepOrder.map((s, i) => (
                <div
                  key={s}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
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
                        color:      i === currentStepIndex ? '#000' : 'var(--text-muted)',
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

            {/* ── STEP 1: Sticker selection ── */}
            {step === 'sticker' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card">
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Package size={18} style={{ color: 'var(--gold)' }} />
                    ¿Qué estampa quieres subastar?
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Solo puedes subastar estampas que tengas duplicadas en tu álbum.
                  </p>

                  {dupStickers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      <p style={{ marginBottom: '1rem' }}>No tienes estampas duplicadas disponibles.</p>
                      <Link href="/dashboard/album" className="btn btn-primary btn-sm">
                        Ir al álbum
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Search */}
                      <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
                        <Search size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Busca por jugador, equipo o número..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          style={{ paddingLeft: '2.25rem' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '320px', overflowY: 'auto' }}>
                        {filteredDupes.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                            Sin resultados para "{search}"
                          </p>
                        ) : (
                          filteredDupes.map(d => (
                            <button
                              key={d.sticker_number}
                              type="button"
                              onClick={() => setSelectedNumber(d.sticker_number)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.625rem 0.875rem',
                                borderRadius: '0.5rem',
                                background:  selectedNumber === d.sticker_number ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
                                border:      selectedNumber === d.sticker_number ? '1px solid rgba(245,158,11,0.35)' : '1px solid var(--border)',
                                cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
                              }}
                            >
                              <span style={{ fontSize: '0.85rem' }}>
                                <span className="badge" style={{ fontSize: '0.68rem', marginRight: '0.5rem' }}>#{d.sticker_number}</span>
                                <strong>{d.sticker?.player_name ?? d.sticker_number}</strong>
                                <span style={{ color: 'var(--text-secondary)', marginLeft: '0.375rem' }}>{d.sticker?.team}</span>
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>×{d.quantity}</span>
                                {selectedNumber === d.sticker_number && <Check size={14} style={{ color: 'var(--gold)' }} />}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Preview of selected sticker */}
                {selectedSticker && (
                  <div className="card-gold" style={{ padding: '1rem 1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      Estampa seleccionada
                    </p>
                    <p style={{ fontWeight: 700, fontSize: '1rem' }}>
                      #{selectedSticker.number} — {selectedSticker.player_name}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                      {selectedSticker.team} · {selectedSticker.section}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleStickerStepSubmit}
                  disabled={!selectedNumber}
                >
                  Continuar a detalles →
                </button>
              </div>
            )}

            {/* ── STEP 2: Auction details ── */}
            {step === 'details' && (
              <form onSubmit={handleDetailsStepSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Payment hold notice */}
                <div className="card" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--gold)' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--gold)' }}>
                    <Package size={16} />
                    Envío físico (opcional)
                  </h3>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    Puedes subir tu estampa sin enviarla físicamente. El pago del ganador quedará <strong style={{ color: 'var(--gold)' }}>retenido</strong> hasta que el comprador confirme la entrega y la valide.
                  </p>
                </div>

                {/* Commission disclosure */}
                <div className="card" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--border)' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-secondary)' }}>
                    <TrendingUp size={15} />
                    Comisión de la plataforma
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                    La plataforma retiene el <strong style={{ color: 'var(--text-secondary)' }}>10%</strong> del precio final de la subasta.
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Ejemplo: Si cierra en <strong style={{ color: 'var(--text-secondary)' }}>$500 MXN</strong>, recibirás <strong style={{ color: 'var(--gold)' }}>$450 MXN</strong>.
                  </p>
                </div>

                {/* Form fields */}
                <div className="card">
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Gavel size={18} style={{ color: 'var(--gold)' }} />
                    Detalles de la subasta
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="auction-title">Título de la subasta</label>
                      <input
                        id="auction-title"
                        type="text"
                        className="form-input"
                        placeholder="ej. Messi — Argentina WC 2026"
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
                        placeholder="Estado de la estampa, notas de autenticidad, etc."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        rows={2}
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="auction-buy-now">Precio fijo "Cómpralo ya" (opcional)</label>
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

                    {/* Entry fee */}
                    <div className="form-group">
                      <label className="form-label">Cuota de entrada por participante (MXN)</label>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Cada participante pagará esta cuota para entrar a la sala y pujar.
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {ENTRY_FEE_OPTIONS.map(fee => (
                          <button
                            key={fee}
                            type="button"
                            onClick={() => setForm({ ...form, entryFee: fee })}
                            style={{
                              padding: '0.4rem 0.9rem',
                              borderRadius: '9999px',
                              fontSize: '0.82rem',
                              fontWeight: form.entryFee === fee ? 700 : 400,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              background: form.entryFee === fee ? 'var(--gold)' : 'transparent',
                              color:      form.entryFee === fee ? '#000' : 'var(--text-secondary)',
                              border:     form.entryFee === fee ? 'none' : '1px solid var(--border)',
                            }}
                          >
                            ${fee} MXN
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
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
                              color:      form.durationDays === days ? '#000' : 'var(--text-secondary)',
                              border:     form.durationDays === days ? 'none' : '1px solid var(--border)',
                            }}
                          >
                            {days === 1 ? '1 día' : `${days} días`}
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
                    onClick={() => setStep('sticker')}
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

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                      Resumen de la subasta
                    </h3>

                    {selectedSticker && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Estampa</span>
                        <span style={{ fontWeight: 600 }}>#{selectedSticker.number} — {selectedSticker.player_name} · {selectedSticker.team}</span>
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
                      <span style={{ color: 'var(--text-muted)' }}>Cuota de entrada por participante</span>
                      <span>${form.entryFee} MXN</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Duración</span>
                      <span>{form.durationDays} {form.durationDays === 1 ? 'día' : 'días'} · termina el {endsOnDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
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

                  <div className="glass-gold" style={{ padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--gold)' }}>Pago seguro vía MercadoPago.</strong>{' '}
                    Serás redirigido al pago. Una vez confirmado, la subasta se activará automáticamente. El pago del ganador quedará retenido hasta que confirme la entrega.
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
