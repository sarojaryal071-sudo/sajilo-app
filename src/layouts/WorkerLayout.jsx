import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getToken } from '../services/api.js'
import workerNavigation from '../config/workerNavigation.js'
import OnlineToggle from '../components/worker/OnlineToggle.jsx'
import WorkerMobileDrawer from './WorkerMobileDrawer.jsx'
import { WorkerProvider, useWorker } from '../contexts/WorkerContext.jsx'
import { BookingProvider } from '../contexts/BookingContext.jsx'
import { useFeatureFlag } from '../hooks/useFeatureFlag.js'

function WorkerLayoutInner({ children, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, toggleOnline, loadAll } = useWorker()
  const [dark, setDark] = useState(() => localStorage.getItem('sajilo_theme') === 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('sajilo_lang') || 'en')
  const [showDrawer, setShowDrawer] = useState(false)

  const isApproved = profile?.status === 'active'
  const sosEnabled = useFeatureFlag('sosEmergency')
    
    const showTopbar = useFeatureFlag('workerTopbar')
    const showTopbarName = useFeatureFlag('workerTopbarName')

  const primaryItems = workerNavigation.filter(n => n.priority === 'primary')
  const secondaryItems = workerNavigation.filter(n => n.priority === 'secondary')

  useEffect(() => {
    const token = getToken()
    if (!token) return
    const socket = io('http://localhost:5000', { auth: { token } })
    socket.on('connected', (data) => console.log('🔍 SOCKET: Worker connected:', data))
    socket.on('booking.created', () => loadAll())
    return () => socket.disconnect()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('sajilo_user')
    localStorage.removeItem('sajilo_token')
    if (onLogout) { onLogout() } else { window.location.href = '/login' }
  }

  return (
    <div data-theme={dark ? 'dark' : 'light'} style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', fontFamily: 'var(--font-family)' }}>
      
           {/* Toggle — always fixed, admin can move but not hide */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 20px', background: 'transparent', flexShrink: 0 }}>
        {isApproved && <OnlineToggle isOnline={profile?.is_online || false} onToggle={toggleOnline} />}
      </div>

      {/* Name — admin can show/hide */}
      {showTopbar && showTopbarName && (
        <div style={{ padding: '0 20px 4px 20px', background: 'transparent' }}>
          <span style={{ fontSize: 'var(--font-body-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {profile?.name || 'Worker'}
          </span>
        </div>
      )}

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Desktop Sidebar */}
        <div className="worker-sidebar" style={{ width: 200, flexShrink: 0, background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', padding: '12px 0', overflowY: 'auto' }}>
          {workerNavigation.filter(n => n.mobileVisible).map((item) => (
            <button key={item.id} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 20px', border: 'none',
              background: location.pathname === item.path ? 'var(--accent-blue-light)' : 'transparent',
              color: location.pathname === item.path ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, paddingBottom: 80 }}>{children}</div>
      </div>

      {/* Mobile Bottom Bar — exact client panel style */}
      <div className="worker-bottom-nav" style={{ display: 'none', height: 60, background: 'var(--bg-nav)', borderTop: '1px solid var(--border)', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
        {primaryItems.map((item) => (
          <button key={item.id} onClick={() => navigate(item.path)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 4px',
            color: location.pathname === item.path ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
        {sosEnabled && (
          <button onClick={() => {}} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 4px', color: '#D92B2B' }}>
            <span style={{ fontSize: 18 }}>🆘</span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>SOS</span>
          </button>
        )}
        <button onClick={() => setShowDrawer(true)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 4px', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: 18 }}>☰</span>
          <span style={{ fontSize: 10, fontWeight: 500 }}>More</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <WorkerMobileDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} navigate={navigate} lang={lang} setLang={setLang} dark={dark} setDark={setDark} onLogout={handleLogout} />

            <style>{`
        .worker-topbar { background: transparent; border-bottom: 1px solid transparent; }
        @media (max-width: 768px) {
          .worker-sidebar { display: none !important; }
          .worker-bottom-nav { display: flex !important; }
          .worker-topbar, [data-theme] .worker-topbar { background: transparent !important; border-bottom: none !important; box-shadow: none !important; }
          .worker-topbar-name { color: var(--text-primary) !important; }
        }
        .worker-card { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
      `}</style>
    </div>
  )
}

export default function WorkerLayout({ children, onLogout }) {
  return <WorkerProvider><BookingProvider><WorkerLayoutInner onLogout={onLogout}>{children}</WorkerLayoutInner></BookingProvider></WorkerProvider>
}