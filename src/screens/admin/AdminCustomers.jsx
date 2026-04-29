import { useState } from 'react'

export default function AdminCustomers() {
  const [search, setSearch] = useState('')

  // Demo data — replace with API later
  const [customers] = useState([
    { id: 1, name: 'Test User', email: 'test@test.com', joined: '2026-04-20', bookings: 0, status: 'active' },
    { id: 2, name: 'Client', email: 'sajilo@client.com', joined: '2026-04-28', bookings: 0, status: 'active' },
  ])

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Customers</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{
          flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none',
        }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 1fr 0.7fr 0.7fr', padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
          <span>Avatar</span><span>Name</span><span>Email</span><span>Joined</span><span>Bookings</span>
        </div>
        {filtered.map((c) => (
          <div key={c.id} style={{
            display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 1fr 0.7fr 0.7fr', padding: '12px 16px',
            borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: 13,
          }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
              {c.name?.charAt(0)}
            </div>
            <span style={{ color: '#1e293b', fontWeight: 500 }}>{c.name}</span>
            <span style={{ color: '#64748b' }}>{c.email}</span>
            <span style={{ color: '#64748b' }}>{c.joined}</span>
            <span style={{ color: '#1A56DB', fontWeight: 600 }}>{c.bookings}</span>
          </div>
        ))}
      </div>
    </div>
  )
}