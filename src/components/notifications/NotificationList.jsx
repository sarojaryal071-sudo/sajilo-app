// NotificationList — dropdown panel showing all notifications with read/unread styling
import { useNotification } from '../../contexts/NotificationContext.jsx'

export default function NotificationList({ onClose }) {
  const { notifications, markAsRead } = useNotification()

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      width: 320,
      maxHeight: 360,
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '1px solid var(--border)',
      overflowY: 'auto',
      zIndex: 200,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          Notifications
        </span>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          fontSize: 14,
          color: 'var(--text-secondary)',
          cursor: 'pointer',
        }}>
          ✕
        </button>
      </div>

      {notifications.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
          No notifications
        </div>
      ) : (
        notifications.map(n => {
          const isUnread = n.status === 'sent'
          return (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                fontWeight: isUnread ? 700 : 400,
                opacity: isUnread ? 1 : 0.6,
                background: isUnread ? 'var(--accent-blue-light)' : 'transparent',
              }}
            >
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</div>
            </div>
          )
        })
      )}
    </div>
  )
}