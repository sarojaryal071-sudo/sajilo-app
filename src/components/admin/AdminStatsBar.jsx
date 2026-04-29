import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminStatsBar() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBookings: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await api.getAdminStats()
      if (res.data) setStats(res.data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const items = [
    { label: 'Total Workers', value: stats.totalWorkers, icon: '👷' },
    { label: 'Active Bookings', value: stats.totalBookings, icon: '📋' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
  ]

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20,
    }}>
      {items.map((item) => (
        <div key={item.label} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 18, textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
          <div style={{
            fontSize: 'var(--font-xl)', fontWeight: 800,
            color: 'var(--accent-blue)',
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)',
            marginTop: 4,
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}