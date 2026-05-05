import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'
import ElementRenderer from '../../components/ElementRenderer.jsx'

export default function AdminApprovals() {
  const [workers, setWorkers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => { 
    api.getAdminWorkers().then(r => {
      setWorkers((r.data || []).filter(w => w.status === 'pending'))
    })
  }, [])

  const handleAction = async (action, worker) => {
    if (action === 'approve') await api.approveWorker(worker.id)
    else await api.rejectWorker(worker.id)
    const r = await api.getAdminWorkers()
    setWorkers((r.data || []).filter(w => w.status === 'pending'))
  }

  let filtered = workers
  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(w => (w.name || '').toLowerCase().includes(s) || (w.email || '').toLowerCase().includes(s) || (w.display_id || '').toLowerCase().includes(s))
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Approvals</h2>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search pending workers..."
        style={{ width: '100%', maxWidth: 400, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none', marginBottom: 16 }} />

      <ElementRenderer elementId="adminWorkersTable" overrideData={{ data: filtered, onAction: handleAction }} />
    </div>
  )
}