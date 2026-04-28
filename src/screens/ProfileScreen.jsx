const menuItems = [
  { icon: '📋', labelKey: 'myBookings', descKey: 'viewHistory', action: 'bookings' },
  { icon: '💳', labelKey: 'transactions', descKey: 'cardsWallet', action: null },
  { icon: '⭐', labelKey: 'myReviews', descKey: 'ratingsGiven', action: null },
  { icon: '🔔', labelKey: 'notifications', descKey: 'managePref', action: null },
  { icon: '🛡️', labelKey: 'safetyTrust', descKey: 'idVerification', action: null },
  { icon: '⚙️', labelKey: 'settings', descKey: 'accountPrivacy', action: null },
  { icon: '🚀', labelKey: 'becomeWorker', descKey: 'earnWith', action: null },
]

export default function ProfileScreen({ navigate, t }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
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
          width: 76, height: 76, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, flexShrink: 0,
        }}>
          🧑
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            Aleksi Järvinen
          </div>
          <div style={{ fontSize: 'var(--font-body)', color: 'rgba(255,255,255,0.65)' }}>
            {t.memberSince} · 12 {t.jobsBooked}
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 22, marginBottom: 20,
      }}>
        <div style={{
          fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)',
          textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6,
        }}>
          {t.walletBalance}
        </div>
        <div style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Rs 4750
        </div>
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 16 }}>
          {t.lastTopup}: Rs 5000 · 3 days ago
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: t.topUp, primary: true },
            { label: t.transactions, primary: false },
            { label: t.withdraw, primary: false },
          ].map((btn) => (
            <button key={btn.label} style={{
              flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer',
              border: btn.primary ? 'none' : '1px solid var(--border)',
              background: btn.primary ? 'var(--accent-blue)' : 'var(--bg-surface2)',
              color: btn.primary ? '#fff' : 'var(--text-primary)',
            }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div onClick={() => navigate('pro')} style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '14px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, cursor: 'pointer',
      }}>
        <div>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 2 }}>
            {t.yourPlan}
          </div>
          <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
            ⭐ {t.sajiloPro}
          </div>
        </div>
        <span style={{
          fontSize: 'var(--font-caption)', fontWeight: 700, color: 'var(--accent-orange)',
          background: 'var(--accent-orange-light)', padding: '4px 10px', borderRadius: 20,
        }}>
          {t.activeBadge}
        </span>
      </div>

      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
      }}>
        {menuItems.map((item, i) => (
          <div
            key={item.labelKey}
            onClick={() => item.action && navigate(item.action)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--font-body)', fontWeight: 500, color: 'var(--text-primary)' }}>
                {t[item.labelKey]}
              </div>
              <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
                {t[item.descKey]}
              </div>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}