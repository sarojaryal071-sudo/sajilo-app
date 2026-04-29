export default function WorkerJobs() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '50vh', gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>🔧</div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
        Jobs
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-body)' }}>
        Job requests will appear here.
      </p>
    </div>
  )
}