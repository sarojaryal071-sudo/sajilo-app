import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import getNavigation from '../config/navigation.js'
import mobile from '../config/ui/mobile.config.js'
import { useFeatureFlag } from '../hooks/useFeatureFlag.js'

export default function MobileBottomNav({ navigate, t, onMore, onSOS }) {
  const location = useLocation()
  const navItems = getNavigation()
  const primaryItems = navItems.filter(item => item.priority === 'primary')
  const sosEnabled = useFeatureFlag('sosEmergency')
  const notifEnabled = useFeatureFlag('notifications')

  // Mock notifications — 🔧 admin-configurable via backend
  const [notifications] = useState([
    { id: 1, icon: '📋', text: 'Your booking is confirmed.', time: '5m ago' },
    { id: 2, icon: '🔔', text: 'Worker is on the way.', time: '30m ago' },
  ])
  const [showNotifMobile, setShowNotifMobile] = useState(false)

  return (
    <>
      <div className="mobile-bottom-nav" style={{
        display: 'none', height: mobile.bottomNav.height, background: 'var(--bg-nav)',
        borderTop: '1px solid var(--border)', flexShrink: 0,
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: mobile.bottomNav.zIndex,
      }}>
        {primaryItems.slice(0, 4).map((item) => (
          <button key={item.id} onClick={() => navigate(item.route)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: mobile.bottomNav.gap, border: 'none', background: 'transparent',
            cursor: 'pointer', padding: mobile.bottomNav.padding,
            color: location.pathname === item.route ? mobile.bottomNav.activeColor : mobile.bottomNav.inactiveColor,
          }}>
            <span style={{ fontSize: mobile.bottomNav.iconSize }}>{item.icon}</span>
            <span style={{ fontSize: mobile.bottomNav.labelSize, fontWeight: mobile.bottomNav.labelWeight }}>{t[item.labelKey]}</span>
          </button>
        ))}

        {/* Notification Bell — mobile */}
        {notifEnabled && (
          <button onClick={() => setShowNotifMobile(!showNotifMobile)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: mobile.bottomNav.gap, border: 'none', background: 'transparent',
            cursor: 'pointer', padding: mobile.bottomNav.padding, color: mobile.bottomNav.inactiveColor,
            position: 'relative',
          }}>
            <span style={{ fontSize: mobile.bottomNav.iconSize }}>🔔</span>
            <span style={{ fontSize: mobile.bottomNav.labelSize, fontWeight: mobile.bottomNav.labelWeight }}>{t.notifBadge || 'Alerts'}</span>
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 'calc(50% - 20px)',
                background: 'var(--accent-red)', color: '#fff',
                fontSize: 9, fontWeight: 700, width: 16, height: 16,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{notifications.length}</span>
            )}
          </button>
        )}

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
        <button onClick={onMore} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: mobile.bottomNav.gap, border: 'none', background: 'transparent',
          cursor: 'pointer', padding: mobile.bottomNav.padding, color: mobile.bottomNav.inactiveColor,
        }}>
          <span style={{ fontSize: mobile.bottomNav.iconSize }}>☰</span>
          <span style={{ fontSize: mobile.bottomNav.labelSize, fontWeight: mobile.bottomNav.labelWeight }}>More</span>
        </button>
      </div>

      {/* Mobile Notifications Panel */}
      {showNotifMobile && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10001 }}>
          <div onClick={() => setShowNotifMobile(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{ position: 'absolute', bottom: 60, left: 16, right: 16, maxHeight: 320, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
              <button onClick={() => setShowNotifMobile(false)} style={{ background: 'none', border: 'none', fontSize: 16, color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
            </div>
            {notifications.map(n => (
              <div key={n.id} style={{ padding: '12px 16px', display: 'flex', gap: 10, borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 18 }}>{n.icon}</span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}