'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { XCircle, Info } from 'lucide-react'
import Navbar from '@/components/Navbar'

function FailureContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const status = searchParams.get('status') ?? 'failure'
  const isPending = status === 'pending'

  return (
    <main className="container-main" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="card" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        {isPending ? (
          <Info size={64} color="var(--gold)" style={{ margin: '0 auto 1.5rem' }} />
        ) : (
          <XCircle size={64} color="var(--crimson)" style={{ margin: '0 auto 1.5rem' }} />
        )}

        <h1 className="page-header" style={{ marginBottom: '1rem', color: isPending ? 'var(--gold)' : 'var(--crimson)' }}>
          {isPending ? 'Pago pendiente' : 'Pago fallido'}
        </h1>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          {isPending
            ? 'Tu pago está siendo procesado. Puede tomar unos minutos en completarse. Te notificaremos cuando se confirme.'
            : 'No se pudo completar el pago. Por favor intenta de nuevo o usa un método de pago diferente.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => router.back()}>
            Volver
          </button>
          <Link href="/dashboard" className="btn btn-secondary">
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function PaymentFailurePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<main className="container-main" style={{ paddingTop: '6rem' }} />}>
        <FailureContent />
      </Suspense>
    </>
  )
}
