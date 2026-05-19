'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import type { Trade, TradeInvitation, Profile } from '@/lib/types'
import { RefreshCw, Search, ArrowLeft, Check, X, MessageSquare, Plus } from 'lucide-react'
import { format } from 'date-fns'

type TabKey = 'proposals' | 'invitations'

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  searching: { label: 'Buscando', cls: 'badge-blue' },
  pending: { label: 'Pendiente', cls: 'badge badge-gold' },
  accepted: { label: 'Aceptado', cls: 'badge-green' },
  completed: { label: 'Completado', cls: '' },
  cancelled: { label: 'Cancelado', cls: 'badge-red' },
}

const INV_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'badge badge-gold' },
  accepted: { label: 'Aceptado', cls: 'badge-green' },
  declined: { label: 'Rechazado', cls: 'badge-red' },
}

export default function TradesPage() {
  const supabase = createClient()
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('proposals')

  const [trades, setTrades] = useState<Trade[]>([])
  const [invitations, setInvitations] = useState<TradeInvitation[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Auth check
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/trades')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setCurrentUser(profile)
      setLoading(false)
    }
    init()
  }, [])

  // Load proposals
  const loadTrades = async (userId: string) => {
    setLoadingData(true)
    const { data } = await supabase
      .from('trades')
      .select('*, offered:sticker_catalog!offered_sticker(*), wanted:sticker_catalog!wanted_sticker(*), invitations:trade_invitations(*)')
      .eq('proposer_id', userId)
      .order('created_at', { ascending: false })
    setTrades((data as Trade[]) || [])
    setLoadingData(false)
  }

  // Load invitations
  const loadInvitations = async (userId: string) => {
    setLoadingData(true)
    const { data } = await supabase
      .from('trade_invitations')
      .select('*, trade:trades(*, offered:sticker_catalog!offered_sticker(*), wanted:sticker_catalog!wanted_sticker(*)), proposer:profiles!proposer_id(username, full_name)')
      .eq('invited_user_id', userId)
      .order('created_at', { ascending: false })
    setInvitations((data as TradeInvitation[]) || [])
    setLoadingData(false)
  }

  useEffect(() => {
    if (!currentUser) return
    if (activeTab === 'proposals') {
      loadTrades(currentUser.id)
    } else {
      loadInvitations(currentUser.id)
    }
  }, [currentUser, activeTab])

  const handlePaySearch = async (tradeId: string) => {
    setActionLoading(tradeId)
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'trade_search', referenceId: tradeId }),
      })
      const { init_point, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = init_point
    } catch (err: any) {
      showToast(err.message || 'Error al procesar pago', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelTrade = async (tradeId: string) => {
    setActionLoading(tradeId)
    const { error } = await supabase
      .from('trades')
      .update({ status: 'cancelled' })
      .eq('id', tradeId)
    if (error) {
      showToast('Error al cancelar', 'error')
    } else {
      showToast('Propuesta cancelada', 'success')
      if (currentUser) loadTrades(currentUser.id)
    }
    setActionLoading(null)
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    setActionLoading(invitationId)
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'trade_accept', referenceId: invitationId }),
      })
      const { init_point, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = init_point
    } catch (err: any) {
      showToast(err.message || 'Error al procesar pago', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    setActionLoading(invitationId)
    const { error } = await supabase
      .from('trade_invitations')
      .update({ status: 'declined' })
      .eq('id', invitationId)
    if (error) {
      showToast('Error al rechazar', 'error')
    } else {
      showToast('Invitación rechazada', 'info')
      if (currentUser) loadInvitations(currentUser.id)
    }
    setActionLoading(null)
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
        <div className="container-main" style={{ paddingTop: '2rem' }}>
          <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
            <ArrowLeft size={14} /> Panel
          </Link>

          {/* Header */}
          <div
            className="page-header"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}
          >
            <div>
              <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={24} style={{ color: 'var(--gold)' }} />
                Intercambios
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Busca y gestiona tus intercambios de estampas
              </p>
            </div>
            <Link href="/trades/new" className="btn btn-primary">
              <Plus size={16} />
              Nueva búsqueda
            </Link>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: '1.5rem' }}>
            <button
              className={`tab ${activeTab === 'proposals' ? 'active' : ''}`}
              onClick={() => setActiveTab('proposals')}
            >
              Mis Propuestas
            </button>
            <button
              className={`tab ${activeTab === 'invitations' ? 'active' : ''}`}
              onClick={() => setActiveTab('invitations')}
            >
              Invitaciones recibidas
              {invitations.filter((i) => i.status === 'pending').length > 0 && (
                <span
                  className="badge badge-gold"
                  style={{ marginLeft: '0.4rem', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}
                >
                  {invitations.filter((i) => i.status === 'pending').length}
                </span>
              )}
            </button>
          </div>

          {/* Loading */}
          {loadingData && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="skeleton" style={{ width: '100%', height: '120px', borderRadius: '1rem' }} />
            </div>
          )}

          {/* MY PROPOSALS */}
          {!loadingData && activeTab === 'proposals' && (
            <>
              {trades.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <Search size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Sin propuestas</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    No tienes propuestas. ¡Crea tu primera búsqueda de intercambio!
                  </p>
                  <Link href="/trades/new" className="btn btn-primary">
                    <Plus size={16} />
                    Nueva búsqueda
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {trades.map((trade) => {
                    const statusInfo = STATUS_LABELS[trade.status] ?? { label: trade.status, cls: '' }
                    const offered = trade.offered as any
                    const wanted = trade.wanted as any
                    const invCount = (trade.invitations as any[])?.length ?? 0
                    const isActioning = actionLoading === trade.id

                    return (
                      <div key={trade.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {/* Top row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {format(new Date(trade.created_at), 'dd MMM yyyy')}
                          </span>
                        </div>

                        {/* Sticker info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(59,130,246,0.15)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--sapphire)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Ofrezco
                            </p>
                            <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                              {offered?.player_name ?? trade.offered_sticker}
                            </p>
                            {offered?.team && (
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{offered.team}</p>
                            )}
                            <span className="badge" style={{ marginTop: '0.25rem', fontSize: '0.68rem' }}>
                              #{trade.offered_sticker}
                            </span>
                          </div>
                          <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Quiero
                            </p>
                            <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                              {wanted?.player_name ?? trade.wanted_sticker}
                            </p>
                            {wanted?.team && (
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{wanted.team}</p>
                            )}
                            <span className="badge badge-gold" style={{ marginTop: '0.25rem', fontSize: '0.68rem' }}>
                              #{trade.wanted_sticker}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          {trade.status === 'searching' && !trade.search_fee_paid && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handlePaySearch(trade.id)}
                              disabled={isActioning}
                            >
                              Pagar búsqueda — $50 MXN
                            </button>
                          )}
                          {trade.status === 'pending' && invCount > 0 && (
                            <Link
                              href={`/trades?tab=invitations`}
                              className="btn btn-secondary btn-sm"
                              onClick={() => setActiveTab('invitations')}
                            >
                              Ver invitaciones ({invCount})
                            </Link>
                          )}
                          {(trade.status === 'searching' || trade.status === 'pending') && (
                            <button
                              className="btn btn-sm"
                              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--crimson)', border: '1px solid rgba(239,68,68,0.2)' }}
                              onClick={() => handleCancelTrade(trade.id)}
                              disabled={isActioning}
                            >
                              <X size={14} />
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* INVITATIONS */}
          {!loadingData && activeTab === 'invitations' && (
            <>
              {invitations.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <MessageSquare size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Sin invitaciones</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    No has recibido invitaciones de intercambio aún.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {invitations.map((inv) => {
                    const trade = inv.trade as any
                    const proposer = inv.proposer as any
                    const offered = trade?.offered as any
                    const wanted = trade?.wanted as any
                    const statusInfo = INV_STATUS_LABELS[inv.status] ?? { label: inv.status, cls: '' }
                    const isActioning = actionLoading === inv.id
                    const isDeclined = inv.status === 'declined'

                    return (
                      <div
                        key={inv.id}
                        className="card"
                        style={{
                          opacity: isDeclined ? 0.55 : 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.875rem',
                        }}
                      >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--gold)' }}>@{proposer?.username ?? '?'}</span>
                            {' '}quiere intercambiar contigo
                          </span>
                          <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
                        </div>

                        {/* Stickers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(16,185,129,0.15)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--emerald)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Te ofrece
                            </p>
                            <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{offered?.player_name ?? '?'}</p>
                            {offered?.team && (
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{offered.team}</p>
                            )}
                          </div>
                          <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              A cambio de
                            </p>
                            <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{wanted?.player_name ?? '?'}</p>
                            {wanted?.team && (
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{wanted.team}</p>
                            )}
                          </div>
                        </div>

                        {/* Date */}
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {format(new Date(inv.created_at), 'dd MMM yyyy, HH:mm')}
                        </p>

                        {/* Actions */}
                        {inv.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleAcceptInvitation(inv.id)}
                              disabled={isActioning}
                            >
                              <Check size={14} />
                              Aceptar — $20 MXN
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--crimson)', border: '1px solid rgba(239,68,68,0.2)' }}
                              onClick={() => handleDeclineInvitation(inv.id)}
                              disabled={isActioning}
                            >
                              <X size={14} />
                              Rechazar
                            </button>
                          </div>
                        )}
                        {inv.status === 'accepted' && (
                          <Link href={`/trades/${inv.id}`} className="btn btn-primary btn-sm">
                            <MessageSquare size={14} />
                            Ir al Chat
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
