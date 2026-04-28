export default function RightPanel() {
  return (
    <aside className="right-panel" style={{
  width: 280,
  flexShrink: 0,
  background: 'var(--bg-surface)',
  borderLeft: '1px solid var(--border)',
  padding: '20px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  overflowY: 'auto',
  height: '100%',
}}>
      <div style={{
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--text-primary)',
      }}>
        Right Panel
      </div>
      <p style={{
        fontSize: 12,
        color: 'var(--text-secondary)',
      }}>
        Content coming soon
      </p>
    </aside>
  )
}