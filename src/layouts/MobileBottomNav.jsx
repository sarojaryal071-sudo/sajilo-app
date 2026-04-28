import { useLocation } from 'react-router-dom'
import navigation from '../config/navigation.js'

export default function MobileBottomNav({ navigate, t, onMore }) {
  const location = useLocation()
  const primaryItems = navigation.filter(item => item.priority === 'primary')

  return (
    <div className="mobile-bottom-nav" style={{
  display: 'none',
  height: 60,
  background: 'var(--bg-nav)',
  borderTop: '1px solid var(--border)',
  flexShrink: 0,
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
}}>
      {primaryItems.slice(0, 4).map((item) => (
        <button key={item.id} onClick={() => navigate(item.route)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 2, border: 'none', background: 'transparent',
          cursor: 'pointer', padding: '8px 4px',
          color: location.pathname === item.route ? 'var(--accent-blue)' : 'var(--text-secondary)',
        }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 500 }}>{t[item.labelKey]}</span>
        </button>
      ))}
      <button onClick={onMore} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 2, border: 'none', background: 'transparent',
        cursor: 'pointer', padding: '8px 4px', color: 'var(--text-secondary)',
      }}>
        <span style={{ fontSize: 18 }}>☰</span>
        <span style={{ fontSize: 10, fontWeight: 500 }}>More</span>
      </button>
    </div>
  )
}