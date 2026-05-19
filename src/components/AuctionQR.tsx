'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Share2, Zap, Copy, Download } from 'lucide-react'
import { showToast } from '@/components/Toast'

interface AuctionQRProps {
  auctionId: string
  auctionTitle: string
  playerName: string
  baseUrl?: string
}

export default function AuctionQR({ auctionId, auctionTitle, playerName, baseUrl }: AuctionQRProps) {
  const [resolvedBase, setResolvedBase] = useState<string>(baseUrl ?? '')

  useEffect(() => {
    if (!baseUrl) {
      setResolvedBase(window.location.origin)
    }
  }, [baseUrl])

  const base = resolvedBase || baseUrl || ''
  const auctionUrl = `${base}/auctions/${auctionId}`
  const shareText = `🔥 ${playerName} en subasta FIFA WC 2026! Oferta actual desde MXN. ¡Únete y puja!`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&format=png&ecc=M&data=${encodeURIComponent(auctionUrl)}`
  const qrUrlHd = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=png&ecc=M&data=${encodeURIComponent(auctionUrl)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(auctionUrl)
      showToast('¡Enlace copiado!', 'success')
    } catch {
      showToast('No se pudo copiar el enlace', 'error')
    }
  }

  const handleDownload = async () => {
    const a = document.createElement('a')
    a.href = qrUrlHd
    a.download = `qr-subasta-${auctionId}.png`
    a.target = '_blank'
    a.click()
  }

  const shareButtons = [
    {
      label: 'WhatsApp',
      icon: <MessageCircle size={14} />,
      color: '#25D366',
      href: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + auctionUrl)}`,
    },
    {
      label: 'Facebook',
      icon: <Share2 size={14} />,
      color: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(auctionUrl)}`,
    },
    {
      label: 'X / Twitter',
      icon: <Zap size={14} />,
      color: '#fff',
      bg: '#000',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(auctionUrl)}`,
    },
  ]

  return (
    <div className="card" style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
      {/* QR Code */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '1rem',
        display: 'inline-block',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        marginBottom: '1rem',
      }}>
        {/* Only render the image once we have a base URL so the QR data is correct */}
        {base ? (
          <img
            src={qrUrl}
            alt={`QR code para subasta de ${playerName}`}
            width={280}
            height={280}
            style={{ display: 'block', borderRadius: '0.5rem' }}
          />
        ) : (
          <div style={{ width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.85rem' }}>
            Cargando QR…
          </div>
        )}
      </div>

      {/* Auction URL */}
      <p style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        wordBreak: 'break-all',
        marginBottom: '1.5rem',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '0.5rem',
        padding: '0.5rem 0.75rem',
        fontFamily: 'monospace',
      }}>
        {auctionUrl || `…/auctions/${auctionId}`}
      </p>

      {/* Share section */}
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Comparte en redes sociales
      </p>

      {/* Share buttons row */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {shareButtons.map(({ label, icon, color, bg, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '0.5rem',
              border: `1px solid ${color}40`,
              background: bg ? bg : `${color}15`,
              color: bg ? color : color,
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.8' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            {icon}
            {label}
          </a>
        ))}

        {/* Copy link button */}
        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
        >
          <Copy size={14} />
          Copiar enlace
        </button>
      </div>

      {/* Instagram / TikTok note */}
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
        Para Instagram y TikTok, descarga el QR y súbelo como historia.
      </p>

      {/* Download QR button */}
      <button
        onClick={handleDownload}
        className="btn btn-primary btn-sm"
        style={{ width: '100%' }}
      >
        <Download size={14} />
        Descargar QR
      </button>
    </div>
  )
}
