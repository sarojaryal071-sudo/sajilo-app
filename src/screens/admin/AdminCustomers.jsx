import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const res = await api.getAdminCustomers()
      setCustomers(res.data || [])
    } catch (err) {
      console.error('Failed to load customers:', err)
    }
  }

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Customers</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, background: 'var(--bg-surface)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
        <input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{
          flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, outline: 'none',
          background: 'var(--bg-surface2)', color: 'var(--text-primary)',
        }} />
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 1fr 1fr 0.7fr', padding: '10px 16px', background: 'var(--bg-surface2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          <span>Avatar</span><span>Name</span><span>Email</span><span>Joined</span><span>Bookings</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No customers found</div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} style={{
              display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 1fr 1fr 0.7fr', padding: '12px 16px',
              borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 13,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                {c.name?.charAt(0)}
              </div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{c.email}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</span>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{c.bookings || 0}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}