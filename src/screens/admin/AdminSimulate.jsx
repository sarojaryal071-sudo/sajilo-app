import { useState } from 'react'
import { api } from '../../services/api.js'

export default function AdminSimulate() {
  const [loading, setLoading] = useState({})
  const [result, setResult] = useState(null)

  const run = async (key, fn, body) => {
    setLoading(prev => ({ ...prev, [key]: true }))
    setResult(null)
    try {
      const res = await fn(body)
      setResult({ type: 'success', message: JSON.stringify(res, null, 2) })
    } catch (err) {
      setResult({ type: 'error', message: err.message || 'Simulation failed' })
    }
    setLoading(prev => ({ ...prev, [key]: false }))
  }

  const actions = [
    {
      key: 'booking',
      label: 'Simulate Booking',
      icon: '📋',
      fn: api.simulateBooking,
      body: { customerId: 11, workerId: 10, serviceName: 'Test Service', jobSize: 'medium' },
    },
    {
      key: 'accept',
      label: 'Simulate Accept',
      icon: '✅',
      fn: api.simulateAccept,
      body: { bookingId: 47, workerId: 10 },
      hint: 'Use a pending booking ID',
    },
    {
      key: 'complete',
      label: 'Simulate Complete',
      icon: '🏁',
      fn: api.simulateComplete,
      body: { bookingId: 47, workerId: 10 },
      hint: 'Use an accepted booking ID',
    },
    {
      key: 'cancel',
      label: 'Simulate Cancel',
      icon: '❌',
      fn: api.simulateCancel,
      body: { bookingId: 47, customerId: 11, reason: 'Admin test' },
    },
    {
      key: 'payment',
      label: 'Simulate Payment',
      icon: '💰',
      fn: api.simulatePayment,
      body: { bookingId: 47 },
      hint: 'Booking must be completed first',
    },
    {
      key: 'notification',
      label: 'Simulate Notification',
      icon: '🔔',
      fn: api.simulateNotification,
      body: {
        userId: 11,
        userRole: 'customer',
        type: 'system_announcement',
        title: 'Test Notification',
        message: 'This is a simulated notification.',
      },
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Simulation Tools
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Trigger real platform actions for testing
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {actions.map(action => (
          <div key={action.key} style={{
            background: 'var(--bg-surface)', borderRadius: 12, padding: 16,
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{action.icon}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{action.label}</span>
            </div>
            {action.hint && (
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>
                💡 {action.hint}
              </div>
            )}
            <button
              onClick={() => run(action.key, action.fn, action.body)}
              disabled={loading[action.key]}
              style={{
                width: '100%', padding: '8px 0', borderRadius: 8, border: 'none',
                background: loading[action.key] ? 'var(--bg-surface2)' : 'var(--accent-blue)',
                color: loading[action.key] ? 'var(--text-secondary)' : '#fff',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
            >
              {loading[action.key] ? 'Running...' : 'Run'}
            </button>
          </div>
        ))}
      </div>

      {result && (
        <div style={{
          marginTop: 20, padding: 16, borderRadius: 10, border: `1px solid ${result.type === 'success' ? '#16A34A' : '#DC2626'}`,
          background: result.type === 'success' ? '#f0fdf4' : '#fee2e2',
          whiteSpace: 'pre-wrap', fontSize: 12, color: result.type === 'success' ? '#166534' : '#991b1b',
          maxHeight: 300, overflow: 'auto',
        }}>
          {result.message}
        </div>
      )}
    </div>
  )
}