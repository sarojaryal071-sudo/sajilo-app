import { useState } from 'react'

export default function AdminAudit() {
  const [logs, setLogs] = useState(() => {
    return JSON.parse(localStorage.getItem('sajilo_audit_logs') || '[]')
  })

  const refresh = () => {
    setLogs(JSON.parse(localStorage.getItem('sajilo_audit_logs') || '[]'))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Audit Log</h2>
        <button onClick={refresh} style={{
          padding: '6px 14px', borderRadius: 6, border: '1px solid var(--border)',
          background: 'var(--bg-surface)', color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>Refresh</button>
      </div>

      {logs.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, background: 'var(--bg-surface)',
          borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📜</div>
          <p style={{ fontSize: 14 }}>No audit logs yet.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1.2fr 1fr',
            padding: '10px 16px', background: 'var(--bg-surface2)', borderBottom: '1px solid var(--border)',
            fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase',
          }}>
            <span>Admin</span><span>Action</span><span>Target</span><span>Details</span><span>Time</span>
          </div>
          {logs.map((log) => (
            <div key={log.id} style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1.2fr 1fr',
              padding: '12px 16px', borderBottom: '1px solid var(--border)',
              alignItems: 'center', fontSize: 13,
            }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{log.admin}</span>
              <span style={{ color: 'var(--text-primary)' }}>{log.action}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{log.target}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{log.details || '—'}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{log.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}