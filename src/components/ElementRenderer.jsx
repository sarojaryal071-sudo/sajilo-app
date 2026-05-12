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
import { useNavigate } from 'react-router-dom';   // ← ADD THIS
import visualIdentityRegistry from "../config/visualIdentityRegistry.js";
import config from "../config/ui/configResolver.js";
import { useStyle } from "../hooks/useStyle.js";
import { useContent } from "../hooks/useContent.js";
import { resolveBookingActions } from '../utils/bookingActionResolver.js'
import ActionButtonGroup from './renderers/ActionButtonGroup.jsx'
import { dispatchBookingCommand } from '../utils/bookingCommandDispatcher.js';
import { api } from '../services/api.js';
import ReviewModal from './reviews/ReviewModal.jsx';
import { formatDateSeparator } from '../utils/dateGrouping.js';
import { getPaymentStatusConfig, getPaymentMethodLabel } from '../config/paymentRegistry.js';
import InvoiceOverlay from './reviews/InvoiceOverlay.jsx';
import WorkerInvoiceOverlay from './reviews/WorkerInvoiceOverlay.jsx';

function JobRow({ booking, statusBadgeKeys, onAction, w, c, r, s, overrideStyles }) {
  const statusKey = statusBadgeKeys[booking.status]
  const statusLabel = useContent(statusKey, booking.status)

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
          fontSize: w.statusBadge?.fontSize || 'var(--font-body-sm)',
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
        fontSize: w.jobs?.info?.fontSize || 'var(--font-body-sm)',
        color: w.jobs?.info?.color || c.textSecondary,
        marginBottom: w.jobs?.info?.marginBottom || '12px',
      }}>
        {/* Show selected services if available, otherwise old behavior */}
        {booking.services_snapshot && booking.services_snapshot.length > 0 ? (
          <>
            <strong>Services:</strong>{' '}
            {booking.services_snapshot.slice(0, 2).map(s => s.label).join(', ')}
            {booking.services_snapshot.length > 2 && ` +${booking.services_snapshot.length - 2} more`}
            <div style={{ fontSize: 'var(--font-body)', fontWeight: 700, color: 'var(--accent-green)', marginTop: 4 }}>
              Rs {parseFloat(booking.booking_total_price || booking.price).toLocaleString()}
            </div>
          </>
        ) : (
          <>
            Customer: {booking.customer_name} | {booking.job_size}
            <div style={{ fontSize: '10px', opacity: 0.7, marginTop: 2 }}>
              Booking #{booking.id}
            </div>
          </>
        )}
      </div>

      {/* Action buttons – Accept/Reject/Start Travel/Complete Job */}
      {resolveBookingActions(booking).length > 0 && (
        <div style={{
          display: 'flex',
          gap: w.jobs?.actions?.gap || '8px',
          marginTop: '10px',
        }}>
          {resolveBookingActions(booking).map((btn, i) => (
            <button
              key={btn.id}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await dispatchBookingCommand({ action: btn.action, bookingId: booking.id });
                } catch (err) {
                  alert(err.message || 'Action failed');
                }
              }}
              style={{
                padding: w.jobs?.actionBtn?.padding || '8px 16px',
                borderRadius: w.jobs?.actionBtn?.borderRadius || '8px',
                border: btn.variant === 'danger' ? `1px solid ${c.border}` : 'none',
                background: btn.variant === 'success' ? c.accentGreen :
                             btn.variant === 'danger' ? 'transparent' : c.accentBlue,
                color: btn.variant === 'danger' ? c.textSecondary : '#fff',
                cursor: 'pointer',
                fontSize: w.jobs?.actionBtn?.fontSize || '14px',
                fontWeight: 600,
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}


            {/* Message button – visible after acceptance */}
            {/* Message button – only while the job is accepted or on‑the‑way */}
      {(booking.status === 'accepted' || booking.status === 'onway') && booking.id && (
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `/inbox?bookingId=${booking.id}`
            }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--accent-blue)',
              background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            💬 Message
          </button>
        </div>
      )}

 </div>
  );
}

console.log('ELEMENT RENDERER VERSION 2 – ' + new Date().toISOString());

