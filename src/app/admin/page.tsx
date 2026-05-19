'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Users, CreditCard, Gavel, RefreshCw,
  ShieldCheck, ShieldOff, CheckCircle, XCircle,
  AlertCircle, Clock, ChevronDown,
} from 'lucide-react'
import { format } from 'date-fns'
import type { Profile, Payment, Auction, Trade } from '@/lib/types'

// ─── Extended types with joins ───────────────────────────────
interface AdminProfile extends Profile {
  is_admin: boolean
  email?: string
}

interface AdminPayment extends Omit<Payment, 'user_id'> {
  user_id: string
  user?: Pick<Profile, 'username' | 'avatar_url'>
}

// Use Omit to override the narrower joined types
interface AdminAuction extends Omit<Auction, 'seller'> {
  seller?: Pick<Profile, 'username'>
}

interface AdminTrade extends Omit<Trade, 'proposer'> {
  proposer?: Pick<Profile, 'username'>
}

// ─── Helpers ─────────────────────────────────────────────────
function fmtMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(s: string) {
  try { return format(new Date(s), 'dd/MM/yy HH:mm') } catch { return s }
}

type TabId = 'usuarios' | 'pagos' | 'subastas' | 'intercambios'

// ─── Payment status badge ─────────────────────────────────────
function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, React.CSSProperties> = {
    completed: { background: 'rgba(16,185,129,0.15)', color: 'var(--emerald)', border: '1px solid rgba(16,185,129,0.3)' },
    pending:   { background: 'rgba(245,158,11,0.12)', color: 'var(--gold)',    border: '1px solid rgba(245,158,11,0.3)' },
    failed:    { background: 'rgba(239,68,68,0.12)',  color: 'var(--crimson)', border: '1px solid rgba(239,68,68,0.3)'  },
  }
  const icons: Record<string, React.ReactNode> = {
    completed: <CheckCircle size={12} />,
    pending:   <Clock size={12} />,
    failed:    <XCircle size={12} />,
  }
  const style = styles[status] ?? styles.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
      ...style,
    }}>
      {icons[status] ?? <AlertCircle size={12} />}
      {status}
    </span>
  )
}

// ─── Boolean badge ────────────────────────────────────────────
function BoolBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
      ...(value
        ? { background: 'rgba(16,185,129,0.15)', color: 'var(--emerald)', border: '1px solid rgba(16,185,129,0.3)' }
        : { background: 'rgba(107,114,128,0.15)', color: 'var(--text-muted)', border: '1px solid var(--border)' }),
    }}>
      {value ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {value ? trueLabel : falseLabel}
    </span>
  )
}

