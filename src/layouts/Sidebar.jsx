import { useState } from 'react'
import { locations } from '../config/data.js'

export default function Sidebar() {
  const [selectedLocation, setSelectedLocation] = useState('Kathmandu')

  return (
    <aside style={{
      width: 248,
      flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      overflowY: 'auto',
      height: 'calc(100vh - 56px)',
      position: 'sticky',
      top: 56,
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--text-primary)',
      }}>
        Filters
      </div>

      {/* Location Dropdown */}
      <div>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          Location
        </div>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--bg-surface2)',
            color: 'var(--text-primary)',
            fontSize: 13,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* More filters will be added later */}

      <div style={{ marginTop: 'auto', paddingTop: 8 }}>
        <button style={{
          padding: '10px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--accent-blue)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
        }}>
          Apply Filters
        </button>
      </div>
    </aside>
  )
}