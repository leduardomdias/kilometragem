import { useState, useEffect, useRef, useCallback } from 'react'

/* ── SVG icons ── */
function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5 4 9.3 9 10.3C17 21.3 21 17 21 12V7L12 2z"
        stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11 7A4 4 0 1 1 7 3a4 4 0 0 1 2.83 1.17L11 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 2.5V5.5H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7l3.5 3.5 5.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Math captcha generator ── */
interface CaptchaChallenge {
  question: string
  answer: number
  canvasKey: number
}

function generateChallenge(): CaptchaChallenge {
  const ops = ['+', '-', '×'] as const
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a = Math.floor(Math.random() * 9) + 1
  let b = Math.floor(Math.random() * 9) + 1
  if (op === '-' && b > a) [a, b] = [b, a]
  const answer = op === '+' ? a + b : op === '-' ? a - b : a * b
  return { question: `${a} ${op} ${b}`, answer, canvasKey: Date.now() }
}

/* ── Draw captcha on canvas ── */
function CaptchaCanvas({ challenge }: { challenge: CaptchaChallenge }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, W, H)

    // Noise lines
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * W, Math.random() * H)
      ctx.lineTo(Math.random() * W, Math.random() * H)
      ctx.strokeStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.06})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.07})`
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }

    // Text — each char slightly rotated & offset
    const text = challenge.question + ' = ?'
    const chars = text.split('')
    const startX = (W - chars.length * 20) / 2 + 10
    ctx.font = 'bold 22px monospace'
    ctx.textBaseline = 'middle'

    chars.forEach((ch, i) => {
      ctx.save()
      const x = startX + i * 20
      const y = H / 2 + (Math.random() - 0.5) * 6
      const angle = (Math.random() - 0.5) * 0.25
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = `hsl(${38 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${65 + Math.random() * 20}%)`
      ctx.fillText(ch, 0, 0)
      ctx.restore()
    })
  }, [challenge])

  return (
    <canvas
      ref={ref}
      width={200}
      height={56}
      style={{ borderRadius: 8, display: 'block', userSelect: 'none' }}
    />
  )
}

/* ── Checkbox ── */
function Checkbox({ checked, onChange, id }: { checked: boolean; onChange: () => void; id: string }) {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      style={{
        flexShrink: 0,
        width: 18,
        height: 18,
        borderRadius: 4,
        border: `1.5px solid ${checked ? 'var(--amber)' : 'var(--border-strong)'}`,
        background: checked ? 'var(--amber)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s',
        color: '#000',
        padding: 0,
      }}
    >
      {checked && <CheckIcon />}
    </button>
  )
}

/* ── Main component ── */
interface AgeGateProps {
  onPass: () => void
}

export function AgeGate({ onPass }: AgeGateProps) {
  const [checks, setChecks] = useState({ age: false, terms: false, content: false })
  const [challenge, setChallenge] = useState<CaptchaChallenge>(generateChallenge)
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState(false)
  const [captchaOk, setCaptchaOk] = useState(false)
  const [shake, setShake] = useState(false)
  const [formError, setFormError] = useState('')

  const allChecked = checks.age && checks.terms && checks.content

  const refreshCaptcha = useCallback(() => {
    setChallenge(generateChallenge())
    setCaptchaInput('')
    setCaptchaError(false)
    setCaptchaOk(false)
  }, [])

  function toggle(key: keyof typeof checks) {
    setChecks(c => ({ ...c, [key]: !c[key] }))
    setFormError('')
  }

  function handleCaptchaChange(val: string) {
    setCaptchaInput(val)
    setCaptchaError(false)
    setFormError('')
    if (val.trim() !== '') {
      const num = parseInt(val, 10)
      setCaptchaOk(!isNaN(num) && num === challenge.answer)
    } else {
      setCaptchaOk(false)
    }
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  function handleEnter() {
    if (!allChecked) {
      setFormError('Você precisa aceitar todas as condições para continuar.')
      triggerShake()
      return
    }
    const num = parseInt(captchaInput, 10)
    if (isNaN(num) || num !== challenge.answer) {
      setCaptchaError(true)
      setCaptchaOk(false)
      setFormError('Resposta do captcha incorreta. Tente novamente.')
      triggerShake()
      refreshCaptcha()
      return
    }
    onPass()
  }

  const checkItems = [
    {
      key: 'age' as const,
      label: 'Confirmo que tenho 18 anos ou mais',
      sub: 'Acesso restrito a maiores de idade conforme a legislação vigente.',
    },
    {
      key: 'terms' as const,
      label: 'Li e aceito os Termos de Uso',
      sub: 'Este site tem caráter humorístico e não oferece serviços reais.',
    },
    {
      key: 'content' as const,
      label: 'Estou ciente do conteúdo adulto (+18)',
      sub: 'O conteúdo desta página é destinado exclusivamente ao público adulto.',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      zIndex: 1,
    }}>
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 2,
          ...(shake ? { animation: 'gate-shake 0.45s ease' } : {}),
        }}
      >
        {/* Header */}
        <div style={{
          padding: '28px 28px 24px',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--amber-dim)',
            border: '1px solid var(--amber-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <ShieldIcon />
          </div>
          <h1 style={{
            fontSize: '1.25rem', fontWeight: 700,
            letterSpacing: '-0.025em', color: 'var(--text-1)', marginBottom: 8,
          }}>
            Verificação de acesso
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
            Este site contém conteúdo destinado exclusivamente ao público adulto.
            Confirme sua idade e aceite os termos para continuar.
          </p>
        </div>

        {/* Checkboxes */}
        <div style={{ padding: '24px 28px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {checkItems.map(item => (
              <label
                key={item.key}
                htmlFor={`check-${item.key}`}
                style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                  background: checks[item.key] ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${checks[item.key] ? 'var(--amber-border)' : 'var(--border)'}`,
                  transition: 'all 0.2s',
                  userSelect: 'none',
                }}
              >
                <Checkbox id={`check-${item.key}`} checked={checks[item.key]} onChange={() => toggle(item.key)} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)', marginBottom: 3 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
                    {item.sub}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Captcha */}
        <div style={{ padding: '20px 28px 0' }}>
          <div style={{
            padding: '16px', borderRadius: 10,
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${captchaError ? '#ef4444' : captchaOk ? 'rgba(34,197,94,0.35)' : 'var(--border)'}`,
            transition: 'border-color 0.2s',
          }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
              Verificação — Resolva o captcha
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <CaptchaCanvas challenge={challenge} />
              <button
                type="button"
                onClick={refreshCaptcha}
                title="Novo desafio"
                style={{
                  flexShrink: 0, width: 34, height: 34, borderRadius: 8,
                  border: '1px solid var(--border-strong)',
                  background: 'transparent', color: 'var(--text-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.color = 'var(--text-1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)'
                  e.currentTarget.style.color = 'var(--text-2)'
                }}
              >
                <RefreshIcon />
              </button>
            </div>
            <input
              className={`input-field${captchaError ? ' error' : ''}`}
              type="number"
              placeholder="Digite o resultado"
              value={captchaInput}
              onChange={e => handleCaptchaChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEnter()}
              style={{
                borderColor: captchaOk ? 'rgba(34,197,94,0.5)' : undefined,
                boxShadow: captchaOk ? '0 0 0 3px rgba(34,197,94,0.12)' : undefined,
              }}
            />
            {captchaOk && (
              <p style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Correto
              </p>
            )}
          </div>
        </div>

        {/* Error message */}
        {formError && (
          <div style={{ padding: '12px 28px 0' }}>
            <p style={{
              fontSize: '0.8125rem', color: '#ef4444',
              display: 'flex', alignItems: 'flex-start', gap: 7, lineHeight: 1.5,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="7" cy="7" r="6.5" stroke="#ef4444" />
                <path d="M7 4v3M7 9.5v.5" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              {formError}
            </p>
          </div>
        )}

        {/* CTA */}
        <div style={{ padding: '24px 28px 28px' }}>
          <button
            className="btn-primary"
            onClick={handleEnter}
            style={{ opacity: allChecked && captchaOk ? 1 : 0.5 }}
          >
            Confirmar e entrar
          </button>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            Ao continuar, você declara ter idade legal para acessar este conteúdo
            e concorda com os termos acima.
          </p>
        </div>
      </div>
    </div>
  )
}
