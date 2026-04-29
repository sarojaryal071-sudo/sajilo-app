import { useState } from 'react'

export default function AdminSettings() {
  const [commission, setCommission] = useState(20)
  const [proCommission, setProCommission] = useState(15)
  const [radius, setRadius] = useState(10)
  const [timeout, setTimeout_] = useState(60)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    console.log('Settings saved:', { commission, proCommission, radius, timeout })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Settings</h2>

      {/* Platform Config */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Platform Configuration</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Platform Commission Rate (%)', value: commission, set: setCommission, desc: 'Applied to all bookings' },
            { label: 'Pro Worker Commission Rate (%)', value: proCommission, set: setProCommission, desc: 'Lower rate for Pro workers' },
            { label: 'Default Matching Radius (km)', value: radius, set: setRadius, desc: 'Max distance for worker matching' },
            { label: 'Request Timeout (seconds)', value: timeout, set: setTimeout_, desc: 'Time before request expires' },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>{field.label}</label>
              <input type="number" value={field.value} onChange={(e) => field.set(Number(e.target.value))} style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
              }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{field.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Config */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Notifications</h3>
        {['Push Notifications', 'SMS Fallback', 'Email Notifications'].map((item) => (
          <div key={item} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: '1px solid #f1f5f9',
          }}>
            <span style={{ fontSize: 13, color: '#334155' }}>{item}</span>
            <button style={{
              width: 48, height: 26, borderRadius: 13, border: 'none',
              background: '#16A34A', cursor: 'pointer', position: 'relative',
            }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: 25 }} />
            </button>
          </div>
        ))}
      </div>

      {/* Admin Account */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Admin Account</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="password" placeholder="New password" style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
          }} />
          <input type="password" placeholder="Confirm new password" style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
          }} />
        </div>
      </div>

      <button onClick={handleSave} style={{
        padding: '12px 24px', borderRadius: 8, border: 'none',
        background: saved ? '#16A34A' : '#1A56DB', color: '#fff',
        fontSize: 14, fontWeight: 600, cursor: 'pointer',
      }}>
        {saved ? '✓ Settings Saved' : 'Save Settings'}
      </button>
    </div>
  )
}