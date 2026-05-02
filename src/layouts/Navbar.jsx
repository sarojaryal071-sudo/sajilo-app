import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import navbar from '../config/ui/navbar.config.js'
import { useFeatureFlag } from '../hooks/useFeatureFlag.js'

export default function Navbar({ dark, setDark, lang, setLang, navigate, t, onSOS }) {
  const location = useLocation()
  const currentPath = location.pathname
  const [showNotif, setShowNotif] = useState(false)
  const notifRef = useRef(null)

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
  const notifEnabled = useFeatureFlag('notifications')

  // Mock notifications — 🔧 admin-configurable via backend
  const [notifications] = useState([
    { id: 1, icon: '📋', text: 'Your application is under review.', time: '2m ago' },
    { id: 2, icon: '✅', text: 'Documents verified successfully.', time: '1h ago' },
    { id: 3, icon: '💰', text: 'New earning credited: Rs 500.', time: '3h ago' },
  ])

  const unreadCount = notifications.length

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    if (showNotif) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showNotif])

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

      {/* Notification Bell — 🔧 admin can disable via feature flag */}
      {notifEnabled && (
        <div ref={notifRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => setShowNotif(!showNotif)} style={{
            width: 34, height: 34, borderRadius: 7, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: showNotif ? 'var(--accent-blue-light)' : 'var(--bg-surface2)',
            border: '1px solid var(--border)', cursor: 'pointer', fontSize: 16,
            position: 'relative',
          }}>
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--accent-red)', color: '#fff',
                fontSize: 10, fontWeight: 700, width: 18, height: 18,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{unreadCount}</span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotif && (
            <div style={{
              position: 'absolute', top: 42, right: 0, width: 320, maxHeight: 360,
              background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid var(--border)',
              overflowY: 'auto', zIndex: 200,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{t.notifTitle || 'Notifications'}</span>
                <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 500 }}>✕</button>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>{t.notifEmpty || 'No new notifications'}</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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