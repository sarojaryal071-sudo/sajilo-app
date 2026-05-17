import React from "react";
import { useContent } from "../../hooks/useContent.js";
import config from "../../config/ui/configResolver.js";
import { useStyle } from "../../hooks/useStyle.js";

export default function StatsCardGroup({ elementConfig, overrideData }) {
  const c = config.colors;
  const s = config.spacing;
  const r = config.radius;
  const w = config.worker;
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {});
  const stats = elementConfig.content?.stats || [];
  const data = overrideData || {};

  return (
    <div style={{
      display: 'flex', gap: w.statsBar?.gap || '10px', marginBottom: w.statsBar?.marginBottom || '20px',
      ...overrideStyles,
    }}>
      {stats.map((stat, idx) => {
        const label = useContent(stat.labelKey, stat.labelKey);
        const value = data[stat.dataSource?.split('.').pop()] ?? '—';
        return (
          <div key={idx} style={{
            flex: 1, background: w.statCard?.background || c.bgSurface,
            padding: w.statCard?.padding || s.md || '14px', textAlign: 'center',
            borderRadius: w.statCard?.borderRadius || r.md || '12px',
          }}>
            <div style={{ fontSize: w.statValue?.fontSize || '20px', fontWeight: w.statValue?.fontWeight || 800, color: w.statValue?.color || c.accentBlue }}>
              {typeof value === 'number' && stat.labelKey !== 'worker.rating' && stat.labelKey !== 'worker.jobsToday' ? `Rs ${value.toLocaleString()}` : value}
            </div>
            <div style={{ fontSize: w.statLabel?.fontSize || '10px', color: w.statLabel?.color || c.textSecondary, marginTop: w.statLabel?.marginTop || '4px' }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}