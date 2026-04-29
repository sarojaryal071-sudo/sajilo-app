export default function AdminMobileBlock() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', gap: 20,
      padding: 32, textAlign: 'center',
      background: 'var(--bg-primary)', fontFamily: 'var(--font-family)',
    }}>
      <div style={{ fontSize: 64 }}>🖥️</div>
      <h2 style={{
        fontSize: 'var(--font-large)', fontWeight: 700,
        color: 'var(--text-primary)',
      }}>
        Desktop Required
      </h2>
      <p style={{
        fontSize: 'var(--font-body)', color: 'var(--text-secondary)',
        maxWidth: 400, lineHeight: 1.6,
      }}>
        The Admin Panel is only available on desktop devices.
        Please open this page on a laptop or desktop computer.
      </p>
      <button onClick={() => {
        localStorage.removeItem('sajilo_user')
        localStorage.removeItem('sajilo_token')
        window.location.href = '/login'
      }} style={{
        padding: '12px 24px', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)', background: 'var(--bg-surface)',
        color: 'var(--accent-blue)', fontSize: 'var(--font-body)',
        fontWeight: 600, cursor: 'pointer',
      }}>
        Back to Login
      </button>
    </div>
  )
}