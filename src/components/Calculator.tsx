import { useState } from 'react'
import { Tooltip } from './Tooltip'
import { ResultBox } from './ResultBox'
import { LoadingOverlay } from './LoadingOverlay'
import { ToastContainer, useToast } from './Toast'

interface FormValues {
  months: string
  weekly: string
  size: number
}

interface Result {
  kilometers: number
  months: number
  weekly: number
  size: number
}

function ResetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M11 6.5A4.5 4.5 0 1 1 6.5 2 4.5 4.5 0 0 1 9.7 3.3L11 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M11 2v2.5H8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalcIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 5h2M9 5h2M5 8h2M9 8h2M5 11h2M9 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function Calculator() {
  const [form, setForm] = useState<FormValues>({ months: '', weekly: '', size: 10 })
  const [errors, setErrors] = useState<{ months?: boolean; weekly?: boolean }>({})
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const { toasts, showToast, dismissToast } = useToast()

  const sliderPct = ((form.size - 1) / 19) * 100

  function validate(): boolean {
    const m = parseFloat(form.months)
    const s = parseFloat(form.weekly)

    if (!form.months || isNaN(m) || m <= 0) {
      showToast('Campo inválido', 'Informe um valor maior que zero para Meses.', 'error')
      setErrors(e => ({ ...e, months: true }))
      return false
    }
    if (!form.weekly || isNaN(s) || s <= 0) {
      showToast('Campo inválido', 'Informe um valor maior que zero para Média Semanal.', 'error')
      setErrors(e => ({ ...e, weekly: true }))
      return false
    }
    setErrors({})
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      const m = parseFloat(form.months)
      const s = parseFloat(form.weekly)
      const t = form.size
      setResult({ kilometers: (m * s * t * 19.2) / 1000, months: m, weekly: s, size: t })
      setLoading(false)
      setTimeout(() => showToast('Cálculo concluído', 'Sua quilometragem foi calculada.', 'success'), 80)
    }, 700)
  }

  function handleReset() {
    setForm({ months: '', weekly: '', size: 10 })
    setErrors({})
    setResult(null)
    showToast('Formulário limpo', 'Todos os campos foram redefinidos.', 'success')
  }

  function handleCopy() {
    if (!result) return
    const text =
      `Quilometragem Total: ${result.kilometers.toFixed(2)} km\n` +
      `Meses (M): ${result.months}\n` +
      `Média Semanal (S): ${result.weekly}\n` +
      `Tamanho (T): ${result.size}`
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado!', 'Resultado na área de transferência.', 'success'))
      .catch(() => showToast('Erro', 'Não foi possível copiar.', 'error'))
  }

  return (
    <>
      <LoadingOverlay visible={loading} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="glass-card" style={{ width: '100%', maxWidth: 480 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--amber-dim)',
              border: '1px solid var(--amber-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--amber)',
            }}>
              <CalcIcon />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>
              Calculadora
            </span>
          </div>
          <button className="btn-ghost" onClick={handleReset} style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
            <ResetIcon /> Redefinir
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 24px' }}>
          {!result ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {/* Months */}
                <div>
                  <label className="field-label">
                    Meses (M)
                    <Tooltip text="Número total de meses de atividade. Mínimo: 1." />
                  </label>
                  <input
                    className={`input-field${errors.months ? ' error' : ''}`}
                    type="number"
                    step="1"
                    min="1"
                    placeholder="Ex: 6"
                    value={form.months}
                    onChange={e => {
                      setForm(f => ({ ...f, months: e.target.value }))
                      setErrors(er => ({ ...er, months: false }))
                    }}
                  />
                </div>

                {/* Weekly */}
                <div>
                  <label className="field-label">
                    Média Semanal (S)
                    <Tooltip text="Frequência média por semana." />
                  </label>
                  <input
                    className={`input-field${errors.weekly ? ' error' : ''}`}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Ex: 2.5"
                    value={form.weekly}
                    onChange={e => {
                      setForm(f => ({ ...f, weekly: e.target.value }))
                      setErrors(er => ({ ...er, weekly: false }))
                    }}
                  />
                </div>
              </div>

              {/* Slider */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <label className="field-label" style={{ margin: 0 }}>
                    Tamanho (T)
                    <Tooltip text="Valor de 1 a 20. Multiplica o resultado final." />
                  </label>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--amber)',
                    lineHeight: 1,
                    minWidth: 32,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {form.size}
                  </span>
                </div>

                {/* Custom track with fill */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: 4,
                    borderRadius: 4,
                    background: 'var(--border-strong)',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${sliderPct}%`,
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                      transition: 'width 0.08s',
                    }} />
                  </div>
                  <input
                    className="slider"
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={form.size}
                    onChange={e => setForm(f => ({ ...f, size: parseInt(e.target.value) }))}
                    style={{ position: 'relative', background: 'transparent' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  {['Pequeno', 'Médio', 'Grande'].map(l => (
                    <span key={l} style={{ fontSize: '0.6875rem', color: 'var(--text-3)', fontWeight: 500 }}>{l}</span>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Calcular Quilometragem
              </button>
            </form>
          ) : (
            <ResultBox result={result} onCopy={handleCopy} onReset={handleReset} />
          )}
        </div>
      </div>
    </>
  )
}
