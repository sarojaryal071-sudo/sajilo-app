import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getToken } from '../services/api.js'
import { useSocket } from '../hooks/useSocket.js'
import workerNavigation from '../config/workerNavigation.js'
import OnlineToggle from '../components/worker/OnlineToggle.jsx'
import WorkerMobileDrawer from './WorkerMobileDrawer.jsx'
import { WorkerProvider, useWorker } from '../contexts/WorkerContext.jsx'
import { BookingProvider } from '../contexts/BookingContext.jsx'
import { useFeatureFlag } from '../hooks/useFeatureFlag.js'
import { useNotification } from '../contexts/NotificationContext.jsx'
import workerConfig from '../config/ui/worker.config.js'

function WorkerLayoutInner({ children, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, toggleOnline, loadAll } = useWorker()
  const [dark, setDark] = useState(() => localStorage.getItem('sajilo_theme') === 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('sajilo_lang') || 'en')
  const [showDrawer, setShowDrawer] = useState(false)
  const w = workerConfig

  const isApproved = profile?.status === 'active'
  const sosEnabled = useFeatureFlag('sosEmergency')
  const showTopbar = useFeatureFlag('workerTopbar')
  const showTopbarName = useFeatureFlag('workerTopbarName')
  const { unreadCount } = useNotification()

  const primaryItems = workerNavigation.filter(n => n.priority === 'primary')
  const secondaryItems = workerNavigation.filter(n => n.priority === 'secondary')

    const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return
    socket.on('booking.created', () => loadAll())
    return () => { socket.off('booking.created') }
  }, [socket, loadAll])

  const handleLogout = () => {
    localStorage.removeItem('sajilo_user')
    localStorage.removeItem('sajilo_token')
    if (onLogout) { onLogout() } else { window.location.href = '/login' }
  }

  console.log('[WORKER LAYOUT] Rendering - about to return JSX')
  
  return (
    <div data-theme={dark ? 'dark' : 'light'} style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', fontFamily: 'var(--font-family)' }}>
      
            {/* ── MOBILE ONLINE TOGGLE (hidden on desktop) ── */}
      <div className="worker-mobile-online" style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '8px 20px',
        background: 'transparent',
        flexShrink: 0,
      }}>
      </div>


      {/* ── DESKTOP NAVBAR (hidden on mobile) ── */}
      <div className="worker-desktop-navbar" style={{
        height: w.desktop?.navbar?.height || '56px',
        background: w.desktop?.navbar?.background || 'var(--bg-surface)',
        borderBottom: w.desktop?.navbar?.borderBottom || '1px solid var(--border)',
        /* display: 'none', */
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: w.desktop?.navbar?.padding || '0 24px',
        flexShrink: 0,
      }}>
        {/* Left: Online toggle + name */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
  {showTopbarName && (
    <span style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)' }}>
      {profile?.name || 'Worker'}
    </span>
  )}