const ElementRenderer = ({ elementId, overrideData = {} }) => {
  const [workerInvoiceBooking, setWorkerInvoiceBooking] = React.useState(null);

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
                                {typeof value === 'number' && stat.labelKey !== 'worker.rating' && stat.labelKey !== 'worker.jobsToday'
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
    // JOB CARD (Jobs Screen)
    // ──────────────────────────────────────────────
        // ──────────────────────────────────────────────
    // JOB CARD (Jobs Screen)
    // ──────────────────────────────────────────────
        case "jobCard": {
      const bookings = overrideData?.bookings || [];
      const statusBadgeKeys = elementConfig.content?.statusBadgeKeys || {};
      // Hook called at TOP LEVEL — always executed, regardless of bookings count
      const emptyMsg = useContent("empty.noBookings", "No job requests yet.");

      if (bookings.length === 0) {
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
          {bookings.map((booking) => (
            <JobRow
              key={booking.id}
              booking={booking}
              statusBadgeKeys={statusBadgeKeys}
              onAction={overrideData?.onAction}
              w={w}
              c={c}
              r={r}
              s={s}
              overrideStyles={overrideStyles}
            />
          ))}
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
      const items = overrideData?.bookings || [];
      const we = w.earnings || {};

      const showReward = elementConfig.content?.showRewardPoints === true;
      const rewardRate = elementConfig.content?.rewardPointsRate || 0.1;

      if (items.length === 0) {
        const emptyMsg = useContent("worker.noCompletedJobs", "No completed jobs yet.");
        return (
          <div style={{
            textAlign: 'center',
            padding: we.empty?.padding || '40px',
            color: 'var(--text-secondary)',
          }}>
            {emptyMsg}
          </div>
        );
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((item, idx) => {
            if (item.type === 'dateSeparator') {
              return (
                <div key={`sep-${idx}`} style={{
                  padding: '12px 16px 4px 16px',
                  fontSize: 'var(--font-caption)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border)',
                }}>
                  {formatDateSeparator(item.date)}
                </div>
              );
            }

            const job = item;
            const completedDate = job.updated_at
              ? new Date(job.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '';

            return (
              <div key={job.id} style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
              }}>
                {/* Top line: Booking ID + Service name ··· Amount */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flex: 1,
                    minWidth: 0,
                  }}>
                    <span style={{
                      fontSize: 'var(--font-body-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}>
                      #{job.id}
                    </span>
                    <span style={{
                      fontSize: 'var(--font-body)',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {job.service_name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 'var(--font-body)',
                    fontWeight: 700,
                    color: 'var(--accent-green)',
                    whiteSpace: 'nowrap',
                    marginLeft: 8,
                  }}>
                    Rs {job.price || 0}
                  </span>
                </div>

                {/* Second line: Client ID · Date · Rating (+ Paid badge when paid) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 4,
                  fontSize: 'var(--font-body-sm)',
                  color: 'var(--text-secondary)',
                }}>
                  <span>{job.customer_client_id || '—'}</span>
                  <span>{completedDate}</span>
                  <span>
                    {job.review_rating != null ? '★' + job.review_rating : ''}
                  </span>
                  {/* Show “Paid by …” at the far right when payment is complete */}
                  {overrideData.paymentMap?.[job.id]?.status === 'paid' && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: 'var(--font-caption)',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      whiteSpace: 'nowrap',
                      background: getPaymentStatusConfig('paid').badgeColor,
                      color: getPaymentStatusConfig('paid').textColor,
                    }}>
                      Paid by {getPaymentMethodLabel(overrideData.paymentMap[job.id].method)}
                    </span>
                  )}
                </div>

                {/* Third line: Payment badge + action buttons (only when NOT paid) */}
                {overrideData.paymentMap?.[job.id]?.status !== 'paid' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 8,
                    flexWrap: 'wrap',
                  }}>
                    {/* Completed badge */}
                    <span style={{
                      fontSize: 'var(--font-caption)',
                      color: 'var(--accent-blue)',
                      background: 'var(--accent-blue-light)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}>
                      Completed
                    </span>

                    {/* Payment badge for non‑paid statuses */}
                    {overrideData.paymentMap?.[job.id] && (
                      <span style={{
                        fontSize: 'var(--font-caption)',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        whiteSpace: 'nowrap',
                        background: getPaymentStatusConfig(overrideData.paymentMap[job.id].status).badgeColor,
                        color: getPaymentStatusConfig(overrideData.paymentMap[job.id].status).textColor,
                      }}>
                        {((status) => {
                          const method = getPaymentMethodLabel(overrideData.paymentMap[job.id].method);
                          if (status === 'pending_cash') return `Pay by ${method}`;
                          return `${getPaymentStatusConfig(status).label} · ${method}`;
                        })(overrideData.paymentMap[job.id].status)}
                      </span>
                    )}

                    {/* View Invoice (unpaid) */}
                    {overrideData.paymentMap?.[job.id]?.status === 'unpaid' && (
                      <button
                        onClick={() => setWorkerInvoiceBooking(job)}
                        style={{
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--accent-blue)',
                          background: 'transparent',
                          color: 'var(--accent-blue)',
                          fontSize: 'var(--font-caption)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        View Invoice
                      </button>
                    )}

                    {/* Confirm Cash Received (pending_cash + cash method) */}
                    {overrideData.paymentMap?.[job.id]?.status === 'pending_cash' &&
                     overrideData.paymentMap?.[job.id]?.method === 'cash' && (
                      <button
                        onClick={() => api.markCashPaid(job.id).catch(err => alert(err.message))}
                        style={{
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--accent-green)',
                          background: 'transparent',
                          color: 'var(--accent-green)',
                          fontSize: 'var(--font-caption)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Confirm Cash Received
                      </button>
                    )}
                  </div>
                )}

                {/* Reward points */}
                {showReward && (
                  <div style={{
                    marginTop: 4,
                    fontSize: 'var(--font-caption)',
                    color: 'var(--text-secondary)',
                  }}>
                    Reward Points: {Math.round((job.price || 0) * rewardRate)} pts
                  </div>
                )}
              </div>
            );
          })}

          {/* Worker Invoice Overlay */}
          {workerInvoiceBooking && (
            <WorkerInvoiceOverlay
              payment={overrideData.paymentMap?.[workerInvoiceBooking.id]}
              booking={workerInvoiceBooking}
              onClose={() => setWorkerInvoiceBooking(null)}
              onConfirmed={() => setWorkerInvoiceBooking(null)}
            />
          )}
        </div>
      );
    }

        // ──────────────────────────────────────────────
        // DAY SCHEDULE CARD (Phase 12 — Dynamic Time Slots)
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
    // MAP PLACEHOLDER (Dashboard — Phase 15)
    // ──────────────────────────────────────────────
  case "mapPlaceholder": {
  const activeJob = overrideData?.activeBooking
  const wd = w.dashboard?.mapCard || {}
  const title = useContent("worker.mapPreview", "Service Map")
  const emptyText = useContent("worker.mapEmpty", "Map updates when job accepted")

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: wd.width || '175px',
        height: wd.height || '175px',
        background: activeJob ? (wd.active?.background || 'var(--accent-blue-light)') : (wd.background || 'var(--bg-surface2)'),
        border: activeJob ? (wd.active?.border || '2px solid var(--accent-blue)') : (wd.border || '2px dashed var(--border)'),
        borderRadius: wd.borderRadius || 'var(--radius-lg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        marginBottom: wd.marginBottom || '16px',
        position: 'relative',
        overflow: 'hidden',
        ...overrideStyles,
      }}>
        {activeJob ? (
          <>
            {/* Blinking worker dot */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '30%',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#3B82F6',
              animation: 'blink 1s infinite',
            }} />
            {/* Target pin */}
            <span style={{ fontSize: wd.icon?.fontSize || '40px', opacity: 1 }}>
              📍
            </span>
            <span style={{
              fontSize: wd.title?.fontSize || '11px',
              color: wd.title?.color || 'var(--text-secondary)',
              marginTop: wd.title?.marginTop || '8px',
              textAlign: 'center',
              padding: '0 12px',
              fontWeight: 600
            }}>
              {activeJob.service_name || 'Active Job'}
            </span>
            <span style={{
              fontSize: '9px',
              color: 'var(--text-secondary)',
              marginTop: '2px',
              textAlign: 'center',
              padding: '0 12px'
            }}>
              Customer: {activeJob.customer_name || '…'}
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: wd.icon?.fontSize || '40px', opacity: wd.icon?.opacity || 0.3 }}>
              🗺️
            </span>
            <span style={{
              fontSize: wd.title?.fontSize || '11px',
              color: wd.title?.color || 'var(--text-secondary)',
              marginTop: wd.title?.marginTop || '8px',
              textAlign: 'center',
              padding: '0 12px'
            }}>
              {emptyText}
            </span>
          </>
        )}
      </div>
    </div>
  )
}



    // ──────────────────────────────────────────────
    // ONLINE TOGGLE CARD (Dashboard — Phase 15)
    // ──────────────────────────────────────────────
               case "onlineToggleCard": {
      const isOnline = overrideData?.isOnline ?? false
      const onToggle = overrideData?.onToggle
      const onlineLabel = isOnline ? '🟢 Online' : '🔴 Offline'

      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <button onClick={() => {
            console.log('Toggle clicked, onToggle exists:', !!onToggle)
            onToggle?.()
          }} style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: `2px solid ${isOnline ? 'var(--accent-green)' : 'var(--accent-red)'}`,
            background: isOnline ? 'var(--accent-green-light)' : 'var(--accent-red-light)',
            color: isOnline ? 'var(--accent-green)' : 'var(--accent-red)',
            fontSize: 'var(--font-body-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            {onlineLabel}
          </button>
        </div>
      )
    }

    // ──────────────────────────────────────────────
    // ANALYTICS CHART (Dashboard — Phase 15)
    // ──────────────────────────────────────────────
      case "analyticsChart": {
      const wd = w.dashboard?.analytics || {}
      const title = useContent("worker.analytics", "Analytics")
      const weeklyData = overrideData?.weeklyEarnings || []
      const monthlyData = overrideData?.monthlyEarnings || []
      const chartMode = overrideData?.chartMode || 'weekly'
      const setChartMode = overrideData?.onSetChartMode || (() => {})

      const currentData = chartMode === 'monthly' ? monthlyData : weeklyData
      const hasData = currentData.length > 0 && currentData.some(v => v > 0)

      const [chartType, setChartType] = React.useState('bar')
      const chartColors = wd.chartColors || ['var(--accent-blue)', 'var(--accent-green)', 'var(--accent-orange)', '#8B5CF6', '#EC4899']

      // Day / month labels
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      // Build correct labels based on mode and data length
      const labels = chartMode === 'monthly'
        ? monthlyData.map((_, i) => {
            const d = new Date()
            d.setMonth(d.getMonth() - (monthlyData.length - 1 - i))
            return monthLabels[d.getMonth()]
          })
        : weeklyData.map((_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (weeklyData.length - 1 - i))
            return dayLabels[d.getDay()]
          })

      return (
        <div style={{
          background: wd.background || 'var(--bg-surface)',
          borderRadius: wd.borderRadius || 'var(--radius-lg)',
          padding: wd.padding || '20px',
          marginBottom: wd.marginBottom || '16px',
          boxShadow: wd.boxShadow || '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['bar', 'line', 'pie'].map(type => (
                <button key={type} onClick={() => setChartType(type)} style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                  background: chartType === type ? 'var(--accent-blue)' : 'transparent',
                  color: chartType === type ? '#fff' : 'var(--text-secondary)',
                  fontSize: 'var(--font-caption)', cursor: 'pointer', fontWeight: 500,
                }}>
                  {type === 'bar' ? '📊' : type === 'line' ? '📈' : '🥧'}
                </button>
              ))}
              <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
              {['weekly', 'monthly'].map(mode => (
                <button key={mode} onClick={() => setChartMode(mode)} style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                  background: chartMode === mode ? 'var(--accent-blue)' : 'transparent',
                  color: chartMode === mode ? '#fff' : 'var(--text-secondary)',
                  fontSize: 'var(--font-caption)', cursor: 'pointer', fontWeight: 500,
                }}>
                  {mode === 'weekly' ? 'Week' : 'Month'}
                </button>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {!hasData ? (
            <div style={{
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontSize: 'var(--font-body-sm)',
            }}>
              No earnings data yet
            </div>
          ) : (
            <div style={{ height: '140px', position: 'relative' }}>
              {/* BAR CHART */}
              {chartType === 'bar' && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: '100%', padding: '4px 0' }}>
                  {currentData.map((h, i) => {
                    const maxVal = Math.max(...currentData, 1)
                    const heightPct = (h / maxVal) * 100
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{
                          width: '100%',
                          height: `${heightPct}%`,
                          background: chartColors[i % chartColors.length],
                          borderRadius: '4px 4px 0 0',
                          minHeight: h > 0 ? 2 : 0,
                        }} />
                        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: 4 }}>
                          {labels[i]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* LINE CHART */}
              {chartType === 'line' && (
                <svg width="100%" height="100%" viewBox="0 0 300 140" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={chartColors[0]}
                    strokeWidth="3"
                    points={currentData.map((v, i) => {
                      const maxVal = Math.max(...currentData, 1)
                      const x = (i / (currentData.length - 1 || 1)) * 300
                      const y = 140 - ((v / maxVal) * 100)
                      return `${x},${y}`
                    }).join(' ')}
                  />
                  {currentData.map((v, i) => {
                    const maxVal = Math.max(...currentData, 1)
                    const x = (i / (currentData.length - 1 || 1)) * 300
                    const y = 140 - ((v / maxVal) * 100)
                    return <circle key={i} cx={x} cy={y} r="4" fill={chartColors[i % chartColors.length]} />
                  })}
                </svg>
              )}

              {/* PIE CHART */}
              {chartType === 'pie' && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <svg width="120" height="120" viewBox="0 0 100 100">
                    {currentData.reduce((acc, val, i) => {
                      const total = currentData.reduce((s, x) => s + x, 0)
                      if (total === 0) return acc
                      const slice = (val / total) * 360
                      const start = acc.offset
                      const end = start + slice
                      const x1 = 50 + 40 * Math.cos((start - 90) * Math.PI / 180)
                      const y1 = 50 + 40 * Math.sin((start - 90) * Math.PI / 180)
                      const x2 = 50 + 40 * Math.cos((end - 90) * Math.PI / 180)
                      const y2 = 50 + 40 * Math.sin((end - 90) * Math.PI / 180)
                      const large = slice > 180 ? 1 : 0
                      return {
                        offset: end,
                        elements: [
                          ...acc.elements,
                          <path
                            key={i}
                            d={`M50,50 L${x1},${y1} A40,40 0 ${large},1 ${x2},${y2} Z`}
                            fill={chartColors[i % chartColors.length]}
                          />,
                        ],
                      }
                    }, { offset: 0, elements: [] }).elements}
                    <circle cx="50" cy="50" r="20" fill="var(--bg-surface)" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }


        case "filterTabs": {
      const tabs = elementConfig.content?.tabs || []
      const [activeTab, setActiveTab] = React.useState(tabs.find(t => t.default)?.id || tabs[0]?.id || 'all')
      const wj = w.jobs || {}

      return (
        <div style={{
          display: wj.filters?.display || 'flex',
          gap: wj.filters?.gap || '6px',
          marginBottom: wj.filters?.marginBottom || '16px',
          overflowX: 'auto',
          padding: '4px 0',
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => {
              setActiveTab(tab.id)
              overrideData?.onFilter?.(tab.id)
            }} style={{
              padding: wj.filterTab?.padding || '8px 16px',
              borderRadius: wj.filterTab?.borderRadius || '20px',
              border: wj.filterTab?.border || '1px solid var(--border)',
              background: activeTab === tab.id ? (wj.filterTabActive?.background || 'var(--accent-blue)') : (wj.filterTab?.background || 'transparent'),
              color: activeTab === tab.id ? (wj.filterTabActive?.color || '#fff') : (wj.filterTab?.color || 'var(--text-secondary)'),
              fontSize: wj.filterTab?.fontSize || 'var(--font-body-sm)',
              fontWeight: wj.filterTab?.fontWeight || 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              {useContent(tab.labelKey, tab.id)}
            </button>
          ))}
        </div>
      )
    }



      case "bookingTrackCard": {
  const bookings = overrideData?.bookings || []
  const stages = elementConfig.content?.stages || []
  const wb = w.bookings || {}
  const stageOrder = stages.map(s => s.key)
  const chatAfter = elementConfig.content?.chatEnabledAfter || 'accepted'
  const chatAfterIdx = stageOrder.indexOf(chatAfter)
  const chatDisableAfter = elementConfig.content?.chatDisabledAfter || null
  const chatDisableIdx = chatDisableAfter ? stageOrder.indexOf(chatDisableAfter) : -1
  const trackEnabled = elementConfig.content?.trackEnabled !== false
  const showRewardPoints = elementConfig.content?.showRewardPoints === true
  const rewardRate = elementConfig.content?.rewardPointsRate || 0.1
  const emptyMsg = useContent("bookings.noBookings", "No bookings yet")
  const navigate = useNavigate()
  const userRole = overrideData?.role || 'customer'

  // Local state for in‑card confirmation
  const [confirmCancelId, setConfirmCancelId] = React.useState(null)
  const [reviewBookingId, setReviewBookingId] = React.useState(null)   // ← review modal
  const [invoiceBookingId, setInvoiceBookingId] = React.useState(null) // ← invoice overlay

    const [cancelReasons, setCancelReasons] = React.useState([])
  const [cancelNote, setCancelNote] = React.useState('')
  const toggleReason = (reason) => {
    setCancelReasons(prev => prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason])
  }

  // Pre‑compute all stage labels
  const stageLabels = {}
  stages.forEach(s => { stageLabels[s.key] = useContent(s.labelKey, s.key) })

  if (bookings.length === 0) {
    return (
      <div style={{
        textAlign: wb.trackEmpty?.textAlign || 'center',
        padding: wb.trackEmpty?.padding || '60px',
        color: 'var(--text-secondary)',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
        <p style={{ fontSize: 'var(--font-body)' }}>{emptyMsg}</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {bookings.map((booking, idx) => {
        // ── Date separator ──
        if (booking.type === 'dateSeparator') {
          return (
            <div key={`sep-${idx}`} style={{
              padding: '10px 0 6px 0',
              fontSize: 'var(--font-body-sm)',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              borderBottom: '1px solid var(--border)',
              marginBottom: '4px',
            }}>
              {formatDateSeparator(booking.date)}
            </div>
          );
        }

        const currentIdx = stageOrder.indexOf(booking.status)
        const chatVisible = currentIdx >= chatAfterIdx && (chatDisableIdx === -1 || currentIdx < chatDisableIdx)
        const customerActions = resolveBookingActions(booking, userRole)
        const showCancel = customerActions.length > 0
        const isConfirming = confirmCancelId === booking.id

        return (
          <div key={booking.id} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '12px',
          }}>
            {/* Top row: Service type / Profession ··· Booking ID / Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{
                  fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)',
                  marginBottom: 2
                }}>
                  {booking.job_size ? (booking.job_size.charAt(0).toUpperCase() + booking.job_size.slice(1)) : '–'} · {booking.service_name || '—'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: 'var(--font-caption)', color: 'var(--text-secondary)',
                  fontWeight: 500, marginBottom: 2
                }}>
                  #{booking.id}
                </div>
                <span style={{
                  fontSize: 'var(--font-caption)', fontWeight: 700, padding: '2px 10px',
                  borderRadius: 20,
                  background: booking.status === 'rejected' ? 'var(--accent-red-light)' : 'var(--accent-blue-light)',
                  color: booking.status === 'rejected' ? 'var(--accent-red)' : 'var(--accent-blue)',
                }}>
                  {stageLabels[booking.status] || booking.status}
                </span>
                {/* Payment status badge – only for completed bookings with payment data */}
                {booking.status === 'completed' && overrideData.paymentMap?.[booking.id] && (
                  <span style={{
                    fontSize: 'var(--font-caption)',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: getPaymentStatusConfig(overrideData.paymentMap[booking.id].status).badgeColor,
                    color: getPaymentStatusConfig(overrideData.paymentMap[booking.id].status).textColor,
                    marginLeft: '6px',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    marginTop: '4px',
                  }}>
                    {((status) => {
                      const method = getPaymentMethodLabel(overrideData.paymentMap[booking.id].method);
                      if (status === 'pending_cash') return `Pay by ${method}`;
                      if (status === 'paid') return `Paid by ${method}`;
                      return `${getPaymentStatusConfig(status).label} · ${method}`;
                    })(overrideData.paymentMap[booking.id].status)}
                  </span>
                )}
              </div>
            </div>

            {/* Timeline bar */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: '14px', padding: '0 6px' }}>
              <div style={{
                position: 'absolute', top: '11px', left: '18px', right: '18px', height: '2px',
                background: 'var(--border)', zIndex: 0,
              }} />
              {stages.map((stage, i) => {
                const isDone = i <= currentIdx
                const isCurrent = i === currentIdx
                return (
                  <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: isDone ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                      border: isCurrent ? '3px solid var(--accent-blue)' : isDone ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: isDone ? '#fff' : 'var(--text-secondary)',
                    }}>
                      {stage.icon}
                    </div>
                    <span style={{
                      fontSize: '8px', color: isCurrent ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      fontWeight: isCurrent ? 600 : 400, textAlign: 'center', marginTop: '4px', maxWidth: '40px',
                    }}>
                      {stageLabels[stage.key]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Bottom section: Worker info, price, reward, tracking, message */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              {/* Row 1: Worker ID + Track Worker */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
                    Worker ID:
                  </span>
                  <span style={{ fontWeight: 600, marginLeft: 6, color: 'var(--text-primary)' }}>
                    {booking.worker_client_id || booking.worker_id || '—'}
                  </span>
                </div>
                {trackEnabled && (booking.status === 'accepted' || booking.status === 'onway') && booking.worker_id && (
                  <button
                    onClick={() => navigate(`/tracking/${booking.worker_id}`)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--accent-blue)',
                      background: 'transparent',
                      color: 'var(--accent-blue)',
                      fontSize: 'var(--font-caption)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    📍 Track Worker
                  </button>
                )}
              </div>

              {/* Row 2: Price + Reward points */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
                    Price:
                  </span>
                  <span style={{ fontWeight: 600, marginLeft: 6, color: 'var(--accent-green)' }}>
                    Rs {booking.price || 0}
                  </span>
                </div>
                {showRewardPoints && (
                  <div>
                    <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
                      Reward Points:
                    </span>
                    <span style={{ fontWeight: 600, marginLeft: 6, color: 'var(--text-primary)' }}>
                      {Math.round((booking.price || 0) * rewardRate)} pts
                    </span>
                  </div>
                )}
              </div>

               {/* ── Cancel button (shows overlay popup) ── */}
              {showCancel && (
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  {customerActions.map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => setConfirmCancelId(booking.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--accent-red)',
                        background: 'transparent',
                        color: 'var(--accent-red)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Overlay popup for cancellation ── */}
              {confirmCancelId === booking.id && (
                <>
                  <div
                    onClick={() => {
                      setConfirmCancelId(null)
                      setCancelReasons([])
                      setCancelNote('')
                    }}
                    style={{
                      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(0,0,0,0.35)', zIndex: 9998,
                    }}
                  />
                  <div style={{
                    position: 'fixed', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%', maxWidth: 400,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 24,
                    zIndex: 9999,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }}>
                    <div style={{
                      fontSize: 16, fontWeight: 700,
                      color: 'var(--text-primary)', marginBottom: 14,
                    }}>
                      Cancel your booking?
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
                      Why are you cancelling? (optional)
                    </div>
                    {['Worker not responding','Found another worker','Job no longer needed','Price too high','Changing schedule'].map(reason => (
                      <label key={reason} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 6, fontSize: 13,
                        color: 'var(--text-primary)', cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={cancelReasons.includes(reason)}
                          onChange={() => toggleReason(reason)}
                        />
                        {reason}
                      </label>
                    ))}
                    <textarea
                      value={cancelNote}
                      onChange={e => setCancelNote(e.target.value)}
                      placeholder="Add a note (will help us improve)"
                      rows={2}
                      style={{
                        width: '100%', marginTop: 10, padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-surface2)',
                        color: 'var(--text-primary)', fontSize: 12,
                        resize: 'vertical',
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <button
                        onClick={async () => {
                          try {
                            await dispatchBookingCommand({
                              action: 'cancel',
                              bookingId: confirmCancelId,
                              reason: [...cancelReasons, cancelNote].filter(Boolean).join(', '),
                            })
                            setConfirmCancelId(null)
                            setCancelReasons([])
                            setCancelNote('')
                          } catch (err) {
                            alert(err.message || 'Cancel failed')
                            setConfirmCancelId(null)
                          }
                        }}
                        style={{
                          flex: 1, padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none', background: 'var(--accent-red)',
                          color: '#fff', fontWeight: 600,
                          fontSize: 14, cursor: 'pointer',
                        }}
                      >
                        Confirm cancellation
                      </button>
                      <button
                        onClick={() => {
                          setConfirmCancelId(null)
                          setCancelReasons([])
                          setCancelNote('')
                        }}
                        style={{
                          flex: 1, padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          fontWeight: 600, fontSize: 14,
                          cursor: 'pointer',
                        }}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ── Leave Review button ── */}
              {booking.status === 'completed' && !booking.reviewed && (
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <button
                    onClick={() => setReviewBookingId(booking.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--accent-green)',
                      background: 'transparent',
                      color: 'var(--accent-green)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ⭐ Leave Review
                  </button>
                </div>
              )}

              {/* ── Invoice button (completed bookings with payment data) ── */}
              {booking.status === 'completed' && overrideData.paymentMap?.[booking.id] && (
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <button
                    onClick={() => setInvoiceBookingId(booking.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--accent-blue)',
                      background: 'transparent',
                      color: 'var(--accent-blue)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🧾 Invoice
                  </button>
                </div>
              )}

              {/* ── Review Modal Overlay ── */}
              {reviewBookingId === booking.id && (
                <ReviewModal
                  bookingId={booking.id}
                  workerName={booking.worker_name || 'Worker'}
                  onClose={() => setReviewBookingId(null)}
                  onSubmitted={() => setReviewBookingId(null)}
                />
              )}


              {/* Message button */}
              {chatVisible && (
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (booking.id) {
                        navigate(`/inbox?bookingId=${booking.id}`)
                      }
                    }}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--accent-blue)',
                      background: 'var(--accent-blue-light)',
                      color: 'var(--accent-blue)',
                      fontSize: 'var(--font-body-sm)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    💬 Message
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Invoice overlay for client */}
      {invoiceBookingId && overrideData?.paymentMap?.[invoiceBookingId] && (
        <InvoiceOverlay
          payment={overrideData.paymentMap[invoiceBookingId]}
          booking={bookings.find(b => b.id === invoiceBookingId)}
          onClose={() => setInvoiceBookingId(null)}
          onPaymentCompleted={() => setInvoiceBookingId(null)}
        />
      )}
    </div>
  )
}

        case "dataTable": {
      const columns = (elementConfig.content?.columns || []).filter(c => c.visible).sort((a, b) => a.order - b.order)
      const data = overrideData?.data || []
      const onAction = overrideData?.onAction

      return (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {columns.map(col => (
                  <th key={col.id} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {useContent(col.labelKey, col.id)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {columns.map(col => (
                    <td key={col.id} style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>
                      {col.type === 'actions' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          {row.status === 'pending' && (
                            <>
                              <button onClick={() => onAction?.('approve', row)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: 'var(--accent-green)', color: '#fff', cursor: 'pointer', fontSize: 12 }}>Approve</button>
                              <button onClick={() => onAction?.('reject', row)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: 'var(--accent-red)', color: '#fff', cursor: 'pointer', fontSize: 12 }}>Reject</button>
                            </>
                          )}
                          {row.status === 'active' && (
                            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Active</span>
                          )}
                          {row.status === 'rejected' && (
                            <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>Rejected</span>
                          )}
                        </div>
                      ) : (
                        row[col.id] || '—'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    // ── WORKER SERVICE MANAGER (Phase 11.1) ──────────────
        case "workerServiceManager": {
      console.log('🔥 workerServiceManager FIRED – workerServices:', overrideData?.workerServices);
      const professions = overrideData?.workerServices || [];
      const [activeProfId, setActiveProfId] = React.useState(null);
      const [showAddForm, setShowAddForm] = React.useState(false);
      const [newCustomLabel, setNewCustomLabel] = React.useState('');
      const [newCustomPrice, setNewCustomPrice] = React.useState('');
      const [newCustomNepali, setNewCustomNepali] = React.useState('');
      const [localServices, setLocalServices] = React.useState({});
      const [showChecklist, setShowChecklist] = React.useState(false);
      const [editingPriceId, setEditingPriceId] = React.useState(null);
      const [editPriceValue, setEditPriceValue] = React.useState('');
  const [editingSvcId, setEditingSvcId] = React.useState(null);
  const [editSvcLabel, setEditSvcLabel] = React.useState('');
  const [editSvcNepali, setEditSvcNepali] = React.useState('');
      const [checkedServices, setCheckedServices] = React.useState(new Set());



      const inputStyle = {
        padding: '8px 10px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        background: 'var(--bg-surface2)',
        color: 'var(--text-primary)',
        fontSize: 13,
      };
      const actionBtn = {
        padding: '4px 12px',
        borderRadius: 4,
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--text-primary)',
        fontSize: 11,
        fontWeight: 500,
        cursor: 'pointer',
      };

      React.useEffect(() => {
        if (professions.length > 0 && !activeProfId) {
          setActiveProfId(professions[0].id);
          setLocalServices(prev => ({
            ...prev,
            [professions[0].id]: professions[0].services || [],
          }));
        }
      }, [professions]);

      const activeProf = professions.find(p => p.id === activeProfId);
      const allServices = (localServices[activeProfId] || activeProf?.services || [])
        .filter(s => s.worker_service_id || s.is_custom);

      const activatedIds = new Set(
        allServices.filter(s => s.worker_service_id).map(s => s.service_id)
      );
      // Full catalogue for checklist – show all admin services, grey out activated ones
      const catalogueServices = (localServices[activeProfId] || activeProf?.services || [])
        .filter(s => !s.is_custom);

      const toggleService = async (wsId, isActive) => {
        try {
          await api.updateWorkerService(wsId, { is_active: isActive });
          setLocalServices(prev => {
            const updated = { ...prev };
            const list = updated[activeProfId] || [];
            updated[activeProfId] = list.map(s =>
              s.worker_service_id === wsId ? { ...s, is_active: isActive } : s
            );
            return updated;
          });
        } catch (err) { alert('Failed to update service: ' + err.message); }
      };

      const updatePrice = async (wsId, price) => {
        try {
          await api.updateWorkerService(wsId, { price });
          setLocalServices(prev => {
            const updated = { ...prev };
            const list = updated[activeProfId] || [];
            updated[activeProfId] = list.map(s =>
              s.worker_service_id === wsId ? { ...s, worker_price: price } : s
            );
            return updated;
          });
        } catch (err) { alert('Failed to update price: ' + err.message); }
      };

      const addCustomService = async () => {
        if (!newCustomLabel.trim()) return alert('Please enter a service name');
        const price = parseFloat(newCustomPrice) || 0;
        try {
          const res = await api.createWorkerCustomService({
            profession_id: activeProfId,
            custom_label: newCustomLabel,
            price,
          });
          const created = res?.data;
          if (created) {
            setLocalServices(prev => {
              const updated = { ...prev };
              updated[activeProfId] = [
                ...(updated[activeProfId] || []),
                {
                  service_id: null,
                  label: created.custom_label,
                  is_custom: true,
                  worker_price: created.price,
                  is_active: created.is_active,
                  worker_service_id: created.id,
                  base_price: null,
                },
              ];
              return updated;
            });
          }
          setNewCustomLabel('');
          setNewCustomPrice('');
          setNewCustomNepali('');
          setShowAddForm(false);
        } catch (err) { alert('Failed to add custom service: ' + err.message); }
      };

      const confirmChecklist = async () => {
        if (checkedServices.size === 0) return;
        const promises = Array.from(checkedServices)
          .filter(svcId => !activatedIds.has(svcId))   // don't reactivate
          .map(svcId => api.activateWorkerService(svcId, activeProfId));
        try {
          await Promise.all(promises);
          const res = await api.getMyServices();
          const freshProfs = res?.data?.professions || [];
          setLocalServices(prev => {
            const updated = { ...prev };
            freshProfs.forEach(p => {
              updated[p.id] = p.services || [];
            });
            return updated;
          });
        } catch (err) { alert('Some services could not be activated'); }
        setShowChecklist(false);
        setCheckedServices(new Set());
      };

      const toggleCheck = (svcId) => {
        setCheckedServices(prev => {
          const next = new Set(prev);
          if (next.has(svcId)) next.delete(svcId);
          else next.add(svcId);
          return next;
        });
      };

      return (
        <div style={{ padding: '0 16px' }}>
          {/* Profession pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {professions.map(prof => (
              <button key={prof.id} onClick={() => {
                setActiveProfId(prof.id);
                if (!localServices[prof.id]) {
                  setLocalServices(prev => ({ ...prev, [prof.id]: prof.services || [] }));
                }
              }} style={{
                padding: '8px 16px', borderRadius: 20,
                border: '1px solid var(--border)',
                background: activeProfId === prof.id ? 'var(--accent-blue)' : 'transparent',
                color: activeProfId === prof.id ? '#fff' : 'var(--text-secondary)',
                fontSize: 'var(--font-body-sm)', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {prof.icon && <span style={{ marginRight: 4 }}>{prof.icon}</span>}
                {prof.name}
              </button>
            ))}
          </div>

                    {/* Services list (admin‑style) */}
          <div style={{ marginBottom: 16 }}>
            {allServices.length === 0 && !showAddForm ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--font-body-sm)' }}>
                No services configured yet.
              </div>
            ) : (
              allServices.map((svc, idx) => (
                <div key={svc.worker_service_id || idx} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 0', borderBottom: '1px solid var(--border)',
                  flexWrap: 'wrap',
                }}>
                  {/* Label + Nepali name */}
                  <div style={{ flex: 2, minWidth: 120 }}>
                    <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {svc.label}
                      {svc.is_custom && (
                        <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--accent-blue)', background: 'var(--accent-blue-light)', padding: '2px 6px', borderRadius: 8 }}>
                          Custom
                        </span>
                      )}
                    </div>
                    {svc.label_np && (
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{svc.label_np}</div>
                    )}
                  </div>

                                    {/* Price (inline editable) */}
                  <div style={{ flex: 1, minWidth: 80, textAlign: 'right', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    {editingPriceId === svc.worker_service_id ? (
                      <>
                        <input
                          type="number"
                          value={editPriceValue}
                          onChange={(e) => setEditPriceValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.target.blur();
                            if (e.key === 'Escape') {
                              setEditingPriceId(null);
                              setEditPriceValue('');
                            }
                          }}
                          style={{ ...inputStyle, width: 80, textAlign: 'right' }}
                          autoFocus
                        />
                        <button
                          onClick={async () => {
                            const val = parseFloat(editPriceValue);
                            if (!isNaN(val) && svc.worker_service_id) {
                              await updatePrice(svc.worker_service_id, val);
                            }
                            setEditingPriceId(null);
                            setEditPriceValue('');
                          }}
                          style={{ ...actionBtn, background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '4px 8px' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingPriceId(null);
                            setEditPriceValue('');
                          }}
                          style={actionBtn}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (


                      <span
                        onClick={() => {
                          setEditingPriceId(svc.worker_service_id);
                          setEditPriceValue(svc.worker_price || '');
                        }}
                        style={{
                          cursor: 'pointer',
                          fontSize: 'var(--font-body-sm)',
                          color: svc.worker_price ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: svc.worker_price ? 600 : 400,
                        }}
                      >
                        {svc.worker_price ? `Rs ${parseFloat(svc.worker_price).toLocaleString()}` : 'Set price'}
                      </span>
                    )}
                  </div>

                  {/* Active / Inactive indicator */}
                  <span style={{
                    fontSize: 10,
                    color: svc.is_active ? 'var(--accent-green)' : 'var(--accent-red)',
                    fontWeight: 600,
                    minWidth: 50,
                    textAlign: 'center',
                  }}>
                    {svc.is_active ? 'Active' : 'Inactive'}
                  </span>

                  {/* Deactivate / Activate button */}
                  <button
                    onClick={() => toggleService(svc.worker_service_id, !svc.is_active)}
                    style={{ ...actionBtn, fontSize: 10, padding: '2px 8px' }}
                  >
                    {svc.is_active ? 'Deactivate' : 'Activate'}
                  </button>

                  {/* ✏️ Edit price button */}
                  <button
                    onClick={() => {
                      setEditingPriceId(svc.worker_service_id);
                      setEditPriceValue(svc.worker_price || '');
                    }}
                    style={{ ...actionBtn, fontSize: 10, padding: '2px 8px' }}
                  >
                    ✏️
                  </button>

                  {/* 🗑️ Delete button */}
                  <button
                    onClick={async () => {
                      if (!confirm('Remove this service?')) return;
                      try {
                        await api.deleteWorkerService(svc.worker_service_id);
                        const res = await api.getMyServices();
                        const freshProfs = res?.data?.professions || [];
                        setLocalServices(prev => {
                          const updated = { ...prev };
                          freshProfs.forEach(p => {
                            updated[p.id] = p.services || [];
                          });
                          return updated;
                        });
                      } catch (err) { alert('Failed to delete service'); }
                    }}
                    style={{ ...actionBtn, fontSize: 10, padding: '2px 8px', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>


          {/* Add custom form */}
          {showAddForm && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <input placeholder="Service name" value={newCustomLabel}
                onChange={e => setNewCustomLabel(e.target.value)}
                style={{ ...inputStyle, flex: 2 }} />
              <input placeholder="Nepali (optional)" value={newCustomNepali}
                onChange={e => setNewCustomNepali(e.target.value)}
                style={{ ...inputStyle, flex: 1 }} />
              <input type="number" placeholder="Price" value={newCustomPrice}
                onChange={e => setNewCustomPrice(e.target.value)}
                style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addCustomService} style={{ ...actionBtn, background: 'var(--accent-blue)', color: '#fff', border: 'none' }}>
                Add
              </button>
              <button onClick={() => { setShowAddForm(false); setNewCustomLabel(''); setNewCustomPrice(''); }}
                style={actionBtn}>Cancel</button>
            </div>
          )}

          {/* Bottom buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => {
              setCheckedServices(new Set());
              setShowChecklist(true);
            }} style={{
              padding: '10px 20px', borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border)', background: 'transparent',
              color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer',
            }}>+ Add Service</button>
                        <button onClick={async () => {
              const servicesToRemove = allServices.filter(s => s.worker_service_id);
              if (servicesToRemove.length === 0) return;
              if (!confirm(`Remove all ${servicesToRemove.length} services?`)) return;
              try {
                await Promise.all(servicesToRemove.map(s => api.deleteWorkerService(s.worker_service_id)));
                // refresh from server
                const res = await api.getMyServices();
                const freshProfs = res?.data?.professions || [];
                setLocalServices(prev => {
                  const updated = { ...prev };
                  freshProfs.forEach(p => {
                    updated[p.id] = p.services || [];
                  });
                  return updated;
                });
              } catch (err) { alert('Failed to clear services'); }
            }} style={{
              padding: '10px 20px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--accent-red)', background: 'transparent',
              color: 'var(--accent-red)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer',
            }}>Clear All</button>
          </div>

          {/* Checklist overlay */}
          {showChecklist && (
            <>
              <div onClick={() => setShowChecklist(false)} style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.35)', zIndex: 9998,
              }} />
              <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%', maxWidth: 420, maxHeight: '80vh', overflowY: 'auto',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: 24, zIndex: 9999,
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                WebkitOverflowScrolling: 'touch',
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, textAlign: 'center' }}>
                  Add Services from Catalogue
                </div>
                                {catalogueServices.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No predefined services available.
                  </div>
                ) : (
                  catalogueServices.map(svc => {
                    const isAlreadyActive = activatedIds.has(svc.service_id);
                    return (
                      <label key={svc.service_id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 0', borderBottom: '1px solid var(--border)',
                        cursor: isAlreadyActive ? 'not-allowed' : 'pointer',
                        fontSize: 'var(--font-body-sm)',
                        opacity: isAlreadyActive ? 0.5 : 1,
                      }}>
                        <input
                          type="checkbox"
                          checked={isAlreadyActive ? true : checkedServices.has(svc.service_id)}
                          disabled={isAlreadyActive}
                          onChange={() => {
                            if (!isAlreadyActive) toggleCheck(svc.service_id);
                          }}
                          style={{ width: 18, height: 18, accentColor: 'var(--accent-blue)' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {svc.label}
                            {svc.label_np && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--text-secondary)' }}>({svc.label_np})</span>}
                          </div>
                          {svc.base_price && (
                            <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>
                              Suggested Rs {parseFloat(svc.base_price).toLocaleString()}
                            </div>
                          )}
                        </div>
                        {isAlreadyActive && (
                          <span style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 600 }}>Active</span>
                        )}
                      </label>
                    );
                  })
                )}

                <div style={{ marginTop: 16, fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span onClick={() => { setShowChecklist(false); setShowAddForm(true); }} style={{ cursor: 'pointer', color: 'var(--accent-blue)', fontWeight: 600 }}>
                    + Add manually
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button onClick={() => { setShowChecklist(false); setCheckedServices(new Set()); }}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Clear Selection
                  </button>
                  <button onClick={confirmChecklist}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--accent-green)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Confirm Selection
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    default: {
      console.warn(`[ElementRenderer] Unknown type: "${elementConfig.type}" for element: "${elementId}"`);
      return null;
    }
  }
};

export default ElementRenderer;