import { workers } from '../config/data.js'

const menuItems = [
  { icon: '📋', label: 'My Bookings', desc: 'View history & active jobs' },
  { icon: '💳', label: 'Transactions', desc: 'Cards, wallet, cash' },
  { icon: '⭐', label: 'My Reviews', desc: "Ratings you've given" },
  { icon: '🔔', label: 'Notifications', desc: 'Manage preferences' },
  { icon: '🛡️', label: 'Safety & Trust', desc: 'ID verification, reports' },
  { icon: '⚙️', label: 'Settings', desc: 'Account, privacy' },
  { icon: '🚀', label: 'Become a Worker', desc: 'Earn with Sajilo' },
]

export default function ProfileScreen({ navigate }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-blue), #2377D8)',
        borderRadius: 'var(--radius-lg)',
        padding: 28,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          flexShrink: 0,
        }}>
          🧑
        </div>
        <div>
          <div style={{
            fontSize: 'var(--font-large)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 4,
          }}>
            Aleksi Järvinen
          </div>
          <div style={{
            fontSize: 'var(--font-body)',
            color: 'rgba(255,255,255,0.65)',
          }}>
            Member since Jan 2024 · 12 jobs booked
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 22,
        marginBottom: 20,
      }}>
        <div style={{
          fontSize: 'var(--font-body-sm)',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          marginBottom: 6,
        }}>
          Wallet Balance
        </div>
        <div style={{
          fontSize: 'var(--font-xxl)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: 4,
        }}>
          Rs 4750
        </div>
        <div style={{
          fontSize: 'var(--font-body-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 16,
        }}>
          Last top-up: Rs 5000 · 3 days ago
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Top Up', primary: true },
            { label: 'Transactions', primary: false },
            { label: 'Withdraw', primary: false },
          ].map((btn) => (
            <button key={btn.label} style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-body-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              border: btn.primary ? 'none' : '1px solid var(--border)',
              background: btn.primary ? 'var(--accent-blue)' : 'var(--bg-surface2)',
              color: btn.primary ? '#fff' : 'var(--text-primary)',
            }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Membership */}
      <div onClick={() => navigate('pro')} style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        cursor: 'pointer',
      }}>
        <div>
          <div style={{
            fontSize: 'var(--font-body-sm)',
            color: 'var(--text-secondary)',
            marginBottom: 2,
          }}>
            Your Plan
          </div>
          <div style={{
            fontSize: 'var(--font-body-lg)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            ⭐ Sajilo Pro
          </div>
        </div>
        <span style={{
          fontSize: 'var(--font-caption)',
          fontWeight: 700,
          color: 'var(--accent-orange)',
          background: 'var(--accent-orange-light)',
          padding: '4px 10px',
          borderRadius: 20,
        }}>
          ACTIVE
        </span>
      </div>

      {/* Menu */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}>
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            onClick={() => item.label === 'My Bookings' && navigate('bookings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 'var(--font-body)',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 'var(--font-body-sm)',
                color: 'var(--text-secondary)',
              }}>
                {item.desc}
              </div>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}