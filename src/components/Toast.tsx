import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error'

export interface ToastData {
  id: number
  title: string
  message: string
  type: ToastType
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="#22c55e" />
      <path d="M5 8l2.5 2.5L11 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="#ef4444" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) {
  useState(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4500)
    return () => clearTimeout(t)
  })

  return (
    <div className="toast">
      <div style={{ marginTop: 1, flexShrink: 0 }}>
        {toast.type === 'success' ? <CheckIcon /> : <XCircleIcon />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f5f5f5', marginBottom: 2 }}>
          {toast.title}
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#a1a1aa', lineHeight: 1.4 }}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#52525b',
          cursor: 'pointer',
          padding: 4,
          borderRadius: 4,
          display: 'flex',
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#a1a1aa')}
        onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}
      >
        <CloseIcon />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: number) => void }) {
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 300 }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback((title: string, message: string, type: ToastType) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, title, message, type }])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, showToast, dismissToast }
}
