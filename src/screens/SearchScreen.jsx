import { useState } from 'react'
import { workers } from '../config/data.js'

export default function SearchScreen({ navigate, t }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { key: 'all', label: t.all },
    { key: 'topRated', label: t.topRated },
    { key: 'available', label: t.availableNow },
    { key: 'nearby', label: t.nearby },
    { key: 'priceLow', label: t.priceLow },
  ]

  const approvedWorkers = workers.filter(w => w.approved)

  return (
    <div>
      <h2 style={{
        fontSize: 'var(--font-heading)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 16,
      }}>
        {t.searchWorkers}
      </h2>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg-surface2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        marginBottom: 14,
      }}>
        <span style={{ fontSize: 14 }}>🔍</span>
        <input
          placeholder={t.searchPlaceholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 'var(--font-body)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 20,
      }}>
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 'var(--font-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              border: activeFilter === f.key
                ? '1px solid var(--accent-blue)'
                : '1px solid var(--border)',
              background: activeFilter === f.key
                ? 'var(--accent-blue)'
                : 'var(--bg-surface)',
              color: activeFilter === f.key
                ? '#fff'
                : 'var(--text-secondary)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {approvedWorkers.map((worker) => (
          <div
            key={worker.id}
            onClick={() => navigate('detail', worker.id)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              display: 'flex',
              gap: 14,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 58,
              height: 58,
              borderRadius: 10,
              background: worker.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--text-primary)',
              flexShrink: 0,
            }}>
              {worker.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 'var(--font-body-lg)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 2,
              }}>
                {worker.name}
              </div>
              <div style={{
                fontSize: 'var(--font-body-sm)',
                color: 'var(--text-secondary)',
                marginBottom: 8,
              }}>
                {worker.role} · {worker.location} · {worker.distance}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  ★ {worker.rating}
                </span>
                {worker.verified && (
                  <span style={{ fontSize: 'var(--font-caption)', fontWeight: 600, color: 'var(--accent-green)' }}>
                    {t.verified}
                  </span>
                )}
              </div>
            </div>

            <div style={{ flexShrink: 0, alignSelf: 'center' }}>
              <span style={{
                fontSize: 'var(--font-caption)',
                fontWeight: 700,
                color: 'var(--accent-blue)',
                background: 'var(--accent-blue-light)',
                padding: '3px 9px',
                borderRadius: 20,
              }}>
                {worker.eta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}