import { useNavigate } from 'react-router-dom'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import { useBooking } from '../../contexts/BookingContext.jsx'
import { useState, useEffect } from 'react'
import ElementRenderer from '../../components/ElementRenderer.jsx'
import { useContent } from '../../hooks/useContent.js'
import { api } from '../../services/api.js'
import { getSocket } from '../../services/realtime/socketClient'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const { profile, earnings, bookings, loading, toggleOnline, activeJob } = useWorker()
  const { activeBooking } = useBooking()
  const isOnline = profile?.is_online || false

  // ── Cancellation notices (from backend) ──
  const [unacknowledged, setUnacknowledged] = useState([])

  // Fetch unacknowledged cancellations on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.getUnacknowledgedCancellations()
        if (res?.success && Array.isArray(res.data)) {
          setUnacknowledged(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch unacknowledged cancellations', err)
      }
    })()
  }, [])

    // Listen for real‑time cancellation events and re‑fetch unacknowledged list
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleBookingUpdated = (payload) => {
      if (payload && payload.status === 'cancelled') {
        // Re‑fetch unacknowledged cancellations from server
        api.getUnacknowledgedCancellations()
          .then(res => {
            if (res?.success && Array.isArray(res.data)) {
              setUnacknowledged(res.data)
            }
          })
          .catch(console.error)
      }
    }

    socket.on('booking.updated', handleBookingUpdated)
    return () => socket.off('booking.updated', handleBookingUpdated)
  }, [])

  // Acknowledge a cancellation (and remove from local list)
  const handleAcknowledge = async (cancellationId) => {
    try {
      await api.acknowledgeCancellation(cancellationId)
      setUnacknowledged(prev => prev.filter(c => c.id !== cancellationId))
    } catch (err) {
      console.error('Failed to acknowledge cancellation', err)
    }
  }

  // Active bookings (exclude completed and cancelled – backend already handles status)
  const activeBookings = (bookings || []).filter(
    b => b.status !== 'completed' && b.status !== 'cancelled'
  )

  const onlineContent = useContent('worker.online')
  const offlineContent = useContent('worker.offline')
  const receivingContent = useContent('worker.receiving')
  const goOnlineContent = useContent('worker.goOnline')

  const txt = {
    online: onlineContent || 'You are online',
    offline: offlineContent || 'You are offline',
    receiving: receivingContent || 'Receiving job requests',
    goOnline: goOnlineContent || 'Go online to receive job requests',
  }

  // ── Weekly earnings (sum of price per day, last 7 days) ──
  const weeklyEarnings = (() => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayTotal = (bookings || [])
        .filter(b => {
          if (b.status !== 'completed') return false
          const bd = new Date(b.updated_at)
          return bd.toISOString().startsWith(dateStr)
        })
        .reduce((sum, b) => sum + (b.price || 0), 0)
      days.push(dayTotal)
    }
    return days.every(v => v === 0) ? [] : days
  })()

  // ── Monthly earnings (sum of price per month, last 12 months) ──
  const monthlyEarnings = (() => {
    const months = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
      const monthTotal = (bookings || [])
        .filter(b => {
          if (b.status !== 'completed') return false
          const bd = new Date(b.updated_at)
          return bd >= start && bd <= end
        })
        .reduce((sum, b) => sum + (b.price || 0), 0)
      months.push(monthTotal)
    }
    return months.every(v => v === 0) ? [] : months
  })()

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            height: i === 1 ? 175 : i === 2 ? 80 : 120,
            borderRadius: 12, background: 'var(--bg-surface)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            animation: 'pulse 1.5s infinite',
          }} />
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
      </div>
    )
  }

  return (
    <div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <ElementRenderer elementId="workerStatusBanner" overrideData={{ isOnline, txt }} />
      <ElementRenderer elementId="dashboardMapCard" overrideData={{ activeBooking: activeJob }} />
      <ElementRenderer elementId="dashboardOnlineToggle" overrideData={{ isOnline, txt, onToggle: toggleOnline }} />

      <ElementRenderer
        elementId="workerStatsBar"
        overrideData={{
          completed_jobs: profile?.completed_jobs || 0,
          total_earnings: earnings?.total_earnings || 0,
          rating: profile?.rating || '—',
        }}
      />

      {/* ── Cancellation notices (from backend) ── */}
      {unacknowledged.map(cancel => (
        <div key={cancel.id} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--accent-red)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            Your booking has been cancelled by client
          </div>
          <button
            onClick={() => handleAcknowledge(cancel.id)}
            style={{
              padding: '6px 20px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--accent-blue)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            OK
          </button>
        </div>
      ))}

      {/* Active job cards (pending, accepted, onway, working) */}
      <ElementRenderer elementId="jobCard" overrideData={{ bookings: activeBookings }} />

      {/* Analytics chart – weekly / monthly */}
      <ElementRenderer
        elementId="dashboardAnalytics"
        overrideData={{
          earnings,
          weeklyEarnings,
          monthlyEarnings,
          chartMode: 'weekly',        // default
          onSetChartMode: (mode) => {},  // can be connected to state if needed later
        }}
      />
    </div>
  )
}