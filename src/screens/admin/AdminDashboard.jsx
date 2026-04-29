import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminDashboard({ navigate }) {
  const [stats, setStats] = useState(null)
  const [workers, setWorkers] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, workersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminWorkers(),
      ])
      setStats(statsRes.data)
      setWorkers(workersRes.data || [])
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    }
  }

  const pendingWorkers = workers.filter(w => w.status !== 'active')
  
  const statusCounts = {
    active: workers.filter(w => w.status === 'active').length,
    pending: workers.filter(w => w.status !== 'active' && w.status !== 'inactive').length,
    inactive: workers.filter(w => w.status === 'inactive').length,
  }
  const maxCount = Math.max(statusCounts.active, statusCounts.pending, statusCounts.inactive, 1)

  const recentActivity = [
    { icon: '👤', text: 'New customer registered', time: '2 min ago' },
    { icon: '🔧', text: 'Worker completed a job', time: '15 min ago' },
    { icon: '📋', text: 'Booking #42 created', time: '1 hour ago' },
    { icon: '✅', text: 'Worker approved by admin', time: '3 hours ago' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Dashboard
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Welcome back, Admin
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#1A56DB', bg: '#eff6ff' },
          { label: 'Active Bookings', value: stats?.totalBookings || 0, icon: '📋', color: '#16A34A', bg: '#f0fdf4' },
          { label: 'Total Workers', value: stats?.totalWorkers || 0, icon: '👷', color: '#f97316', bg: '#fff7ed' },
          { label: 'Pending Approvals', value: pendingWorkers.length, icon: '⏳', color: '#eab308', bg: '#fefce8' },
        ].map((card) => (
          <div key={card.label} style={{
            background: 'var(--bg-surface)', borderRadius: 12, padding: 20,
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{card.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Workers by Status Bar Chart */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
            Workers by Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Active', count: statusCounts.active, color: '#16A34A', bg: '#dcfce7' },
              { label: 'Pending', count: statusCounts.pending, color: '#D97706', bg: '#fef3c7' },
              { label: 'Inactive', count: statusCounts.inactive, color: '#DC2626', bg: '#fee2e2' },
            ].map((bar) => (
              <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 70, fontSize: 12, color: 'var(--text-secondary)' }}>{bar.label}</span>
                <div style={{ flex: 1, height: 24, background: 'var(--bg-surface2)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(bar.count / maxCount) * 100}%`,
                    background: bar.color, borderRadius: 6, transition: 'width 0.5s',
                    display: 'flex', alignItems: 'center', paddingLeft: 8,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{bar.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
          Pending Worker Approvals
        </h3>
        {pendingWorkers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)', fontSize: 13 }}>
            No pending approvals
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingWorkers.slice(0, 5).map((worker) => (
              <div key={worker.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{worker.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{worker.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={async () => { await api.approveWorker(worker.id); loadData() }} style={{
                    padding: '4px 12px', borderRadius: 4, border: 'none',
                    background: '#16A34A', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  }}>Approve</button>
                  <button onClick={async () => { await api.rejectWorker(worker.id); loadData() }} style={{
                    padding: '4px 12px', borderRadius: 4,
                    border: '1px solid #ef4444', background: 'transparent',
                    color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {pendingWorkers.length > 5 && (
          <button onClick={() => navigate('/admin/approvals')} style={{
            marginTop: 12, padding: '6px 0', border: 'none', background: 'transparent',
            color: '#1A56DB', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>View all →</button>
        )}
      </div>
    </div>
  )
}