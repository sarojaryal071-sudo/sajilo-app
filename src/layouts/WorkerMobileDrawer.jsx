import { useRef, useEffect } from 'react'
import mobile from '../config/ui/mobile.config.js'

export default function WorkerMobileDrawer({ isOpen, onClose, navigate, lang, setLang, dark, setDark, onLogout }) {
  const ref = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: mobile.drawer.overlayBackground, zIndex: mobile.drawer.overlayZIndex }} />
      <div ref={ref} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: mobile.drawer.width, background: mobile.drawer.background, zIndex: mobile.drawer.zIndex, padding: mobile.drawer.padding, overflowY: 'auto', animation: 'slideIn 0.2s ease' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: mobile.drawer.titleSize, fontWeight: mobile.drawer.titleWeight, color: 'var(--text-primary)' }}>More</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
        </div>

        {/* Secondary Nav Items */}
        <button onClick={() => { navigate('/worker/earnings'); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: mobile.drawer.itemPadding, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontSize: mobile.drawer.itemFontSize, fontWeight: mobile.drawer.itemWeight, color: 'var(--text-primary)', borderBottom: mobile.drawer.itemBorder }}>
          <span style={{ fontSize: mobile.drawer.iconSize }}>💰</span> Earnings
        </button>
        <button onClick={() => { navigate('/worker/schedule'); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: mobile.drawer.itemPadding, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontSize: mobile.drawer.itemFontSize, fontWeight: mobile.drawer.itemWeight, color: 'var(--text-primary)', borderBottom: mobile.drawer.itemBorder }}>
          <span style={{ fontSize: mobile.drawer.iconSize }}>📅</span> Schedule
        </button>
        <button onClick={() => { navigate('/worker/profile'); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: mobile.drawer.itemPadding, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontSize: mobile.drawer.itemFontSize, fontWeight: mobile.drawer.itemWeight, color: 'var(--text-primary)', borderBottom: mobile.drawer.itemBorder }}>
          <span style={{ fontSize: mobile.drawer.iconSize }}>👤</span> Profile
        </button>
        <button onClick={() => { navigate('/worker/settings'); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: mobile.drawer.itemPadding, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontSize: mobile.drawer.itemFontSize, fontWeight: mobile.drawer.itemWeight, color: 'var(--text-primary)', borderBottom: mobile.drawer.itemBorder }}>
          <span style={{ fontSize: mobile.drawer.iconSize }}>⚙️</span> Settings
        </button>

        {/* Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 18 }}>🌐</span>
          <select value={lang || 'en'} onChange={(e) => { setLang(e.target.value); localStorage.setItem('sajilo_lang', e.target.value); onClose() }} style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, cursor: 'pointer', outline: 'none', flex: 1 }}>
            <option value="en">English</option>
            <option value="ne">नेपाली</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button onClick={() => { const n = !dark; setDark(n); localStorage.setItem('sajilo_theme', n ? 'dark' : 'light'); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 18 }}>{dark ? '☀️' : '🌙'}</span> Theme
        </button>

        {/* Logout */}
        <button onClick={() => { localStorage.clear(); window.location.href = '/login' }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', fontSize: 14, fontWeight: 500, color: 'var(--accent-red)', borderBottom: '1px solid var(--border)', marginTop: 8 }}>
          <span style={{ fontSize: 18 }}>🚪</span> Logout
        </button>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </>
  )
}