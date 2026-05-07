import { useState, useEffect } from 'react'
import { api } from '../services/api.js'
import { useContent } from '../hooks/useContent.js'

// ── Helper component – one per menu row, hooks stay stable ──
function MenuRow({ item, navigate }) {
  const label = useContent(item.labelKey, item.labelKey)
  const desc = useContent(item.descKey, item.descKey)
  return (
    <div
      onClick={() => item.action && navigate(`/${item.action}`)}
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: item.action ? 'pointer' : 'default',
      }}
    >
      <span style={{ fontSize: 22 }}>{item.icon}</span>
      <div>
        <div style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {label}
        </div>
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

const menuItems = [
  { icon: '📋', labelKey: 'profile.myBookings', descKey: 'profile.viewHistory', action: 'bookings' },
  { icon: '💳', labelKey: 'profile.transactions', descKey: 'profile.cardsWallet', action: null },
  { icon: '★', labelKey: 'profile.safety', descKey: 'profile.verification', action: null },
  { icon: '⚙️', labelKey: 'profile.settings', descKey: 'profile.accountPrivacy', action: null },
  { icon: '🚀', labelKey: 'profile.becomeWorker', descKey: 'profile.earn', action: null },
]

export default function ProfileScreen({ navigate }) {
  const [user, setUser] = useState(null)
  const [bookingsCount, setBookingsCount] = useState(0)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  // Fetch user data on mount
  useEffect(() => {
    (async () => {
      try {
        const profileRes = await api.getMe()
        const u = profileRes?.data?.user || profileRes?.data
        if (u) {
          setUser(u)
          setName(u.name || '')
          setPhone(u.phone || '')
        }

        const bookingsRes = await api.getMyBookings()
        const bookings = bookingsRes?.data || []
        setBookingsCount(bookings.length)
      } catch (err) {
        console.error('Failed to load profile', err)
      }
    })()
  }, [])

  const txt = {
    title: useContent('profile.title'),
    wallet: useContent('profile.wallet'),
    memberSince: useContent('profile.memberSince'),
    jobsBooked: useContent('profile.jobsBooked'),
    editProfile: useContent('profile.editProfile'),
    settings: useContent('profile.settings'),
    logout: useContent('profile.logout'),
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateUserProfile({ name, phone })
      setUser(prev => ({ ...prev, name, phone }))
      setEditing(false)
    } catch (err) {
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Loading state – must be after ALL hooks to keep order stable
  if (!user) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Loading profile...</div>
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
    : '—'

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-blue), #2377D8)',
        borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, flexShrink: 0,
        }}>
          {user.name?.charAt(0)?.toUpperCase() || '👤'}
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            {user.name || 'User'}
          </div>
          <div style={{ fontSize: 'var(--font-body)', color: 'rgba(255,255,255,0.65)' }}>
            {txt.memberSince} · {bookingsCount} {txt.jobsBooked}
          </div>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            {user.client_id || ''}
          </div>
        </div>
      </div>

      {/* Wallet — static placeholder for now */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 22, marginBottom: 20,
      }}>
        <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{txt.wallet}</div>
        <div style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Rs 0</div>
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 16 }}>No transactions yet</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'var(--accent-blue)', color: '#fff' }}>Top Up</button>
          <button style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)' }}>Transactions</button>
          <button style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)' }}>Withdraw</button>
        </div>
      </div>

      {/* Editable profile section */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)' }}>{txt.editProfile}</span>
          {!editing ? (
            <button onClick={() => setEditing(true)} style={{
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--accent-blue)', background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)',
              fontWeight: 600, cursor: 'pointer',
            }}>Edit</button>
          ) : (
            <button onClick={handleSave} disabled={saving} style={{
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              border: 'none', background: saving ? '#94a3b8' : 'var(--accent-green)',
              color: '#fff', fontSize: 'var(--font-body-sm)',
              fontWeight: 600, cursor: saving ? 'wait' : 'pointer',
            }}>{saving ? 'Saving...' : 'Save'}</button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Name</div>
            {editing ? (
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)' }} />
            ) : (
              <div style={{ fontSize: 'var(--font-body)', color: 'var(--text-primary)' }}>{user.name || '—'}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Email</div>
            <div style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)' }}>{user.email || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Phone</div>
            {editing ? (
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)' }} />
            ) : (
              <div style={{ fontSize: 'var(--font-body)', color: 'var(--text-primary)' }}>{user.phone || '—'}</div>
            )}
          </div>
        </div>
      </div>

      {/* Membership (static) */}
      <div onClick={() => navigate('/pro')} style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '14px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, cursor: 'pointer',
      }}>
        <div>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 2 }}>Your Plan</div>
          <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>Free</div>
        </div>
        <span style={{ color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)' }}>Upgrade →</span>
      </div>

      {/* Menu items – each rendered by a stable component */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {menuItems.map((item, idx) => (
          <MenuRow key={idx} item={item} navigate={navigate} />
        ))}
      </div>
    </div>
  )
}