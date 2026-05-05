import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import translations from '../config/translations.js'
import { getCurrentUser, logoutAndRedirect } from '../config/auth.js'
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
import AdminLayout from './AdminLayout.jsx'
import { WorkerProvider } from '../contexts/WorkerContext.jsx'
import CommunicationCenter from '../components/chat/CommunicationCenter.jsx'
import { reconnectSocket } from '../services/realtime/socketClient.js'
import { BookingProvider } from '../contexts/BookingContext.jsx'


export default function AppShell() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('sajilo_theme') === 'dark'
  })
  const handleSetDark = (val) => {
    const newVal = typeof val === 'function' ? val(dark) : val
    setDark(newVal)
    localStorage.setItem('sajilo_theme', newVal ? 'dark' : 'light')
  }

    const handleLogin = (userData) => {
    console.log("🔍 LOGIN: Setting user", {
      email: userData?.email, role: userData?.role, status: userData?.status
    })
    setUser(userData)
    localStorage.setItem('sajilo_user', JSON.stringify(userData))
    reconnectSocket()
  }
  const [lang, setLang] = useState(() => localStorage.getItem('sajilo_lang') || 'en')
  const [showSOS, setShowSOS] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [user, setUser] = useState(getCurrentUser)
  const [authChecked, setAuthChecked] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const t = translations[lang]

  useEffect(() => {
  if (!localStorage.getItem('sajilo_welcome_seen') && location.pathname !== '/welcome') {
    localStorage.setItem('sajilo_welcome_seen', '1')
    navigate('/welcome')
  }
}, [])

  useEffect(() => {
    console.log("🔍 APP STATE", {
      email: user?.email, role: user?.role, status: user?.status, path: location.pathname
    })
  }, [user, location.pathname])

  useEffect(() => {
    const currentUser = getCurrentUser()
    console.log("🔍 AUTH CHECK - Initial user:", {
      email: currentUser?.email, role: currentUser?.role, status: currentUser?.status
    })
    setUser(currentUser)
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    if (!authChecked) return
    if (!user && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/welcome' && location.pathname !== '/worker/apply' && location.pathname !== '/worker/pending') {
      console.log("🔍 REDIRECT: No user, redirecting to /login")
      navigate('/login')
    }
  }, [user, authChecked, location.pathname, navigate])

  useEffect(() => {
    if (!user || !authChecked) return
    if (user.role === 'worker' && user.status === 'pending') {
      const hasApplied = user.application_submitted || user.phone
      if (hasApplied && location.pathname !== '/worker/pending') {
        console.log("🔍 REDIRECT: Pending (applied) → /worker/pending")
        navigate('/worker/pending', { replace: true })
      } else if (!hasApplied && location.pathname !== '/worker/apply') {
        console.log("🔍 REDIRECT: Pending (no app) → /worker/apply")
        navigate('/worker/apply', { replace: true })
      }
    }
  }, [user, authChecked, location.pathname, navigate])

  const handleLogout = () => {
    console.log("🔍 LOGOUT: Clearing user")
    setUser(null)
    setAuthChecked(true)
    logoutAndRedirect()
  }

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', fontFamily: 'var(--font-family)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    )
  }

  if (user && user.role === 'admin' && window.innerWidth < 768) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', fontFamily: 'var(--font-family)' }}>
        <AdminMobileBlock />
      </div>
    )
  }

  if (location.pathname === '/worker/pending') {
    const route = routes.find(r => r.path === '/worker/pending')
    if (route) {
      const Component = route.component
      return (
        <>
          <Component navigate={navigate} t={t} onLogin={handleLogin} />
          {localStorage.getItem('sajilo_worker_application') && <CommunicationCenter />}
        </>
      )
    }
  }

  

  if (user && user.role === 'worker' && user.status === 'pending' && location.pathname === '/worker/apply') {
    const route = routes.find(r => r.path === '/worker/apply')
    if (route) {
      const Component = route.component
      return <WorkerProvider><Component navigate={navigate} t={t} onLogin={handleLogin} /></WorkerProvider>
    }
  }

  if (user && user.role === 'worker') {
    const workerRoutes = routes.filter(r => r.role === 'worker')
    console.log("🔍 WORKER ROUTES:", { status: user.status, totalRoutes: workerRoutes.length, paths: workerRoutes.map(r => r.path) })

    return (
  <WorkerLayout user={user} onLogout={handleLogout}>
    <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)', padding: 0 }}>
      <Routes>
        {workerRoutes.map(route => {
          const Component = route.component
          return <Route key={route.path} path={route.path} element={<Component navigate={navigate} t={t} onLogin={handleLogin} title={route.label} />} />
        })}
      </Routes>
    </main>
    {(user || location.pathname === '/worker/pending' || localStorage.getItem('sajilo_worker_application')) && <CommunicationCenter />}
  </WorkerLayout>
)
  }

  if (user && user.role === 'admin') {
    return (
      <AdminLayout>
        <Routes>
          {routes.filter(r => r.role === 'admin').map(route => {
            const Component = route.component
            return <Route key={route.path} path={route.path} element={<RequireRole role="admin"><Component navigate={navigate} t={t} title={route.label} /></RequireRole>} />
          })}
        </Routes>
      </AdminLayout>
    )
  }

  const isAdminOrWorker = user && user.role === 'admin'
  const showLayout = user && !isAdminOrWorker && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/welcome'
  return (
    <div className="app-shell" data-theme={dark ? 'dark' : 'light'} style={{
      height: '100vh', width: '100vw', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-family)',
    }}>
      {showLayout && <Navbar dark={dark} setDark={handleSetDark} lang={lang} setLang={setLang} navigate={navigate} t={t} onSOS={() => setShowSOS(true)} />}
      <div className="layout-row" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {showLayout && <div className="desktop-sidebar" style={{ flexShrink: 0 }}><Sidebar t={t} /></div>}
        <main className="main-content" style={{ flex: 1, minWidth: 0, minHeight: 0, padding: showLayout ? 28 : 0, overflowY: 'auto', background: 'var(--bg-primary)' }}>
          <Routes>
            {routes.filter(r => r.role !== 'worker' && r.role !== 'admin').map(route => {
              const Component = route.component
              const element = <Component navigate={navigate} t={t} onLogin={handleLogin} title={route.label} />
              if (route.public) return <Route key={route.path} path={route.path} element={element} />
              if (route.role === 'admin') return <Route key={route.path} path={route.path} element={<RequireRole role={route.role}>{element}</RequireRole>} />
              return <Route key={route.path} path={route.path} element={<RequireAuth>{element}</RequireAuth>} />
            })}
          </Routes>
        </main>
        {showLayout && <div className="desktop-right" style={{ flexShrink: 0 }}><RightPanel t={t} /></div>}
      </div>
      {showLayout && <MobileBottomNav navigate={navigate} t={t} onMore={() => setShowDrawer(!showDrawer)} onSOS={() => setShowSOS(true)} />}
      <MobileDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} navigate={navigate} t={t} lang={lang} setLang={setLang} />
      {(user || location.pathname === '/worker/pending' || localStorage.getItem('sajilo_worker_application')) && <CommunicationCenter />}
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