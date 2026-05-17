import React from "react";
import config from "../../config/ui/configResolver.js";
import { useStyle } from "../../hooks/useStyle.js";

export default function ActiveTaskCard({ elementConfig, overrideData }) {
  const c = config.colors;
  const s = config.spacing;
  const r = config.radius;
  const w = config.worker;
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {});
  const isOnline = overrideData?.isOnline ?? false;
  const activeBooking = overrideData?.activeBooking;
  const txt = overrideData?.txt || {};
  const cardStyle = overrideData?.cardStyle || {};
  const hasActiveJob = !!activeBooking;
  const title = hasActiveJob ? (txt.activeJobInProgress || "Active Job in Progress") : (txt.noJob || "No active job");
  const subtitle = hasActiveJob ? `Booking #${activeBooking.id} — ${activeBooking.status}` : (isOnline ? (txt.waiting || "Waiting for bookings...") : (txt.goOnline || "Go online"));
  const buttonLabel = txt.viewTasks || "View Tasks";

  return (
    <div style={{
      background: w.activeTaskCard?.background || c.bgSurface,
      border: w.activeTaskCard?.border || `2px solid ${c.accentOrange}`,
      padding: w.activeTaskCard?.padding || s.md || '18px',
      marginBottom: w.activeTaskCard?.marginBottom || '16px',
      borderRadius: w.activeTaskCard?.borderRadius || r.md || '12px',
      ...cardStyle, ...overrideStyles,
    }}>
      <div style={{ fontSize: w.activeTaskTitle?.fontSize || '14px', fontWeight: w.activeTaskTitle?.fontWeight || 600, color: w.activeTaskTitle?.color || c.textPrimary, marginBottom: w.activeTaskTitle?.marginBottom || '4px' }}>{title}</div>
      <div style={{ fontSize: w.activeTaskSubtitle?.fontSize || '12px', color: w.activeTaskSubtitle?.color || c.textSecondary, marginBottom: w.activeTaskSubtitle?.marginBottom || '12px' }}>{subtitle}</div>
      <button onClick={() => window.location.href = '/worker/jobs'} style={{
        padding: w.activeTaskButton?.padding || '10px 20px', borderRadius: w.activeTaskButton?.borderRadius || r.sm || '8px',
        border: 'none', background: w.activeTaskButton?.background || c.accentBlue, color: '#fff',
        fontSize: w.activeTaskButton?.fontSize || '12px', fontWeight: w.activeTaskButton?.fontWeight || 600, cursor: 'pointer', opacity: isOnline ? 1 : 0.5,
      }}>{buttonLabel}</button>
    </div>
  );
}