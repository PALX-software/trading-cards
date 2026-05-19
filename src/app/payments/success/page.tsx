'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AuctionQR from '@/components/AuctionQR'
import ToastContainer from '@/components/Toast'
import type { PaymentType } from '@/lib/types'

const SUCCESS_MESSAGES: Record<PaymentType, string> = {
  membership: 'Tu membresía ha sido activada. ¡Bienvenido!',
  auction_creation: 'Tu subasta ha sido creada y está activa.',
  auction_entry: 'Te has unido a la subasta exitosamente.',
  trade_search: 'Búsqueda iniciada. Te notificaremos cuando encontremos matches.',
  trade_accept: 'Intercambio aceptado. El chat está ahora disponible.',
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const externalReferenceRaw = searchParams.get('external_reference')

  let type: PaymentType | null = null
  let referenceId: string | null = null

  if (externalReferenceRaw) {
    try {
      const parsed = JSON.parse(externalReferenceRaw)
      type = parsed?.type ?? null
      referenceId = parsed?.referenceId ?? null
    } catch { /* ignore */ }
  }

  if (type === 'auction_creation') {
    return (
      <>
        <Navbar />
        <ToastContainer />
        <main className="container-main" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            {/* Success header */}
            <div className="card card-gold" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle
                size={64}
                color="var(--emerald)"
                style={{ margin: '0 auto 1.25rem' }}
              />
              <h1 className="page-header" style={{ marginBottom: '0.75rem' }}>
                ¡Subasta creada!
              </h1>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {SUCCESS_MESSAGES.auction_creation}
              </p>
            </div>

            {/* Verification reminder */}
            <div style={{
              background: 'rgba(245,158,11,0.07)',
              border: '1px solid var(--border-gold)',
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
            }}>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                📦 Próximo paso: Envía tu tarjeta para verificación
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                Tu subasta se activará una vez que verifiquemos tu tarjeta.
              </p>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Dirección:
              </p>
              <address style={{ fontStyle: 'normal', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Calle 30 Número 19<br />
                Zona Cementos Atoyac, Puebla, Puebla, C.P. 72023
              </address>
            </div>

            {/* QR section */}
            {referenceId && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Comparte tu subasta
                </h2>
                <AuctionQR
                  auctionId={referenceId}
                  auctionTitle="Subasta FIFA WC"
                  playerName="Tu tarjeta"
                />
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {referenceId && (
                <Link
                  href={`/auctions/${referenceId}`}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                >
                  Ver mi subasta
                </Link>
              )}
              <Link
                href="/dashboard"
                className="btn btn-secondary btn-lg"
                style={{ flex: 1 }}
              >
                Ir al Dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Generic success layout for other payment types
  const message = type && SUCCESS_MESSAGES[type]
    ? SUCCESS_MESSAGES[type]
    : 'Tu pago ha sido procesado exitosamente.'

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className="container-main" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div className="card card-gold" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <CheckCircle
            size={64}
            color="var(--emerald)"
            style={{ margin: '0 auto 1.5rem' }}
          />
          <h1 className="page-header" style={{ marginBottom: '1rem' }}>
            ¡Pago exitoso!
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            {message}
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Ir al Dashboard
          </Link>
        </div>
      </main>
    </>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '6rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
