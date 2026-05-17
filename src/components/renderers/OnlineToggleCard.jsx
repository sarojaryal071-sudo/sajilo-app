import React from 'react'

export default function OnlineToggleCard({ elementConfig, overrideData }) {
  const isOnline = overrideData?.isOnline ?? false
  const onToggle = overrideData?.onToggle
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
      <button onClick={() => onToggle?.()} style={{ padding: '8px 16px', borderRadius: '20px', border: `2px solid ${isOnline ? 'var(--accent-green)' : 'var(--accent-red)'}`, background: isOnline ? 'var(--accent-green-light)' : 'var(--accent-red-light)', color: isOnline ? 'var(--accent-green)' : 'var(--accent-red)', fontSize: 'var(--font-body-sm)', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
        {isOnline ? '🟢 Online' : '🔴 Offline'}
      </button>
    </div>
  )
}