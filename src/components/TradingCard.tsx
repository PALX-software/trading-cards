'use client'

import { Card } from '@/lib/types'
import { RARITY_LABELS, CONDITION_LABELS } from '@/lib/types'
import { ShoppingCart, Gavel } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export default function TradingCard({ card }: { card: Card & { owner?: { username: string } } }) {
  const { lang } = useI18n()

  const rarityColors = {
    common: 'linear-gradient(to bottom right, #f3f4f6, #9ca3af)',
    rare: 'linear-gradient(to bottom right, #bfdbfe, #3b82f6)',
    ultra_rare: 'linear-gradient(to bottom right, #e9d5ff, #a855f7)',
    legendary: 'linear-gradient(to bottom right, #fef08a, #eab308)',
  }

  const bgStyle = card.rarity === 'legendary' ? 'glass-gold' : 'card'
  const isAuction = card.is_for_auction

  const conditionLabel = CONDITION_LABELS[card.condition as keyof typeof CONDITION_LABELS] || card.condition
  const rarityLabel = RARITY_LABELS[card.rarity as keyof typeof RARITY_LABELS] || card.rarity

  return (
    <div className={`trading-card-wrapper ${bgStyle}`} style={{
      position: 'relative',
      padding: '0',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Rarity Top Border */}
      <div style={{
        height: '4px',
        background: rarityColors[card.rarity as keyof typeof rarityColors] || 'var(--border)',
        width: '100%'
      }} />

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge" style={{ fontSize: '0.65rem' }}>{card.year}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {card.team}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }}>{card.player_name}</h3>
          </div>
          <div style={{
            fontSize: '1.5rem',
            background: 'var(--bg-card-hover)',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}>
            ⚽
          </div>
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span className={`badge ${card.rarity === 'legendary' ? 'badge-gold' : card.rarity === 'ultra_rare' ? 'badge-purple' : 'badge-blue'}`}>
            {rarityLabel}
          </span>
          <span className="badge">{conditionLabel}</span>
          {card.series && (
            <span className="badge" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
              {card.series}
            </span>
          )}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div className="divider" style={{ margin: '1rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {card.price ? (
                <>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'es' ? 'Precio' : 'Price'}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold)' }}>
                    ${card.price.toFixed(2)}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {lang === 'es' ? 'No a la venta' : 'Not for sale'}
                </div>
              )}
            </div>

            {isAuction ? (
              <span className="badge badge-red" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <Gavel size={12} /> {lang === 'es' ? 'En Subasta' : 'In Auction'}
              </span>
            ) : card.is_for_sale ? (
              <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.75rem' }}>
                <ShoppingCart size={14} /> {lang === 'es' ? 'Comprar' : 'Buy'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
