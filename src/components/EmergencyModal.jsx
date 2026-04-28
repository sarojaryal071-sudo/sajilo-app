import { useRef, useEffect } from 'react'

export default function EmergencyModal({ onClose }) {
  const ref = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const handleCall = (number) => {
    window.location.href = `tel:${number}`
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div ref={ref} style={{
        background: 'var(--bg-surface)', borderRadius: 18, padding: 28,
        width: '100%', maxWidth: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#D92B2B' }}>🚨 Emergency</div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: 'var(--text-secondary)',
          }}>✕</button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Tap to call — Nepal emergency numbers
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {/* Police */}
          <button onClick={() => handleCall('100')} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 16, borderRadius: 10, border: '2px solid #1A4FA0',
            background: '#EBF3FF', cursor: 'pointer', width: '100%',
          }}>
            <span style={{ fontSize: 28 }}>🚔</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1A4FA0' }}>100</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A4FA0' }}>Police</div>
            </div>
          </button>

          {/* Fire */}
          <button onClick={() => handleCall('101')} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 16, borderRadius: 10, border: '2px solid #D92B2B',
            background: '#FEF0F0', cursor: 'pointer', width: '100%',
          }}>
            <span style={{ fontSize: 28 }}>🚒</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#D92B2B' }}>101</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#D92B2B' }}>Fire</div>
            </div>
          </button>

          {/* Ambulance */}
          <button onClick={() => handleCall('102')} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 16, borderRadius: 10, border: '2px solid #1A7A50',
            background: '#E8F7F0', cursor: 'pointer', width: '100%',
          }}>
            <span style={{ fontSize: 28 }}>🚑</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1A7A50' }}>102</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A7A50' }}>Ambulance</div>
            </div>
          </button>
        </div>

        <button onClick={onClose} style={{
          width: '100%', padding: 12, borderRadius: 10,
          border: '1px solid var(--border)', background: 'var(--bg-surface2)',
          fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer',
        }}>
          Close — I am safe
        </button>
      </div>
    </div>
  )
}