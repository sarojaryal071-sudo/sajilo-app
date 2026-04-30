import { useRef, useEffect } from 'react'
import getNavigation from '../config/navigation.js'
import mobile from '../config/ui/mobile.config.js'

export default function MobileDrawer({ isOpen, onClose, navigate, t }) {
  const ref = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const navItems = getNavigation()
  const secondaryItems = navItems.filter(item => item.priority === 'secondary')

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: mobile.drawer.overlayBackground, zIndex: mobile.drawer.overlayZIndex }} />
      <div ref={ref} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: mobile.drawer.width, background: mobile.drawer.background, zIndex: mobile.drawer.zIndex, padding: mobile.drawer.padding, overflowY: 'auto', animation: 'slideIn 0.2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: mobile.drawer.titleSize, fontWeight: mobile.drawer.titleWeight, color: 'var(--text-primary)' }}>More</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
        </div>
        {secondaryItems.map((item) => (
          <button key={item.id} onClick={() => { navigate(item.route); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: mobile.drawer.itemPadding, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontSize: mobile.drawer.itemFontSize, fontWeight: mobile.drawer.itemWeight, color: 'var(--text-primary)', borderBottom: mobile.drawer.itemBorder }}>
            <span style={{ fontSize: mobile.drawer.iconSize }}>{item.icon}</span>
            {t[item.labelKey]}
          </button>
        ))}
        <button onClick={() => { localStorage.removeItem('sajilo_user'); localStorage.removeItem('sajilo_token'); window.location.href = '/login' }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontSize: 14, fontWeight: 500, color: 'var(--accent-red)', borderBottom: '1px solid var(--border)', marginTop: 8 }}>
          <span style={{ fontSize: 18 }}>🚪</span>Logout
        </button>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </>
  )
}