// ─── Stat card ────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: React.ElementType; color: string
}) {
  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: 44, height: 44, borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}20`, flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{label}</div>
      </div>
    </div>
  )
}

// ─── Table wrapper ────────────────────────────────────────────
function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        {children}
      </table>
    </div>
  )
}

const TH: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <th style={{
    padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600,
    color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', ...style,
  }}>
    {children}
  </th>
)

const TD: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; colSpan?: number }> = ({ children, style, colSpan }) => (
  <td colSpan={colSpan} style={{
    padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
    color: '#e5e7eb', verticalAlign: 'middle', ...style,
  }}>
    {children}
  </td>
)

// ─── Main page ────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab]                 = useState<TabId>('usuarios')
  const [loading, setLoading]         = useState(true)
  const [users, setUsers]             = useState<AdminProfile[]>([])
  const [payments, setPayments]       = useState<AdminPayment[]>([])
  const [auctions, setAuctions]       = useState<AdminAuction[]>([])
  const [trades, setTrades]           = useState<AdminTrade[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast]             = useState<{ msg: string; ok: boolean } | null>(null)

  // Inline balance editor state
  const [editBalanceId, setEditBalanceId]     = useState<string | null>(null)
  const [editBalanceValue, setEditBalanceValue] = useState<string>('')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [usersRes, paymentsRes, auctionsRes, tradesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*, user:profiles!user_id(username, avatar_url)').order('created_at', { ascending: false }).limit(200),
      supabase.from('auctions').select('*, seller:profiles!seller_id(username)').order('created_at', { ascending: false }).limit(200),
      supabase.from('trades').select('*, proposer:profiles!proposer_id(username)').order('created_at', { ascending: false }).limit(200),
    ])
    setUsers((usersRes.data as AdminProfile[]) || [])
    setPayments((paymentsRes.data as AdminPayment[]) || [])
    setAuctions((auctionsRes.data as AdminAuction[]) || [])
    setTrades((tradesRes.data as AdminTrade[]) || [])
    setLoading(false)
  }

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function patchUser(id: string, fields: Record<string, unknown>) {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      showToast('Usuario actualizado')
      // Refresh users list
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers((data as AdminProfile[]) || [])
    } catch (e: unknown) {
      showToast((e as Error).message, false)
    } finally {
      setActionLoading(null)
    }
  }

  async function forceCloseAuction(id: string) {
    setActionLoading(`auction-${id}`)
    try {
      const { error } = await supabase
        .from('auctions')
        .update({ status: 'cancelled' })
        .eq('id', id)
      if (error) throw new Error(error.message)
      showToast('Subasta cerrada')
      setAuctions(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch (e: unknown) {
      showToast((e as Error).message, false)
    } finally {
      setActionLoading(null)
    }
  }

  // Derived stats
  const totalPaymentsMXN = payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0)
  const activeAuctions   = auctions.filter(a => a.status === 'active').length
  const activeTrades     = trades.filter(t => t.status === 'searching' || t.status === 'pending').length

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'usuarios',     label: 'Usuarios',     icon: Users },
    { id: 'pagos',        label: 'Pagos',         icon: CreditCard },
    { id: 'subastas',     label: 'Subastas',      icon: Gavel },
    { id: 'intercambios', label: 'Intercambios',  icon: RefreshCw },
  ]

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999,
          background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: toast.ok ? 'var(--emerald)' : 'var(--crimson)',
          border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: '8px', padding: '0.75rem 1.25rem', fontSize: '0.875rem', fontWeight: 500,
        }}>
          {toast.msg}
        </div>
      )}

      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>
        Panel de Administración
      </h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Usuarios"       value={users.length}         icon={Users}     color="var(--sapphire)" />
        <StatCard label="Total Pagos (MXN)"    value={fmtMXN(totalPaymentsMXN)} icon={CreditCard} color="var(--emerald)" />
        <StatCard label="Subastas Activas"     value={activeAuctions}       icon={Gavel}     color="var(--gold)" />
        <StatCard label="Intercambios Activos" value={activeTrades}         icon={RefreshCw} color="var(--crimson)" />
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab${tab === id ? ' active' : ''}`}
            onClick={() => setTab(id)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Cargando datos...
        </div>
      ) : (
        <>
          {/* ── USUARIOS ─────────────────────────────────── */}
          {tab === 'usuarios' && (
            <TableWrap>
              <thead>
                <tr>
                  <TH>Usuario</TH>
                  <TH>Balance</TH>
                  <TH>Membresía</TH>
                  <TH>Admin</TH>
                  <TH>Registrado</TH>
                  <TH>Acciones</TH>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <TD>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {u.username?.[0]?.toUpperCase() ?? '?'}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{u.username}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.full_name ?? '—'}</div>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      {editBalanceId === u.id ? (
                        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                          <input
                            type="number"
                            value={editBalanceValue}
                            onChange={e => setEditBalanceValue(e.target.value)}
                            style={{
                              width: '90px', padding: '4px 8px', borderRadius: '6px',
                              background: 'var(--bg-primary)', border: '1px solid var(--border-gold)',
                              color: '#fff', fontSize: '0.875rem',
                            }}
                          />
                          <button className="btn btn-sm btn-primary"
                            disabled={actionLoading === u.id}
                            onClick={async () => {
                              await patchUser(u.id, { balance: parseFloat(editBalanceValue) })
                              setEditBalanceId(null)
                            }}
                          >
                            OK
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditBalanceId(null)}>
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditBalanceId(u.id); setEditBalanceValue(String(u.balance ?? 0)) }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontWeight: 600, fontSize: '0.875rem' }}
                        >
                          {fmtMXN(u.balance ?? 0)}
                        </button>
                      )}
                    </TD>
                    <TD>
                      <BoolBadge value={u.membership_paid} trueLabel="Activa" falseLabel="Sin membresía" />
                    </TD>
                    <TD>
                      <BoolBadge value={u.is_admin} trueLabel="Admin" falseLabel="Usuario" />
                    </TD>
                    <TD style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      {fmtDate(u.created_at)}
                    </TD>
                    <TD>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          disabled={actionLoading === u.id}
                          onClick={() => patchUser(u.id, { membership_paid: !u.membership_paid })}
                          title={u.membership_paid ? 'Revocar membresía' : 'Activar membresía'}
                        >
                          {u.membership_paid ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                          {u.membership_paid ? 'Revocar' : 'Activar'}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          disabled={actionLoading === u.id}
                          onClick={() => patchUser(u.id, { is_admin: !u.is_admin })}
                          title={u.is_admin ? 'Quitar admin' : 'Hacer admin'}
                          style={{ color: u.is_admin ? 'var(--crimson)' : 'var(--text-secondary)' }}
                        >
                          {u.is_admin ? 'Quitar admin' : 'Hacer admin'}
                        </button>
                      </div>
                    </TD>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><TD style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }} colSpan={6}>Sin usuarios</TD></tr>
                )}
              </tbody>
            </TableWrap>
          )}

          {/* ── PAGOS ────────────────────────────────────── */}
          {tab === 'pagos' && (
            <TableWrap>
              <thead>
                <tr>
                  <TH>Usuario</TH>
                  <TH>Tipo</TH>
                  <TH>Monto</TH>
                  <TH>Estado</TH>
                  <TH>Método</TH>
                  <TH>Fecha</TH>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <TD>
                      <span style={{ fontWeight: 500 }}>
                        {(p.user as Pick<Profile, 'username'> | undefined)?.username ?? p.user_id.slice(0, 8)}
                      </span>
                    </TD>
                    <TD>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{p.type}</span>
                    </TD>
                    <TD>
                      <span style={{ fontWeight: 600, color: 'var(--gold)' }}>{fmtMXN(p.amount)}</span>
                    </TD>
                    <TD><PaymentStatusBadge status={p.status} /></TD>
                    <TD><span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{p.payment_method}</span></TD>
                    <TD style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{fmtDate(p.created_at)}</TD>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }} colSpan={6}>Sin pagos</td></tr>
                )}
              </tbody>
            </TableWrap>
          )}

          {/* ── SUBASTAS ─────────────────────────────────── */}
          {tab === 'subastas' && (
            <TableWrap>
              <thead>
                <tr>
                  <TH>Título</TH>
                  <TH>Vendedor</TH>
                  <TH>Precio actual</TH>
                  <TH>Estado</TH>
                  <TH>Inicio</TH>
                  <TH>Fin</TH>
                  <TH>Verificada</TH>
                  <TH>Acciones</TH>
                </tr>
              </thead>
              <tbody>
                {auctions.map(a => (
                  <tr key={a.id}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <TD>
                      <span style={{ fontWeight: 500, maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.title}
                      </span>
                    </TD>
                    <TD>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {(a.seller as Pick<Profile, 'username'> | undefined)?.username ?? a.seller_id.slice(0, 8)}
                      </span>
                    </TD>
                    <TD><span style={{ fontWeight: 600, color: 'var(--gold)' }}>{fmtMXN(a.current_price)}</span></TD>
                    <TD>
                      <span className={`badge badge-${
                        a.status === 'active' ? 'green' :
                        a.status === 'ended'  ? 'blue'  :
                        a.status === 'draft'  ? 'gold'  : 'red'
                      }`}>
                        {a.status}
                      </span>
                    </TD>
                    <TD style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{fmtDate(a.starts_at)}</TD>
                    <TD style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{fmtDate(a.ends_at)}</TD>
                    <TD><BoolBadge value={a.card_verified} trueLabel="Sí" falseLabel="No" /></TD>
                    <TD>
                      {a.status === 'active' && (
                        <button
                          className="btn btn-sm btn-danger"
                          disabled={actionLoading === `auction-${a.id}`}
                          onClick={() => forceCloseAuction(a.id)}
                        >
                          {actionLoading === `auction-${a.id}` ? '...' : 'Cerrar'}
                        </button>
                      )}
                    </TD>
                  </tr>
                ))}
                {auctions.length === 0 && (
                  <tr><td style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }} colSpan={8}>Sin subastas</td></tr>
                )}
              </tbody>
            </TableWrap>
          )}

          {/* ── INTERCAMBIOS ─────────────────────────────── */}
          {tab === 'intercambios' && (
            <TableWrap>
              <thead>
                <tr>
                  <TH>Proponente</TH>
                  <TH>Ofrece</TH>
                  <TH>Busca</TH>
                  <TH>Estado</TH>
                  <TH>Fecha</TH>
                </tr>
              </thead>
              <tbody>
                {trades.map(t => (
                  <tr key={t.id}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <TD>
                      <span style={{ fontWeight: 500 }}>
                        {(t.proposer as Pick<Profile, 'username'> | undefined)?.username ?? t.proposer_id.slice(0, 8)}
                      </span>
                    </TD>
                    <TD><span className="badge badge-blue">{t.offered_sticker}</span></TD>
                    <TD><span className="badge badge-purple">{t.wanted_sticker}</span></TD>
                    <TD>
                      <span className={`badge badge-${
                        t.status === 'completed'  ? 'green'  :
                        t.status === 'accepted'   ? 'blue'   :
                        t.status === 'searching'  ? 'gold'   :
                        t.status === 'pending'    ? 'gold'   : 'red'
                      }`}>
                        {t.status}
                      </span>
                    </TD>
                    <TD style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{fmtDate(t.created_at)}</TD>
                  </tr>
                ))}
                {trades.length === 0 && (
                  <tr><td style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }} colSpan={5}>Sin intercambios</td></tr>
                )}
              </tbody>
            </TableWrap>
          )}
        </>
      )}
    </>
  )
}
