'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import { useI18n } from '@/lib/i18n'
import {
  Trophy, ShoppingBag, Gavel, LayoutDashboard,
  LogOut, User, Menu, X, Wallet, Globe
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang, toggleLang } = useI18n()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/marketplace', label: lang === 'es' ? 'Mercado' : 'Marketplace', icon: ShoppingBag },
    { href: '/auctions', label: lang === 'es' ? 'Subastas' : 'Auctions', icon: Gavel },
    ...(profile ? [{ href: '/dashboard', label: lang === 'es' ? 'Panel' : 'Dashboard', icon: LayoutDashboard }] : []),
  ]

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Trophy size={22} style={{ color: 'var(--gold)' }} />
          <span>World Cup</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.85rem' }}>Cards</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links" style={{ display: 'flex', gap: '0.25rem' }}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`navbar-link ${pathname.startsWith(href) ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          <button onClick={toggleLang} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.6rem' }} title={lang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}>
            <Globe size={16} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>{lang.toUpperCase()}</span>
          </button>

          {profile ? (
            <>
              {/* Balance */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--gold)',
              }}>
                <Wallet size={14} />
                ${profile.balance?.toFixed(2)} MXN
              </div>

              {/* Member badge */}
              {profile.membership_paid && (
                <div className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                  ✦ {lang === 'es' ? 'Miembro' : 'Member'}
                </div>
              )}

              {/* Avatar */}
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <div className="avatar" style={{ cursor: 'pointer' }}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} />
                  ) : (
                    profile.username?.[0]?.toUpperCase() || <User size={16} />
                  )}
                </div>
              </Link>

              <button
                onClick={handleSignOut}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.375rem' }}
              >
                <LogOut size={14} />
                {lang === 'es' ? 'Salir' : 'Sign out'}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-secondary btn-sm">
                {lang === 'es' ? 'Ingresar' : 'Sign in'}
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                {lang === 'es' ? 'Únete' : 'Join Now'}
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none' }}
            id="mobile-menu-btn"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`navbar-link ${pathname.startsWith(href) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
