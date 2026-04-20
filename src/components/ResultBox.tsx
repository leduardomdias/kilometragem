interface ResultData {
  kilometers: number
  months: number
  weekly: number
  size: number
}

interface ResultBoxProps {
  result: ResultData
  onCopy: () => void
  onReset: () => void
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M9.5 4.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1H4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 7A5 5 0 1 1 7 2a5 5 0 0 1 3.54 1.46L12 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M12 2v3H9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ResultBox({ result, onCopy, onReset }: ResultBoxProps) {
  const stats = [
    { label: 'Meses (M)', value: result.months },
    { label: 'Média Semanal (S)', value: result.weekly },
    { label: 'Tamanho (T)', value: result.size },
  ]

  return (
    <div className="result-reveal">
      {/* Main result */}
      <div style={{ textAlign: 'center', padding: '32px 0 28px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
          Quilometragem Total
        </p>
        <div className="km-display">{result.kilometers.toFixed(2)}</div>
        <p style={{ marginTop: 8, fontSize: '0.9375rem', color: 'var(--text-2)', fontWeight: 500 }}>km</p>
      </div>

      <div className="divider" />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              {s.label}
            </p>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-1)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Formula */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
          Fórmula
        </p>
        <div className="formula-chip">Kf = M × S × T × 19.2 ÷ 1000</div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-ghost" onClick={onCopy} style={{ flex: 1, justifyContent: 'center' }}>
          <CopyIcon /> Copiar
        </button>
        <button className="btn-ghost" onClick={onReset} style={{ flex: 1, justifyContent: 'center' }}>
          <RefreshIcon /> Novo cálculo
        </button>
      </div>
    </div>
  )
}
