import { useNavigate } from 'react-router-dom'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import { useBooking } from '../../contexts/BookingContext.jsx'
import WorkerStatsBar from '../../components/worker/WorkerStatsBar.jsx'
import ConfigContainer from '../../components/ConfigContainer.jsx'
import { useContent } from '../../hooks/useContent.js'
import { useStyle } from '../../hooks/useStyle.js'
import { useFeatureFlag } from '../../hooks/useFeatureFlag.js'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const { profile, loading } = useWorker()
  const { activeBooking } = useBooking()
  const isOnline = profile?.is_online || false

  const showQuickActions = useFeatureFlag('workerQuickActions')
  const showNotifications = useFeatureFlag('workerNotifications')

  const onlineContent = useContent('worker.online')
  const offlineContent = useContent('worker.offline')
  const receivingContent = useContent('worker.receiving')
  const goOnlineContent = useContent('worker.goOnline')
  const activeTasksContent = useContent('worker.activeTasks')
  const upcomingScheduleContent = useContent('worker.upcomingSchedule')
  const earningsContent = useContent('worker.earnings')
  const quickActionsContent = useContent('worker.quickActions')
  const notificationsContent = useContent('worker.notifications')
  const viewTasksContent = useContent('worker.viewTasks')
  const viewScheduleContent = useContent('worker.viewSchedule')
  const noNotificationsContent = useContent('worker.noNotifications')
  const noJobContent = useContent('worker.noJob')
  const waitingContent = useContent('worker.waiting')
  const profileContent = useContent('worker.profile')
  const activeJobInProgressContent = useContent('worker.activeJobInProgress')

  const txt = {
    online: onlineContent || 'You are online',
    offline: offlineContent || 'You are offline',
    receiving: receivingContent || 'Receiving job requests',
    goOnline: goOnlineContent || 'Go online to receive job requests',
    activeTasks: activeTasksContent || 'Active Tasks',
    upcomingSchedule: upcomingScheduleContent || 'Upcoming Schedule',
    earnings: earningsContent || 'Earnings',
    quickActions: quickActionsContent || 'Quick Actions',
    notifications: notificationsContent || 'Notifications',
    viewTasks: viewTasksContent || 'View Tasks',
    viewSchedule: viewScheduleContent || 'View Schedule',
    noNotifications: noNotificationsContent || 'No new notifications',
    noJob: noJobContent || 'No active job',
    waiting: waitingContent || 'Waiting for bookings...',
    workerProfile: profileContent || 'Profile',
    activeJobInProgress: activeJobInProgressContent || 'Active Job in Progress',
  }

  const cardStyle = useStyle('workerCard')
  const actionCardStyle = useStyle('workerActionCard')

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            height: i === 1 ? 56 : i === 4 ? 100 : 80,
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
      <div className="worker-card" style={{
        background: isOnline ? '#dcfce7' : '#fee2e2',
        borderLeft: `4px solid ${isOnline ? '#16A34A' : '#DC2626'}`,
        padding: '14px 18px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>{isOnline ? '🟢' : '🔴'}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: isOnline ? '#16A34A' : '#DC2626' }}>
            {isOnline ? txt.online : txt.offline}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {isOnline ? txt.receiving : txt.goOnline}
          </div>
        </div>
      </div>

      <ConfigContainer id="workerStats">
        <WorkerStatsBar />
      </ConfigContainer>

      <ConfigContainer id="workerActiveTask">
        <div className="worker-card" style={{
          background: 'var(--bg-surface)', border: '2px solid var(--accent-orange)',
          padding: 18, marginBottom: 16, ...cardStyle,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            {activeBooking ? txt.activeJobInProgress : txt.noJob}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            {activeBooking ? `Booking #${activeBooking.id} — ${activeBooking.status}` : (isOnline ? txt.waiting : txt.goOnline)}
          </div>
          <button onClick={() => navigate('/worker/jobs')} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: 'var(--accent-blue)', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            opacity: isOnline ? 1 : 0.5,
          }}>{txt.viewTasks}</button>
        </div>
      </ConfigContainer>

      <ConfigContainer id="workerQuickActions">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: txt.viewTasks, icon: '🔧', path: '/worker/jobs' },
            { label: txt.viewSchedule, icon: '📅', path: '/worker/schedule' },
            { label: txt.earnings, icon: '💰', path: '/worker/earnings' },
            { label: txt.workerProfile, icon: '👤', path: '/worker/profile' },
          ].map((link) => (
            <div key={link.path} onClick={() => navigate(link.path)} className="worker-card" style={{
              background: 'var(--bg-surface)', padding: 16, textAlign: 'center', cursor: 'pointer',
              ...actionCardStyle,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{link.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{link.label}</div>
            </div>
          ))}
        </div>
      </ConfigContainer>

      <ConfigContainer id="workerNotifications">
        <div className="worker-card" style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          padding: 16, ...cardStyle,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            {txt.notifications}
          </div>
          <div style={{ textAlign: 'center', padding: 16, color: 'var(--text-secondary)', fontSize: 12 }}>
            {txt.noNotifications}
          </div>
        </div>
      </ConfigContainer>
    </div>
  )
}