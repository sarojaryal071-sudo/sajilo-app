import { useState, useEffect, useCallback } from 'react'
import { api } from '../../services/api.js'
import { useSocket } from '../../hooks/useSocket.js'

// Simple relative time formatter
function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Icon + color mapping per type
const typeConfig = {
  booking:    { icon: '📋', borderColor: '#16A34A' },   // green
  payment:    { icon: '💰', borderColor: '#1A56DB' },   // blue
  user:       { icon: '👤', borderColor: '#eab308' },   // orange
  moderation: { icon: '🛡️', borderColor: '#DC2626' },   // red
  ticket:     { icon: '🎫', borderColor: '#7c3aed' },  // purple
  system:     { icon: '⚙️', borderColor: '#6b7280' },   // gray
  default:    { icon: '📌', borderColor: '#6b7280' },
}

export default function AdminActivity() {
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('all')
  const { socket } = useSocket()

  // Load recent activity on mount
  const fetchActivity = useCallback(async () => {
    try {
      const params = filter !== 'all' ? { type: filter, limit: 50 } : { limit: 50 }
      const res = await api.getActivity(params)
      if (res?.success) setActivities(res.data)
    } catch (err) {
      console.error('Failed to fetch activity:', err)
    }
  }, [filter])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  // Real‑time socket listener
  useEffect(() => {
    if (!socket) return

    const handleNewActivity = (activity) => {
      setActivities(prev => [activity, ...prev].slice(0, 100)) // keep max 100
    }

    socket.on('activity.created', handleNewActivity)
    return () => socket.off('activity.created', handleNewActivity)
  }, [socket])

  // Format metadata for subtitle
  const getSubtitle = (item) => {
    if (!item.metadata) return ''
    try {
      const meta = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata
      if (item.entity_type === 'booking' && meta.customer_id) {
        return `Client #${meta.customer_id} · Worker #${meta.worker_id}`
      }
      if (item.entity_type === 'payment' && meta.booking_id) {
        return `Booking #${meta.booking_id}`
      }
      return ''
    } catch {
      return ''
    }
  }

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter)

  // Filter types from current data (or predefine)
  const availableTypes = ['all', ...new Set(activities.map(a => a.type))]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Activity Timeline
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Real‑time system events
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {availableTypes.slice(0, 8).map(type => {
          const config = typeConfig[type] || typeConfig.default
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: '4px 14px',
                borderRadius: 20,
                border: filter === type ? `2px solid ${config.borderColor}` : '1px solid var(--border)',
                background: filter === type ? `${config.borderColor}20` : 'transparent',
                color: filter === type ? config.borderColor : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {config.icon} {type}
            </button>
          )
        })}
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {filteredActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 13 }}>
            No activity yet
          </div>
        ) : (
          filteredActivities.map((item, idx) => {
            const config = typeConfig[item.type] || typeConfig.default
            return (
              <div key={item.id} style={{
                display: 'flex', gap: 12, padding: '14px 0',
                borderLeft: `3px solid ${config.borderColor}`,
                marginLeft: 8, paddingLeft: 16,
                borderBottom: idx < filteredActivities.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 20, lineHeight: 1, marginTop: 2 }}>{config.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                  {getSubtitle(item) && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {getSubtitle(item)}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {timeAgo(item.created_at)} · {item.action}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}