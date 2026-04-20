export function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8,8,8,0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="loader" />
    </div>
  )
}
