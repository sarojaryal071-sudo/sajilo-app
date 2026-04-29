import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'
import { logAction } from '../../utils/auditLog.js'

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => { loadWorkers() }, [])

  const loadWorkers = async () => {
    const res = await api.getAdminWorkers()
    setWorkers(res.data || [])
  }

  const openModal = (worker, action) => setModal({ worker, action })
  const closeModal = () => setModal(null)

  const confirmAction = async () => {
    if (modal.action === 'suspend') {
      await api.rejectWorker(modal.worker.id)
      logAction('Suspended Worker', modal.worker.name, modal.worker.email)
    } else if (modal.action === 'restore') {
      await api.approveWorker(modal.worker.id)
      logAction('Restored Worker', modal.worker.name, modal.worker.email)
    }
    setModal(null)
    loadWorkers()
  }

  const filtered = workers.filter(w => {
    if (filter === 'Active') return w.status === 'active'
    if (filter === 'Suspended') return w.status === 'inactive'
    return true
  }).filter(w => w.name?.toLowerCase().includes(search.toLowerCase()) || w.email?.toLowerCase().includes(search.toLowerCase()))

  const statusColor = (status) => {
    if (status === 'active') return { bg: '#dcfce7', color: '#16A34A' }
    if (status === 'inactive') return { bg: '#fee2e2', color: '#DC2626' }
    return { bg: '#fef3c7', color: '#D97706' }
  }

  const getRisk = (worker) => {
    if (!worker.phone || !worker.skills?.length) return { color: '#DC2626', label: 'High Risk' }
    if (worker.completed_jobs < 1) return { color: '#D97706', label: 'Medium Risk' }
    return { color: '#16A34A', label: 'Low Risk' }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Workers</h2>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, background: 'var(--bg-surface)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
        <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{
          flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, outline: 'none',
          background: 'var(--bg-surface2)', color: 'var(--text-primary)',
        }} />
        {['All', 'Active', 'Suspended'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 6, border: filter === f ? '1px solid var(--accent-blue)' : '1px solid var(--border)',
            background: filter === f ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
            color: filter === f ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 0.8fr 0.5fr 0.5fr 0.8fr', padding: '10px 16px', background: 'var(--bg-surface2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          <span>Name</span><span>Email</span><span>Status</span><span>Risk</span><span>Jobs</span><span>Actions</span>
        </div>
        {filtered.map((worker) => {
          const risk = getRisk(worker)
          const isExpanded = expandedId === worker.id
          return (
            <div key={worker.id}>
              <div onClick={() => setExpandedId(isExpanded ? null : worker.id)} style={{
                display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 0.8fr 0.5fr 0.5fr 0.8fr', padding: '12px 16px',
                borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 13,
                cursor: 'pointer', background: isExpanded ? 'var(--bg-surface2)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                    {worker.name?.charAt(0)}
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{worker.name}</span>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>{worker.email}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                  background: statusColor(worker.status).bg, color: statusColor(worker.status).color,
                  display: 'inline-block', width: 'fit-content',
                }}>{worker.status}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: risk.color,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: risk.color, display: 'inline-block' }} />
                  {risk.label}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{worker.completed_jobs || 0}</span>
                <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                  {worker.status === 'active' && (
                    <button onClick={() => openModal(worker, 'suspend')} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Suspend</button>
                  )}
                  {worker.status === 'inactive' && (
                    <button onClick={() => openModal(worker, 'restore')} style={{ background: 'none', border: 'none', color: '#16A34A', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Restore</button>
                  )}
                </div>
              </div>

              {/* Expandable row */}
              {isExpanded && (
                <div style={{
                  padding: '12px 16px', background: 'var(--bg-surface2)',
                  borderBottom: '1px solid var(--border)', display: 'flex', gap: 30,
                  fontSize: 12, color: 'var(--text-secondary)',
                }}>
                  <div><strong style={{ color: 'var(--text-primary)' }}>Phone:</strong> {worker.phone || '—'}</div>
                  <div><strong style={{ color: 'var(--text-primary)' }}>Skills:</strong> {(worker.skills || []).join(', ') || '—'}</div>
                  <div><strong style={{ color: 'var(--text-primary)' }}>Joined:</strong> {worker.created_at ? new Date(worker.created_at).toLocaleDateString() : '—'}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

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
              {modal.action === 'suspend' ? 'Suspend Worker' : 'Restore Worker'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              {modal.action === 'suspend'
                ? `Suspend ${modal.worker.name}? They will lose access to the worker panel immediately.`
                : `Restore ${modal.worker.name}? They will regain access to the worker panel.`
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
                background: modal.action === 'suspend' ? '#DC2626' : '#16A34A',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                {modal.action === 'suspend' ? 'Confirm Suspend' : 'Confirm Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}