import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminLiveOps() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    api.getLiveOperations()
      .then(res => {
        if (res?.success) setMetrics(res.data)
      })
      .catch(err => console.error('Live ops fetch failed:', err))
  }, [])

  const cards = [
    {
      label: 'Active Bookings',
      value: metrics?.activeBookings ?? 0,
      icon: '📋',
      color: '#16A34A',
      bg: '#f0fdf4',
    },
    {
      label: 'Unpaid Invoices',
      value: metrics?.unpaidInvoices ?? 0,
      icon: '💰',
      color: '#D97706',
      bg: '#fef3c7',
    },
    {
      label: 'Cancellations (24h)',
      value: metrics?.cancellationsToday ?? 0,
      icon: '❌',
      color: '#DC2626',
      bg: '#fee2e2',
    },
    {
      label: 'Online Workers',
      value: metrics?.workerActivity?.online ?? 0,
      icon: '🟢',
      color: '#1A56DB',
      bg: '#eff6ff',
    },
    {
      label: 'Offline Workers',
      value: metrics?.workerActivity?.offline ?? 0,
      icon: '🔴',
      color: '#6b7280',
      bg: '#f3f4f6',
    },
    {
      label: 'Notifications (24h)',
      value: metrics?.notificationsToday ?? 0,
      icon: '🔔',
      color: '#7c3aed',
      bg: '#f5f3ff',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Live Operations
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Real‑time operational metrics
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {cards.map((card) => (
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
    </div>
  )
}