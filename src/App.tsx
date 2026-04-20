import { useState } from 'react'
import { Header } from './components/Header'
import { Calculator } from './components/Calculator'
import { AgeGate } from './components/AgeGate'

function App() {
  const [verified, setVerified] = useState(false)

  if (!verified) {
    return <AgeGate onPass={() => setVerified(true)} />
  }

  return (
    <>
      <div className="bg-grid" />
      <div className="bg-glow" />

      <Header />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40, maxWidth: 480 }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: 'var(--text-1)',
            lineHeight: 1.15,
            marginBottom: 12,
          }}>
            Calcule sua<br />
            <span style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FDE68A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              quilometragem
            </span>
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
            Meça a quilometragem de você sabe o quê...
          </p>
        </div>

        <Calculator />
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '18px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
          © 2025 Calvin Kisin
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Apenas para adultos
        </p>
      </footer>
    </>
  )
}

export default App
