import React from "react";
import { useContent } from "../../hooks/useContent.js";
import config from "../../config/ui/configResolver.js";
import { useStyle } from "../../hooks/useStyle.js";

export default function NavActionGrid({ elementConfig, overrideData }) {
  const c = config.colors;
  const s = config.spacing;
  const r = config.radius;
  const w = config.worker;
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {});
  const items = elementConfig.content?.items || [];
  const actionCardStyle = overrideData?.actionCardStyle || {};

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: w.quickActionsGrid?.gridTemplateColumns || '1fr 1fr',
      gap: w.quickActionsGrid?.gap || '10px', marginBottom: w.quickActionsGrid?.marginBottom || '16px',
      ...overrideStyles,
    }}>
      {items.map((item, idx) => {
        const label = useContent(item.labelKey, item.labelKey);
        return (
          <div key={idx} onClick={() => window.location.href = item.route} style={{
            background: w.actionCard?.background || c.bgSurface, padding: w.actionCard?.padding || s.md || '16px',
            textAlign: 'center', cursor: 'pointer', borderRadius: w.actionCard?.borderRadius || r.md || '12px',
            ...actionCardStyle,
          }}>
            <div style={{ fontSize: w.actionIcon?.fontSize || '28px', marginBottom: w.actionIcon?.marginBottom || '8px' }}>{item.icon}</div>
            <div style={{ fontSize: w.actionLabel?.fontSize || '12px', fontWeight: w.actionLabel?.fontWeight || 500, color: w.actionLabel?.color || c.textPrimary }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}