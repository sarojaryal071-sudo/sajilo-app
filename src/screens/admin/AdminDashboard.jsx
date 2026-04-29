import AdminStatsBar from '../../components/admin/AdminStatsBar.jsx'
import AdminQuickActions from '../../components/admin/AdminQuickActions.jsx'

export default function AdminDashboard({ navigate }) {
  return (
    <div>
      <h2 style={{
        fontSize: 'var(--font-heading)', fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: 20,
      }}>
        Admin Dashboard
      </h2>

      <AdminStatsBar />

      <AdminQuickActions navigate={navigate} />

      {/* Recent activity placeholder */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{
          fontSize: 'var(--font-title)', fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 12,
        }}>
          Recent Activity
        </h3>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 24, textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-body)' }}>
            No recent activity to display.
          </p>
        </div>
      </div>
    </div>
  )
}