// sajilo-app/src/screens/worker/WorkerDashboard.jsx

import { useNavigate } from 'react-router-dom'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import { useBooking } from '../../contexts/BookingContext.jsx'
import WorkerStatsBar from '../../components/worker/WorkerStatsBar.jsx'
import ConfigContainer from '../../components/ConfigContainer.jsx'
import ElementRenderer from '../../components/ElementRenderer.jsx'
import { useContent } from '../../hooks/useContent.js'
import { useStyle } from '../../hooks/useStyle.js'
import { useFeatureFlag } from '../../hooks/useFeatureFlag.js'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const { profile, earnings, loading } = useWorker()
  const { activeBooking } = useBooking()
  const isOnline = profile?.is_online || false

  // Feature flags — KEPT ACTIVE (controls visibility via uiRegistry.js)
  const showQuickActions = useFeatureFlag('workerQuickActions')
  const showNotifications = useFeatureFlag('workerNotifications')

  // Content strings — KEPT ACTIVE (powers all text from contentRegistry)
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

  // Text map — KEPT ACTIVE
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

  // Styles — KEPT ACTIVE
  const cardStyle = useStyle('workerCard')
  const actionCardStyle = useStyle('workerActionCard')

  // ── Loading State (unchanged) ────────────────────────
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

  // ── Render ──────────────────────────────────────────
  return (
    <div>

      {/* 1. Status Banner: online/offline */}
      {/* PHASE 5: Replaced inline JSX with ElementRenderer */}
      <ElementRenderer
        elementId="workerStatusBanner"
        overrideData={{ isOnline, txt }}
      />

      {/* 2. WorkerStatsBar */}
      {/* KEPT ORIGINAL — WorkerStatsBar is a separate component, not in ElementRenderer yet */}
      <ConfigContainer id="workerStats">
        <WorkerStatsBar />
      </ConfigContainer>

      {/* 3. Active Task Card */}
      {/* PHASE 5: Replaced inline JSX with ElementRenderer */}
      <ConfigContainer id="workerActiveTask">
        <ElementRenderer
          elementId="workerActiveTaskCard"
          overrideData={{ isOnline, activeBooking, txt, cardStyle }}
        />
      </ConfigContainer>

      {/* 4. Quick Actions Grid */}
      {/* Feature flag controls visibility */}
      {showQuickActions && (
        <ConfigContainer id="workerQuickActions">
          {/* PHASE 5: Replaced inline JSX with ElementRenderer */}
          <ElementRenderer
            elementId="workerQuickActions"
            overrideData={{ txt, actionCardStyle }}
          />
        </ConfigContainer>
      )}

      {/* 5. Notifications Card */}
      {/* Feature flag controls visibility */}
      {showNotifications && (
        <ConfigContainer id="workerNotifications">
          {/* PHASE 5: Replaced inline JSX with ElementRenderer */}
          <ElementRenderer
            elementId="workerNotificationsCard"
            overrideData={{ txt, cardStyle }}
          />
        </ConfigContainer>
      )}

    </div>
  )
}