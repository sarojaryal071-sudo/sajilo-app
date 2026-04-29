import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getToken } from '../services/api.js'
import workerNavigation from '../config/workerNavigation.js'
import OnlineToggle from '../components/worker/OnlineToggle.jsx'
import { WorkerProvider, useWorker } from '../contexts/WorkerContext.jsx'

function WorkerLayoutInner({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, toggleOnline, loadAll } = useWorker()
  const [dark, setDark] = useState(() => {
  return localStorage.getItem('sajilo_theme') === 'dark'
})

const handleSetDark = (val) => {
  const newVal = typeof val === 'function' ? val(dark) : val
  setDark(newVal)
  localStorage.setItem('sajilo_theme', newVal ? 'dark' : 'light')
}

  useEffect(() => {
    const token = getToken()
    if (!token) return
    const socket = io('http://localhost:5000', { auth: { token } })
    socket.on('connected', (data) => console.log('Worker socket connected:', data))
    socket.on('booking.created', () => loadAll())
    return () => socket.disconnect()
  }, [])

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
        padding: '12px 20px', background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 'var(--font-body-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {profile?.name || 'Worker'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <OnlineToggle isOnline={profile?.is_online || false} onToggle={toggleOnline} />
          <button onClick={() => handleSetDark(!dark)} style={{
            width: 30, height: 30, borderRadius: 6, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-surface2)', border: '1px solid var(--border)',
            cursor: 'pointer', fontSize: 14,
          }}>{dark ? '☀️' : '🌙'}</button>
          <button onClick={handleLogout} style={{
            padding: '6px 12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--accent-red)', background: 'transparent',
            color: 'var(--accent-red)', fontSize: 'var(--font-body-sm)',
            fontWeight: 600, cursor: 'pointer',
          }}>Logout</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div className="worker-sidebar" style={{
          width: 200, flexShrink: 0, background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)', padding: '12px 0', overflowY: 'auto',
        }}>
          {workerNavigation.map((item) => (
            <button key={item.id} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 20px', border: 'none',
              background: location.pathname === item.path ? 'var(--accent-blue-light)' : 'transparent',
              color: location.pathname === item.path ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, paddingBottom: 80 }}>
          {children}
        </div>
      </div>

      <div className="worker-bottom-nav" style={{
        display: 'none', height: 60, background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)', flexShrink: 0,
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      }}>
        {workerNavigation.filter(n => n.mobileVisible).map((item) => (
          <button key={item.id} onClick={() => navigate(item.path)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 2, border: 'none', background: 'transparent',
            cursor: 'pointer', padding: '8px 4px',
            color: location.pathname === item.path ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .worker-sidebar { display: none !important; }
          .worker-bottom-nav { display: flex !important; }
        }
        .worker-card {
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  )
}

export default function WorkerLayout({ children }) {
  return (
    <WorkerProvider>
      <WorkerLayoutInner>{children}</WorkerLayoutInner>
    </WorkerProvider>
  )
}