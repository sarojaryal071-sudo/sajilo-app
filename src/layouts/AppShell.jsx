import { useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
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

export default function AppShell() {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('en')
  const [showSOS, setShowSOS] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const navigate = useNavigate()
  const t = translations[lang]

  return (
    <div data-theme={dark ? 'dark' : 'light'} style={{
      height: '100vh', width: '100vw',
      background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-family)',
      overflow: 'hidden',
    }}>
      <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} navigate={navigate} t={t} onSOS={() => setShowSOS(true)} />
      <div className="layout-row" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
          <Sidebar t={t} />
        </div>
        <main className="main-content" style={{
          flex: 1, minWidth: 0, minHeight: 0, padding: 28,
          overflowY: 'auto', background: 'var(--bg-primary)',
        }}>
          <Routes>
            <Route path="/" element={<HomeScreen navigate={navigate} t={t} />} />
            <Route path="/home" element={<HomeScreen navigate={navigate} t={t} />} />
            <Route path="/search" element={<SearchScreen navigate={navigate} t={t} />} />
            <Route path="/detail/:workerId" element={<DetailWrapper t={t} />} />
            <Route path="/tracking/:workerId" element={<TrackingWrapper t={t} />} />
            <Route path="/bookings" element={<BookingsScreen navigate={navigate} t={t} />} />
            <Route path="/pro" element={<ProScreen t={t} />} />
            <Route path="/profile" element={<ProfileScreen navigate={navigate} t={t} />} />
          </Routes>
        </main>
        <div className="desktop-right" style={{ flexShrink: 0 }}>
          <RightPanel t={t} />
        </div>
      </div>
      <MobileBottomNav navigate={navigate} t={t} onMore={() => setShowDrawer(true)} />
      <MobileDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} navigate={navigate} t={t} />
      {showSOS && <EmergencyModal onClose={() => setShowSOS(false)} />}

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar, .desktop-right { display: none !important; }
          .navbar { display: none !important; }
          .layout-row { flex: 1 1 auto !important; min-height: 0 !important; }
          .main-content { 
            flex: 1 !important; 
            min-height: 0 !important; 
            overflow-y: auto !important; 
            -webkit-overflow-scrolling: touch !important; 
            padding: 16px !important; 
            padding-bottom: 80px !important;
            position: relative !important;
          }
          .mobile-bottom-nav { 
            position: fixed !important; 
            left: 0 !important; 
            right: 0 !important; 
            bottom: 0 !important; 
            height: 60px !important; 
            z-index: 9999 !important; 
            display: flex !important; 
          }
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .workers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}