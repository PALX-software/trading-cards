'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

// Simple global toast store
const listeners: Array<(toast: Toast) => void> = []

export function showToast(message: string, type: ToastType = 'info') {
  const toast: Toast = { id: Date.now().toString(), message, type }
  listeners.forEach(fn => fn(toast))
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler = (toast: Toast) => {
      setToasts(prev => [...prev, toast])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, 4000)
    }
    listeners.push(handler)
    return () => {
      const idx = listeners.indexOf(handler)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  const icons = {
    success: <CheckCircle size={16} />,
    error: <XCircle size={16} />,
    info: <Info size={16} />,
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {icons[toast.type]}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => remove(toast.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
