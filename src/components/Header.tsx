export function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '20px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #F59E0B, #c67700)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#000" strokeWidth="1.25" />
            <path d="M8 5v3l2 1.5" stroke="#000" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
          Quilometragem
        </span>
      </div>

      {/* Badge */}
      <div className="badge">
        <svg width="7" height="7" viewBox="0 0 7 7">
          <circle cx="3.5" cy="3.5" r="3.5" fill="#F59E0B" />
        </svg>
        +18
      </div>
    </header>
  )
}
