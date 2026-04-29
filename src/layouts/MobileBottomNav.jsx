import { useLocation } from 'react-router-dom'
import getNavigation from '../config/navigation.js'
import mobile from '../config/ui/mobile.config.js'
import uiRegistry from '../config/ui/uiRegistry.js'

export default function MobileBottomNav({ navigate, t, onMore, onSOS }) {
  const location = useLocation()
  const navItems = getNavigation()
  const primaryItems = navItems.filter(item => item.priority === 'primary')

  return (
    <div className="mobile-bottom-nav" style={{
      display: 'none', height: mobile.bottomNav.height, background: 'var(--bg-nav)',
      borderTop: '1px solid var(--border)', flexShrink: 0,
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: mobile.bottomNav.zIndex,
    }}>
      {primaryItems.slice(0, 3).map((item) => (
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
      {uiRegistry.features.sosEmergency.enabled && (
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
  )
}