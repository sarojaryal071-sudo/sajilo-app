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
    api.getAdminWorkers().then(r => setWorkers(r.data || []))
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
    filtered = filtered.filter(w => (w.name || '').toLowerCase().includes(s) || (w.email || '').toLowerCase().includes(s) || (w.display_id || '').toLowerCase().includes(s))
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Workers</h2>

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