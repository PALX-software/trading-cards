'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Zap, LayoutDashboard, Users, CreditCard,
  Gavel, RefreshCw, ArrowLeft, LogOut,
} from 'lucide-react'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin#usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin#pagos', label: 'Pagos', icon: CreditCard },
  { href: '/admin#subastas', label: 'Subastas', icon: Gavel },
  { href: '/admin#intercambios', label: 'Intercambios', icon: RefreshCw },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-gold)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        height: '56px',
      }}>
        {/* Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--gold)',
          fontWeight: 700,
          fontSize: '1rem',
          marginRight: '1.5rem',
          whiteSpace: 'nowrap',
        }}>
          <Zap size={18} />
          Admin Panel
        </div>

        {/* Nav links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          flex: 1,
          overflowX: 'auto',
        }}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith('/admin') && href !== '/admin'
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              border: '1px solid var(--border)',
              transition: 'all 0.15s',
            }}
          >
            <ArrowLeft size={14} />
            Volver al sitio
          </Link>

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              color: 'var(--crimson)',
              background: 'transparent',
              border: '1px solid rgba(239,68,68,0.3)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
