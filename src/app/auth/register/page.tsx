'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Mail, Lock, User, CheckCircle2, Shield, Home } from 'lucide-react'
import ToastContainer, { showToast } from '@/components/Toast'
import { PRICING } from '@/lib/types'
import { useI18n } from '@/lib/i18n'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const { lang } = useI18n()
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [userId, setUserId] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Check if username exists
    const { data: existingUser } = await supabase.from('profiles').select('id').eq('username', form.username).single()
    if (existingUser) {
      showToast(lang === 'es' ? 'El usuario ya existe' : 'Username already taken', 'error')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { username: form.username },
      }
    })

    if (error) {
      showToast(error.message, 'error')
      setLoading(false)
    } else if (data.user) {
      setUserId(data.user.id)
      setStep('payment')
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!userId) return
    setLoading(true)

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'membership' }),
      })
      const data = await res.json()
      if (!res.ok || !data.init_point) {
        throw new Error(data.error || (lang === 'es' ? 'Error al crear preferencia de pago' : 'Failed to create payment'))
      }
      window.location.href = data.init_point
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : (lang === 'es' ? 'Error al procesar el pago' : 'Payment error'), 'error')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
    }}>
      <ToastContainer />
      <div className="hero-bg" />

      <Link href="/" className="btn btn-secondary btn-sm" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10 }}>
        <Home size={16} /> {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '900px', width: '100%', zIndex: 1 }}>
        {/* Left side info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="badge badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
            <Trophy size={14} /> FIFA World Cup Collector
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            {lang === 'es' ? 'Únete al Mercado' : 'Join the Premier'} <br />
            <span className="gradient-text">{lang === 'es' ? 'Mundial' : 'Marketplace'}</span>
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              lang === 'es' ? 'Acceso completo a compra y venta de tarjetas' : 'Full access to buy and sell trading cards',
              lang === 'es' ? 'Crea y participa en subastas en tiempo real' : 'Create and bid in real-time auctions',
              lang === 'es' ? 'Membresía de por vida, pago único' : 'Lifetime membership, one-time payment'
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--emerald)' }} />
                <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>{text}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ marginTop: '2.5rem', padding: '1.5rem', borderLeft: '4px solid var(--gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{lang === 'es' ? 'Cuota de Membresía' : 'Membership Fee'}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold)' }}>${PRICING.MEMBERSHIP_FEE} MXN</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {lang === 'es' ? 'Requerida para acceder a la plataforma.' : 'Required one-time fee to access the platform.'}
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          {step === 'form' ? (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {lang === 'es' ? 'Crear Cuenta' : 'Create Account'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                {lang === 'es' ? 'Paso 1: Configura tu perfil de coleccionista' : 'Step 1: Setup your collector profile'}
              </p>

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Usuario' : 'Username'}</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="cardking99"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Correo' : 'Email Address'}</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="collector@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Contraseña' : 'Password'}</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                  {loading ? (lang === 'es' ? 'Creando...' : 'Creating...') : (lang === 'es' ? 'Continuar al Pago' : 'Continue to Payment')}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {lang === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
                <Link href="/auth/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  {lang === 'es' ? 'Inicia sesión' : 'Sign in'}
                </Link>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Shield size={48} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {lang === 'es' ? 'Pagar Membresía' : 'Pay Membership'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {lang === 'es' ? 'Asegura tu cuenta de por vida' : 'Secure your lifetime platform access'}
                </p>
              </div>

              <div className="card-gold" style={{ textAlign: 'center', marginBottom: '2rem', padding: '2rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  {lang === 'es' ? 'Total a Pagar' : 'Total Due'}
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--gold)', lineHeight: 1 }}>
                  ${PRICING.MEMBERSHIP_FEE} <span style={{ fontSize: '1rem' }}>MXN</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? (lang === 'es' ? 'Procesando...' : 'Processing...') : (lang === 'es' ? `Pagar $${PRICING.MEMBERSHIP_FEE} MXN Seguro` : `Pay $${PRICING.MEMBERSHIP_FEE} MXN Securely`)}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🔒 {lang === 'es' ? 'Pago seguro con MercadoPago' : 'Secure payment via MercadoPago'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
