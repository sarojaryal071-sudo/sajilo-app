import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'
import { logAction } from '../../utils/auditLog.js'

export default function AdminApprovals() {
  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState('Pending')
  const [modal, setModal] = useState(null)

  useEffect(() => { loadWorkers() }, [])

  const loadWorkers = async () => {
    const res = await api.getAdminWorkers()
    setWorkers(res.data || [])
  }

  const openModal = (worker, action) => setModal({ worker, action })
  const closeModal = () => setModal(null)

  const confirmAction = async () => {
    if (modal.action === 'approve') {
  await api.approveWorker(modal.worker.id)
  logAction('Approved Worker', modal.worker.name, modal.worker.email)
}
    else {
  await api.rejectWorker(modal.worker.id)
  logAction('Rejected Worker', modal.worker.name, modal.worker.email)
}
    setModal(null)
    loadWorkers()
  }

  const filtered = workers.filter(w => {
    if (filter === 'Pending') return w.status === 'pending'
    if (filter === 'Approved') return w.status === 'active'
    if (filter === 'Rejected') return w.status === 'rejected'
    return true
  })

  const getStatusBadge = (w) => {
    if (w.status === 'active') return { text: 'Approved', color: '#16A34A', bg: '#dcfce7' }
    if (w.status === 'inactive') return { text: 'Rejected', color: '#DC2626', bg: '#fee2e2' }
    return { text: 'Pending', color: '#D97706', bg: '#fef3c7' }
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        Worker Approvals
      </h2>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['Pending', 'Approved', 'Rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 16px', borderRadius: 8,
            border: filter === f ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
            background: filter === f ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
            color: filter === f ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>{f}</button>
        ))}
      </div>

      {/* Approval cards */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, background: 'var(--bg-surface)',
          borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)',
        }}>
          No {filter.toLowerCase()} workers
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((worker) => {
            const badge = getStatusBadge(worker)
            return (
              <div key={worker.id} style={{
                background: 'var(--bg-surface)', borderRadius: 10,
                border: '1px solid var(--border)', padding: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: '#e2e8f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 600, color: '#64748b',
                    }}>{worker.name?.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{worker.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{worker.email}</div>
                      {worker.phone && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📱 {worker.phone}</div>}
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        {(worker.skills || []).map((s, i) => (
                          <span key={i} style={{
                            padding: '2px 8px', borderRadius: 10, background: 'var(--accent-blue-light)',
                            color: 'var(--accent-blue)', fontSize: 10, fontWeight: 500,
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: badge.bg, color: badge.color,
                    }}>{badge.text}</span>
                    {badge.text === 'Pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openModal(worker, 'approve')} style={{
                          padding: '6px 16px', borderRadius: 6, border: 'none',
                          background: '#16A34A', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>Approve</button>
                        <button onClick={() => openModal(worker, 'reject')} style={{
                          padding: '6px 16px', borderRadius: 6,
                          border: '1px solid #ef4444', background: 'transparent',
                          color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document checklist */}
                <div style={{
                  marginTop: 12, padding: 12, borderRadius: 8,
                  background: 'var(--bg-surface2)', display: 'flex', gap: 20,
                }}>
                  {[
                    { label: 'Profile', done: !!worker.name },
                    { label: 'Phone', done: !!worker.phone },
                    { label: 'Skills', done: (worker.skills || []).length > 0 },
                  ].map((doc) => (
                    <div key={doc.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                      <span style={{ color: doc.done ? '#16A34A' : '#DC2626' }}>
                        {doc.done ? '✓' : '✕'}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{doc.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={closeModal}>
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 14, padding: 28, width: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              {modal.action === 'approve' ? 'Approve Worker' : 'Reject Worker'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              {modal.action === 'approve'
                ? `Are you sure you want to approve ${modal.worker.name}? They will be able to go online and receive jobs.`
                : `Are you sure you want to reject ${modal.worker.name}? They will not be able to access the worker panel.`
              }
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={closeModal} style={{
                flex: 1, padding: '10px 0', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--bg-surface)',
                color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={confirmAction} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: modal.action === 'approve' ? '#16A34A' : '#DC2626',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                {modal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}