import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadWorkers() }, [])

  const loadWorkers = async () => {
    try {
      const res = await api.getAdminWorkers()
      setWorkers(res.data || [])
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleApprove = async (id) => {
    await api.approveWorker(id)
    loadWorkers()
  }

  const handleReject = async (id) => {
    await api.rejectWorker(id)
    loadWorkers()
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        Worker Management
      </h2>

      {workers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No workers found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {workers.map((worker) => (
            <div key={worker.id} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 14,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{worker.name}</div>
                <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
                  {worker.email} · {worker.status}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {worker.status !== 'active' && (
                  <button onClick={() => handleApprove(worker.id)} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: 'none',
                    background: 'var(--accent-green)', color: '#fff', cursor: 'pointer',
                    fontSize: 'var(--font-body-sm)', fontWeight: 600,
                  }}>Approve</button>
                )}
                {worker.status !== 'inactive' && (
                  <button onClick={() => handleReject(worker.id)} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--accent-red)', background: 'transparent',
                    color: 'var(--accent-red)', cursor: 'pointer',
                    fontSize: 'var(--font-body-sm)', fontWeight: 600,
                  }}>Reject</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}