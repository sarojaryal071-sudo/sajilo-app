import { useState, useEffect } from 'react'
import { API_URL } from '../../services/api.js'
import { useSocket } from '../../hooks/useSocket.js'

export default function AdminDeployment() {
  const [systemStatus, setSystemStatus] = useState(null)
  const [health, setHealth] = useState(null)
  const [deploymentStatus, setDeploymentStatus] = useState(null)
  const { socket } = useSocket()

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(d => setHealth(d))
      .catch(() => setHealth({ db: 'unknown', status: 'error' }))

    fetch(`${API_URL}/system/status`)
      .then(r => r.json())
      .then(d => setSystemStatus(d))
      .catch(() => setSystemStatus({ error: true }))

    // Fetch deployment validation (Module 4)
    const token = localStorage.getItem('sajilo_token')
    fetch(`${API_URL}/admin/deployment-status`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => {
        if (d?.success) setDeploymentStatus(d.data)
      })
      .catch(() => {})
  }, [])

  const socketActive = socket?.connected || false

  const cards = [
    {
      label: 'Environment',
      value: systemStatus?.environment || '—',
      icon: '🌐',
      detail: systemStatus ? (systemStatus.environment === 'production' ? 'Live' : 'Dev') : '',
    },
    {
      label: 'API Version',
      value: systemStatus?.version || '—',
      icon: '📦',
      detail: '',
    },
    {
      label: 'Deployed At',
      value: systemStatus?.deployedAt
        ? new Date(systemStatus.deployedAt).toLocaleString()
        : '—',
      icon: '🕒',
      detail: '',
    },
    {
      label: 'Database',
      value: health?.db === 'ok' ? 'Connected' : health?.db === 'error' ? 'Error' : '—',
      icon: '🗄️',
      detail: '',
    },
    {
      label: 'Socket Status',
      value: socketActive ? 'Connected' : 'Disconnected',
      icon: '🔌',
      detail: socketActive ? 'Live' : 'Check backend',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Deployment & Environment
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Current backend status and deployment validation
        </p>
      </div>

      {/* Deployment validation warnings */}
      {deploymentStatus?.warnings?.length > 0 && (
        <div style={{ marginBottom: 20, padding: 16, background: '#fef3c7', borderRadius: 10, border: '1px solid #D97706' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#D97706', marginBottom: 8 }}>⚠️ Deployment Warnings</div>
          {deploymentStatus.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 13, color: '#92400e', marginBottom: 4 }}>• {w}</div>
          ))}
        </div>
      )}

      {/* Version mismatch specific */}
      {deploymentStatus?.versionMismatch && (
        <div style={{ marginBottom: 20, padding: 16, background: '#fee2e2', borderRadius: 10, border: '1px solid #DC2626' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>
            Version Mismatch
          </div>
          <div style={{ fontSize: 13, color: '#991b1b', marginTop: 4 }}>
            Frontend: {deploymentStatus.frontendVersion || 'unknown'} — Backend: {deploymentStatus.backendVersion}
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {cards.map((card) => (
          <div key={card.label} style={{
            background: 'var(--bg-surface)', borderRadius: 12, padding: 20,
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>{card.icon}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{card.detail}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{card.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          ⏱ Backend Uptime: {deploymentStatus?.uptime
            ? Math.floor(deploymentStatus.uptime) + ' seconds'
            : systemStatus?.uptime
              ? Math.floor(systemStatus.uptime) + ' seconds'
              : '—'}
        </span>
      </div>
    </div>
  )
}