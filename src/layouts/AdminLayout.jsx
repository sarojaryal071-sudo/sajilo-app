import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import adminNavigation from '../config/adminNavigation.js'

const sections = ['Overview', 'People', 'Operations', 'Platform', 'System']

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [dark, setDark] = useState(() => {
  return localStorage.getItem('sajilo_theme') === 'dark'
})

const handleSetDark = (val) => {
  const newVal = typeof val === 'function' ? val(dark) : val
  setDark(newVal)
  localStorage.setItem('sajilo_theme', newVal ? 'dark' : 'light')
}

  const handleLogout = () => {
    localStorage.removeItem('sajilo_user')
    localStorage.removeItem('sajilo_token')
    window.location.href = '/login'
  }

  return (
    <div data-theme={dark ? 'dark' : 'light'} style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', fontFamily: 'var(--font-family)',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', height: 56, background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
          Dashboard
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => handleSetDark(!dark)} style={{
            width: 34, height: 34, borderRadius: 7, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-surface2)', border: '1px solid var(--border)',
            cursor: 'pointer', fontSize: 16,
          }}>
            {dark ? '☀️' : '🌙'}
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Admin</span>
          <button onClick={handleLogout} style={{
            padding: '6px 14px', borderRadius: 6,
            border: '1px solid var(--accent-red)', background: 'transparent',
            color: 'var(--accent-red)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Logout</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Dark Sidebar */}
        <div style={{
          width: 240, flexShrink: 0, background: '#0F172A',
          padding: '20px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          {/* Logo */}
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <div onClick={() => navigate('/admin/home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #1A56DB, #1e3a5f)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 14,
              }}>S</div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Sajilo</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                background: 'var(--accent-orange)', color: '#fff',
              }}>ADMIN</span>
            </div>
          </div>

          {/* Navigation sections */}
          {sections.map((section) => (
            <div key={section} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                padding: '0 20px', marginBottom: 6,
              }}>
                {section}
              </div>
              {adminNavigation
                .filter(item => item.section === section)
                .map((item) => (
                  <button key={item.id} onClick={() => navigate(item.path)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '9px 20px', border: 'none',
                    background: location.pathname === item.path ? '#1A56DB' : 'transparent',
                    color: location.pathname === item.path ? '#fff' : '#94a3b8',
                    fontSize: 13, fontWeight: location.pathname === item.path ? 600 : 400,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }} onMouseEnter={(e) => {
                    if (location.pathname !== item.path) e.target.style.color = '#e2e8f0'
                  }} onMouseLeave={(e) => {
                    if (location.pathname !== item.path) e.target.style.color = '#94a3b8'
                  }}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
            </div>
          ))}

          {/* User at bottom */}
          <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: '#334155',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#94a3b8', fontSize: 14, fontWeight: 600,
              }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>Admin</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Super Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: 24,
          background: 'var(--bg-surface2)',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}