'use client'

import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

interface CountdownTimerProps {
  endsAt: string
  onEnd?: () => void
}

export default function CountdownTimer({ endsAt, onEnd }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const calculate = () => {
      const total = differenceInSeconds(new Date(endsAt), new Date())
      if (total <= 0) {
        setEnded(true)
        onEnd?.()
        return
      }
      setTimeLeft({
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      })
    }
    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  if (ended) {
    return (
      <div className="badge badge-red" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
        ⏱ Auction Ended
      </div>
    )
  }

  return (
    <div className="countdown">
      {timeLeft.days > 0 && (
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="countdown-label">Days</span>
        </div>
      )}
      <div className="countdown-unit">
        <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-label">Hrs</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">Min</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value" style={{ color: timeLeft.minutes === 0 ? 'var(--crimson)' : undefined }}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="countdown-label">Sec</span>
      </div>
    </div>
  )
}
