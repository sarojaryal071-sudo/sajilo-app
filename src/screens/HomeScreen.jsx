import { useState, useEffect } from 'react'
import { api, API_URL } from '../services/api.js'
import ConfigContainer from '../components/ConfigContainer.jsx'
import BannerCarousel from '../components/BannerCarousel.jsx'
import WorkerCard from '../components/WorkerCard.jsx'
import { useContent } from '../hooks/useContent.js'
import { useStyle } from '../hooks/useStyle.js'
import { useIsMobile } from '../hooks/useIsMobile.js'
import { getSocket } from '../services/realtime/socketClient'
import DynamicBlockRenderer from '../components/dynamic/DynamicBlockRenderer.jsx'
import useLayoutConfig from '../hooks/useLayoutConfig.js'

// ── Helper for horizontal category buttons (hooks safe) ──
function CategoryButton({ service, isActive, onClick }) {
  const icon = useContent(`category.icon.${service.role}`, '🔧')
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 20,
        border: isActive ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
        background: isActive ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
        color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
        fontSize: 'var(--font-body-sm)',
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span>{icon}</span>
      <span>{service.label}</span>
    </button>
  )
}

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

export default function HomeScreen({ navigate, t }) {
  // ── Search state (moved from SearchScreen) ──
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [locations, setLocations] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  // Original HomeScreen state
  const [stackedCategory, setStackedCategory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const isMobile = useIsMobile()
  const { homepageLayout } = useLayoutConfig()

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

  // Fetch locations for search (from SearchScreen)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/locations?status=available`)
        const json = await res.json()
        if (json.success) setLocations(json.data || [])
      } catch (err) {
        console.error('Failed to load locations', err)
      }
    })()
  }, [])

  // Perform search whenever searchTerm or selectedLocation changes
  useEffect(() => {
    const params = {}
    if (searchTerm.trim()) params.service = searchTerm.trim()
    if (selectedLocation) params.location = selectedLocation

    setSearching(true)
    api.searchWorkers(params)
      .then(result => setSearchResults(result.data || []))
      .catch(console.error)
      .finally(() => setSearching(false))
  }, [searchTerm, selectedLocation])

  const txt = {
    welcome: useContent('home.welcome'),
    subtitle: useContent('home.subtitle'),
    primary: useContent('category.primary'),
    secondary: useContent('category.secondary'),
    nearbyWorkers: useContent('home.nearbyWorkers'),
    noWorkers: useContent('home.noWorkers'),
    all: useContent('category.all'),
    back: useContent('home.back'),
    searchPlaceholder: useContent('search.placeholder'),
    locationLabel: useContent('search.locationLabel') || 'Service Area',
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

  // ── Determine if we should show search results ──
  const showSearchResults = searchTerm.trim() !== '' || selectedLocation !== ''

  // Expanded category view — horizontal filter bar + worker grid
  if (stackedCategory) {
    return (
      <div>
        <h2 style={welcomeTitleStyle}>{txt.welcome}</h2>
        <p style={welcomeSubStyle}>{txt.subtitle}</p>

        <button onClick={() => { setStackedCategory(null); setSelectedCategory(null); }} style={{
          background: 'var(--bg-surface2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          fontSize: 'var(--font-body)', color: 'var(--text-secondary)',
          fontWeight: 500, padding: '6px 14px', marginBottom: 12,
          width: 'fit-content',
        }}>← {txt.back}</button>

        {/* Horizontal scrollable category buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
          {categoryStack.map(service => (
            <CategoryButton
              key={service.role}
              service={service}
              isActive={stackedCategory === service.role}
              onClick={() => setStackedCategory(service.role)}
            />
          ))}
        </div>

        {/* Workers grid */}
        <h3 style={sectionTitleStyle}>
          {categories.find(c => c.role === stackedCategory)?.label || ''} — {txt.nearbyWorkers}
        </h3>
        {stackedWorkers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>👷</div>
            <p>{txt.noWorkers}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            maxWidth: 800,
            margin: '0 auto',
          }}>
            {stackedWorkers.map(worker => (
              <div key={worker.id} onClick={() => navigate(`/detail/${worker.id}`)} style={{ cursor: 'pointer' }}>
                <WorkerCard worker={worker} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default view
  return (
    <div>
      <h2 style={welcomeTitleStyle}>{txt.welcome}</h2>
      <p style={welcomeSubStyle}>{txt.subtitle}</p>

      {/* ── SEARCH BAR (integrated from SearchScreen) ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={txt.searchPlaceholder}
          style={{
            flex: 1, minWidth: 200,
            padding: '12px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', background: 'var(--bg-surface2)',
            color: 'var(--text-primary)', fontSize: 'var(--font-body)',
            outline: 'none'
          }}
        />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{
            padding: '12px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', background: 'var(--bg-surface2)',
            color: 'var(--text-primary)', fontSize: 'var(--font-body)',
            cursor: 'pointer', minWidth: 150
          }}
        >
          <option value="">{txt.locationLabel}</option>
          {locations.map(loc => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </select>
      </div>

      {/* ── SEARCH RESULTS (only when user is actively searching) ── */}
      {showSearchResults && (
        <div style={{ marginBottom: 20 }}>
          {searching ? (
            <div style={{ textAlign: 'center', padding: 20 }}>Searching…</div>
          ) : searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)' }}>
              No workers found
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {searchResults.map(worker => (
                <div key={worker.id} onClick={() => navigate(`/detail/${worker.id}`)}
                  style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                    padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
                    background: worker.photo_url ? 'transparent' : 'var(--accent-blue-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 700, color: 'var(--accent-blue)', flexShrink: 0,
                  }}>
                    {worker.photo_url ? (
                      <img src={worker.photo_url} alt="Worker" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      worker.name?.charAt(0)?.toUpperCase() || 'W'
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--font-body)' }}>
                      {worker.name}
                      {worker.is_online && <span style={{ color: 'var(--accent-green)', marginLeft: 6, fontSize: 12 }}>● Online</span>}
                    </div>
                    <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
                      {worker.primary_skill || 'General Service'}
                      {worker.secondary_roles?.length > 0 && ` + ${worker.secondary_roles.join(', ')}`}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--accent-blue)', fontWeight: 600, marginTop: 2 }}>
                      {worker.client_id}
                    </div>
                  </div>
                  <span style={{ color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)', fontWeight: 600 }}>
                    Rs {worker.hourly_rate || 500}/hr
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Original HomeScreen content (hidden when search results are active to reduce clutter) ── */}
      {!showSearchResults && (
        <>
          {homepageLayout && homepageLayout.length > 0 ? (
            <DynamicBlockRenderer blocks={homepageLayout} />
          ) : (
            <>
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
            </>
          )}
        </>
      )}
    </div>
  )
}