import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

const ROLES = ['admin', 'moderator', 'support_agent']

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  // New staff form
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'support_agent' })

  const fetchStaff = async () => {
    try {
      const res = await api.getStaff()
      if (res?.success) setStaff(res.data)
    } catch (err) {
      console.error('Failed to fetch staff:', err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchStaff() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return
    try {
      await api.createStaff(form)
      setForm({ name: '', email: '', password: '', role: 'support_agent' })
      setShowForm(false)
      fetchStaff()
    } catch (err) {
      alert(err.message || 'Failed to create staff')
    }
  }

  const handleToggle = async (userId, active) => {
    try {
      await api.toggleStaff(userId, active)
      fetchStaff()
    } catch (err) {
      alert(err.message || 'Failed to update staff')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Staff Management
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Manage admin, moderator, and support accounts
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: 'none',
            background: showForm ? 'var(--bg-surface2)' : 'var(--accent-blue)',
            color: showForm ? 'var(--text-primary)' : '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : '+ Add Staff'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: 'var(--bg-surface)', borderRadius: 12, padding: 20,
          border: '1px solid var(--border)', marginBottom: 24,
          display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500,
        }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13 }} required />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13 }} required />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13 }} required />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13 }}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: 'var(--accent-blue)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>Create Staff</button>
        </form>
      )}

      {/* Staff list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
      ) : staff.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          No staff accounts yet. Click "+ Add Staff" to create one.
        </div>
      ) : (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 8, padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {staff.map((s) => (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 8, padding: '12px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 13 }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{s.email}</span>
              <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{s.role?.replace('_', ' ')}</span>
              <span style={{ color: s.status === 'active' ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                {s.status}
              </span>
              <button
                onClick={() => handleToggle(s.id, s.status !== 'active')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: s.status === 'active' ? '1px solid #DC2626' : '1px solid #16A34A',
                  background: 'transparent',
                  color: s.status === 'active' ? '#DC2626' : '#16A34A',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {s.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}