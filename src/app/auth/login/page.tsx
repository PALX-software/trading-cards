'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Mail, Lock, ArrowRight, Home } from 'lucide-react'
import ToastContainer, { showToast } from '@/components/Toast'
import { useI18n } from '@/lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const { lang } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      showToast(lang === 'es' ? 'Credenciales incorrectas' : error.message, 'error')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
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
      <div className="hero-orb hero-orb-1" style={{ opacity: 0.5 }} />

      <Link href="/" className="btn btn-secondary btn-sm" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10 }}>
        <Home size={16} /> {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
      </Link>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '3.5rem', height: '3.5rem', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(245,158,11,0.3)',
            }}>
              <Trophy size={24} style={{ color: 'var(--gold)' }} />
            </div>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {lang === 'es' ? 'Bienvenido' : 'Welcome Back'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {lang === 'es' ? 'Ingresa para gestionar tus tarjetas' : 'Sign in to your collector account'}
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">{lang === 'es' ? 'Correo Electrónico' : 'Email Address'}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="collector@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (lang === 'es' ? 'Ingresando...' : 'Signing in...') : (
              <>
                {lang === 'es' ? 'Iniciar Sesión' : 'Sign In'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {lang === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
          <Link href="/auth/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>
            {lang === 'es' ? 'Únete y obtén membresía' : 'Join & get membership'}
          </Link>
        </div>
      </div>
    </div>
  )
}
