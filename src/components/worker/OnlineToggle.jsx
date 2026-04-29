import { useState } from 'react'

export default function OnlineToggle() {
  const [isOnline, setIsOnline] = useState(false)

  return (
    <button
      onClick={() => setIsOnline(!isOnline)}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        border: `2px solid ${isOnline ? 'var(--accent-green)' : 'var(--accent-red)'}`,
        background: isOnline ? 'var(--accent-green-light)' : 'var(--accent-red-light)',
        color: isOnline ? 'var(--accent-green)' : 'var(--accent-red)',
        fontSize: 'var(--font-body-sm)',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {isOnline ? '🟢 Online' : '🔴 Offline'}
    </button>
  )
}