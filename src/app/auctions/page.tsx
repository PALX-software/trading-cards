'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import CountdownTimer from '@/components/CountdownTimer'
import ToastContainer, { showToast } from '@/components/Toast'
import type { Auction, Profile } from '@/lib/types'
import { PRICING, RARITY_LABELS } from '@/lib/types'
import { Gavel, Clock, ArrowRight, ShieldCheck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'

export default function AuctionsPage() {
  const supabase = createClient()
  const router = useRouter()
  const { lang } = useI18n()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<Profile | null>(null)
  const [enteringId, setEnteringId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
        setUser(data)
      }
    })

    fetchAuctions()

    const channel = supabase.channel('public:auctions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, () => {
        fetchAuctions()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchAuctions = async () => {
    const { data } = await supabase
      .from('auctions')
      .select('*, card:cards(*), seller:profiles(username)')
      .eq('status', 'active')
      .order('ends_at', { ascending: true })

    if (data) {
      const now = new Date().toISOString()
      const validAuctions = data.filter(a => a.ends_at > now && a.starts_at <= now)
      setAuctions(validAuctions)
    }
    setLoading(false)
  }

  const handleEnterAuction = async (auctionId: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!user.membership_paid) {
      showToast(lang === 'es' ? 'Se requiere membresía' : 'Membership required to join auctions', 'error')
      router.push('/auth/register')
      return
    }

    setEnteringId(auctionId)

    const { data: existingEntry } = await supabase
      .from('auction_participants')
      .select('id')
      .eq('auction_id', auctionId)
      .eq('user_id', user.id)
      .single()

    if (existingEntry) {
      router.push(`/auctions/${auctionId}`)
      return
    }

    const { error: payError } = await supabase.from('payments').insert({
      user_id: user.id,
      type: 'auction_entry',
      amount: PRICING.AUCTION_ENTRY_FEE,
      status: 'completed',
      payment_method: 'simulated'
    })

    if (payError) {
      showToast(lang === 'es' ? 'Error al cobrar entrada' : 'Failed to process entry fee', 'error')
      setEnteringId(null)
      return
    }

    const { error: partError } = await supabase.from('auction_participants').insert({
      auction_id: auctionId,
      user_id: user.id,
      fee_paid: true
    })

    if (partError) {
      showToast(lang === 'es' ? 'Error al ingresar' : 'Failed to join auction', 'error')
      setEnteringId(null)
      return
    }

    showToast(lang === 'es' ? 'Cuota de $10 MXN pagada. ¡Entrando!' : 'Entry fee paid. Joining auction!', 'success')
    router.push(`/auctions/${auctionId}`)
  }

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="page-header">
          <div className="container-main">
            <h1 className="page-title">
              ⚡ {lang === 'es' ? 'Subastas en' : 'Live'} <span className="gradient-text">{lang === 'es' ? 'Vivo' : 'Auctions'}</span>
            </h1>
            <p className="page-subtitle">
              {lang === 'es'
                ? `Costo de entrada: $${PRICING.AUCTION_ENTRY_FEE} MXN por sala para pujas ilimitadas.`
                : `Entry fee: $${PRICING.AUCTION_ENTRY_FEE} MXN per room to place unlimited bids.`}
            </p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '2rem' }}>
          {loading ? (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '1.25rem' }} />)}
            </div>
          ) : auctions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <Gavel size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {lang === 'es' ? 'No hay subastas activas' : 'No active auctions right now'}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {lang === 'es' ? 'Vuelve pronto para nuevas tarjetas FIFA World Cup' : 'Check back later for new FIFA World Cup cards'}
              </p>
              <Link href="/auctions/create" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                {lang === 'es' ? 'Crear Subasta' : 'Create an Auction'}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {auctions.map(auction => {
                const card = auction.card as any
                const rarityLabel = RARITY_LABELS[card?.rarity as keyof typeof RARITY_LABELS] || card?.rarity

                return (
                  <div key={auction.id} className={`card ${card?.rarity === 'legendary' ? 'card-gold' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div className={`badge ${card?.rarity === 'legendary' ? 'badge-gold' : 'badge-blue'}`}>
                        {rarityLabel}
                      </div>
                      <div className="badge badge-red" style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <Clock size={12} />
                        <CountdownTimer endsAt={auction.ends_at} />
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem', lineHeight: 1.2 }}>
                      {auction.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      {card?.player_name} • {card?.team} {card?.year}
                    </p>

                    <div className="divider" style={{ margin: '1rem 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'es' ? 'Puja Actual' : 'Current Bid'}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>
                          ${auction.current_price.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'es' ? 'Vendedor' : 'Seller'}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <User size={12} /> {(auction.seller as any)?.username}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <button
                        onClick={() => handleEnterAuction(auction.id)}
                        disabled={enteringId === auction.id}
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'space-between' }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShieldCheck size={16} />
                          {enteringId === auction.id ? (lang === 'es' ? 'Procesando...' : 'Processing...') : (lang === 'es' ? 'Ingresar a la Sala' : 'Enter Auction Room')}
                        </span>
                        {!enteringId && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem' }}>
                            ${PRICING.AUCTION_ENTRY_FEE} MXN <ArrowRight size={12} />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
