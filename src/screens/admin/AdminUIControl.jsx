import { useState } from 'react'
import uiRegistry from '../../config/ui/uiRegistry.js'

const FLAG_LABELS = {
  sosEmergency: 'SOS Emergency',
  proSubscription: 'Pro Subscription',
  googleLogin: 'Google Login',
  appleLogin: 'Apple Login',
  forgotPassword: 'Forgot Password',
  rememberMe: 'Remember Me',
  termsText: 'Terms & Privacy',
  socialDivider: 'Social Divider',
  loginLogo: 'Login Logo',
}

export default function AdminUIControl() {
  const [flags, setFlags] = useState(() => {
    const saved = localStorage.getItem('sajilo_flags')
    const allFlags = saved ? JSON.parse(saved) : uiRegistry.features
    return {
      sosEmergency: allFlags.sosEmergency || { enabled: true },
      proSubscription: allFlags.proSubscription || { enabled: true },
      googleLogin: allFlags.googleLogin || { enabled: false },
      appleLogin: allFlags.appleLogin || { enabled: false },
      forgotPassword: allFlags.forgotPassword || { enabled: true },
      rememberMe: allFlags.rememberMe || { enabled: true },
      termsText: allFlags.termsText || { enabled: true },
      socialDivider: allFlags.socialDivider || { enabled: false },
      loginLogo: allFlags.loginLogo || { enabled: false },
    }
  })
  const [theme, setTheme] = useState(uiRegistry.theme)
  const [saved, setSaved] = useState(false)

  const [navItems, setNavItems] = useState(() => {
    const saved = localStorage.getItem('sajilo_nav_config')
    return saved ? JSON.parse(saved) : [
      { id: 'home', label: 'Home', enabled: true },
      { id: 'search', label: 'Search', enabled: true },
      { id: 'bookings', label: 'Bookings', enabled: true },
      { id: 'pro', label: 'Pro', enabled: true },
      { id: 'profile', label: 'Profile', enabled: true },
    ]
  })

  const toggleFlag = (key) => {
    setFlags(prev => {
      const updated = { ...prev, [key]: { enabled: !prev[key].enabled } }
      localStorage.setItem('sajilo_flags', JSON.stringify(updated))
      return updated
    })
  }

  const toggleNavItem = (id) => {
    setNavItems(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
      localStorage.setItem('sajilo_nav_config', JSON.stringify(updated))
      return updated
    })
  }

  const handleSave = () => {
    localStorage.setItem('sajilo_flags', JSON.stringify(flags))
    localStorage.setItem('sajilo_nav_config', JSON.stringify(navItems))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        UI Control Panel
      </h2>

      {/* Feature Flags */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Feature Flags</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {Object.entries(flags).map(([key, value]) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {FLAG_LABELS[key] || key}
              </span>
              <button onClick={() => toggleFlag(key)} style={{
                width: 48, height: 26, borderRadius: 13, border: 'none',
                background: value.enabled ? '#16A34A' : '#cbd5e1',
                cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: value.enabled ? 25 : 3, transition: 'all 0.2s',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Theme Settings</h3>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Primary Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={theme.primaryColor} onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))} style={{ width: 40, height: 36, border: 'none', cursor: 'pointer' }} />
              <input value={theme.primaryColor} onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))} style={{
                padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, width: 100,
              }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Accent Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={theme.accentColor} onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))} style={{ width: 40, height: 36, border: 'none', cursor: 'pointer' }} />
              <input value={theme.accentColor} onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))} style={{
                padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, width: 100,
              }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: 'var(--bg-surface2)', display: 'flex', gap: 8 }}>
          <div style={{ padding: '8px 16px', borderRadius: 6, background: theme.primaryColor, color: '#fff', fontSize: 12, fontWeight: 600 }}>Primary Button</div>
          <div style={{ padding: '8px 16px', borderRadius: 6, background: theme.accentColor, color: '#fff', fontSize: 12, fontWeight: 600 }}>Accent Button</div>
        </div>
      </div>

      {/* Navigation Config */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Navigation Config</h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Toggle visibility of navigation items in customer app.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {navItems.map((item) => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.label}</span>
              <button onClick={() => toggleNavItem(item.id)} style={{
                width: 48, height: 26, borderRadius: 13, border: 'none',
                background: item.enabled ? '#16A34A' : '#cbd5e1',
                cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: item.enabled ? 25 : 3, transition: 'all 0.2s',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} style={{
        padding: '12px 24px', borderRadius: 8, border: 'none',
        background: saved ? '#16A34A' : 'var(--accent-blue)', color: '#fff',
        fontSize: 14, fontWeight: 600, cursor: 'pointer',
      }}>
        {saved ? '✓ Saved to Config' : 'Save Changes'}
      </button>
    </div>
  )
}