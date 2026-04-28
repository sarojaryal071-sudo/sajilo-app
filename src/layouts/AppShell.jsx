import { useState, useEffect } from 'react'
import { Routes, useNavigate, useLocation } from 'react-router-dom'
import translations from '../config/translations.js'
import { getCurrentUser, logoutUser } from '../config/auth.js'
import routes from '../config/routes.config.js'
import RouteRenderer from '../components/RouteRenderer.jsx'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import RightPanel from './RightPanel.jsx'
import EmergencyModal from '../components/EmergencyModal.jsx'
import MobileBottomNav from './MobileBottomNav.jsx'
import MobileDrawer from './MobileDrawer.jsx'

export default function AppShell() {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('en')
  const [showSOS, setShowSOS] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [user, setUser] = useState(getCurrentUser)
  const navigate = useNavigate()
  const location = useLocation()
  const t = translations[lang]

  useEffect(() => {
    if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login')
    }
  }, [user, location.pathname])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    navigate('/login')
  }

  const isAdminOrWorker = user && (user.role === 'admin' || user.role === 'worker')
  const showLayout = user && !isAdminOrWorker

  return (
    <div className="app-shell" data-theme={dark ? 'dark' : 'light'} style={{
      height: '100vh', width: '100vw', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-family)',
    }}>
      {showLayout && (
        <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} navigate={navigate} t={t} onSOS={() => setShowSOS(true)} />
      )}
      <div className="layout-row" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {showLayout && (
          <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
            <Sidebar t={t} />
          </div>
        )}
        <main className="main-content" style={{
          flex: 1, minWidth: 0, minHeight: 0,
          padding: showLayout ? 28 : 0,
          overflowY: 'auto', background: 'var(--bg-primary)',
        }}>
          <Routes>
            {routes.map(route => (
              <RouteRenderer key={route.path} route={route} navigate={navigate} t={t} handleLogin={handleLogin} />
            ))}
          </Routes>
        </main>
        {showLayout && (
          <div className="desktop-right" style={{ flexShrink: 0 }}>
            <RightPanel t={t} />
          </div>
        )}
      </div>
      {showLayout && (
        <MobileBottomNav navigate={navigate} t={t} onMore={() => setShowDrawer(!showDrawer)} onSOS={() => setShowSOS(true)} />
      )}
      <MobileDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} navigate={navigate} t={t} />
      {showSOS && <EmergencyModal onClose={() => setShowSOS(false)} />}

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar, .desktop-right { display: none !important; }
          .navbar { display: none !important; }
          .layout-row { flex-direction: column !important; }
          .main-content { padding: 16px !important; padding-bottom: 80px !important; }
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .workers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}