import { useState } from 'react'
import { services, workers } from '../config/data.js'
import ConfigContainer from '../components/ConfigContainer.jsx'
import BannerCarousel from '../components/BannerCarousel.jsx'
import WorkerList from '../components/WorkerList.jsx'
import { useContent } from '../hooks/useContent.js'
import { useStyle } from '../hooks/useStyle.js'

const primaryServices = services.slice(0, 6)
const secondaryServices = services.slice(6)

export default function HomeScreen({ navigate, t }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const txt = {
    welcome: useContent('home.welcome'),
    subtitle: useContent('home.subtitle'),
    primary: useContent('category.primary'),
    secondary: useContent('category.secondary'),
    nearbyWorkers: useContent('home.nearbyWorkers'),
    noWorkers: useContent('home.noWorkers'),
    all: useContent('category.all'),
  }

  const welcomeTitleStyle = useStyle('homeWelcomeTitle')
  const welcomeSubStyle = useStyle('homeWelcomeSub')
  const sectionTitleStyle = useStyle('homeSectionTitle')
  const cardStyle = useStyle('homeServiceCard')
  const iconStyle = useStyle('homeServiceIcon')
  const labelStyle = useStyle('homeServiceLabel')

  const approvedWorkers = workers.filter(w => w.approved)
  const filteredWorkers = selectedCategory
    ? approvedWorkers.filter(w => {
        const cat = services.find(s => s.id === selectedCategory)
        return cat && w.role?.toLowerCase() === cat.name?.toLowerCase()
      })
    : approvedWorkers

  const renderTileGrid = (serviceList) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
      {serviceList.map(service => (
        <div
          key={service.id}
          onClick={() => setSelectedCategory(service.id)}
          style={{
            ...cardStyle,
            display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
            border: selectedCategory === service.id ? '2px solid var(--accent-blue)' : cardStyle.border,
            transition: 'border-color 0.12s',
          }}
        >
          <div style={{ ...iconStyle, background: service.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {service.icon}
          </div>
          <span style={{ ...labelStyle, textAlign: 'center' }}>{service.name}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <h2 style={welcomeTitleStyle}>{txt.welcome}</h2>
      <p style={welcomeSubStyle}>{txt.subtitle}</p>

      {/* Promo Banners */}
      <ConfigContainer id="promoBanners">
        <BannerCarousel />
      </ConfigContainer>

      {/* Primary Services */}
      <ConfigContainer id="primaryServices">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={sectionTitleStyle}>{txt.primary}</h3>
          <button onClick={() => setSelectedCategory(null)} style={{ fontSize: 12, color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            {txt.all}
          </button>
        </div>
        {renderTileGrid(primaryServices)}
      </ConfigContainer>

      {/* Secondary Services */}
      {secondaryServices.length > 0 && (
        <ConfigContainer id="secondaryServices">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={sectionTitleStyle}>{txt.secondary}</h3>
          </div>
          {renderTileGrid(secondaryServices)}
        </ConfigContainer>
      )}

      {/* Workers for selected category */}
      <h3 style={sectionTitleStyle}>
        {selectedCategory
          ? (services.find(s => s.id === selectedCategory)?.name || '') + ' — Workers'
          : txt.nearbyWorkers}
      </h3>
      <WorkerList workers={filteredWorkers} navigate={navigate} />
    </div>
  )
}