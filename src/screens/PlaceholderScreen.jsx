export default function PlaceholderScreen({ title, navigate }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <h2 style={{
        fontSize: 'var(--font-large)', fontWeight: 700,
        color: 'var(--text-primary)',
      }}>
        {title || 'Coming Soon'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-body)' }}>
        This section is under development.
      </p>
      <button onClick={() => navigate('/login')} style={{
        padding: '10px 20px', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)', background: 'var(--bg-surface2)',
        color: 'var(--accent-blue)', cursor: 'pointer', fontSize: 'var(--font-body)',
        fontWeight: 600,
      }}>
        ← Back to Login
      </button>
    </div>
  )
}