'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import ToastContainer, { showToast } from '@/components/Toast'
import type { Profile } from '@/lib/types'
import { RARITY_LABELS, CONDITION_LABELS, WORLD_CUP_TEAMS } from '@/lib/types'
import { ArrowLeft, Upload, Save } from 'lucide-react'
import Link from 'next/link'

export default function AddCardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    playerName: '',
    team: '',
    year: new Date().getFullYear().toString(),
    cardNumber: '',
    series: '',
    rarity: 'common',
    condition: 'good',
    title: '',
    description: '',
    imageUrl: '',
    price: '',
    isForSale: false,
  })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
      if (!data?.membership_paid && !data?.is_admin) {
        showToast('Membership required to list cards', 'error')
        router.push('/auth/register')
        return
      }
      setUser(data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const { error } = await supabase.from('cards').insert({
      owner_id: user.id,
      player_name: form.playerName,
      team: form.team,
      year: parseInt(form.year),
      card_number: form.cardNumber || null,
      series: form.series || null,
      rarity: form.rarity,
      condition: form.condition,
      title: form.title || `${form.playerName} - ${form.team} ${form.year}`,
      description: form.description || null,
      image_url: form.imageUrl || null,
      price: form.price ? parseFloat(form.price) : null,
      is_for_sale: form.isForSale,
      is_for_auction: false,
    })

    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('FIFA World Cup card added! ⚽', 'success')
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="page-header">
          <div className="container-main">
            <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <h1 className="page-title">
              ⚽ Add FIFA World Cup <span className="gradient-text">Card</span>
            </h1>
            <p className="page-subtitle">List a FIFA World Cup soccer trading card to your collection</p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '2rem' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Player Info */}
              <div className="card">
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Player Information
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Player Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Lionel Messi"
                        value={form.playerName}
                        onChange={e => setForm({ ...form, playerName: e.target.value })}
                        required
                        id="card-player-name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">National Team *</label>
                      <select
                        className="form-select"
                        value={form.team}
                        onChange={e => setForm({ ...form, team: e.target.value })}
                        required
                        id="card-team"
                      >
                        <option value="">Select Team</option>
                        {WORLD_CUP_TEAMS.map(team => (
                          <option key={team} value={team}>{team}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">World Cup Year *</label>
                      <select
                        className="form-select"
                        value={form.year}
                        onChange={e => setForm({ ...form, year: e.target.value })}
                        required
                        id="card-year"
                      >
                        {[2026, 2022, 2018, 2014, 2010, 2006, 2002, 1998, 1994, 1990, 1986, 1982].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 001"
                        value={form.cardNumber}
                        onChange={e => setForm({ ...form, cardNumber: e.target.value })}
                        id="card-number"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Series / Set</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Panini Gold"
                        value={form.series}
                        onChange={e => setForm({ ...form, series: e.target.value })}
                        id="card-series"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Quality */}
              <div className="card">
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Card Quality
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Rarity *</label>
                    <select
                      className="form-select"
                      value={form.rarity}
                      onChange={e => setForm({ ...form, rarity: e.target.value })}
                      required
                      id="card-rarity"
                    >
                      {Object.entries(RARITY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Condition *</label>
                    <select
                      className="form-select"
                      value={form.condition}
                      onChange={e => setForm({ ...form, condition: e.target.value })}
                      required
                      id="card-condition"
                    >
                      {Object.entries(CONDITION_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Listing Details */}
              <div className="card">
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Listing Details
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Title (auto-generated if empty)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`${form.playerName || 'Player'} - ${form.team || 'Team'} ${form.year}`}
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      id="card-title"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      placeholder="Any special notes about this FIFA World Cup card..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      style={{ resize: 'vertical' }}
                      id="card-description"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL (optional)</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://..."
                      value={form.imageUrl}
                      onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                      id="card-image-url"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Sale Price (MXN)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Leave empty if not for sale"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        min="0"
                        step="0.01"
                        id="card-price"
                      />
                    </div>
                    <div style={{ paddingBottom: '0.1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={form.isForSale}
                          onChange={e => setForm({ ...form, isForSale: e.target.checked })}
                          id="card-for-sale"
                          style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--gold)' }}
                        />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>List for sale</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
                id="add-card-submit"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Add FIFA World Cup Card'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
