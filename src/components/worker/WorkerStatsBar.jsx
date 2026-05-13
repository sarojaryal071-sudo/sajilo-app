import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function WorkerStatsBar() {
  const [todayMetrics, setTodayMetrics] = useState({ earnings: 0, completedJobs: 0 })
  const [lifetimeMetrics, setLifetimeMetrics] = useState({ averageRating: 0, reviewCount: 0 })

  useEffect(() => {
    api.getWorkerDashboardMetrics()
      .then(res => {
        if (res?.success && res.data) {
          const d = res.data
          setTodayMetrics({
            earnings: d.today?.earnings || 0,
            completedJobs: d.today?.completedJobs || 0,
          })
          setLifetimeMetrics({
            averageRating: d.lifetime?.averageRating || 0,
            reviewCount: d.lifetime?.reviewCount || 0,
          })
        }
      })
      .catch(() => {
        // Silent fail — keep default zeros
      })
  }, [])

  // Refresh on socket events by listening for any dashboard update
  useEffect(() => {
    const { getSocket } = require('../../services/realtime/socketClient')
    const socket = getSocket()
    if (!socket) return

    const refresh = () => {
      api.getWorkerDashboardMetrics()
        .then(res => {
          if (res?.success && res.data) {
            setTodayMetrics({
              earnings: res.data.today?.earnings || 0,
              completedJobs: res.data.today?.completedJobs || 0,
            })
            setLifetimeMetrics({
              averageRating: res.data.lifetime?.averageRating || 0,
              reviewCount: res.data.lifetime?.reviewCount || 0,
            })
          }
        })
        .catch(() => {})
    }

    socket.on('booking.updated', refresh)
    socket.on('payment.updated', refresh)
    return () => {
      socket.off('booking.updated', refresh)
      socket.off('payment.updated', refresh)
    }
  }, [])

  const stats = [
    { label: 'Jobs Today', value: todayMetrics.completedJobs },
    { label: "Today's Earnings", value: `Rs ${todayMetrics.earnings.toLocaleString()}` },
    { label: 'Rating', value: lifetimeMetrics.averageRating > 0 ? `⭐ ${lifetimeMetrics.averageRating}` : '—' },
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