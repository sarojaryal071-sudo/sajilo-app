// sajilo-app/src/governance/NotificationBellV2.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedNotifications } from './useUnifiedNotifications.js';

export default function NotificationBellV2({
  userNotificationsEnabled = true,
  placement = 'bottom',
  mobileNavigateTo = null,   // route path for mobile navigation (e.g. "/inbox")
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

  const {
    unifiedNotifications,
    systemNotices,
    notificationUnreadCount,
    markAsRead,
    clearAllNotifications,
    clearSystemNotices,
    dismissNotice,
  } = useUnifiedNotifications();

  const visibleNotifications = userNotificationsEnabled ? unifiedNotifications : [];

  // ── Outside click handler ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current || !buttonRef.current) return;
      const insideContainer = containerRef.current.contains(e.target);
      const insideButton = buttonRef.current.contains(e.target);
      if (!insideContainer && !insideButton) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const handleClearSystem = () => {
    clearSystemNotices();
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* ── BELL BUTTON ── */}
      <button
        ref={buttonRef}
        onClick={() => {
          if (mobileNavigateTo && isMobile()) {
            navigate(mobileNavigateTo);
          } else {
            setOpen(prev => !prev);
          }
        }}
        style={{
          width: 34,
          height: 34,
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: open ? 'var(--accent-blue-light)' : 'var(--bg-surface2)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          fontSize: 16,
          position: 'relative',
        }}
      >
        🔔
        {notificationUnreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: 'var(--accent-red)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            width: 18,
            height: 18,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {notificationUnreadCount}
          </span>
        )}
      </button>

      {/* ── DROPDOWN ── */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 42,
          right: 0,
          width: 320,
          maxHeight: 400,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid var(--border)',
          overflowY: 'auto',
          zIndex: 200,
          display: open ? 'block' : 'none',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: 4,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            Notifications
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Clear all button – always visible when there are any notifications */}
            {visibleNotifications.length > 0 && (
              <button
                onClick={handleClearAll}
                title="Clear all notifications"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-blue)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                Clear all
              </button>
            )}
            {/* Clear system notices button – always visible when notices exist */}
            {systemNotices.length > 0 && (
              <button
                onClick={handleClearSystem}
                title="Clear all system notices"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-red)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                Clear system
              </button>
            )}
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                color: 'var(--accent-blue)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── USER NOTIFICATIONS ── */}
        {visibleNotifications.length === 0 && systemNotices.length === 0 && (
          <div style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 13,
          }}>
            No new notifications
          </div>
        )}
        {visibleNotifications.map(n => (
          <div
            key={n.id}
            onClick={() => {
              if (!n.read && markAsRead) {
                markAsRead(n.id);
              }
            }}
            style={{
              padding: '12px 16px',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
              background: n.read ? 'transparent' : 'var(--accent-blue-light)',
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: n.read ? 400 : 700 }}>
                {n.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                {n.time ? new Date(n.time).toLocaleString() : ''}
              </div>
            </div>
          </div>
        ))}

        {/* ── SYSTEM NOTICES ── */}
        {systemNotices.length > 0 && (
          <>
            <div style={{
              padding: '8px 16px',
              borderTop: visibleNotifications.length > 0 ? '1px solid var(--border)' : 'none',
              borderBottom: '1px solid var(--border)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}>
              System Notices
            </div>
            {systemNotices.map(notice => (
              <div
                key={notice.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  background:
                    notice.severity === 'critical'
                      ? '#fee2e2'
                      : notice.severity === 'warning'
                      ? '#fef3c7'
                      : '#dbeafe',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{notice.title}</div>
                    <div style={{ fontSize: 12, marginTop: 2 }}>{notice.message}</div>
                  </div>
                  {notice.dismissible !== false && (
                    <button
                      onClick={() => dismissNotice(notice.id)}
                      style={{ background: 'transparent', border: 'none', fontSize: 14, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── ADMIN EMPTY STATE ── */}
        {!userNotificationsEnabled && systemNotices.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
            No system notices
          </div>
        )}
      </div>
    </div>
  );
}