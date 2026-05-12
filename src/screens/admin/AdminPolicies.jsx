import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const fetchPolicies = async () => {
    try {
      const res = await api.getPolicies()
      if (res?.success) setPolicies(res.data)
    } catch (err) {
      console.error('Failed to fetch policies:', err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchPolicies() }, [])

  const startEdit = (policy) => {
    setEditingKey(policy.key)
    setEditValue(JSON.stringify(policy.value))
    setEditDesc(policy.description || '')
  }

  const cancelEdit = () => {
    setEditingKey(null)
    setEditValue('')
    setEditDesc('')
  }

  const saveEdit = async (key) => {
    try {
      let parsedValue
      try {
        parsedValue = JSON.parse(editValue)   // accept numbers, booleans, strings
      } catch {
        parsedValue = editValue                // fallback to raw string
      }
      await api.updatePolicy(key, parsedValue, editDesc)
      cancelEdit()
      fetchPolicies()
    } catch (err) {
      alert(err.message || 'Failed to update policy')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Platform Policies
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Manage operational rules and limits
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
      ) : policies.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 40, color: 'var(--text-secondary)',
          background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)',
        }}>
          No policies defined yet. Use the backend API to add some.
        </div>
      ) : (
        <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 2fr 1fr', gap: 8, padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
            <span>Key</span>
            <span>Value</span>
            <span>Description</span>
            <span>Action</span>
          </div>
          {policies.map(policy => (
            <div key={policy.key} style={{
              display: 'grid', gridTemplateColumns: '2fr 3fr 2fr 1fr', gap: 8, padding: '12px 20px',
              borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 13,
            }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500, wordBreak: 'break-word' }}>
                {policy.key}
              </span>

              {editingKey === policy.key ? (
                <>
                  <input
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    style={{
                      padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
                      background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13, width: '100%',
                    }}
                  />
                  <input
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    placeholder="Description (optional)"
                    style={{
                      padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
                      background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13, width: '100%',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => saveEdit(policy.key)} style={{
                      padding: '4px 10px', borderRadius: 6, border: 'none',
                      background: 'var(--accent-blue)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>Save</button>
                    <button onClick={cancelEdit} style={{
                      padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)',
                      background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                    {typeof policy.value === 'object' ? JSON.stringify(policy.value) : String(policy.value)}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{policy.description || '—'}</span>
                  <button onClick={() => startEdit(policy)} style={{
                    padding: '4px 10px', borderRadius: 6, border: '1px solid var(--accent-blue)',
                    background: 'transparent', color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>Edit</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}