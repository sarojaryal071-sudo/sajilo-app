import { useNavigate } from 'react-router-dom'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import { useBooking } from '../../contexts/BookingContext.jsx'
import ElementRenderer from '../../components/ElementRenderer.jsx'
import { useContent } from '../../hooks/useContent.js'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const { profile, earnings, bookings, loading, toggleOnline, activeJob } = useWorker()
  const { activeBooking } = useBooking()
  const isOnline = profile?.is_online || false

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

  const dashboardBookings = (bookings || []).filter(b => b.status !== 'completed')
  const activeBookingForMap = activeJob   // onway / working

  // Compute real weekly earnings for the last 7 days (no backend change needed)
        const weeklyEarnings = (() => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayCount = (bookings || [])
        .filter(b => {
          if (b.status !== 'completed') return false
          const bd = new Date(b.updated_at)
          return bd.toISOString().startsWith(dateStr)
        }).length
      days.push(dayCount)
    }
    return days.every(v => v === 0) ? [] : days   // show empty if truly no jobs
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

    console.log('Analytics data:', { earnings, weeklyEarnings })

  return (
    <div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <ElementRenderer elementId="workerStatusBanner" overrideData={{ isOnline, txt }} />
      <ElementRenderer elementId="dashboardMapCard" overrideData={{ activeBooking: activeBookingForMap }} />
      <ElementRenderer elementId="dashboardOnlineToggle" overrideData={{ isOnline, txt, onToggle: toggleOnline }} />

      <ElementRenderer
        elementId="workerStatsBar"
        overrideData={{
          completed_jobs: profile?.completed_jobs || 0,
          total_earnings: earnings?.total_earnings || 0,
          rating: profile?.rating || '—',
        }}
      />

      {/* Only pending requests show up as cards */}
      <ElementRenderer elementId="jobCard" overrideData={{ bookings: dashboardBookings }} />

      {/* Analytics chart now receives real weekly earnings */}
      <ElementRenderer elementId="dashboardAnalytics" overrideData={{ earnings, weeklyEarnings }} />
    </div>
  )
}