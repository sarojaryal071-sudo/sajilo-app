import { useWorker } from '../../contexts/WorkerContext.jsx'
import WorkerStatsBar from '../../components/worker/WorkerStatsBar.jsx'

export default function WorkerDashboard() {
  const { profile, loading } = useWorker()
  const isOnline = profile?.is_online || false

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            height: i === 1 ? 56 : i === 4 ? 100 : 80,
            borderRadius: 12, background: 'var(--bg-surface)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            animation: 'pulse 1.5s infinite',
          }} />
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
      </div>
    )
  }

  return (
    <div>
      <div className="worker-card" style={{
        background: isOnline ? '#dcfce7' : '#fee2e2',
        borderLeft: `4px solid ${isOnline ? '#16A34A' : '#DC2626'}`,
        padding: '14px 18px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>{isOnline ? '🟢' : '🔴'}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: isOnline ? '#16A34A' : '#DC2626' }}>
            {isOnline ? 'You are online' : 'You are offline'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {isOnline ? 'Receiving job requests' : 'Go online to receive job requests'}
          </div>
        </div>
      </div>

      <WorkerStatsBar />

      <div className="worker-card" style={{
        background: 'var(--bg-surface)', border: '2px solid var(--accent-orange)', padding: 18, marginBottom: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No active job</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          {isOnline ? 'Waiting for customer requests...' : 'Go online to receive job requests'}
        </div>
        <button style={{
          padding: '10px 20px', borderRadius: 8, border: 'none',
          background: 'var(--accent-blue)', color: '#fff',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          opacity: isOnline ? 1 : 0.5,
        }}>View Active Job →</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[{ label: 'Earnings', icon: '💰' }, { label: 'Schedule', icon: '📅' }].map((link) => (
          <div key={link.label} className="worker-card" style={{
            background: 'var(--bg-surface)', padding: 16, textAlign: 'center', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{link.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{link.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}