import { useState, useEffect } from 'react'
import { API_URL } from '../../services/api.js';

export default function AdminAudit() {
  const [logs, setLogs] = useState(() => {
    return JSON.parse(localStorage.getItem('sajilo_audit_logs') || '[]')
  })
  const [financialEvents, setFinancialEvents] = useState([])
  const [financialLoading, setFinancialLoading] = useState(false)

  const refresh = () => {
    setLogs(JSON.parse(localStorage.getItem('sajilo_audit_logs') || '[]'))
  }

  useEffect(() => {
    setFinancialLoading(true)
    const token = localStorage.getItem('sajilo_token')
    fetch(`${API_URL}/ledger/timeline?limit=50`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    .then(r => r.json())
    .then(d => {
        if (d?.success) setFinancialEvents(d.data || [])
    })
    .catch(console.error)
    .finally(() => setFinancialLoading(false))
  }, [])

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

      {/* ── Financial Events Timeline ── */}
      <div style={{ marginTop: 30 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
          💰 Financial Events
        </h2>

        {financialLoading ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)' }}>
            Loading financial events...
          </div>
        ) : financialEvents.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 60, background: 'var(--bg-surface)',
            borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📜</div>
            <p style={{ fontSize: 14 }}>No financial events recorded yet.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1.2fr 1fr',
              padding: '10px 16px', background: 'var(--bg-surface2)', borderBottom: '1px solid var(--border)',
              fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase',
            }}>
              <span>Event</span>
              <span>Worker</span>
              <span>Amount</span>
              <span>Details</span>
              <span>Time</span>
            </div>
            {financialEvents.map(evt => (
              <div key={evt.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1.2fr 1fr',
                padding: '12px 16px', borderBottom: '1px solid var(--border)',
                alignItems: 'center', fontSize: 13,
              }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, textTransform: 'capitalize' }}>
                  {evt.event_type?.replace(/_/g, ' ')}
                </span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {evt.worker_name || evt.worker_client_id || evt.worker_id}
                </span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                  Rs {parseFloat(evt.amount || 0).toLocaleString()}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  {evt.metadata?.payment_method ? `via ${evt.metadata.payment_method}` : ''}
                  {evt.metadata?.commission_percent ? ` · ${evt.metadata.commission_percent}% commission` : ''}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                  {evt.created_at ? new Date(evt.created_at).toLocaleString() : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}