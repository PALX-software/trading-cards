'use client'

import { Suspense, useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import type { Profile, UserSticker } from '@/lib/types'
import { STICKER_CATALOG } from '@/lib/catalog'
import type { StickerDef } from '@/lib/catalog'
import { ArrowLeft, Search, RefreshCw, Check } from 'lucide-react'

interface DupSticker extends Omit<UserSticker, 'sticker'> {
  sticker: StickerDef | null | undefined
}

function NewTradeContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefilledNumber = searchParams.get('sticker') ?? ''

  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const [dupStickers, setDupStickers] = useState<DupSticker[]>([])
  const [offeredNumber, setOfferedNumber] = useState<string>(prefilledNumber)

  const [wantedSearch, setWantedSearch] = useState('')
  const [wantedNumber, setWantedNumber] = useState<string>('')

  const [submitting, setSubmitting] = useState(false)

  // Auth + membership check
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/trades/new')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        router.push('/auth/login')
        return
      }
      if (!profile.membership_paid && !profile.is_admin) {
        router.push('/dashboard?membership=required')
        return
      }
      setCurrentUser(profile)

      // Load user's duplicate stickers (quantity > 1)
      const { data: dupData } = await supabase
        .from('user_stickers')
        .select('*, sticker:sticker_catalog(*)')
        .eq('user_id', user.id)
        .gt('quantity', 1)

      setDupStickers((dupData as DupSticker[]) || [])
      setLoading(false)
    }
    init()
  }, [])

  // Pre-select offered if URL param is set and available in dup stickers
  useEffect(() => {
    if (prefilledNumber && dupStickers.length > 0) {
      const found = dupStickers.find((d) => d.sticker_number === prefilledNumber)
      if (found) setOfferedNumber(prefilledNumber)
    }
  }, [prefilledNumber, dupStickers])

  // Catalog search for "wanted" sticker
  const wantedResults = useMemo<StickerDef[]>(() => {
    if (!wantedSearch.trim()) return []
    const q = wantedSearch.toLowerCase()
    return STICKER_CATALOG.filter(
      (s) =>
        s.player_name.toLowerCase().includes(q) ||
        s.team.toLowerCase().includes(q) ||
        s.number.includes(q)
    ).slice(0, 20)
  }, [wantedSearch])

  const offeredSticker = useMemo(() => {
    const dup = dupStickers.find((d) => d.sticker_number === offeredNumber)
    return dup?.sticker ?? null
  }, [offeredNumber, dupStickers])

  const wantedSticker = useMemo(() => {
    return STICKER_CATALOG.find((s) => s.number === wantedNumber) ?? null
  }, [wantedNumber])

  const handleSubmit = async () => {
    if (!currentUser || !offeredNumber || !wantedNumber) {
      showToast('Selecciona ambas estampas', 'error')
      return
    }
    if (offeredNumber === wantedNumber) {
      showToast('No puedes intercambiar la misma estampa', 'error')
      return
    }

    setSubmitting(true)
    try {
      const { data: trade, error: insertError } = await supabase
        .from('trades')
        .insert({
          proposer_id: currentUser.id,
          offered_sticker: offeredNumber,
          wanted_sticker: wantedNumber,
          search_fee_paid: false,
          status: 'searching',
        })
        .select()
        .single()

      if (insertError) throw insertError

      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'trade_search', referenceId: trade.id }),
      })
      const { init_point, error: payError } = await res.json()
      if (payError) throw new Error(payError)

      window.location.href = init_point
    } catch (err: any) {
      showToast(err.message || 'Error al crear el intercambio', 'error')
      setSubmitting(false)
    }
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

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="container-main" style={{ paddingTop: '2rem', maxWidth: '640px' }}>
          <Link href="/trades" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
            <ArrowLeft size={14} /> Intercambios
          </Link>

          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={22} style={{ color: 'var(--gold)' }} />
              Nueva búsqueda de intercambio
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Indica qué estampa ofreces y cuál deseas recibir. Costo: $50 MXN
            </p>
          </div>

          {/* Section 1: Offered sticker */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
              ¿Qué estampa ofreces?
            </h2>
            {dupStickers.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No tienes estampas duplicadas disponibles para intercambiar.
              </p>
            ) : (
              <select
                className="form-input"
                value={offeredNumber}
                onChange={(e) => setOfferedNumber(e.target.value)}
              >
                <option value="">Selecciona una estampa...</option>
                {dupStickers.map((d) => (
                  <option key={d.sticker_number} value={d.sticker_number}>
                    #{d.sticker_number} {d.sticker?.player_name ?? d.sticker_number} ({d.sticker?.team ?? '?'}) — {d.quantity} copias
                  </option>
                ))}
              </select>
            )}
            {offeredSticker && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(59,130,246,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(59,130,246,0.15)', fontSize: '0.85rem' }}>
                <strong>#{offeredSticker.number}</strong> — {offeredSticker.player_name} · {offeredSticker.team} · {offeredSticker.section}
              </div>
            )}
          </div>

          {/* Section 2: Wanted sticker */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
              ¿Qué estampa quieres?
            </h2>
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Busca por jugador, equipo o número..."
                value={wantedSearch}
                onChange={(e) => setWantedSearch(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>

            {wantedNumber && !wantedSearch && (
              <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  <strong>#{wantedSticker?.number}</strong> — {wantedSticker?.player_name} · {wantedSticker?.team}
                </span>
                <button
                  className="btn btn-sm"
                  style={{ padding: '0.2rem 0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => setWantedNumber('')}
                >
                  <span style={{ fontSize: '0.75rem' }}>Cambiar</span>
                </button>
              </div>
            )}

            {wantedSearch && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '280px', overflowY: 'auto' }}>
                {wantedResults.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                    Sin resultados para "{wantedSearch}"
                  </p>
                ) : (
                  wantedResults.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => {
                        setWantedNumber(s.number)
                        setWantedSearch('')
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        background: wantedNumber === s.number ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)',
                        border: wantedNumber === s.number ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '0.85rem' }}>
                        <span className="badge" style={{ fontSize: '0.68rem', marginRight: '0.5rem' }}>#{s.number}</span>
                        <strong>{s.player_name}</strong>
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '0.375rem' }}>{s.team}</span>
                      </span>
                      {wantedNumber === s.number && <Check size={14} style={{ color: 'var(--gold)' }} />}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          {(offeredSticker || wantedSticker) && (
            <div className="card-gold" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>Vista previa del intercambio</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>OFRECERÁS</p>
                  {offeredSticker ? (
                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                      #{offeredSticker.number} {offeredSticker.player_name}
                      <br />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.78rem' }}>{offeredSticker.team}</span>
                    </p>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin seleccionar</p>
                  )}
                </div>
                <RefreshCw size={18} style={{ color: 'var(--gold)' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>RECIBIRÁS</p>
                  {wantedSticker ? (
                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                      #{wantedSticker.number} {wantedSticker.player_name}
                      <br />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.78rem' }}>{wantedSticker.team}</span>
                    </p>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin seleccionar</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '1rem', padding: '0.875rem' }}
            onClick={handleSubmit}
            disabled={!offeredNumber || !wantedNumber || submitting || dupStickers.length === 0}
          >
            <RefreshCw size={18} />
            {submitting ? 'Procesando...' : 'Buscar intercambio — $50 MXN'}
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            Serás redirigido a MercadoPago para completar el pago
          </p>
        </div>
      </main>
    </>
  )
}

export default function NewTradePage() {
  return (
    <Suspense fallback={<><Navbar /><div style={{ minHeight: '60vh' }} /></>}>
      <NewTradeContent />
    </Suspense>
  )
}
