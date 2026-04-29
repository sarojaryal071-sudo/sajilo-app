import { useState, useEffect } from 'react'
import WorkerStatsBar from '../../components/worker/WorkerStatsBar.jsx'
import { api } from '../../services/api.js'

export default function WorkerDashboard() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      const res = await api.getWorkerProfile()
      setIsOnline(res.data?.is_online || false)
    } catch (err) {
      console.error('Failed to load status:', err)
    }
  }

  return (
    <div>
      <div style={{
        background: isOnline ? 'var(--accent-green-light)' : 'var(--accent-red-light)',
        border: `1px solid ${isOnline ? 'var(--accent-green)' : 'var(--accent-red)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>{isOnline ? '🟢' : '🔴'}</span>
        <div>
          <div style={{
            fontSize: 'var(--font-body)', fontWeight: 600,
            color: isOnline ? 'var(--accent-green)' : 'var(--accent-red)',
          }}>
            {isOnline ? 'You are online' : 'You are offline'}
          </div>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
            {isOnline ? 'Receiving job requests' : 'Go online to receive job requests'}
          </div>
        </div>
      </div>

      <WorkerStatsBar />

      <div style={{
        background: 'var(--bg-surface)',
        border: '2px solid var(--accent-orange)',
        borderRadius: 'var(--radius-md)', padding: 18, marginBottom: 16,
      }}>
        <div style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          No active job
        </div>
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
          {isOnline ? 'Waiting for customer requests...' : 'Go online to receive job requests'}
        </div>
        <button style={{
          padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none',
          background: 'var(--accent-blue)', color: '#fff',
          fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer',
          opacity: isOnline ? 1 : 0.5,
        }}>
          View Active Job →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Earnings', icon: '💰', path: '/worker/earnings' },
          { label: 'Schedule', icon: '📅', path: '/worker/schedule' },
        ].map((link) => (
          <div key={link.label} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center',
            cursor: 'pointer',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{link.icon}</div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
              {link.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}