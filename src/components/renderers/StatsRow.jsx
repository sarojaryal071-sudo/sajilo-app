import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function StatsRow({ elementConfig, overrideData }) {
  const c = config.colors; const r = config.radius; const f = config.font; const w = config.worker; const wp = w.profile || {}
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {})
  const profile = overrideData?.profile || {}
  const stats = elementConfig.content?.stats || []

  return (
    <div style={{ display: 'flex', gap: wp.statsRow?.gap || '10px', ...overrideStyles }}>
      {stats.map((stat, idx) => {
        const label = useContent(stat.labelKey, stat.labelKey)
        let value = profile[stat.valueField] ?? 0
        if (stat.format === 'currency') value = `Rs ${(value || 0).toLocaleString()}`
        else if (stat.format === 'onlineStatus') value = value ? '🟢' : '🔴'
        return (
          <div key={idx} style={{ flex: 1, background: wp.statCard?.background || c.bgSurface, border: wp.statCard?.border || `1px solid ${c.border}`, borderRadius: wp.statCard?.borderRadius || r.md || '12px', padding: wp.statCard?.padding || '14px', textAlign: 'center' }}>
            <div style={{ fontSize: wp.statValue?.fontSize || f.large || '18px', fontWeight: wp.statValue?.fontWeight || 800, color: stat.color === 'accentGreen' ? c.accentGreen : stat.color === 'statusBased' ? (profile.is_online ? c.accentGreen : c.accentRed) : c.accentBlue }}>{value}</div>
            <div style={{ fontSize: wp.statLabel?.fontSize || f.caption || '12px', color: wp.statLabel?.color || c.textSecondary }}>{label}</div>
          </div>
        )
      })}
    </div>
  )
}