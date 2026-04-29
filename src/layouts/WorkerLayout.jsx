import { useNavigate, useLocation } from 'react-router-dom'
import workerNavigation from '../config/workerNavigation.js'
import OnlineToggle from '../components/worker/OnlineToggle.jsx'

export default function WorkerLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', fontFamily: 'var(--font-family)',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 'var(--font-body-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
          Worker Panel
        </span>
        <OnlineToggle />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 20, paddingBottom: 80,
      }}>
        {children}
      </div>

      {/* Bottom nav (mobile) */}
      <div className="worker-bottom-nav" style={{
        display: 'none',
        height: 60, background: 'var(--bg-nav)',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      }}>
        {workerNavigation.filter(n => n.mobileVisible).map((item) => (
          <button key={item.id} onClick={() => navigate(item.path)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 2, border: 'none', background: 'transparent',
            cursor: 'pointer', padding: '8px 4px',
            color: location.pathname === item.path ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .worker-bottom-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}