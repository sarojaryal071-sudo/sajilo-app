// src/components/ToastBanner.jsx
import { useEffect } from 'react';

/**
 * ToastBanner
 * Slides down from top, shows a brief notification, auto-dismisses.
 * 
 * Props:
 *  - id           : unique identifier
 *  - title        : bold line
 *  - message      : optional subtitle / message preview
 *  - duration     : auto-dismiss in ms (default 5000)
 *  - onDismiss    : callback to remove this toast (receives id)
 *  - onNavigate   : callback to navigate (receives path) – parent will handle navigation
 *  - navigatePath : path to navigate to on tap (if provided)
 */
export default function ToastBanner({ id, title, message, duration = 5000, onDismiss, onNavigate, navigatePath }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const handleTap = () => {
    if (navigatePath) {
      onNavigate?.(navigatePath);
    }
    onDismiss(id);
  };

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9997,             // below overlays (9998+)
        background: 'var(--accent-blue)',
        color: '#fff',
        padding: '14px 16px',
        paddingTop: 'env(safe-area-inset-top, 14px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        animation: 'toastSlideDown 0.3s ease-out',
        fontWeight: 500,
        fontSize: 'var(--font-body-sm)',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 'var(--font-body)', marginBottom: 2 }}>
        {title}
      </div>
      {message && (
        <div style={{ opacity: 0.9, fontSize: 'var(--font-caption)' }}>
          {message}
        </div>
      )}
      <style>{`
        @keyframes toastSlideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}