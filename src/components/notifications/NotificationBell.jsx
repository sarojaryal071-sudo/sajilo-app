// NotificationBell — displays unread notification count badge on a bell icon
import { useNotification } from '../../contexts/NotificationContext.jsx'

export default function NotificationBell({ onClick }) {
  const { unreadCount } = useNotification()

  return (
    <button onClick={onClick} style={{
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 18,
      padding: '4px 8px',
    }}>
      🔔
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: -2,
          right: -2,
          background: 'var(--accent-red)',
          color: '#fff',
          fontSize: 10,
          fontWeight: 700,
          minWidth: 18,
          height: 18,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
        }}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}