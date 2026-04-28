import { useState } from 'react'
import translations from './config/translations.js'
import Navbar from './layouts/Navbar.jsx'
import Sidebar from './layouts/Sidebar.jsx'
import RightPanel from './layouts/RightPanel.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import SearchScreen from './screens/SearchScreen.jsx'
import DetailScreen from './screens/DetailScreen.jsx'
import BookingsScreen from './screens/BookingsScreen.jsx'
import ProScreen from './screens/ProScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import TrackingScreen from './screens/TrackingScreen.jsx'

export default function App() {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('en')
  const [activeTab, setActiveTab] = useState('home')
  const [selectedWorkerId, setSelectedWorkerId] = useState(null)
  const [previousTab, setPreviousTab] = useState('home')

  const t = translations[lang]

  const navigateTo = (tab, workerId = null) => {
    if (tab === 'detail') {
      setPreviousTab(activeTab)
      setSelectedWorkerId(workerId)
    }
    setActiveTab(tab)
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen navigate={navigateTo} t={t} />
      case 'search': return <SearchScreen navigate={navigateTo} t={t} />
      case 'detail': return <DetailScreen navigate={navigateTo} workerId={selectedWorkerId} previousTab={previousTab} t={t} />
      case 'tracking': return <TrackingScreen navigate={navigateTo} workerId={selectedWorkerId} previousTab={previousTab} t={t} />
      case 'bookings': return <BookingsScreen navigate={navigateTo} t={t} />
      case 'pro': return <ProScreen t={t} />
      case 'profile': return <ProfileScreen navigate={navigateTo} t={t} />
      default: return <HomeScreen navigate={navigateTo} t={t} />
    }
  }

  return (
    <div data-theme={dark ? 'dark' : 'light'} style={{
      height: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-family)',
      overflow: 'hidden',
    }}>
      <Navbar
        dark={dark}
        setDark={setDark}
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        t={t}
      />
      <div style={{
        display: 'flex',
        flex: 1,
        minHeight: 0,
      }}>
        <Sidebar t={t} />
        <main style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          padding: 28,
          overflowY: 'auto',
          background: 'var(--bg-primary)',
        }}>
          {renderScreen()}
        </main>
        <RightPanel t={t} />
      </div>
    </div>
  )
}