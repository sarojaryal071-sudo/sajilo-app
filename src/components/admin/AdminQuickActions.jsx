export default function AdminQuickActions({ navigate }) {
  const actions = [
    { label: 'Approve Workers', icon: '✅', path: '/admin/workers' },
    { label: 'View Bookings', icon: '📋', path: '/admin/bookings' },
    { label: 'Manage Users', icon: '👥', path: '/admin/users' },
    { label: 'Platform Settings', icon: '⚙️', path: '/admin/settings' },
  ]

  return (
    <div>
      <h3 style={{
        fontSize: 'var(--font-title)', fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: 12,
      }}>
        Quick Actions
      </h3>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10,
      }}>
        {actions.map((action) => (
          <button key={action.label} onClick={() => navigate(action.path)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: 14, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', background: 'var(--bg-surface)',
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 22 }}>{action.icon}</span>
            <span style={{
              fontSize: 'var(--font-body)', fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}