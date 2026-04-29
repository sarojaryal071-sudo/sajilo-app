import { useState } from 'react'
import { useWorker } from '../../contexts/WorkerContext.jsx'

export default function WorkerProfile() {
  const { profile, updateProfile } = useWorker()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    setName(profile?.name || '')
    setPhone(profile?.phone || '')
    setBio(profile?.bio || '')
    setSkills((profile?.skills || []).join(', '))
    setHourlyRate(profile?.hourly_rate || '')
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    await updateProfile({
      name, phone, bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      hourly_rate: parseInt(hourlyRate) || 500,
    })
    setSaving(false)
    setEditing(false)
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>My Profile</h2>
        <button onClick={() => editing ? handleSave() : startEdit()} style={{
          padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
          background: editing ? 'var(--accent-green)' : 'var(--accent-blue)',
          color: '#fff', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer',
        }}>{editing ? (saving ? 'Saving...' : 'Save') : 'Edit'}</button>
      </div>

      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--accent-blue-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: 'var(--accent-blue)',
          }}>{profile.name?.charAt(0)?.toUpperCase() || 'W'}</div>
          <div>
            <div style={{ fontSize: 'var(--font-large)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {editing ? (
                <input value={name} onChange={(e) => setName(e.target.value)} style={{
                  padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                  fontSize: 'var(--font-body)', width: '100%',
                }} />
              ) : profile.name}
            </div>
            <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>{profile.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Phone</div>
            {editing ? (
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{
                padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                width: '100%', fontSize: 'var(--font-body)',
              }} />
            ) : <div style={{ color: 'var(--text-primary)' }}>{profile.phone || 'Not set'}</div>}
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Bio</div>
            {editing ? (
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{
                padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                width: '100%', fontSize: 'var(--font-body)', resize: 'vertical',
              }} />
            ) : <div style={{ color: 'var(--text-primary)' }}>{profile.bio || 'No bio yet'}</div>}
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Skills</div>
            {editing ? (
              <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="electrician, plumber, cleaner" style={{
                padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                width: '100%', fontSize: 'var(--font-body)',
              }} />
            ) : (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(profile.skills || []).length > 0 ? profile.skills.map((s, i) => (
                  <span key={i} style={{ padding: '4px 10px', borderRadius: 12, background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)', fontWeight: 500 }}>{s}</span>
                )) : <span style={{ color: 'var(--text-secondary)' }}>No skills added</span>}
              </div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Hourly Rate (Rs)</div>
            {editing ? (
              <input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} type="number" style={{
                padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                width: '100%', fontSize: 'var(--font-body)',
              }} />
            ) : <div style={{ color: 'var(--text-primary)' }}>Rs {profile.hourly_rate || 500}</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--accent-blue)' }}>{profile.completed_jobs || 0}</div>
          <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>Jobs Done</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--accent-green)' }}>Rs {(profile.total_earnings || 0).toLocaleString()}</div>
          <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>Earnings</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: profile.is_online ? 'var(--accent-green)' : 'var(--accent-red)' }}>{profile.is_online ? '🟢' : '🔴'}</div>
          <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>{profile.is_online ? 'Online' : 'Offline'}</div>
        </div>
      </div>
    </div>
  )
}