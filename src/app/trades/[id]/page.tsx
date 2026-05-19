'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import Chat from '@/components/Chat'
import type { Profile, TradeInvitation } from '@/lib/types'
import { ArrowLeft, RefreshCw, Check, X } from 'lucide-react'
import { format } from 'date-fns'

const INV_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'badge badge-gold' },
  accepted: { label: 'Aceptado', cls: 'badge-green' },
  declined: { label: 'Rechazado', cls: 'badge-red' },
}

export default function TradeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const invitationId = params.id as string

  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [invitation, setInvitation] = useState<TradeInvitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/trades/' + invitationId)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setCurrentUser(profile)

      const { data: inv } = await supabase
        .from('trade_invitations')
        .select(`
          *,
          trade:trades(
            *,
            offered:sticker_catalog!offered_sticker(*),
            wanted:sticker_catalog!wanted_sticker(*)
          ),
          proposer:profiles!proposer_id(username, full_name, avatar_url),
          invited_user:profiles!invited_user_id(username, full_name, avatar_url)
        `)
        .eq('id', invitationId)
        .single()

      if (!inv) {
        setLoading(false)
        return
      }

      setInvitation(inv as TradeInvitation)

      // Auth: must be proposer or invited user
      if (user.id === inv.proposer_id || user.id === inv.invited_user_id) {
        setAuthorized(true)
      }

      setLoading(false)
    }
    init()
  }, [invitationId])

  const handleAccept = async () => {
    if (!invitation) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'trade_accept', referenceId: invitation.id }),
      })
      const { init_point, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = init_point
    } catch (err: any) {
      showToast(err.message || 'Error al procesar pago', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDecline = async () => {
    if (!invitation) return
    setActionLoading(true)
    const { error } = await supabase
      .from('trade_invitations')
      .update({ status: 'declined' })
      .eq('id', invitation.id)
    if (error) {
      showToast('Error al rechazar', 'error')
    } else {
      showToast('Invitación rechazada', 'info')
      router.push('/trades')
    }
    setActionLoading(false)
  }

  const handleMarkCompleted = async () => {
    if (!invitation?.trade) return
    setActionLoading(true)
    const { error } = await supabase
      .from('trades')
      .update({ status: 'completed' })
      .eq('id', (invitation.trade as any).id)
    if (error) {
      showToast('Error al marcar como completado', 'error')
    } else {
      showToast('Intercambio marcado como completado', 'success')
      // Refresh
      const { data: inv } = await supabase
        .from('trade_invitations')
        .select(`
          *,
          trade:trades(*, offered:sticker_catalog!offered_sticker(*), wanted:sticker_catalog!wanted_sticker(*)),
          proposer:profiles!proposer_id(username, full_name, avatar_url),
          invited_user:profiles!invited_user_id(username, full_name, avatar_url)
        `)
        .eq('id', invitationId)
        .single()
      if (inv) setInvitation(inv as TradeInvitation)
    }
    setActionLoading(false)
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

  if (!invitation) {
    return (
      <>
        <Navbar />
        <div className="container-main" style={{ paddingTop: '4rem', textAlign: 'center' }}>
          <h2>Invitación no encontrada</h2>
          <Link href="/trades" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={14} /> Volver a Intercambios
          </Link>
        </div>
      </>
    )
  }

  if (!authorized) {
    return (
      <>
        <Navbar />
        <div className="container-main" style={{ paddingTop: '4rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--crimson)' }}>No autorizado</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            No tienes acceso a este intercambio.
          </p>
          <Link href="/trades" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={14} /> Volver
          </Link>
        </div>
      </>
    )
  }

  const trade = invitation.trade as any
  const proposer = invitation.proposer as any
  const invitedUser = invitation.invited_user as any
  const offered = trade?.offered as any
  const wanted = trade?.wanted as any
  const statusInfo = INV_STATUS_LABELS[invitation.status] ?? { label: invitation.status, cls: '' }
  const tradeStatus = trade?.status ?? ''

  const isInvitedUser = currentUser?.id === invitation.invited_user_id
  const isProposer = currentUser?.id === invitation.proposer_id

  const otherUserName = isProposer ? invitedUser?.username : proposer?.username

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="container-main" style={{ paddingTop: '2rem', maxWidth: '700px' }}>
          <Link href="/trades" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
            <ArrowLeft size={14} /> Intercambios
          </Link>

          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={22} style={{ color: 'var(--gold)' }} />
              Detalle del intercambio
            </h1>
          </div>

          {/* Trade details card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            {/* Status + date */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {format(new Date(invitation.created_at), 'dd MMM yyyy, HH:mm')}
              </span>
            </div>

            {/* Participants */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Proponente
                </p>
                <p style={{ fontWeight: 700 }}>@{proposer?.username ?? '?'}</p>
                {proposer?.full_name && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{proposer.full_name}</p>
                )}
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Invitado
                </p>
                <p style={{ fontWeight: 700 }}>@{invitedUser?.username ?? '?'}</p>
                {invitedUser?.full_name && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{invitedUser.full_name}</p>
                )}
              </div>
            </div>

            {/* Stickers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(59,130,246,0.15)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--sapphire)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                  Ofrece
                </p>
                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{offered?.player_name ?? '?'}</p>
                {offered?.team && <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{offered.team}</p>}
                <span className="badge" style={{ marginTop: '0.25rem', fontSize: '0.68rem' }}>#{trade?.offered_sticker}</span>
              </div>
              <RefreshCw size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(245,158,11,0.15)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                  A cambio de
                </p>
                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{wanted?.player_name ?? '?'}</p>
                {wanted?.team && <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{wanted.team}</p>}
                <span className="badge badge-gold" style={{ marginTop: '0.25rem', fontSize: '0.68rem' }}>#{trade?.wanted_sticker}</span>
              </div>
            </div>
          </div>

          {/* Actions for pending invitation (invited user only) */}
          {invitation.status === 'pending' && isInvitedUser && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                ¿Aceptas el intercambio?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Aceptar tiene un costo de <strong style={{ color: 'var(--gold)' }}>$20 MXN</strong>.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleAccept}
                  disabled={actionLoading}
                >
                  <Check size={16} />
                  Aceptar — $20 MXN
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--crimson)', border: '1px solid rgba(239,68,68,0.2)' }}
                  onClick={handleDecline}
                  disabled={actionLoading}
                >
                  <X size={14} />
                  Rechazar
                </button>
              </div>
            </div>
          )}

          {/* Mark completed */}
          {invitation.status === 'accepted' && invitation.acceptance_fee_paid && tradeStatus === 'accepted' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={handleMarkCompleted}
                disabled={actionLoading}
              >
                <Check size={16} />
                Marcar como completado
              </button>
            </div>
          )}

          {/* Chat */}
          {invitation.status === 'accepted' && invitation.acceptance_fee_paid && currentUser && (
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                Chat de coordinación
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Coordina con la otra parte para completar el intercambio de estampas.
              </p>
              <Chat
                roomType="trade"
                roomId={invitation.id}
                currentUserId={currentUser.id}
                otherUserName={otherUserName}
              />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
