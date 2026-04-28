export default function ServiceCard({ service }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 8px 12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: service.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
      }}>
        {service.icon}
      </div>
      <span style={{
        fontSize: 'var(--font-body-sm)',
        fontWeight: 500,
        color: 'var(--text-primary)',
        textAlign: 'center',
      }}>
        {service.name}
      </span>
    </div>
  )
}