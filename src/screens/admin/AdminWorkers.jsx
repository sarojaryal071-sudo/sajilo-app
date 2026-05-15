import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'
import ElementRenderer from '../../components/ElementRenderer.jsx'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'offline', label: 'Offline' },
  { key: 'suspended', label: 'Suspended' },
]

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => { 
  api.getAdminWorkers({ status: 'active,rejected,suspended' }).then(r => setWorkers(r.data || []))
}, [])

  const handleAction = async (action, worker) => {
    if (action === 'approve') await api.approveWorker(worker.id)
    else await api.rejectWorker(worker.id)
    const r = await api.getAdminWorkers()
    setWorkers(r.data || [])
  }

  // Filter + search
  let filtered = workers
  if (filter === 'active') filtered = workers.filter(w => w.status === 'active' && w.is_online)
  else if (filter === 'offline') filtered = workers.filter(w => w.status === 'active' && !w.is_online)
  else if (filter === 'suspended') filtered = workers.filter(w => w.status === 'suspended')
  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(w => (w.name || '').toLowerCase().includes(s) || (w.email || '').toLowerCase().includes(s) || (w.client_id || '').toLowerCase().includes(s))
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Workers</h2>

      {/* Workers by Status Chart */}
      {(() => {
        const statusCounts = {
          active: workers.filter(w => w.status === 'active').length,
          pending: workers.filter(w => w.status !== 'active' && w.status !== 'inactive').length,
          inactive: workers.filter(w => w.status === 'inactive').length,
        };
        const maxCount = Math.max(statusCounts.active, statusCounts.pending, statusCounts.inactive, 1);
        return (
          <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
              Workers by Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Active', count: statusCounts.active, color: '#16A34A', bg: '#dcfce7' },
                { label: 'Pending', count: statusCounts.pending, color: '#D97706', bg: '#fef3c7' },
                { label: 'Inactive', count: statusCounts.inactive, color: '#DC2626', bg: '#fee2e2' },
              ].map((bar) => (
                <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 70, fontSize: 12, color: 'var(--text-secondary)' }}>{bar.label}</span>
                  <div style={{ flex: 1, height: 24, background: 'var(--bg-surface2)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${(bar.count / maxCount) * 100}%`,
                      background: bar.color, borderRadius: 6, transition: 'width 0.5s',
                      display: 'flex', alignItems: 'center', paddingLeft: 8,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{bar.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search workers..."
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' }} />
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 14px', borderRadius: 6, border: '1px solid var(--border)',
              background: filter === f.key ? 'var(--accent-blue)' : 'var(--bg-surface)',
              color: filter === f.key ? '#fff' : 'var(--text-secondary)',
              fontSize: 13, cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <ElementRenderer elementId="adminWorkersTable" overrideData={{ data: filtered, onAction: handleAction }} />
    </div>
  )
}