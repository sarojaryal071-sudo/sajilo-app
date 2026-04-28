import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import translations from '../config/translations.js'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import RightPanel from './RightPanel.jsx'
import EmergencyModal from '../components/EmergencyModal.jsx'
import MobileBottomNav from './MobileBottomNav.jsx'
import MobileDrawer from './MobileDrawer.jsx'
import HomeScreen from '../screens/HomeScreen.jsx'
import SearchScreen from '../screens/SearchScreen.jsx'
import DetailScreen from '../screens/DetailScreen.jsx'
import BookingsScreen from '../screens/BookingsScreen.jsx'
import ProScreen from '../screens/ProScreen.jsx'
import ProfileScreen from '../screens/ProfileScreen.jsx'
import TrackingScreen from '../screens/TrackingScreen.jsx'
import LoginScreen from '../screens/LoginScreen.jsx'
import SignupScreen from '../screens/SignupScreen.jsx'
import PlaceholderScreen from '../screens/PlaceholderScreen.jsx'

function DetailWrapper({ t }) {
  const { workerId } = useParams()
  const navigate = useNavigate()
  return <DetailScreen navigate={navigate} workerId={parseInt(workerId)} previousTab="search" t={t} />
}

function TrackingWrapper({ t }) {
  const { workerId } = useParams()
  const navigate = useNavigate()
  return <TrackingScreen navigate={navigate} workerId={parseInt(workerId)} previousTab="home" t={t} />
}

function ProtectedRoute({ user, children, requiredRole }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else if (requiredRole && user.role !== requiredRole) {
      navigate('/login')
    }
  }, [user, requiredRole, navigate])

  if (!user) return null
  if (requiredRole && user.role !== requiredRole) return null
  return children
}

export default function AppShell() {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('en')
  const [showSOS, setShowSOS] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const t = translations[lang]

  return (
    <div className="app-shell" data-theme={dark ? 'dark' : 'light'} style={{
      height: '100vh', width: '100vw', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-family)',
    }}>
      {user && (
        <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} navigate={navigate} t={t} onSOS={() => setShowSOS(true)} />
      )}
      <div className="layout-row" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {user && (
          <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
            <Sidebar t={t} />
          </div>
        )}
        <main className="main-content" style={{
          flex: 1, minWidth: 0, minHeight: 0, padding: user ? 28 : 0,
          overflowY: 'auto', background: 'var(--bg-primary)',
        }}>
          <Routes>
            <Route path="/login" element={<LoginScreen navigate={navigate} t={t} onLogin={setUser} />} />
            <Route path="/signup" element={<SignupScreen navigate={navigate} t={t} />} />
            <Route path="/" element={<ProtectedRoute user={user}><HomeScreen navigate={navigate} t={t} /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute user={user}><HomeScreen navigate={navigate} t={t} /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute user={user}><SearchScreen navigate={navigate} t={t} /></ProtectedRoute>} />
            <Route path="/detail/:workerId" element={<ProtectedRoute user={user}><DetailWrapper t={t} /></ProtectedRoute>} />
            <Route path="/tracking/:workerId" element={<ProtectedRoute user={user}><TrackingWrapper t={t} /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute user={user}><BookingsScreen navigate={navigate} t={t} /></ProtectedRoute>} />
            <Route path="/pro" element={<ProtectedRoute user={user}><ProScreen t={t} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user}><ProfileScreen navigate={navigate} t={t} /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute user={user} requiredRole="admin"><PlaceholderScreen title="Admin Dashboard" navigate={navigate} /></ProtectedRoute>} />
            <Route path="/worker/dashboard" element={<ProtectedRoute user={user} requiredRole="worker"><PlaceholderScreen title="Worker Dashboard" navigate={navigate} /></ProtectedRoute>} />
          </Routes>
        </main>
        {user && (
          <div className="desktop-right" style={{ flexShrink: 0 }}>
            <RightPanel t={t} />
          </div>
        )}
      </div>
      {user && (
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