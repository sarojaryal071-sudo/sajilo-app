import { useState, useEffect, useMemo } from 'react'
import { api, API_URL } from '../services/api.js'
import { useContent } from '../hooks/useContent.js'
import { getSocket } from '../services/realtime/socketClient'

export default function SearchScreen({ navigate }) {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [locations, setLocations] = useState([])

  // Fetch available service areas
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

  // Fetch workers whenever service filter or location changes
  useEffect(() => {
    const params = {}
    if (searchTerm.trim()) params.service = searchTerm.trim()
    if (selectedLocation) params.location = selectedLocation

    setLoading(true)
    api.searchWorkers(params)
      .then(result => setWorkers(result.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [searchTerm, selectedLocation])

  
  // Live update when a worker toggles online/offline
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleStatusChange = () => {
      // Re‑fetch the worker list when any worker toggles
      setLoading(true)
      api.searchWorkers()
        .then(result => setWorkers(result.data || []))
        .catch(console.error)
        .finally(() => setLoading(false))
    }

    socket.on('worker:statusChanged', handleStatusChange)
    return () => socket.off('worker:statusChanged', handleStatusChange)
  }, [])

  const txt = {
    title: useContent('search.title'),
    placeholder: useContent('search.placeholder'),
    all: useContent('search.all'),
    topRated: useContent('search.topRated'),
    availableNow: useContent('search.availableNow'),
    noResults: useContent('search.noResults'),
    verified: useContent('search.verified'),
    locationLabel: useContent('search.locationLabel') || 'Service Area',
  }

  const filters = [
    { key: 'all', label: txt.all },
    { key: 'topRated', label: txt.topRated },
  ]

  // Client‑side sorting
  let filtered = [...workers]
  if (activeFilter === 'topRated') {
    filtered.sort((a, b) => (b.completed_jobs || 0) - (a.completed_jobs || 0))
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{txt.title}</h2>

      {/* Search term + location dropdown */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={txt.placeholder}
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

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setActiveFilter(f.key)}
            style={{
              padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)',
              background: activeFilter === f.key ? 'var(--accent-blue)' : 'transparent',
              color: activeFilter === f.key ? '#fff' : 'var(--text-secondary)',
              fontSize: 'var(--font-body-sm)', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>{txt.noResults}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(worker => (
            <div key={worker.id} onClick={() => navigate(`/detail/${worker.id}`)}
              style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              }}>
              {/* Worker photo */}
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

              {/* Name, professions, worker ID */}
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
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  📍 {worker.service_area || '—'}
                </div>
              </div>

              {/* Hourly rate */}
              <span style={{ color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)', fontWeight: 600 }}>
                Rs {worker.hourly_rate || 500}/hr
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}