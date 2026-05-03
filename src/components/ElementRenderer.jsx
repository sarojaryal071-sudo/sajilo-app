// sajilo-app/src/components/ElementRenderer.jsx

/**
 * ELEMENT RENDERER (Phase 10 — Config-Wired)
 * -------------------------------------------
 * Reads visualIdentityRegistry for element blueprints.
 * Reads configResolver (theme.config.js + worker.config.js) for all styles.
 * Reads contentRegistry via useContent for all text.
 * Zero hardcoded colors, fonts, spacing — everything from configs.
 *
 * Types covered: 15
 */

import React from "react";
import visualIdentityRegistry from "../config/visualIdentityRegistry.js";
import config from "../config/ui/configResolver.js";
import { useStyle } from "../hooks/useStyle.js";
import { useContent } from "../hooks/useContent.js";

const ElementRenderer = ({ elementId, overrideData = {} }) => {

  // Get blueprint from registry
  const elementConfig = visualIdentityRegistry[elementId];
  if (!elementConfig || elementConfig.visible === false) return null;

  // Shorthand references to config sections
  const c = config.colors;        // Theme colors (light/dark)
  const r = config.radius;        // Border radius scale
  const s = config.spacing;       // Spacing scale
  const f = config.font;          // Font sizes
  const w = config.worker;        // Worker-specific component styles

  // Get style overrides from registry's styleRef → worker config
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {});

  switch (elementConfig.type) {

    // ──────────────────────────────────────────────
    // STATUS BANNER (Dashboard)
    // ──────────────────────────────────────────────
    case "statusBanner": {
      const isOnline = overrideData?.isOnline ?? false;
      const txt = overrideData?.txt || {};
      const onlineTitle = txt.online || useContent(elementConfig.content?.onlineTitleKey, "You are online");
      const offlineTitle = txt.offline || useContent(elementConfig.content?.offlineTitleKey, "You are offline");
      const onlineSub = txt.receiving || useContent(elementConfig.content?.onlineSubtitleKey, "Receiving job requests");
      const offlineSub = txt.goOnline || useContent(elementConfig.content?.offlineSubtitleKey, "Go online");

      return (
        <div style={{
          background: isOnline ? (w.statusBannerOnline?.background || '#D1FAE5') : (w.statusBannerOffline?.background || '#FEE2E2'),
          borderLeft: `4px solid ${isOnline ? (w.statusBannerOnline?.borderLeftColor || c.accentGreen) : (w.statusBannerOffline?.borderLeftColor || c.accentRed)}`,
          padding: w.statusBanner?.padding || '14px 18px',
          marginBottom: w.statusBanner?.marginBottom || '20px',
          display: 'flex',
          alignItems: 'center',
          gap: w.statusBanner?.gap || '10px',
          ...overrideStyles,
        }}>
          <span style={{ fontSize: w.statusDot?.fontSize || '24px' }}>{isOnline ? '🟢' : '🔴'}</span>
          <div>
            <div style={{
              fontSize: w.statusTitle?.fontSize || f.bodySm || '14px',
              fontWeight: w.statusTitle?.fontWeight || 600,
              color: isOnline ? (w.statusBannerOnline?.borderLeftColor || c.accentGreen) : (w.statusBannerOffline?.borderLeftColor || c.accentRed),
            }}>
              {isOnline ? onlineTitle : offlineTitle}
            </div>
            <div style={{
              fontSize: w.statusSubtitle?.fontSize || f.caption || '12px',
              color: w.statusSubtitle?.color || c.textSecondary,
            }}>
              {isOnline ? onlineSub : offlineSub}
            </div>
          </div>
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // STATS CARD GROUP (Dashboard)
    // ──────────────────────────────────────────────
    case "statsCardGroup": {
      const stats = elementConfig.content?.stats || [];
      const data = overrideData || {};

      return (
        <div style={{
          display: 'flex',
          gap: w.statsBar?.gap || '10px',
          marginBottom: w.statsBar?.marginBottom || '20px',
          ...overrideStyles,
        }}>
          {stats.map((stat, idx) => {
            const label = useContent(stat.labelKey, stat.labelKey);
            const value = data[stat.dataSource?.split('.').pop()] ?? '—';

            return (
              <div key={idx} style={{
                flex: 1,
                background: w.statCard?.background || c.bgSurface,
                padding: w.statCard?.padding || s.md || '14px',
                textAlign: 'center',
                borderRadius: w.statCard?.borderRadius || r.md || '12px',
              }}>
                <div style={{
                  fontSize: w.statValue?.fontSize || '20px',
                  fontWeight: w.statValue?.fontWeight || 800,
                  color: w.statValue?.color || c.accentBlue,
                }}>
                  {typeof value === 'number' && stat.labelKey !== 'worker.rating'
                    ? `Rs ${value.toLocaleString()}`
                    : value}
                </div>
                <div style={{
                  fontSize: w.statLabel?.fontSize || f.caption || '10px',
                  color: w.statLabel?.color || c.textSecondary,
                  marginTop: w.statLabel?.marginTop || '4px',
                }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // ACTIVE TASK CARD (Dashboard)
    // ──────────────────────────────────────────────
    case "activeTaskCard": {
      const isOnline = overrideData?.isOnline ?? false;
      const activeBooking = overrideData?.activeBooking;
      const txt = overrideData?.txt || {};
      const cardStyle = overrideData?.cardStyle || {};
      const hasActiveJob = !!activeBooking;
      const title = hasActiveJob
        ? (txt.activeJobInProgress || "Active Job in Progress")
        : (txt.noJob || "No active job");
      const subtitle = hasActiveJob
        ? `Booking #${activeBooking.id} — ${activeBooking.status}`
        : (isOnline ? (txt.waiting || "Waiting for bookings...") : (txt.goOnline || "Go online"));
      const buttonLabel = txt.viewTasks || "View Tasks";

      return (
        <div style={{
          background: w.activeTaskCard?.background || c.bgSurface,
          border: w.activeTaskCard?.border || `2px solid ${c.accentOrange}`,
          padding: w.activeTaskCard?.padding || s.md || '18px',
          marginBottom: w.activeTaskCard?.marginBottom || '16px',
          borderRadius: w.activeTaskCard?.borderRadius || r.md || '12px',
          ...cardStyle,
          ...overrideStyles,
        }}>
          <div style={{
            fontSize: w.activeTaskTitle?.fontSize || f.bodySm || '14px',
            fontWeight: w.activeTaskTitle?.fontWeight || 600,
            color: w.activeTaskTitle?.color || c.textPrimary,
            marginBottom: w.activeTaskTitle?.marginBottom || '4px',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: w.activeTaskSubtitle?.fontSize || f.caption || '12px',
            color: w.activeTaskSubtitle?.color || c.textSecondary,
            marginBottom: w.activeTaskSubtitle?.marginBottom || '12px',
          }}>
            {subtitle}
          </div>
          <button onClick={() => window.location.href = '/worker/jobs'} style={{
            padding: w.activeTaskButton?.padding || '10px 20px',
            borderRadius: w.activeTaskButton?.borderRadius || r.sm || '8px',
            border: 'none',
            background: w.activeTaskButton?.background || c.accentBlue,
            color: '#fff',
            fontSize: w.activeTaskButton?.fontSize || f.caption || '12px',
            fontWeight: w.activeTaskButton?.fontWeight || 600,
            cursor: 'pointer',
            opacity: isOnline ? 1 : 0.5,
          }}>
            {buttonLabel}
          </button>
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // NAV ACTION GRID (Dashboard)
    // ──────────────────────────────────────────────
    case "navActionGrid": {
      const items = elementConfig.content?.items || [];
      const txt = overrideData?.txt || {};
      const actionCardStyle = overrideData?.actionCardStyle || {};

      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: w.quickActionsGrid?.gridTemplateColumns || '1fr 1fr',
          gap: w.quickActionsGrid?.gap || '10px',
          marginBottom: w.quickActionsGrid?.marginBottom || '16px',
          ...overrideStyles,
        }}>
          {items.map((item, idx) => {
            const label = useContent(item.labelKey, item.labelKey);
            return (
              <div
                key={idx}
                onClick={() => window.location.href = item.route}
                style={{
                  background: w.actionCard?.background || c.bgSurface,
                  padding: w.actionCard?.padding || s.md || '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: w.actionCard?.borderRadius || r.md || '12px',
                  ...actionCardStyle,
                }}
              >
                <div style={{
                  fontSize: w.actionIcon?.fontSize || '28px',
                  marginBottom: w.actionIcon?.marginBottom || '8px',
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: w.actionLabel?.fontSize || f.caption || '12px',
                  fontWeight: w.actionLabel?.fontWeight || 500,
                  color: w.actionLabel?.color || c.textPrimary,
                }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // NOTIFICATION CARD (Dashboard)
    // ──────────────────────────────────────────────
    case "notificationCard": {
      const txt = overrideData?.txt || {};
      const cardStyle = overrideData?.cardStyle || {};
      const title = txt.notifications || useContent(elementConfig.content?.titleKey, "Notifications");
      const emptyText = txt.noNotifications || useContent(elementConfig.content?.emptyKey, "No new notifications");

      return (
        <div style={{
          background: w.notificationsCard?.background || c.bgSurface,
          border: w.notificationsCard?.border || `1px solid ${c.border}`,
          padding: w.notificationsCard?.padding || s.md || '16px',
          borderRadius: w.notificationsCard?.borderRadius || r.md || '12px',
          ...cardStyle,
          ...overrideStyles,
        }}>
          <div style={{
            fontSize: w.notificationsTitle?.fontSize || f.bodySm || '14px',
            fontWeight: w.notificationsTitle?.fontWeight || 600,
            color: w.notificationsTitle?.color || c.textPrimary,
            marginBottom: w.notificationsTitle?.marginBottom || '8px',
          }}>
            {title}
          </div>
          <div style={{
            textAlign: 'center',
            padding: w.notificationsEmpty?.padding || s.md || '16px',
            color: w.notificationsEmpty?.color || c.textSecondary,
            fontSize: w.notificationsEmpty?.fontSize || f.caption || '12px',
          }}>
            {emptyText}
          </div>
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // SCREEN HEADING (Jobs, Earnings, Schedule)
    // ──────────────────────────────────────────────
    case "screenHeading": {
      const title = useContent(elementConfig.content?.titleKey, "");
      const ws = w.jobs?.heading || w.earnings?.heading || w.schedule?.heading || {};

      return (
        <h2 style={{
          fontSize: ws.fontSize || f.heading || '24px',
          fontWeight: ws.fontWeight || 700,
          color: ws.color || c.textPrimary,
          marginBottom: ws.marginBottom || '20px',
          ...overrideStyles,
        }}>
          {title}
        </h2>
      );
    }

    // ──────────────────────────────────────────────
    // JOB CARD (Jobs Screen)
    // ──────────────────────────────────────────────
    case "jobCard": {
      const bookings = overrideData?.bookings || [];
      const statusBadgeKeys = elementConfig.content?.statusBadgeKeys || {};
      const actionButtons = elementConfig.content?.actionButtons || {};

      if (bookings.length === 0) {
        const emptyMsg = useContent("empty.noBookings", "No job requests yet.");
        return (
          <div style={{
            textAlign: 'center',
            padding: w.jobs?.empty?.padding || '40px',
            color: w.jobs?.empty?.color || c.textSecondary,
          }}>
            {emptyMsg}
          </div>
        );
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: w.jobs?.list?.gap || '12px',
        }}>
          {bookings.map((booking) => {
            const statusKey = statusBadgeKeys[booking.status];
            const statusLabel = useContent(statusKey, booking.status);
            const buttons = actionButtons[booking.status] || [];
            const onAction = overrideData?.onAction;

            return (
              <div key={booking.id} style={{
                background: w.jobs?.card?.background || c.bgSurface,
                border: w.jobs?.card?.border || `1px solid ${c.border}`,
                borderRadius: w.jobs?.card?.borderRadius || r.md || '12px',
                padding: w.jobs?.card?.padding || s.md || '16px',
                ...overrideStyles,
              }}>
                {/* Header: name + badge */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: w.jobs?.header?.marginBottom || '8px',
                }}>
                  <span style={{
                    fontWeight: w.jobs?.serviceName?.fontWeight || 600,
                    color: w.jobs?.serviceName?.color || c.textPrimary,
                  }}>
                    {booking.service_name}
                  </span>
                  <span style={{
                    fontSize: w.statusBadge?.fontSize || f.caption || '12px',
                    fontWeight: w.statusBadge?.fontWeight || 700,
                    padding: w.statusBadge?.padding || '2px 10px',
                    borderRadius: w.statusBadge?.borderRadius || '12px',
                    background: booking.status === 'pending'
                      ? (w.statusPending?.background || '#FED7AA')
                      : (w.statusOther?.background || '#DBEAFE'),
                    color: booking.status === 'pending'
                      ? (w.statusPending?.color || c.accentOrange)
                      : (w.statusOther?.color || c.accentBlue),
                  }}>
                    {statusLabel}
                  </span>
                </div>

                {/* Info */}
                <div style={{
                  fontSize: w.jobs?.info?.fontSize || f.bodySm || '14px',
                  color: w.jobs?.info?.color || c.textSecondary,
                  marginBottom: w.jobs?.info?.marginBottom || '12px',
                }}>
                  Customer: {booking.customer_name} | {booking.job_size}
                </div>

                {/* Action buttons */}
                {buttons.length > 0 && (
                  <div style={{ display: 'flex', gap: w.jobs?.actions?.gap || '8px' }}>
                    {buttons.map((btn, i) => {
                      const btnLabel = useContent(btn.labelKey, btn.action);
                      const isAccept = btn.action === 'accept';
                      const isReject = btn.action === 'reject';
                      const isComplete = btn.action === 'completed';
                      return (
                        <button
                          key={i}
                          onClick={() => onAction && onAction(booking.id, btn.action)}
                          style={{
                            padding: w.btnAccept?.padding || '8px 16px',
                            borderRadius: w.btnAccept?.borderRadius || r.sm || '8px',
                            border: isReject
                              ? (w.btnReject?.border || `1px solid ${c.border}`)
                              : 'none',
                            background: isAccept || isComplete
                              ? (w.btnAccept?.background || c.accentGreen)
                              : isReject
                                ? (w.btnReject?.background || 'transparent')
                                : (w.btnAction?.background || c.accentBlue),
                            color: isReject
                              ? (w.btnReject?.color || c.textSecondary)
                              : '#fff',
                            cursor: 'pointer',
                            fontSize: w.btnAccept?.fontSize || f.bodySm || '14px',
                            fontWeight: w.btnAccept?.fontWeight || 600,
                          }}
                        >
                          {btnLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // EARNINGS HERO CARD (Earnings Screen)
    // ──────────────────────────────────────────────
    case "earningsHero": {
      const earnings = overrideData?.earnings || {};
      const label = useContent(elementConfig.content?.labelKey, "Total Earnings");
      const subLabel = useContent(elementConfig.content?.subLabelKey, "completed jobs");
      const amount = earnings[elementConfig.content?.amountField] || 0;
      const count = earnings[elementConfig.content?.subField] || 0;
      const we = w.earnings || {};

      return (
        <div style={{
          background: we.hero?.background || `linear-gradient(135deg, ${c.accentBlue}, #1A56DB)`,
          borderRadius: we.hero?.borderRadius || r.lg || '16px',
          padding: we.hero?.padding || s.spacious || '24px',
          marginBottom: we.hero?.marginBottom || '20px',
          color: '#fff',
          ...overrideStyles,
        }}>
          <div style={{
            fontSize: we.heroLabel?.fontSize || f.bodySm || '14px',
            opacity: we.heroLabel?.opacity || 0.8,
            marginBottom: we.heroLabel?.marginBottom || '4px',
          }}>
            {label}
          </div>
          <div style={{
            fontSize: we.heroAmount?.fontSize || f.xxl || '32px',
            fontWeight: we.heroAmount?.fontWeight || 800,
          }}>
            Rs {amount.toLocaleString()}
          </div>
          <div style={{
            fontSize: we.heroSub?.fontSize || f.bodySm || '14px',
            opacity: we.heroSub?.opacity || 0.8,
            marginTop: we.heroSub?.marginTop || '8px',
          }}>
            {count} {subLabel}
          </div>
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // SECTION HEADING (e.g., "Job History")
    // ──────────────────────────────────────────────
    case "sectionHeading": {
      const title = useContent(elementConfig.content?.titleKey, "");
      const we = w.earnings || {};

      return (
        <h3 style={{
          fontSize: we.subheading?.fontSize || f.title || '20px',
          fontWeight: we.subheading?.fontWeight || 700,
          color: we.subheading?.color || c.textPrimary,
          marginBottom: we.subheading?.marginBottom || '12px',
          ...overrideStyles,
        }}>
          {title}
        </h3>
      );
    }

    // ──────────────────────────────────────────────
    // JOB HISTORY ITEM (Earnings — completed jobs)
    // ──────────────────────────────────────────────
    case "jobHistoryItem": {
      const completedJobs = overrideData?.bookings || [];
      const we = w.earnings || {};

      if (completedJobs.length === 0) {
        const emptyMsg = useContent("worker.noCompletedJobs", "No completed jobs yet.");
        return (
          <div style={{
            textAlign: 'center',
            padding: we.empty?.padding || '40px',
            color: we.empty?.color || c.textSecondary,
          }}>
            {emptyMsg}
          </div>
        );
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: we.list?.gap || '8px',
          ...overrideStyles,
        }}>
          {completedJobs.map((job) => (
            <div key={job.id} style={{
              background: we.jobItem?.background || c.bgSurface,
              border: we.jobItem?.border || `1px solid ${c.border}`,
              borderRadius: we.jobItem?.borderRadius || r.md || '12px',
              padding: we.jobItem?.padding || '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontWeight: we.jobName?.fontWeight || 600,
                  color: we.jobName?.color || c.textPrimary,
                  fontSize: we.jobName?.fontSize || f.body || '16px',
                }}>
                  {job.service_name}
                </div>
                <div style={{
                  fontSize: we.jobMeta?.fontSize || f.bodySm || '14px',
                  color: we.jobMeta?.color || c.textSecondary,
                }}>
                  {job.customer_name} · {job.job_size}
                </div>
              </div>
              <div style={{
                fontSize: we.jobPrice?.fontSize || f.body || '16px',
                fontWeight: we.jobPrice?.fontWeight || 700,
                color: we.jobPrice?.color || c.accentGreen,
              }}>
                Rs {job.price || 0}
              </div>
            </div>
          ))}
        </div>
      );
    }

        // ──────────────────────────────────────────────
    // DAY SCHEDULE CARD (Phase 12 — Dynamic Time Slots)
    // Worker can add/remove multiple start-end time ranges per day.
    // ──────────────────────────────────────────────
    case "dayScheduleCard": {
      const days = elementConfig.content?.days || [];
      const schedule = overrideData?.schedule || [];
      const onSave = overrideData?.onSaveSchedule;
      const addSlotLabel = useContent("worker.schedule.addSlot", "+ Add Time Slot");
      const startLabel = useContent("worker.schedule.startTime", "Start");
      const endLabel = useContent("worker.schedule.endTime", "End");
      const removeLabel = useContent("worker.schedule.remove", "×");
      const ws = w.schedule || {};
      const wts = ws.timeSlots || {};
      const maxSlots = elementConfig.content?.maxSlotsPerDay || 5;

      // Get time slots for a specific day
      const getDaySlots = (dayIndex) => {
        const day = schedule.find(s => s.day_of_week === dayIndex);
        return day?.slots || [];
      };

      // Update slots for a day
      const updateDaySlots = (dayIndex, newSlots) => {
        const updated = schedule.map(s =>
          s.day_of_week === dayIndex ? { ...s, slots: newSlots } : s
        );
        // If day doesn't exist yet, add it
        if (!updated.find(s => s.day_of_week === dayIndex)) {
          updated.push({ day_of_week: dayIndex, slots: newSlots });
        }
        onSave?.(updated);
      };

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: ws.list?.gap || '10px',
        }}>
          {days.map((day, dayIndex) => {
            const daySlots = getDaySlots(dayIndex);
            return (
              <div key={day} style={{
                background: ws.dayCard?.background || c.bgSurface,
                border: ws.dayCard?.border || `1px solid ${c.border}`,
                borderRadius: ws.dayCard?.borderRadius || r.md || '12px',
                padding: ws.dayCard?.padding || '12px',
              }}>
                <div style={{
                  fontSize: ws.dayName?.fontSize || f.body || '16px',
                  fontWeight: ws.dayName?.fontWeight || 600,
                  color: ws.dayName?.color || c.textPrimary,
                  marginBottom: ws.dayName?.marginBottom || '8px',
                }}>
                  {day}
                </div>

                {/* Time slot rows */}
                {daySlots.map((slot, slotIdx) => (
                  <div key={slotIdx} style={{
                    display: wts.slotRow?.display || 'flex',
                    alignItems: wts.slotRow?.alignItems || 'center',
                    gap: wts.slotRow?.gap || '8px',
                    padding: wts.slotRow?.padding || '6px 0',
                  }}>
                    <span style={{
                      fontSize: wts.timeLabel?.fontSize || f.bodySm || '14px',
                      color: wts.timeLabel?.color || c.textSecondary,
                    }}>
                      {startLabel}:
                    </span>
                    <input
                      type="time"
                      value={slot.start || ''}
                      onChange={(e) => {
                        const updated = [...daySlots];
                        updated[slotIdx] = { ...updated[slotIdx], start: e.target.value };
                        updateDaySlots(dayIndex, updated);
                      }}
                      style={{
                        padding: wts.timeInput?.padding || '6px 10px',
                        borderRadius: wts.timeInput?.borderRadius || r.sm || '8px',
                        border: wts.timeInput?.border || `1px solid ${c.border}`,
                        fontSize: wts.timeInput?.fontSize || f.bodySm || '14px',
                        background: wts.timeInput?.background || c.bgSurface,
                        color: wts.timeInput?.color || c.textPrimary,
                        width: wts.timeInput?.width || '100px',
                      }}
                    />
                    <span style={{
                      fontSize: wts.timeLabel?.fontSize || f.bodySm || '14px',
                      color: wts.timeLabel?.color || c.textSecondary,
                    }}>
                      {endLabel}:
                    </span>
                    <input
                      type="time"
                      value={slot.end || ''}
                      onChange={(e) => {
                        const updated = [...daySlots];
                        updated[slotIdx] = { ...updated[slotIdx], end: e.target.value };
                        updateDaySlots(dayIndex, updated);
                      }}
                      style={{
                        padding: wts.timeInput?.padding || '6px 10px',
                        borderRadius: wts.timeInput?.borderRadius || r.sm || '8px',
                        border: wts.timeInput?.border || `1px solid ${c.border}`,
                        fontSize: wts.timeInput?.fontSize || f.bodySm || '14px',
                        background: wts.timeInput?.background || c.bgSurface,
                        color: wts.timeInput?.color || c.textPrimary,
                        width: wts.timeInput?.width || '100px',
                      }}
                    />
                    <button
                      onClick={() => {
                        const updated = daySlots.filter((_, i) => i !== slotIdx);
                        updateDaySlots(dayIndex, updated);
                      }}
                      style={{
                        padding: wts.removeBtn?.padding || '4px 8px',
                        borderRadius: wts.removeBtn?.borderRadius || r.sm || '8px',
                        border: wts.removeBtn?.border || `1px solid ${c.accentRed}`,
                        background: 'transparent',
                        color: wts.removeBtn?.color || c.accentRed,
                        fontSize: wts.removeBtn?.fontSize || f.caption || '12px',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      {removeLabel}
                    </button>
                  </div>
                ))}

                {/* Add slot button or max reached message */}
                {daySlots.length < maxSlots ? (
                  <button
                    onClick={() => {
                      const updated = [...daySlots, { start: '', end: '' }];
                      updateDaySlots(dayIndex, updated);
                    }}
                    style={{
                      padding: wts.addSlotBtn?.padding || '6px 12px',
                      borderRadius: wts.addSlotBtn?.borderRadius || r.sm || '8px',
                      border: wts.addSlotBtn?.border || `1px dashed ${c.border}`,
                      background: 'transparent',
                      color: wts.addSlotBtn?.color || c.accentBlue,
                      fontSize: wts.addSlotBtn?.fontSize || f.bodySm || '14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      width: '100%',
                      marginTop: wts.addSlotBtn?.marginTop || '4px',
                    }}
                  >
                    {addSlotLabel}
                  </button>
                ) : (
                  <div style={{
                    fontSize: wts.maxReached?.fontSize || f.caption || '12px',
                    color: wts.maxReached?.color || c.textSecondary,
                    textAlign: 'center',
                    padding: wts.maxReached?.padding || '4px',
                  }}>
                    Max {maxSlots} slots per day
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

        // ──────────────────────────────────────────────
    // SCREEN HEADER WITH ACTION BUTTON (Profile)
    // ──────────────────────────────────────────────
    case "screenHeaderWithAction": {
      const title = useContent(elementConfig.content?.titleKey, "My Profile");
      const editLabel = useContent(elementConfig.content?.editButtonKey, "Edit");
      const saveLabel = useContent(elementConfig.content?.saveButtonKey, "Save");
      const savingLabel = useContent(elementConfig.content?.savingButtonKey, "Saving...");
      const wp = w.profile || {};

      const isEditing = overrideData?.isEditing ?? false;
      const isSaving = overrideData?.isSaving ?? false;
      const onEdit = overrideData?.onEdit;
      const onSave = overrideData?.onSave;

      // Determine button label based on state
      let buttonLabel = editLabel;
      if (isEditing && isSaving) buttonLabel = savingLabel;
      else if (isEditing) buttonLabel = saveLabel;

      return (
        <div style={{
          display: wp.header?.display || 'flex',
          justifyContent: wp.header?.justifyContent || 'space-between',
          alignItems: wp.header?.alignItems || 'center',
          marginBottom: wp.header?.marginBottom || '20px',
          ...overrideStyles,
        }}>
          <h2 style={{
            fontSize: wp.heading?.fontSize || f.heading || '24px',
            fontWeight: wp.heading?.fontWeight || 700,
            color: wp.heading?.color || c.textPrimary,
          }}>
            {title}
          </h2>
          <button
            onClick={() => isEditing ? onSave?.() : onEdit?.()}
            style={{
              padding: wp.editBtn?.padding || '8px 16px',
              borderRadius: wp.editBtn?.borderRadius || r.sm || '8px',
              border: 'none',
              background: isEditing
                ? (wp.editBtnSave?.background || c.accentGreen)
                : (wp.editBtnEdit?.background || c.accentBlue),
              color: '#fff',
              fontSize: wp.editBtn?.fontSize || f.bodySm || '14px',
              fontWeight: wp.editBtn?.fontWeight || 600,
              cursor: 'pointer',
            }}
          >
            {buttonLabel}
          </button>
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // AVATAR (Profile)
    // ──────────────────────────────────────────────
    case "avatar": {
  const profile = overrideData?.profile || {};
  const name = profile.name || "W";
  const email = profile.email || "";
  const photoUrl = profile.photo_url || null;
  const wp = w.profile || {};

  return (
    <div style={{
      display: wp.avatarRow?.display || 'flex',
      alignItems: wp.avatarRow?.alignItems || 'center',
      gap: wp.avatarRow?.gap || '16px',
      marginBottom: wp.avatarRow?.marginBottom || '16px',
      ...overrideStyles,
    }}>
      {/* Avatar: photo if exists, otherwise initial letter */}
      <div style={{
        width: wp.avatar?.width || '64px',
        height: wp.avatar?.height || '64px',
        borderRadius: wp.avatar?.borderRadius || '50%',
        background: photoUrl ? 'transparent' : (wp.avatar?.background || c.accentBlueLight),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: wp.avatar?.fontSize || '28px',
        fontWeight: wp.avatar?.fontWeight || 700,
        color: wp.avatar?.color || c.accentBlue,
        overflow: 'hidden',
      }}>
        {photoUrl ? (
          <img src={photoUrl} alt={name} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }} />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <div>
        <div style={{
          fontSize: wp.name?.fontSize || f.large || '18px',
          fontWeight: wp.name?.fontWeight || 700,
          color: wp.name?.color || c.textPrimary,
        }}>
          {name}
        </div>
        <div style={{
          fontSize: wp.email?.fontSize || f.bodySm || '14px',
          color: wp.email?.color || c.textSecondary,
        }}>
          {email}
        </div>
      </div>
    </div>
  );
}

    // ──────────────────────────────────────────────
    // EDITABLE FIELD GROUP (Profile)
    // ──────────────────────────────────────────────
    case "editableFieldGroup": {
      const profile = overrideData?.profile || {};
      const fields = elementConfig.content?.fields || [];
      const isEditing = overrideData?.isEditing ?? false;
      const wp = w.profile || {};

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: wp.fieldGroup?.gap || '12px',
          ...overrideStyles,
        }}>
          {fields.map((field, idx) => {
            const label = useContent(field.labelKey, field.name);
            const value = profile[field.name] || '';

            return (
              <div key={idx}>
                <div style={{
                  fontSize: wp.fieldLabel?.fontSize || f.bodySm || '14px',
                  fontWeight: wp.fieldLabel?.fontWeight || 600,
                  color: wp.fieldLabel?.color || c.textSecondary,
                  marginBottom: wp.fieldLabel?.marginBottom || '4px',
                }}>
                  {label}
                </div>
                {isEditing ? (
                  field.type === 'textarea' ? (
                    <textarea defaultValue={value} rows={3} style={{
                      padding: wp.fieldTextarea?.padding || '8px 10px',
                      borderRadius: wp.fieldTextarea?.borderRadius || r.sm || '8px',
                      border: wp.fieldTextarea?.border || `1px solid ${c.border}`,
                      width: '100%',
                      fontSize: wp.fieldTextarea?.fontSize || f.body || '16px',
                      resize: 'vertical',
                    }} />
                  ) : (
                    <input defaultValue={value} type={field.type === 'number' ? 'number' : 'text'} style={{
                      padding: wp.fieldInput?.padding || '8px 10px',
                      borderRadius: wp.fieldInput?.borderRadius || r.sm || '8px',
                      border: wp.fieldInput?.border || `1px solid ${c.border}`,
                      width: '100%',
                      fontSize: wp.fieldInput?.fontSize || f.body || '16px',
                    }} />
                  )
                ) : (
                  <div style={{
                    color: wp.fieldValue?.color || c.textPrimary,
                    fontSize: wp.fieldValue?.fontSize || f.body || '16px',
                  }}>
                    {field.name === 'skills'
                      ? (Array.isArray(value) && value.length > 0
                          ? value.map((s, i) => (
                              <span key={i} style={{
                                padding: wp.skillTag?.padding || '4px 10px',
                                borderRadius: wp.skillTag?.borderRadius || '12px',
                                background: wp.skillTag?.background || c.accentBlueLight,
                                color: wp.skillTag?.color || c.accentBlue,
                                fontSize: wp.skillTag?.fontSize || f.bodySm || '14px',
                                fontWeight: wp.skillTag?.fontWeight || 500,
                                marginRight: '6px',
                              }}>{s}</span>
                            ))
                          : 'No skills added')
                      : value || 'Not set'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // STATS ROW (Profile bottom)
    // ──────────────────────────────────────────────
    case "statsRow": {
      const profile = overrideData?.profile || {};
      const stats = elementConfig.content?.stats || [];
      const wp = w.profile || {};

      return (
        <div style={{
          display: 'flex',
          gap: wp.statsRow?.gap || '10px',
          ...overrideStyles,
        }}>
          {stats.map((stat, idx) => {
            const label = useContent(stat.labelKey, stat.labelKey);
            let value = profile[stat.valueField] ?? 0;

            if (stat.format === 'currency') {
              value = `Rs ${(value || 0).toLocaleString()}`;
            } else if (stat.format === 'onlineStatus') {
              value = value ? '🟢' : '🔴';
            }

            return (
              <div key={idx} style={{
                flex: 1,
                background: wp.statCard?.background || c.bgSurface,
                border: wp.statCard?.border || `1px solid ${c.border}`,
                borderRadius: wp.statCard?.borderRadius || r.md || '12px',
                padding: wp.statCard?.padding || '14px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: wp.statValue?.fontSize || f.large || '18px',
                  fontWeight: wp.statValue?.fontWeight || 800,
                  color: stat.color === 'accentGreen'
                    ? c.accentGreen
                    : stat.color === 'statusBased'
                      ? (profile.is_online ? c.accentGreen : c.accentRed)
                      : c.accentBlue,
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: wp.statLabel?.fontSize || f.caption || '12px',
                  color: wp.statLabel?.color || c.textSecondary,
                }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // EMPTY STATE (generic)
    // ──────────────────────────────────────────────
    case "emptyState": {
      const message = useContent(elementConfig.content?.messageKey, "Nothing to show");
      return (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: c.textSecondary,
          ...overrideStyles,
        }}>
          {message}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // STATUS TEXT (saving indicator, etc.)
    // ──────────────────────────────────────────────
    case "statusText": {
      const message = useContent(elementConfig.content?.messageKey || elementConfig.content?.savingKey, "");
      const ws = w.schedule || {};
      return (
        <div style={{
          textAlign: 'center',
          marginTop: ws.saving?.marginTop || '12px',
          color: ws.saving?.color || c.textSecondary,
          fontSize: ws.saving?.fontSize || f.bodySm || '14px',
          ...overrideStyles,
        }}>
          {message}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // SKILL TAG (reusable)
    // ──────────────────────────────────────────────
    case "skillTag": {
      const label = useContent(elementConfig.content?.labelKey, elementConfig.content?.label || "");
      const wp = w.profile || {};
      return (
        <span style={{
          padding: wp.skillTag?.padding || '4px 10px',
          borderRadius: wp.skillTag?.borderRadius || '12px',
          background: wp.skillTag?.background || c.accentBlueLight,
          color: wp.skillTag?.color || c.accentBlue,
          fontSize: wp.skillTag?.fontSize || f.bodySm || '14px',
          fontWeight: wp.skillTag?.fontWeight || 500,
          ...overrideStyles,
        }}>
          {label}
        </span>
      );
    }

        // ──────────────────────────────────────────────
    // SUBTAB CONTAINER (Phase 12 — Schedule)
    // Renders a tab bar + active subtab content.
    // Admin can add/remove/reorder subtabs.
    // ──────────────────────────────────────────────
    case "subtabContainer": {
      const subtabs = elementConfig.content?.defaultSubtabs || [];
      const addLabel = useContent("worker.schedule.addSlot", "+");
      const ws = w.schedule?.subtabs || {};
      const [activeTabId, setActiveTabId] = React.useState(subtabs[0]?.id || null);



      return (
        <div>
          {/* Subtab bar */}
          <div style={{
            display: ws.bar?.display || 'flex',
            gap: ws.bar?.gap || '4px',
            marginBottom: ws.bar?.marginBottom || '20px',
            borderBottom: ws.bar?.borderBottom || `2px solid ${c.border}`,
            paddingBottom: ws.bar?.paddingBottom || '0',
            overflowX: 'auto',
            flexWrap: 'nowrap',
          }}>
            {subtabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const label = useContent(tab.labelKey, tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  style={{
                    padding: ws.tab?.padding || '10px 18px',
                    fontSize: ws.tab?.fontSize || f.bodySm || '14px',
                    fontWeight: isActive ? (ws.tabActive?.fontWeight || 600) : (ws.tab?.fontWeight || 500),
                    color: isActive ? (ws.tabActive?.color || c.accentBlue) : (ws.tab?.color || c.textSecondary),
                    background: ws.tab?.background || 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${isActive ? (ws.tabActive?.borderBottomColor || c.accentBlue) : 'transparent'}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    marginBottom: '-2px',
                  }}
                >
                  {label}
                </button>
              );
            })}

                        {/* Add tab button — only visible in admin panel */}
            {overrideData?.isAdmin && (
              <button
                style={{
                  padding: ws.addButton?.padding || '10px 14px',
                  fontSize: ws.addButton?.fontSize || '18px',
                  fontWeight: ws.addButton?.fontWeight || 600,
                  color: ws.addButton?.color || c.textSecondary,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: ws.addButton?.opacity || 0.6,
                }}
                title="Add new subtab"
              >
                +
              </button>
            )}
          </div>
          
          {/* Active subtab content */}
          <div>
            {subtabs.map((tab) => {
              if (tab.id !== activeTabId) return null;

              // If tab has no elementId (admin-added empty container)
              if (!tab.elementId) {
                const emptyText = useContent("worker.schedule.empty", "Configure this section from the Admin Panel.");
                return (
                  <div key={tab.id} style={{
                    textAlign: ws.emptySubtab?.textAlign || 'center',
                    padding: ws.emptySubtab?.padding || '40px',
                    color: ws.emptySubtab?.color || c.textSecondary,
                    fontSize: ws.emptySubtab?.fontSize || f.body || '16px',
                    border: ws.emptySubtab?.border || `2px dashed ${c.border}`,
                    borderRadius: ws.emptySubtab?.borderRadius || r.md || '12px',
                    background: ws.emptySubtab?.background || c.bgSurface,
                  }}>
                    {emptyText}
                  </div>
                );
              }

              // Render the subtab's target element
              return (
                <ElementRenderer
                  key={tab.id}
                  elementId={tab.elementId}
                  overrideData={overrideData}
                />
              );
            })}
          </div>
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // SERVICE TABLE (Phase 12 — Schedule)
    // Editable table for worker services.
    // Columns configurable by admin via registry.
    // ──────────────────────────────────────────────
    case "serviceTable": {
      const columns = elementConfig.content?.columns || [];
      const services = overrideData?.services || [];
      const addLabel = useContent(elementConfig.content?.addLabelKey, "+ Add Service");
      const removeLabel = useContent(elementConfig.content?.removeLabelKey, "Remove");
      const onSave = overrideData?.onSaveServices;
      const ws = w.schedule?.services || {};

      // Category options from registry
      const getCategoryLabel = (value) => {
        const col = columns.find(c => c.id === 'category');
        const opt = col?.options?.find(o => o.value === value);
        return useContent(opt?.labelKey, value);
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: ws.table?.gap || '8px' }}>
          {/* Header row */}
          <div style={{
            display: 'flex',
            gap: ws.header?.gap || '8px',
            padding: ws.header?.padding || '8px 12px',
            background: ws.header?.background || c.bgSurface2,
            borderRadius: ws.header?.borderRadius || r.sm || '8px',
            fontWeight: ws.header?.fontWeight || 600,
            fontSize: ws.header?.fontSize || f.bodySm || '14px',
            color: ws.header?.color || c.textSecondary,
          }}>
            {columns.map((col) => (
              <span key={col.id} style={{ flex: 1, minWidth: 0 }}>
                {useContent(col.labelKey, col.id)}
              </span>
            ))}
            <span style={{ width: '50px', flexShrink: 0 }}></span>
          </div>

          {/* Data rows */}
          {services.map((service, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: ws.row?.gap || '8px',
              padding: ws.row?.padding || '10px 12px',
              background: ws.row?.background || c.bgSurface,
              border: ws.row?.border || `1px solid ${c.border}`,
              borderRadius: ws.row?.borderRadius || r.md || '12px',
              alignItems: 'center',
            }}>
              {columns.map((col) => {
                if (col.type === 'toggle') {
                  const isActive = service[col.id] !== false;
                  return (
                    <div key={col.id} style={{ flex: 1, minWidth: 0 }}>
                      <button
                        onClick={() => {
                          const updated = [...services];
                          updated[idx] = { ...updated[idx], [col.id]: !isActive };
                          onSave?.(updated);
                        }}
                        style={{
                          width: ws.toggle?.width || '40px',
                          height: ws.toggle?.height || '22px',
                          borderRadius: ws.toggle?.borderRadius || '11px',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          background: isActive
                            ? (ws.toggleActive?.background || c.accentGreen)
                            : (ws.toggleInactive?.background || c.border),
                        }}
                      >
                        <span style={{
                          width: ws.toggleDot?.width || '18px',
                          height: ws.toggleDot?.height || '18px',
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          top: '2px',
                          left: isActive ? '20px' : '2px',
                          transition: 'left 0.2s',
                        }} />
                      </button>
                    </div>
                  );
                }

                if (col.type === 'select') {
                  return (
                    <select
                      key={col.id}
                      value={service[col.id] || ''}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx] = { ...updated[idx], [col.id]: e.target.value };
                        onSave?.(updated);
                      }}
                      style={{
                        padding: ws.select?.padding || '6px 8px',
                        borderRadius: ws.select?.borderRadius || r.sm || '8px',
                        border: ws.select?.border || `1px solid ${c.border}`,
                        fontSize: ws.select?.fontSize || f.bodySm || '14px',
                        background: ws.select?.background || c.bgSurface,
                        color: ws.select?.color || c.textPrimary,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {(col.options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {useContent(opt.labelKey, opt.value)}
                        </option>
                      ))}
                    </select>
                  );
                }

                // Default: text or number input
                return (
                  <input
                    key={col.id}
                    type={col.type || 'text'}
                    value={service[col.id] || ''}
                    placeholder={useContent(col.labelKey, '')}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[idx] = { ...updated[idx], [col.id]: col.type === 'number' ? Number(e.target.value) : e.target.value };
                      onSave?.(updated);
                    }}
                    style={{
                      padding: ws.input?.padding || '6px 8px',
                      borderRadius: ws.input?.borderRadius || r.sm || '8px',
                      border: ws.input?.border || `1px solid ${c.border}`,
                      fontSize: ws.input?.fontSize || f.bodySm || '14px',
                      background: ws.input?.background || c.bgSurface,
                      color: ws.input?.color || c.textPrimary,
                      flex: 1,
                      minWidth: 0,
                    }}
                  />
                );
              })}

              {/* Remove button */}
              <button
                onClick={() => {
                  const updated = services.filter((_, i) => i !== idx);
                  onSave?.(updated);
                }}
                style={{
                  padding: ws.removeBtn?.padding || '4px 8px',
                  borderRadius: ws.removeBtn?.borderRadius || r.sm || '8px',
                  border: ws.removeBtn?.border || `1px solid ${c.accentRed}`,
                  background: 'transparent',
                  color: ws.removeBtn?.color || c.accentRed,
                  fontSize: ws.removeBtn?.fontSize || f.caption || '12px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {removeLabel}
              </button>
            </div>
          ))}

          {/* Add row button */}
          <button
            onClick={() => {
              const newRow = {};
              columns.forEach((col) => {
                newRow[col.id] = col.type === 'toggle' ? true : col.type === 'number' ? 0 : '';
              });
              const updated = [...services, newRow];
              onSave?.(updated);
            }}
            style={{
              padding: ws.addBtn?.padding || '6px 12px',
              borderRadius: ws.addBtn?.borderRadius || r.sm || '8px',
              border: ws.addBtn?.border || `1px dashed ${c.border}`,
              background: 'transparent',
              color: ws.addBtn?.color || c.accentBlue,
              fontSize: ws.addBtn?.fontSize || f.bodySm || '14px',
              cursor: 'pointer',
              fontWeight: 500,
              width: '100%',
            }}
          >
            {addLabel}
          </button>
        </div>
      );
    }


    // ──────────────────────────────────────────────
    // UNKNOWN TYPE — safe fallback
    // ──────────────────────────────────────────────
    default: {
      console.warn(`[ElementRenderer] Unknown type: "${elementConfig.type}" for element: "${elementId}"`);
      return null;
    }
  }
};

export default ElementRenderer;