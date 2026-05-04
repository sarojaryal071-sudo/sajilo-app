import { useNavigate } from 'react-router-dom'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import { useBooking } from '../../contexts/BookingContext.jsx'
import ElementRenderer from '../../components/ElementRenderer.jsx'
import { useContent } from '../../hooks/useContent.js'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const { profile, earnings, bookings, loading, toggleOnline } = useWorker()
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

      {/* 1. Status Banner */}
      <ElementRenderer elementId="workerStatusBanner" overrideData={{ isOnline, txt }} />

      {/* 2. Map — square, centered */}
      <ElementRenderer elementId="dashboardMapCard" overrideData={{ activeBooking }} />

      {/* 3. Online Toggle — centered below map */}
      <ElementRenderer elementId="dashboardOnlineToggle" overrideData={{ isOnline, txt, onToggle: toggleOnline }} />

      {/* 4. Stats Bar — compact */}
      <ElementRenderer
        elementId="workerStatsBar"
        overrideData={{
          completed_jobs: profile?.completed_jobs || 0,
          total_earnings: earnings?.total_earnings || 0,
          rating: profile?.rating || '—',
        }}
      />

      {/* 5. Active / Upcoming Jobs */}
      <ElementRenderer
        elementId="jobCard"
        overrideData={{ bookings: bookings || [] }}
      />

      {/* 6. Analytics — below everything, chart toggle */}
      <ElementRenderer elementId="dashboardAnalytics" overrideData={{ earnings }} />

    </div>
  )
}