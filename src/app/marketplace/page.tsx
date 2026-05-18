'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import TradingCard from '@/components/TradingCard'
import ToastContainer from '@/components/Toast'
import type { Card, Rarity, Condition } from '@/lib/types'
import { RARITY_LABELS, CONDITION_LABELS, WORLD_CUP_TEAMS } from '@/lib/types'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function MarketplacePage() {
  const supabase = createClient()
  const { lang } = useI18n()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    rarity: '' as Rarity | '',
    team: '',
    condition: '' as Condition | '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'created_at',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [total, setTotal] = useState(0)

  const fetchCards = async () => {
    setLoading(true)
    let query = supabase
      .from('cards')
      .select('*, owner:profiles(username, avatar_url)', { count: 'exact' })
      .eq('is_for_sale', true)

    if (search) {
      query = query.or(`player_name.ilike.%${search}%,team.ilike.%${search}%,title.ilike.%${search}%`)
    }
    if (filters.rarity) query = query.eq('rarity', filters.rarity)
    if (filters.team) query = query.eq('team', filters.team)
    if (filters.condition) query = query.eq('condition', filters.condition)
    if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice))
    if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice))

    if (filters.sortBy === 'price_asc') query = query.order('price', { ascending: true })
    else if (filters.sortBy === 'price_desc') query = query.order('price', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, count } = await query.limit(48)
    setCards(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  useEffect(() => {
    const debounce = setTimeout(fetchCards, 300)
    return () => clearTimeout(debounce)
  }, [search, filters])

  const clearFilters = () => {
    setFilters({ rarity: '', team: '', condition: '', minPrice: '', maxPrice: '', sortBy: 'created_at' })
    setSearch('')
  }

  const hasActiveFilters = search || filters.rarity || filters.team || filters.condition || filters.minPrice || filters.maxPrice

  return (
    <>
      <Navbar />
      <ToastContainer />

      <main style={{ minHeight: '100vh' }}>
        {/* Header */}
        <div className="page-header">
          <div className="container-main">
            <h1 className="page-title">
              ⚽ FIFA World Cup <span className="gradient-text">{lang === 'es' ? 'Mercado' : 'Marketplace'}</span>
            </h1>
            <p className="page-subtitle">
              {lang === 'es'
                ? 'Explora miles de tarjetas coleccionables de fútbol de la Copa del Mundo de coleccionistas globales'
                : 'Browse thousands of FIFA World Cup soccer trading cards from collectors worldwide'}
            </p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: '280px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder={lang === 'es' ? "Buscar por jugador, equipo..." : "Search FIFA World Cup cards by player, team..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="marketplace-search"
              />
            </div>

            <button
              className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              {lang === 'es' ? 'Filtros' : 'Filters'}
              {hasActiveFilters ? (
                <span style={{
                  background: 'rgba(0,0,0,0.3)', borderRadius: '999px',
                  padding: '0.1rem 0.4rem', fontSize: '0.7rem',
                }}>!</span>
              ) : null}
            </button>

            {hasActiveFilters ? (
              <button className="btn btn-danger btn-sm" onClick={clearFilters}>
                <X size={14} /> {lang === 'es' ? 'Limpiar' : 'Clear'}
              </button>
            ) : null}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Rareza' : 'Rarity'}</label>
                  <select
                    className="form-select"
                    value={filters.rarity}
                    onChange={e => setFilters({ ...filters, rarity: e.target.value as Rarity | '' })}
                  >
                    <option value="">{lang === 'es' ? 'Todas' : 'All Rarities'}</option>
                    {Object.entries(RARITY_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Equipo' : 'Team'}</label>
                  <select
                    className="form-select"
                    value={filters.team}
                    onChange={e => setFilters({ ...filters, team: e.target.value })}
                  >
                    <option value="">{lang === 'es' ? 'Todos' : 'All Teams'}</option>
                    {WORLD_CUP_TEAMS.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Condición' : 'Condition'}</label>
                  <select
                    className="form-select"
                    value={filters.condition}
                    onChange={e => setFilters({ ...filters, condition: e.target.value as Condition | '' })}
                  >
                    <option value="">{lang === 'es' ? 'Todas' : 'All Conditions'}</option>
                    {Object.entries(CONDITION_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Precio Mín' : 'Min Price'} (MXN)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Precio Máx' : 'Max Price'} (MXN)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="99999"
                    value={filters.maxPrice}
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'es' ? 'Ordenar por' : 'Sort By'}</label>
                  <select
                    className="form-select"
                    value={filters.sortBy}
                    onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="created_at">{lang === 'es' ? 'Más recientes' : 'Newest First'}</option>
                    <option value="price_asc">{lang === 'es' ? 'Precio: Menor a Mayor' : 'Price: Low to High'}</option>
                    <option value="price_desc">{lang === 'es' ? 'Precio: Mayor a Menor' : 'Price: High to Low'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {loading 
                ? (lang === 'es' ? 'Cargando...' : 'Loading...') 
                : `${total} ${lang === 'es' ? 'tarjetas FIFA World Cup encontradas' : 'FIFA World Cup cards found'}`}
            </p>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="cards-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ aspectRatio: '3/5', borderRadius: '1.25rem' }} />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚽</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {lang === 'es' ? 'No se encontraron tarjetas' : 'No cards found'}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {lang === 'es' ? 'Intenta ajustar tu búsqueda o filtros' : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="cards-grid">
              {cards.map(card => (
                <TradingCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
