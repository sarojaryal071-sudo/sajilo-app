import { useRef, useEffect } from 'react'
import navigation from '../config/navigation.js'

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

  const secondaryItems = navigation.filter(item => item.priority === 'secondary')

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200,
      }} />
      <div ref={ref} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 260,
        background: 'var(--bg-surface)', zIndex: 300,
        padding: '20px 16px', overflowY: 'auto',
        animation: 'slideIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>More</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}>✕</button>
        </div>

        {secondaryItems.map((item) => (
          <button key={item.id} onClick={() => { navigate(item.route); onClose(); }} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
            border: 'none', background: 'transparent', cursor: 'pointer',
            width: '100%', fontSize: 14, fontWeight: 500,
            color: 'var(--text-primary)', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {t[item.labelKey]}
          </button>
        ))}
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </>
  )
}
