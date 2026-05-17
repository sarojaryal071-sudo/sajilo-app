import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function MapPlaceholder({ elementConfig, overrideData }) {
  const w = config.worker; const wd = w.dashboard?.mapCard || {}
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {})
  const activeJob = overrideData?.activeBooking
  const emptyText = useContent('worker.mapEmpty', 'Map updates when job accepted')

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: wd.width || '175px', height: wd.height || '175px', background: activeJob ? (wd.active?.background || 'var(--accent-blue-light)') : (wd.background || 'var(--bg-surface2)'), border: activeJob ? (wd.active?.border || '2px solid var(--accent-blue)') : (wd.border || '2px dashed var(--border)'), borderRadius: wd.borderRadius || 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: wd.marginBottom || '16px', position: 'relative', overflow: 'hidden', ...overrideStyles }}>
        {activeJob ? (
          <>
            <div style={{ position: 'absolute', bottom: '12px', left: '30%', width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6', animation: 'blink 1s infinite' }} />
            <span style={{ fontSize: wd.icon?.fontSize || '40px', opacity: 1 }}>📍</span>
            <span style={{ fontSize: wd.title?.fontSize || '11px', color: wd.title?.color || 'var(--text-secondary)', marginTop: wd.title?.marginTop || '8px', textAlign: 'center', padding: '0 12px', fontWeight: 600 }}>{activeJob.service_name || 'Active Job'}</span>
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px', textAlign: 'center', padding: '0 12px' }}>Customer: {activeJob.customer_name || '…'}</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: wd.icon?.fontSize || '40px', opacity: wd.icon?.opacity || 0.3 }}>🗺️</span>
            <span style={{ fontSize: wd.title?.fontSize || '11px', color: wd.title?.color || 'var(--text-secondary)', marginTop: wd.title?.marginTop || '8px', textAlign: 'center', padding: '0 12px' }}>{emptyText}</span>
          </>
        )}
      </div>
    </div>
  )
}