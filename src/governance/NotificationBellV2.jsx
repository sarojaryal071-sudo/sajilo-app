import { useState, useRef, useEffect } from 'react';
import { useUnifiedNotifications } from './useUnifiedNotifications.js';

export default function NotificationBellV2({ userNotificationsEnabled = true }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { userNotifications, systemNotices, totalCount, unreadCount, dismissNotice } = useUnifiedNotifications();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: 34, height: 34, borderRadius: 7, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: open ? 'var(--accent-blue-light)' : 'var(--bg-surface2)',
        border: '1px solid var(--border)', cursor: 'pointer', fontSize: 16,
        position: 'relative',
      }}>
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: 'var(--accent-red)', color: '#fff',
            fontSize: 10, fontWeight: 700, width: 18, height: 18,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 42, right: 0, width: 320, maxHeight: 400,
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid var(--border)',
          overflowY: 'auto', zIndex: 200,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 500 }}>✕</button>
          </div>

          {/* User notifications section (visible only when enabled) */}
          {userNotificationsEnabled && userNotifications.length === 0 && systemNotices.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              No new notifications
            </div>
          )}

          {userNotificationsEnabled && userNotifications.map(n => (
            <div key={n.id} style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{n.time}</div>
              </div>
            </div>
          ))}

          {/* System notices section (always visible) */}
          {systemNotices.length > 0 && (
            <>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', borderTop: userNotificationsEnabled ? '1px solid var(--border)' : 'none', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                System Notices
              </div>
              {systemNotices.map(notice => (
                <div key={notice.id} style={{
                  padding: '12px 16px', borderBottom: '1px solid var(--border)',
                  background: notice.severity === 'critical' ? '#fee2e2' : notice.severity === 'warning' ? '#fef3c7' : '#dbeafe',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{notice.title}</div>
                      <div style={{ fontSize: 12, marginTop: 2 }}>{notice.message}</div>
                    </div>
                    {notice.dismissible !== false && (
                      <button onClick={() => dismissNotice(notice.id)} style={{
                        background: 'transparent', border: 'none', fontSize: 14, cursor: 'pointer', padding: '0 4px',
                      }}>✕</button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Admin-only empty state: no system notices */}
          {!userNotificationsEnabled && systemNotices.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              No system notices
            </div>
          )}
        </div>
      )}
    </div>
  );
}