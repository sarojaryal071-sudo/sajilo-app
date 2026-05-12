import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminFeatureFlags() {
  const [flags, setFlags] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})

  const fetchFlags = async () => {
    try {
      const res = await api.getFeatureFlags()
      if (res?.success) setFlags(res.data)
    } catch (err) {
      console.error('Failed to fetch feature flags:', err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchFlags() }, [])

  const handleToggle = async (flagName) => {
    const current = flags[flagName]
    const newValue = !current

    setSaving(prev => ({ ...prev, [flagName]: true }))
    try {
      await api.toggleFeatureFlag(flagName, newValue)
      setFlags(prev => ({ ...prev, [flagName]: newValue }))
    } catch (err) {
      alert(err.message || 'Failed to update flag')
    }
    setSaving(prev => ({ ...prev, [flagName]: false }))
  }

  const flagNames = Object.keys(flags).sort()

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Feature Flags
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Toggle platform features on or off
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
      ) : flagNames.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          No feature flags found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {flagNames.map(flag => (
            <div key={flag} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px', background: 'var(--bg-surface)', borderRadius: 10,
              border: '1px solid var(--border)',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {flag.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {flags[flag] ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <button
                onClick={() => handleToggle(flag)}
                disabled={saving[flag]}
                style={{
                  padding: '6px 16px',
                  borderRadius: 20,
                  border: flags[flag] ? '2px solid #16A34A' : '2px solid var(--border)',
                  background: flags[flag] ? '#16A34A' : 'transparent',
                  color: flags[flag] ? '#fff' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  minWidth: 80,
                  opacity: saving[flag] ? 0.6 : 1,
                }}
              >
                {saving[flag] ? '...' : flags[flag] ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}