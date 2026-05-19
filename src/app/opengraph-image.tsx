import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'World Cup Trading Cards — Estampas FIFA 2026'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TEAMS = ['🇦🇷', '🇧🇷', '🇲🇽', '🇫🇷', '🇩🇪', '🇪🇸', '🇵🇹', '🇮🇹', '🇬🇧', '🇯🇵', '🇸🇦', '🇺🇸']

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#080808',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Gold top-left glow */}
        <div
          style={{
            position: 'absolute',
            top: '-180px',
            left: '-180px',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* Blue bottom-right glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-160px',
            right: '-160px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* Crimson center glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-200px',
            marginLeft: '-200px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Main content row */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            padding: '52px 80px 40px 80px',
            gap: '56px',
          }}
        >
          {/* Left column — trophy + ball */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minWidth: '180px',
            }}
          >
            <div style={{ fontSize: '110px', lineHeight: 1, display: 'flex' }}>🏆</div>
            <div style={{ fontSize: '52px', lineHeight: 1, display: 'flex' }}>⚽</div>
            <div
              style={{
                marginTop: '12px',
                width: '80px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
                display: 'flex',
              }}
            />
          </div>

          {/* Vertical divider */}
          <div
            style={{
              width: '2px',
              height: '280px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(245,158,11,0.5) 30%, rgba(245,158,11,0.5) 70%, transparent 100%)',
              display: 'flex',
              flexShrink: 0,
            }}
          />

          {/* Right column — text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              flex: 1,
            }}
          >
            {/* Top badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 18px',
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.35)',
                  borderRadius: '20px',
                  color: '#f59e0b',
                  fontSize: '17px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                ✦ FIFA WORLD CUP 2026
              </div>
            </div>

            {/* Main title */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 0.9,
                letterSpacing: '-3px',
              }}
            >
              <span
                style={{
                  fontSize: '80px',
                  fontWeight: '900',
                  color: '#ffffff',
                  display: 'flex',
                }}
              >
                TRADING
              </span>
              <span
                style={{
                  fontSize: '80px',
                  fontWeight: '900',
                  color: '#f59e0b',
                  display: 'flex',
                }}
              >
                CARDS
              </span>
            </div>

            {/* Gold accent line */}
            <div
              style={{
                width: '240px',
                height: '3px',
                background: 'linear-gradient(90deg, #f59e0b, rgba(245,158,11,0.2))',
                display: 'flex',
                marginTop: '-4px',
              }}
            />

            {/* Tagline */}
            <div
              style={{
                fontSize: '24px',
                color: '#94a3b8',
                letterSpacing: '2px',
                display: 'flex',
              }}
            >
              ESTAMPAS · SUBASTAS · INTERCAMBIOS
            </div>

            {/* Pills row */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {[
                { icon: '🇲🇽', text: 'México' },
                { icon: '🔒', text: 'MercadoPago' },
                { icon: '⚡', text: 'En vivo' },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '18px',
                  }}
                >
                  {icon} {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team flags strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            padding: '12px 80px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          {TEAMS.map((flag, i) => (
            <span key={i} style={{ fontSize: '30px', display: 'flex' }}>
              {flag}
            </span>
          ))}
          <span style={{ color: 'rgba(148,163,184,0.6)', fontSize: '18px', marginLeft: '8px', display: 'flex' }}>
            + 20 selecciones más
          </span>
        </div>

        {/* Bottom gold bar */}
        <div
          style={{
            height: '5px',
            background:
              'linear-gradient(90deg, transparent 0%, #f59e0b 20%, #fbbf24 50%, #f59e0b 80%, transparent 100%)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
