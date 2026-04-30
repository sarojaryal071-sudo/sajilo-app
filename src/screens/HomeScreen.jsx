import { useState } from 'react'
import { services, workers } from '../config/data.js'
import ConfigContainer from '../components/ConfigContainer.jsx'
import BannerCarousel from '../components/BannerCarousel.jsx'
import WorkerList from '../components/WorkerList.jsx'
import WorkerCard from '../components/WorkerCard.jsx'
import { useContent } from '../hooks/useContent.js'
import { useStyle } from '../hooks/useStyle.js'
import { useIsMobile } from '../hooks/useIsMobile.js'

const primaryServices = services.slice(0, 6)
const secondaryServices = services.slice(6)

export default function HomeScreen({ navigate, t }) {
  const [stackedCategory, setStackedCategory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const isMobile = useIsMobile()

  const txt = {
    welcome: useContent('home.welcome'),
    subtitle: useContent('home.subtitle'),
    primary: useContent('category.primary'),
    secondary: useContent('category.secondary'),
    nearbyWorkers: useContent('home.nearbyWorkers'),
    noWorkers: useContent('home.noWorkers'),
    all: useContent('category.all'),
    back: useContent('home.back'),
  }

  const welcomeTitleStyle = useStyle('homeWelcomeTitle')
  const welcomeSubStyle = useStyle('homeWelcomeSub')
  const sectionTitleStyle = useStyle('homeSectionTitle')
  const cardStyle = useStyle('homeServiceCard')
  const iconStyle = useStyle('homeServiceIcon')
  const labelStyle = useStyle('homeServiceLabel')

  const approvedWorkers = workers.filter(w => w.approved)

  const stackedWorkers = stackedCategory
    ? approvedWorkers.filter(w => {
        const cat = services.find(s => s.id === stackedCategory)
        return cat && w.role?.toLowerCase() === cat.name?.toLowerCase()
      })
    : []

  const buildStack = (clickedId) => {
    const clicked = services.find(s => s.id === clickedId)
    const others = services.filter(s => s.id !== clickedId)
    return [clicked, ...others]
  }

  const categoryStack = stackedCategory ? buildStack(stackedCategory) : []

  const renderTileGrid = (serviceList) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
      {serviceList.map(service => (
        <div
          key={service.id}
          onClick={() => {
  setStackedCategory(service.id)
  setSelectedCategory(service.id)
}}
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

  // Desktop stacked view — LOCKED SCROLL
  if (stackedCategory) {
    return (
      <div style={{ height: 'calc(100vh - 140px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h2 style={welcomeTitleStyle}>{txt.welcome}</h2>
        <p style={welcomeSubStyle}>{txt.subtitle}</p>

        <button onClick={() => { setStackedCategory(null); setSelectedCategory(null); }} style={{
          background: 'var(--bg-surface2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          fontSize: 'var(--font-body)', color: 'var(--text-secondary)',
          fontWeight: 500, padding: '6px 14px', marginBottom: 12,
          width: 'fit-content',
        }}>← {txt.back}</button>

        <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
          {/* Category Stack — ONLY THIS SCROLLS */}
          <div style={{
            width: 220, flexShrink: 0,
            overflowY: 'auto',
            paddingRight: 8,
          }}>
            <h3 style={{ ...sectionTitleStyle, marginBottom: 12 }}>{txt.primary}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categoryStack.map(service => (
                <div
                  key={service.id}
                  onClick={() => setStackedCategory(service.id)}
                  style={{
                    ...cardStyle,
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    border: stackedCategory === service.id ? '2px solid var(--accent-blue)' : cardStyle.border,
                    padding: '10px 14px',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{service.icon}</span>
                  <span style={{ fontSize: 'var(--font-body-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{service.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Worker List — NOT scrollable, fills space */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <h3 style={sectionTitleStyle}>
              {services.find(s => s.id === stackedCategory)?.name} — {txt.nearbyWorkers}
            </h3>
            {stackedWorkers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>👷</div>
                <p>{txt.noWorkers}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {stackedWorkers.map(worker => (
                  <div key={worker.id} onClick={() => navigate(`/detail/${worker.id}`)} style={{ cursor: 'pointer' }}>
                    <WorkerCard worker={worker} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default view
  return (
    <div>
      <h2 style={welcomeTitleStyle}>{txt.welcome}</h2>
      <p style={welcomeSubStyle}>{txt.subtitle}</p>

      <ConfigContainer id="promoBanners">
        <BannerCarousel />
      </ConfigContainer>

      <ConfigContainer id="primaryServices">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={sectionTitleStyle}>{txt.primary}</h3>
          <button onClick={() => setSelectedCategory(null)} style={{ fontSize: 12, color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            {txt.all}
          </button>
        </div>
        {renderTileGrid(primaryServices)}
      </ConfigContainer>

      {secondaryServices.length > 0 && (
        <ConfigContainer id="secondaryServices">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={sectionTitleStyle}>{txt.secondary}</h3>
          </div>
          {renderTileGrid(secondaryServices)}
        </ConfigContainer>
      )}

      <h3 style={sectionTitleStyle}>{txt.nearbyWorkers}</h3>
      <WorkerList workers={approvedWorkers} navigate={navigate} />
    </div>
  )
}