import { useNavigate, useLocation } from 'react-router-dom'
import adminNavigation from '../config/adminNavigation.js'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const mobileItems = adminNavigation.filter(n => n.mobileVisible)

  const handleLogout = () => {
    localStorage.removeItem('sajilo_user')
    localStorage.removeItem('sajilo_token')
    window.location.href = '/login'
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', fontFamily: 'var(--font-family)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--accent-red)' }}>
          Admin Panel
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
            Sajilo Control Center
          </span>
          <button onClick={handleLogout} style={{
            padding: '6px 12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--accent-red)', background: 'transparent',
            color: 'var(--accent-red)', fontSize: 'var(--font-body-sm)',
            fontWeight: 600, cursor: 'pointer',
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div className="admin-sidebar" style={{
          width: 220, flexShrink: 0, background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)', padding: '16px 0',
          overflowY: 'auto',
        }}>
          {adminNavigation.map((item) => (
            <button key={item.id} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 20px', border: 'none',
              background: location.pathname === item.path ? 'var(--accent-blue-light)' : 'transparent',
              color: location.pathname === item.path ? 'var(--accent-blue)' : 'var(--text-primary)',
              fontSize: 'var(--font-body)', fontWeight: 500, cursor: 'pointer',
              textAlign: 'left',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{
          flex: 1, overflowY: 'auto', padding: 24, paddingBottom: 80,
        }}>
          {children}
        </div>
      </div>

      <div className="admin-bottom-nav" style={{
        display: 'none',
        height: 60, background: 'var(--bg-nav)',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      }}>
        {mobileItems.map((item) => (
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
          .admin-sidebar { display: none !important; }
          .admin-bottom-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}