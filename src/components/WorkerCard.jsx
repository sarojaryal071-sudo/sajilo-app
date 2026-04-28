export default function WorkerCard({ worker }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: 'pointer',
    }}>
      {/* Photo / Initials Area */}
      <div style={{
        height: 80,
        background: worker.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {worker.photo ? (
          <img
            src={worker.photo}
            alt={worker.name}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #fff',
            }}
          />
        ) : (
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {worker.name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>

      <div style={{ padding: 12 }}>
        <div style={{
          fontSize: 'var(--font-body)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 2,
        }}>
          {worker.name}
        </div>
        <div style={{
          fontSize: 'var(--font-body-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--accent-green)',
          }} />
          {worker.role}
        </div>
        <div style={{
          fontSize: 'var(--font-body-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 6,
        }}>
          📍 {worker.location} · {worker.distance}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
            ★ {worker.rating}
          </span>
          <span style={{
            fontSize: 'var(--font-caption)',
            fontWeight: 700,
            color: 'var(--accent-blue)',
            background: 'var(--accent-blue-light)',
            padding: '2px 8px',
            borderRadius: 20,
          }}>
            {worker.eta}
          </span>
        </div>
      </div>
    </div>
  )
}