</div>

        {/* Right: Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: w.desktop?.navbar?.gap || '12px' }}>
          {/* Theme toggle */}
          <button onClick={() => { const v = !dark; setDark(v); localStorage.setItem('sajilo_theme', v ? 'dark' : 'light'); window.dispatchEvent(new Event('themeChange')); }}
            style={{
              width: w.desktop?.navbar?.control?.width || '36px',
              height: w.desktop?.navbar?.control?.height || '36px',
              borderRadius: w.desktop?.navbar?.control?.borderRadius || '8px',
              border: w.desktop?.navbar?.control?.border || '1px solid var(--border)',
              background: w.desktop?.navbar?.control?.background || 'var(--bg-surface2)',
              cursor: 'pointer',
              fontSize: w.desktop?.navbar?.control?.fontSize || '16px',
              color: w.desktop?.navbar?.control?.color || 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>

          {/* Language toggle */}
          <select value={lang} onChange={(e) => { setLang(e.target.value); localStorage.setItem('sajilo_lang', e.target.value); window.dispatchEvent(new Event('langChange')); }}
            style={{
              height: w.desktop?.navbar?.control?.height || '36px',
              borderRadius: w.desktop?.navbar?.control?.borderRadius || '8px',
              border: w.desktop?.navbar?.control?.border || '1px solid var(--border)',
              background: w.desktop?.navbar?.control?.background || 'var(--bg-surface2)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: w.desktop?.navbar?.control?.color || 'var(--text-secondary)',
              padding: '0 6px',
              outline: 'none',
            }}>
            <option value="en">EN</option>
            <option value="ne">ने</option>
          </select>

          {/* Notifications */}
          <button style={{
            width: w.desktop?.navbar?.control?.width || '36px',
            height: w.desktop?.navbar?.control?.height || '36px',
            borderRadius: w.desktop?.navbar?.control?.borderRadius || '8px',
            border: w.desktop?.navbar?.control?.border || '1px solid var(--border)',
            background: w.desktop?.navbar?.control?.background || 'var(--bg-surface2)',
            cursor: 'pointer',
            fontSize: w.desktop?.navbar?.control?.fontSize || '16px',
            color: w.desktop?.navbar?.control?.color || 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }} title="Notifications">
            🔔
            {unreadCount > 0 && (
              <span style={{
                background: w.desktop?.navbar?.badge?.background || 'var(--accent-red)',
                color: '#fff',
                fontSize: w.desktop?.navbar?.badge?.fontSize || '10px',
                fontWeight: 700,
                width: w.desktop?.navbar?.badge?.width || '18px',
                height: w.desktop?.navbar?.badge?.height || '18px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'absolute',
                top: w.desktop?.navbar?.badge?.top || '-4px',
                right: w.desktop?.navbar?.badge?.right || '-4px',
              }}>{unreadCount}</span>
            )}
          </button>

          {/* Logout */}
          <button onClick={handleLogout} style={{
            width: w.desktop?.navbar?.control?.width || '36px',
            height: w.desktop?.navbar?.control?.height || '36px',
            borderRadius: w.desktop?.navbar?.control?.borderRadius || '8px',
            border: w.desktop?.navbar?.control?.border || '1px solid var(--border)',
            background: w.desktop?.navbar?.control?.background || 'var(--bg-surface2)',
            cursor: 'pointer',
            fontSize: w.desktop?.navbar?.control?.fontSize || '16px',
            color: 'var(--accent-red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} title="Logout">
            🚪
          </button>
        </div>
      </div>

      {/* ── BODY: Sidebar + Content ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Desktop Sidebar */}
        <div className="worker-sidebar" style={{
          width: w.desktop?.sidebar?.width || '240px',
          flexShrink: 0,
          background: w.desktop?.sidebar?.background || 'var(--bg-surface)',
          borderRight: w.desktop?.sidebar?.borderRight || '1px solid var(--border)',
          padding: w.desktop?.sidebar?.padding || '20px 0',
          overflowY: 'auto',
        }}>
          {/* Brand */}
          <div style={{
            fontSize: w.desktop?.sidebar?.brand?.fontSize || '20px',
            fontWeight: w.desktop?.sidebar?.brand?.fontWeight || 800,
            color: w.desktop?.sidebar?.brand?.color || 'var(--accent-blue)',
            padding: w.desktop?.sidebar?.brand?.padding || '0 20px 20px',
            marginBottom: w.desktop?.sidebar?.brand?.marginBottom || '20px',
            borderBottom: w.desktop?.sidebar?.brand?.borderBottom || '1px solid var(--border)',
          }}>
            Sajilo
          </div>

          {/* Nav links */}
          {workerNavigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.id} onClick={() => navigate(item.path)} style={{
                display: w.desktop?.sidebar?.link?.display || 'flex',
                alignItems: w.desktop?.sidebar?.link?.alignItems || 'center',
                gap: w.desktop?.sidebar?.link?.gap || '12px',
                width: '100%',
                padding: w.desktop?.sidebar?.link?.padding || '12px 20px',
                border: 'none',
                borderLeft: isActive
                  ? (w.desktop?.sidebar?.linkActive?.borderLeft || `3px solid var(--accent-blue)`)
                  : (w.desktop?.sidebar?.link?.borderLeft || '3px solid transparent'),
                background: isActive
                  ? (w.desktop?.sidebar?.linkActive?.background || 'var(--accent-blue-light)')
                  : 'transparent',
                color: isActive
                  ? (w.desktop?.sidebar?.linkActive?.color || 'var(--accent-blue)')
                  : (w.desktop?.sidebar?.link?.color || 'var(--text-secondary)'),
                fontSize: w.desktop?.sidebar?.link?.fontSize || 'var(--font-body)',
                fontWeight: isActive
                  ? (w.desktop?.sidebar?.linkActive?.fontWeight || 600)
                  : (w.desktop?.sidebar?.link?.fontWeight || 500),
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}>
                <span style={{
                  fontSize: w.desktop?.sidebar?.icon?.fontSize || '18px',
                  width: w.desktop?.sidebar?.icon?.width || '24px',
                  textAlign: 'center',
                }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="worker-content" style={{
          flex: 1,
          overflowY: 'auto',
          padding: w.desktop?.content?.padding || '24px',
          background: w.desktop?.content?.background || 'var(--bg-primary)',
          paddingBottom: '80px',
        }}>
          {children}
        </div>
      </div>

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
        {/* Real notification bell — same as client panel */}
        <button style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 2, border: 'none', background: 'transparent',
          cursor: 'pointer', padding: '8px 4px', color: 'var(--text-secondary)',
          position: 'relative',
        }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <span style={{ fontSize: 10, fontWeight: 500 }}>Alerts</span>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 'calc(50% - 20px)',
              background: 'var(--accent-red)', color: '#fff',
              fontSize: 9, fontWeight: 700, width: 16, height: 16,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{unreadCount}</span>
          )}
        </button>
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

      <WorkerMobileDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} navigate={navigate} lang={lang} setLang={setLang} dark={dark} setDark={setDark} onLogout={handleLogout} />

                  <style>{`
        /* Hide desktop navbar by default */
        .worker-desktop-navbar { display: none; }
        /* Desktop: show navbar + sidebar, hide mobile bottom nav */
        @media (min-width: 1024px) {
          .worker-desktop-navbar { display: flex !important; }
          .worker-bottom-nav { display: none !important; }
          .worker-content { padding-bottom: 24px !important; }
          .worker-mobile-online { display: none !important; }
        }
        /* Mobile: hide desktop navbar, sidebar; show bottom nav */
        @media (max-width: 1023px) {
          .worker-sidebar { display: none !important; }
          .worker-bottom-nav { display: flex !important; }
        }
        .worker-card { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
      `}</style>
    </div>
  )
}

export default function WorkerLayout({ children, onLogout }) {
  return <WorkerProvider><BookingProvider><WorkerLayoutInner onLogout={onLogout}>{children}</WorkerLayoutInner></BookingProvider></WorkerProvider>
}