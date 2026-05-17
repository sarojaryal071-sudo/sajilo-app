import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import mobile from '../config/ui/mobile.config.js'
import { useFeatureFlag } from '../hooks/useFeatureFlag.js'
import { useNotification } from '../contexts/NotificationContext.jsx'
import conversationState from '../services/chat/ConversationStateManager.js'
import { API_URL } from '../services/api.js'
import { useUnifiedNotifications } from '../governance/useUnifiedNotifications.js';

export default function MobileBottomNav({ navigate, t, onMore, onSOS }) {
  const location = useLocation()
  const sosEnabled = useFeatureFlag('sosEmergency')
  const notifEnabled = useFeatureFlag('notifications')
  const { notifications, unreadCount } = useNotification()
    const { unreadCount: g2UnreadCount } = useUnifiedNotifications();


  const [convUnread, setConvUnread] = useState(conversationState.getUnreadCount())
  useEffect(() => {
    const unsub = conversationState.onChange(count => setConvUnread(count))
    return unsub
  }, [])


  // Seed unread conversation count from server on mount
  useEffect(() => {
    const token = localStorage.getItem('sajilo_token')
    if (!token) return
    fetch(`${API_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => {
      const list = d.data || []
      list.forEach(c => {
        if (c.unread === '1') conversationState.setUnread(c.id)
      })
      const count = list.filter(c => c.unread === '1').length
      setConvUnread(count)
    }).catch(() => {})
  }, [])

  return (
    <div className="mobile-bottom-nav" style={{
      display: 'none', height: mobile.bottomNav.height, background: 'var(--bg-nav)',
      borderTop: '1px solid var(--border)', flexShrink: 0,
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: mobile.bottomNav.zIndex,
    }}>
      {/* Home */}
      <button onClick={() => navigate('/home')} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: mobile.bottomNav.gap, border: 'none', background: 'transparent',
        cursor: 'pointer', padding: mobile.bottomNav.padding,
        color: location.pathname === '/home' ? mobile.bottomNav.activeColor : mobile.bottomNav.inactiveColor,
      }}>
        <span style={{ fontSize: mobile.bottomNav.iconSize }}>🏠</span>
        <span style={{ fontSize: mobile.bottomNav.labelSize, fontWeight: mobile.bottomNav.labelWeight }}>Home</span>
      </button>

      {/* Bookings */}
      <button onClick={() => navigate('/bookings')} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: mobile.bottomNav.gap, border: 'none', background: 'transparent',
        cursor: 'pointer', padding: mobile.bottomNav.padding,
        color: location.pathname === '/bookings' ? mobile.bottomNav.activeColor : mobile.bottomNav.inactiveColor,
      }}>
        <span style={{ fontSize: mobile.bottomNav.iconSize }}>📋</span>
        <span style={{ fontSize: mobile.bottomNav.labelSize, fontWeight: mobile.bottomNav.labelWeight }}>Bookings</span>
      </button>

      {/* Notifications */}
      {notifEnabled && (
        <button onClick={() => navigate('/inbox')} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: mobile.bottomNav.gap, border: 'none', background: 'transparent',
          cursor: 'pointer', padding: mobile.bottomNav.padding, color: mobile.bottomNav.inactiveColor,
          position: 'relative',
        }}>
          <span style={{ fontSize: mobile.bottomNav.iconSize }}>🔔</span>
          <span style={{ fontSize: mobile.bottomNav.labelSize, fontWeight: mobile.bottomNav.labelWeight }}>Alerts</span>
          {g2UnreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 'calc(50% - 20px)',
              background: 'var(--accent-red)', color: '#fff',
              fontSize: 9, fontWeight: 700, width: 16, height: 16,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{g2UnreadCount}</span>
          )}
        </button>
      )}

      {/* SOS */}
      {sosEnabled && (
        <button onClick={onSOS} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: mobile.bottomNav.gap, border: 'none', background: 'transparent',
          cursor: 'pointer', padding: mobile.bottomNav.padding, color: mobile.bottomNav.sosColor,
        }}>
          <span style={{ fontSize: mobile.bottomNav.iconSize }}>🆘</span>
          <span style={{ fontSize: mobile.bottomNav.labelSize, fontWeight: 700 }}>SOS</span>
        </button>
      )}

      {/* More */}
      <button onClick={onMore} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: mobile.bottomNav.gap, border: 'none', background: 'transparent',
        cursor: 'pointer', padding: mobile.bottomNav.padding, color: mobile.bottomNav.inactiveColor,
      }}>
        <span style={{ fontSize: mobile.bottomNav.iconSize }}>☰</span>
        <span style={{ fontSize: mobile.bottomNav.labelSize, fontWeight: mobile.bottomNav.labelWeight }}>More</span>
      </button>
    </div>
  )
}