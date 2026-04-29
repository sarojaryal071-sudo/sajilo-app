import WorkerStatsBar from '../../components/worker/WorkerStatsBar.jsx'

export default function WorkerDashboard() {
  return (
    <div>
      {/* Online status banner */}
      <div style={{
        background: 'var(--accent-green-light)',
        border: '1px solid var(--accent-green)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>🟢</span>
        <div>
          <div style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--accent-green)' }}>
            You are online
          </div>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
            Receiving job requests
          </div>
        </div>
      </div>

      {/* Stats */}
      <WorkerStatsBar />

      {/* Active job card (placeholder) */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '2px solid var(--accent-orange)',
        borderRadius: 'var(--radius-md)',
        padding: 18,
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          No active job
        </div>
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Go online and wait for customer requests
        </div>
        <button style={{
          padding: '10px 20px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          background: 'var(--accent-blue)',
          color: '#fff',
          fontSize: 'var(--font-body-sm)',
          fontWeight: 600,
          cursor: 'pointer',
          opacity: 0.5,
        }}>
          View Active Job →
        </button>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Earnings', icon: '💰', path: '/worker/earnings' },
          { label: 'Schedule', icon: '📅', path: '/worker/schedule' },
        ].map((link) => (
          <div key={link.label} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            textAlign: 'center',
            cursor: 'pointer',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{link.icon}</div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
              {link.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}