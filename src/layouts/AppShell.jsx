import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import translations from '../config/translations.js'
import { getCurrentUser, logoutUser } from '../config/auth.js'
import routes from '../config/routes.config.js'
import { RequireAuth, RequireRole } from '../components/RequireAuth.jsx'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import RightPanel from './RightPanel.jsx'
import EmergencyModal from '../components/EmergencyModal.jsx'
import MobileBottomNav from './MobileBottomNav.jsx'
import MobileDrawer from './MobileDrawer.jsx'
import uiRegistry from '../config/ui/uiRegistry.js'
import WorkerLayout from './WorkerLayout.jsx'
import AdminMobileBlock from '../screens/admin/AdminMobileBlock.jsx'

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
    localStorage.setItem('sajilo_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    navigate('/login')
  }

  // Admin on mobile — block access
  if (user && user.role === 'admin' && window.innerWidth < 768) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        background: 'var(--bg-primary)', fontFamily: 'var(--font-family)',
      }}>
        <AdminMobileBlock />
      </div>
    )
  }

  // Worker gets their own layout
  if (user && user.role === 'worker') {
    return (
      <WorkerLayout>
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)', padding: 0 }}>
          <Routes>
            {routes.filter(r => r.role === 'worker').map(route => {
              const Component = route.component
              const element = <Component navigate={navigate} t={t} onLogin={handleLogin} title={route.label} />
              return <Route key={route.path} path={route.path} element={<RequireRole role="worker">{element}</RequireRole>} />
            })}
          </Routes>
        </main>
      </WorkerLayout>
    )
  }

  const isAdminOrWorker = user && user.role === 'admin'
  const showLayout = user && !isAdminOrWorker && location.pathname !== '/login' && location.pathname !== '/signup'

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
            {routes.filter(r => r.role !== 'worker').map(route => {
              const Component = route.component
              const element = <Component navigate={navigate} t={t} onLogin={handleLogin} title={route.label} />

              if (route.public) {
                return <Route key={route.path} path={route.path} element={element} />
              }

              if (route.role === 'admin') {
                return <Route key={route.path} path={route.path} element={<RequireRole role={route.role}>{element}</RequireRole>} />
              }

              return <Route key={route.path} path={route.path} element={<RequireAuth>{element}</RequireAuth>} />
            })}
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