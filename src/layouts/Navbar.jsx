import { useLocation } from 'react-router-dom'
import navbar from '../config/ui/navbar.config.js'
import { useFeatureFlag } from '../hooks/useFeatureFlag.js'

export default function Navbar({ dark, setDark, lang, setLang, navigate, t, onSOS }) {
  const location = useLocation()
  const currentPath = location.pathname

  const savedNav = localStorage.getItem('sajilo_nav_config')
  const navConfig = savedNav ? JSON.parse(savedNav) : null

  const allTabs = [
    { key: '/home', label: t.navHome, id: 'home' },
    { key: '/search', label: t.navSearch, id: 'search' },
    { key: '/bookings', label: t.navBookings, id: 'bookings' },
    { key: '/pro', label: t.navPro, id: 'pro' },
    { key: '/profile', label: t.navProfile, id: 'profile' },
  ]

  const tabs = navConfig
    ? allTabs.filter(tab => {
        const configItem = navConfig.find(n => n.id === tab.id)
        return configItem ? configItem.enabled : true
      })
    : allTabs

  const sosEnabled = useFeatureFlag('sosEmergency')

  const handleLangChange = (e) => {
    const newLang = e.target.value
    setLang(newLang)
    const user = JSON.parse(localStorage.getItem('sajilo_user') || '{}')
    const role = user?.role || 'customer'
    localStorage.setItem(`sajilo_lang_${role}`, newLang)
    window.dispatchEvent(new Event('langChange'))
  }

  return (
    <nav className="navbar" style={{
      height: navbar.height, background: 'var(--bg-nav)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: navbar.padding, gap: 8,
      position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 24, flexShrink: 0 }}>
        <div style={{
          width: 30, height: 30, background: 'var(--accent-blue)', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 14,
        }}>S</div>
        <span style={{ fontSize: navbar.brand.fontSize, fontWeight: navbar.brand.fontWeight, color: 'var(--text-primary)' }}>{t.appName}</span>
      </div>

      <div style={{ display: 'flex', gap: 2, flex: 1 }}>
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => navigate(tab.key)} style={{
            padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
            background: currentPath === tab.key ? 'var(--accent-blue-light)' : 'transparent',
            color: currentPath === tab.key ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}>{tab.label}</button>
        ))}
      </div>

      {sosEnabled && (
        <button onClick={onSOS} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', background: '#D92B2B', color: '#fff',
          border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700,
          cursor: 'pointer', flexShrink: 0,
        }}>
          📞 SOS
        </button>
      )}

      <select value={lang} onChange={handleLangChange} style={{
        padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)',
        background: 'var(--bg-surface2)', color: 'var(--text-primary)',
        fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', flexShrink: 0,
      }}>
        <option value="en">EN</option>
        <option value="ne">ने</option>
      </select>

      <button onClick={() => setDark(d => !d)} style={{
        width: 34, height: 34, borderRadius: 7, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-surface2)', border: '1px solid var(--border)',
        cursor: 'pointer', fontSize: 16, flexShrink: 0,
      }}>
        {dark ? '☀️' : '🌙'}
      </button>
      <button onClick={() => {
        localStorage.removeItem('sajilo_user')
        localStorage.removeItem('sajilo_token')
        window.location.href = '/login'
      }} style={{
        padding: '6px 12px', borderRadius: 6,
        border: '1px solid var(--accent-red)', background: 'transparent',
        color: 'var(--accent-red)', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', flexShrink: 0,
      }}>
        Logout
      </button>
    </nav>
  )
}