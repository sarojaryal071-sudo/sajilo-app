export default function WorkerStatsBar() {
  const stats = [
    { label: 'Jobs Today', value: '0' },
    { label: 'Earnings', value: 'Rs 0' },
    { label: 'Rating', value: '4.8 ★' },
  ]

  return (
    <div style={{
      display: 'flex', gap: 10, marginBottom: 20,
    }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{
          flex: 1,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 14,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 'var(--font-large)',
            fontWeight: 800,
            color: 'var(--accent-blue)',
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: 'var(--font-caption)',
            color: 'var(--text-secondary)',
            marginTop: 4,
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}