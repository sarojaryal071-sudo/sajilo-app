import { useWorker } from '../../contexts/WorkerContext.jsx'

export default function WorkerStatsBar() {
  const { profile, earnings } = useWorker()

  const stats = [
    { label: 'Jobs Today', value: profile?.completed_jobs || 0 },
    { label: "Today's Earnings", value: `Rs ${(earnings?.total_earnings || 0).toLocaleString()}` },
    { label: 'Rating', value: '—' },
  ]

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
      {stats.map((stat) => (
        <div key={stat.label} className="worker-card" style={{
          flex: 1, background: 'var(--bg-surface)', padding: 14, textAlign: 'center',
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-blue)' }}>{stat.value}</div>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}