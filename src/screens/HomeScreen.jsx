import { useState, useEffect } from 'react'
import { api, API_URL } from '../services/api.js'
import ConfigContainer from '../components/ConfigContainer.jsx'
import BannerCarousel from '../components/BannerCarousel.jsx'
import WorkerCard from '../components/WorkerCard.jsx'
import { useContent } from '../hooks/useContent.js'
import { useStyle } from '../hooks/useStyle.js'
import { useIsMobile } from '../hooks/useIsMobile.js'
import { getSocket } from '../services/realtime/socketClient'

// ── Helper component for grid tiles (vertical icon + label) ──
function ServiceTile({ service, isSelected, onClick, cardStyle, iconStyle, labelStyle }) {
  const icon = useContent(`category.icon.${service.role}`, service.label?.charAt(0) || '🔧')
  return (
    <div
      onClick={onClick}
      style={{
        ...cardStyle,
        display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
        border: isSelected ? '2px solid var(--accent-blue)' : cardStyle.border,
        transition: 'border-color 0.12s',
      }}
    >
      <div style={{ ...iconStyle, background: service.bg || '#F0F2F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ ...labelStyle, textAlign: 'center' }}>{service.label}</span>
    </div>
  )
}

// ── Helper component for stacked list (horizontal icon + label) ──
function ServiceStackItem({ service, isSelected, onClick, cardStyle }) {
  const icon = useContent(`category.icon.${service.role}`, service.label?.charAt(0) || '🔧')
  return (
    <div
      onClick={onClick}
      style={{
        ...cardStyle,
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        border: isSelected ? '2px solid var(--accent-blue)' : cardStyle.border,
        padding: '10px 14px',
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 'var(--font-body-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{service.label}</span>
    </div>
  )
}

export default function HomeScreen({ navigate, t }) {
  const [stackedCategory, setStackedCategory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const isMobile = useIsMobile()

  // Fetch all online workers on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await api.searchWorkers()
        setWorkers(data.data || [])
      } catch (err) {
        console.error('Failed to load workers', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

    // Live update when a worker toggles online/offline
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleStatusChange = () => {
      api.searchWorkers().then(result => setWorkers(result.data || []))
    }

    socket.on('worker:statusChanged', handleStatusChange)
    return () => socket.off('worker:statusChanged', handleStatusChange)
  }, [])

  // Fetch enabled professions from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/workers/categories`)
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data)
        }
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setCategoriesLoading(false)
      }
    })()
  }, [])

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

  // Dynamic primary / secondary split
  const primaryServices = categories.filter(c => c.enabled).slice(0, 6)
  const secondaryServices = categories.filter(c => c.enabled).slice(6)

  // Filter workers for the currently stacked category
  const stackedWorkers = stackedCategory
    ? workers.filter(w => {
        const cat = categories.find(c => c.role === stackedCategory)
        if (!cat) return false
        const catRole = cat.role?.toLowerCase()
        const primary = (w.primary_skill || '').toLowerCase()
        const secondary = (w.secondary_roles || []).map(s => s.toLowerCase())
        return primary === catRole || secondary.includes(catRole)
      })
    : []

  const buildStack = (clickedRole) => {
    const clicked = categories.find(c => c.role === clickedRole)
    const others = categories.filter(c => c.role !== clickedRole)
    return clicked ? [clicked, ...others] : others
  }

  const categoryStack = stackedCategory ? buildStack(stackedCategory) : []

  const renderTileGrid = (serviceList) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
      {serviceList.map(service => (
        <ServiceTile
          key={service.role}
          service={service}
          isSelected={selectedCategory === service.role}
          onClick={() => {
            setStackedCategory(service.role)
            setSelectedCategory(service.role)
          }}
          cardStyle={cardStyle}
          iconStyle={iconStyle}
          labelStyle={{
            ...labelStyle,
            fontSize: '11px',
          }}
        />
      ))}
    </div>
  )

  // Desktop stacked view
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
          <div style={{
            width: 220, flexShrink: 0,
            overflowY: 'auto',
            paddingRight: 8,
          }}>
            <h3 style={{ ...sectionTitleStyle, marginBottom: 12 }}>{txt.primary}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categoryStack.map(service => (
                <ServiceStackItem
                  key={service.role}
                  service={service}
                  isSelected={stackedCategory === service.role}
                  onClick={() => setStackedCategory(service.role)}
                  cardStyle={cardStyle}
                />
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <h3 style={sectionTitleStyle}>
              {categories.find(c => c.role === stackedCategory)?.label || ''} — {txt.nearbyWorkers}
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
      {loading ? (
        <div style={{ textAlign: 'center', padding: 20 }}>Loading workers…</div>
      ) : workers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👷</div>
          <p>{txt.noWorkers}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {workers.map(worker => (
            <div key={worker.id} onClick={() => navigate(`/detail/${worker.id}`)} style={{ cursor: 'pointer' }}>
              <WorkerCard worker={worker} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}