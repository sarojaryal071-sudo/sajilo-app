import { useState } from 'react'
import { api } from '../../services/api.js'

// Icon + color per result type
const typeConfig = {
  booking:  { icon: '📋', color: '#16A34A' },
  payment:  { icon: '💰', color: '#1A56DB' },
  worker:   { icon: '👷', color: '#f97316' },
  customer: { icon: '👤', color: '#eab308' },
  ticket:   { icon: '🎫', color: '#7c3aed' },
  review:   { icon: '⭐', color: '#D97706' },
}

export default function AdminSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await api.searchAdmin(q)
      if (res?.success) {
        setResults(res.results || [])
      }
    } catch (err) {
      console.error('Search failed:', err)
    }
    setLoading(false)
  }

  // Group results by type for display
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = []
    acc[item.type].push(item)
    return acc
  }, {})

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Global Search
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Search bookings, payments, workers, clients, tickets, and reviews
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by ID, name, email, service..."
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-surface2)',
            color: 'var(--text-primary)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--accent-blue)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results */}
      {searched ? (
        results.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 40, color: 'var(--text-secondary)',
            fontSize: 14, background: 'var(--bg-surface)', borderRadius: 12,
            border: '1px solid var(--border)',
          }}>
            No results found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.keys(grouped).map(type => {
              const config = typeConfig[type] || { icon: '📌', color: '#6b7280' }
              return (
                <div key={type} style={{
                  background: 'var(--bg-surface)', borderRadius: 12,
                  border: '1px solid var(--border)', overflow: 'hidden',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px',
                    backgroundColor: `${config.color}15`,
                    borderBottom: '1px solid var(--border)',
                    fontSize: 13, fontWeight: 600, color: config.color,
                    textTransform: 'capitalize',
                  }}>
                    <span>{config.icon}</span> {type}s
                  </div>
                  {grouped[type].map(item => (
                    <a key={item.id} href={item.url || '#'} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      textDecoration: 'none', color: 'inherit', fontSize: 14,
                      background: 'var(--bg-surface)',
                    }}>
                      <span style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.subtitle}</span>
                    </a>
                  ))}
                </div>
              )
            })}
          </div>
        )
      ) : (
        <div style={{
          textAlign: 'center', padding: 40, color: 'var(--text-secondary)',
          fontSize: 14, background: 'var(--bg-surface)', borderRadius: 12,
          border: '1px solid var(--border)',
        }}>
          Enter a search term and press Enter to find records across the platform.
        </div>
      )}
    </div>
  )
}