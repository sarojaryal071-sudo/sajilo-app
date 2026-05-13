import { useNavigate } from 'react-router-dom'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import { useBooking } from '../../contexts/BookingContext.jsx'
import { useState, useEffect } from 'react'
import ElementRenderer from '../../components/ElementRenderer.jsx'
import { useContent } from '../../hooks/useContent.js'
import { api } from '../../services/api.js'
import { getSocket } from '../../services/realtime/socketClient'
import WorkerPerformanceCard from '../../components/WorkerPerformanceCard.jsx'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const { profile, bookings, loading, toggleOnline, activeJob } = useWorker()
  const { activeBooking } = useBooking()
  const isOnline = profile?.is_online || false

  // ── Cancellation notices (from backend) ──
  const [unacknowledged, setUnacknowledged] = useState([])

  // ── Dashboard metrics from centralized metrics engine ──
  const [dashboardMetrics, setDashboardMetrics] = useState(null)

  // Fetch dashboard metrics from unified endpoint
  const fetchDashboardMetrics = async () => {
    try {
      const res = await api.getWorkerDashboardMetrics()
      if (res?.success) setDashboardMetrics(res.data)
    } catch (err) {
      console.error('Failed to fetch dashboard metrics', err)
    }
  }

  useEffect(() => { fetchDashboardMetrics() }, [])

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

  // Active bookings (exclude completed and cancelled)
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

  // ── Derive chart data from metrics engine ──
  const dm = dashboardMetrics

  // Weekly earnings: array of 7 daily values for chart
  const weeklyEarnings = dm?.weekly?.days
    ? dm.weekly.days.map(d => d.earnings)
    : []

  // Monthly earnings: array of 12 monthly values for chart
  const monthlyEarnings = dm?.monthly?.months
    ? dm.monthly.months.map(m => m.earnings)
    : []

  // Lifetime stats for workerStatsBar
  const statsBarData = {
    today_jobs: dm?.today?.completedJobs ?? 0,
    today_earnings: dm?.today?.earnings ?? 0,
    rating: dm?.lifetime?.averageRating ?? '—',
  }

  // Today stats for potential display
  const todayData = dm?.today || { earnings: 0, completedJobs: 0 }

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

      <WorkerPerformanceCard />

      <ElementRenderer
        elementId="workerStatsBar"
        overrideData={statsBarData}
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
          earnings: { total_earnings: dm?.lifetime?.totalEarnings ?? 0 },
          weeklyEarnings: weeklyEarnings.length > 0 ? weeklyEarnings : null,
          monthlyEarnings: monthlyEarnings.length > 0 ? monthlyEarnings : null,
          chartMode: 'weekly',
          onSetChartMode: (mode) => {},
        }}
      />
    </div>
  )
}