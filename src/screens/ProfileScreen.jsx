import { useContent } from '../hooks/useContent.js'

const menuItems = [
  { icon: '📋', labelKey: 'profile.myBookings', descKey: 'profile.viewHistory', action: 'bookings' },
  { icon: '💳', labelKey: 'profile.transactions', descKey: 'profile.cardsWallet', action: null },
  { icon: '⭐', labelKey: 'profile.reviews', descKey: 'profile.ratings', action: null },
  { icon: '🔔', labelKey: 'profile.notifications', descKey: 'profile.managePref', action: null },
  { icon: '🛡️', labelKey: 'profile.safety', descKey: 'profile.verification', action: null },
  { icon: '⚙️', labelKey: 'profile.settings', descKey: 'profile.accountPrivacy', action: null },
  { icon: '🚀', labelKey: 'profile.becomeWorker', descKey: 'profile.earn', action: null },
]

export default function ProfileScreen({ navigate }) {
  const txt = {
    title: useContent('profile.title'),
    wallet: useContent('profile.wallet'),
    memberSince: useContent('profile.memberSince'),
    jobsBooked: useContent('profile.jobsBooked'),
    editProfile: useContent('profile.editProfile'),
    settings: useContent('profile.settings'),
    logout: useContent('profile.logout'),
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--accent-blue), #2377D8)', borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>🧑</div>
        <div>
          <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: '#fff', marginBottom: 4 }}>User Name</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'rgba(255,255,255,0.65)' }}>{txt.memberSince} · 0 {txt.jobsBooked}</div>
        </div>
      </div>

      {/* Wallet */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 22, marginBottom: 20 }}>
        <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{txt.wallet}</div>
        <div style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Rs 0</div>
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 16 }}>No transactions yet</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'var(--accent-blue)', color: '#fff' }}>Top Up</button>
          <button style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)' }}>Transactions</button>
          <button style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)' }}>Withdraw</button>
        </div>
      </div>

      {/* Membership */}
      <div onClick={() => navigate('/pro')} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, cursor: 'pointer' }}>
        <div>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 2 }}>Your Plan</div>
          <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>⭐ Free Plan</div>
        </div>
        <span style={{ fontSize: 'var(--font-caption)', fontWeight: 700, color: 'var(--accent-orange)', background: 'var(--accent-orange-light)', padding: '4px 10px', borderRadius: 20 }}>UPGRADE</span>
      </div>

      {/* Menu */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        {menuItems.map((item, i) => (
          <div key={item.labelKey} onClick={() => item.action && navigate(`/${item.action}`)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--font-body)', fontWeight: 500, color: 'var(--text-primary)' }}>{txt[item.labelKey.split('.')[1]] || item.labelKey}</div>
              <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>{txt[item.descKey.split('.')[1]] || item.descKey}</div>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}