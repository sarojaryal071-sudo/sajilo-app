// sajilo-app/src/screens/ProfileScreen.jsx
import { useState, useEffect } from 'react'
import { api } from '../services/api.js'
import { useContent } from '../hooks/useContent.js'

// ── Helper: calculate points based on job size ──
const JOB_SIZE_POINTS = {
  small: 2,
  medium: 5,
  large: 15,
}

function calcRewardPoints(bookings) {
  return bookings
    .filter(b => b.status === 'completed')
    .reduce((total, b) => total + (JOB_SIZE_POINTS[b.job_size] || 0), 0)
}

export default function ProfileScreen({ navigate }) {
  const [user, setUser] = useState(null)
  const [bookingsCount, setBookingsCount] = useState(0)
  const [rewardPoints, setRewardPoints] = useState(0)

  // Fetch user data on mount
  useEffect(() => {
    (async () => {
      try {
        const profileRes = await api.getMe()
        const u = profileRes?.data?.user || profileRes?.data
        if (u) setUser(u)

        const bookingsRes = await api.getMyBookings()
        const bookings = bookingsRes?.data || []
        setBookingsCount(bookings.length)
        setRewardPoints(calcRewardPoints(bookings))
      } catch (err) {
        console.error('Failed to load profile', err)
      }
    })()
  }, [])

  const txt = {
    title: useContent('profile.title'),
    rewardPoints: useContent('profile.rewardPoints') || 'Reward Points',
    memberSince: useContent('profile.memberSince'),
    jobsBooked: useContent('profile.jobsBooked'),
    editProfile: useContent('profile.editProfile'),
    settings: useContent('profile.settings'),
    logout: useContent('profile.logout'),
  }

  if (!user) return <div style={{ textAlign: 'center', padding: 40 }}>Loading profile...</div>

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
    : '—'

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Profile Header with Avatar */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-blue), #2377D8)',
        borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: user.photo_url ? 'transparent' : 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, flexShrink: 0,
          overflow: 'hidden'
        }}>
          {user.photo_url ? (
            <img src={user.photo_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user.name?.charAt(0)?.toUpperCase() || '👤'
          )}
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
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            📍 {user.location || 'Location not available'}
          </div>
        </div>
      </div>

      {/* Reward Points Card */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 22, marginBottom: 20,
      }}>
        <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
          {txt.rewardPoints}
        </div>
        <div style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, color: 'var(--accent-green)', marginBottom: 4 }}>
          {rewardPoints} pts
        </div>
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
          {rewardPoints === 0
            ? 'Complete bookings to earn reward points'
            : `${rewardPoints} point${rewardPoints > 1 ? 's' : ''} = Rs ${rewardPoints}`}
        </div>
      </div>

      {/* Read‑only profile information (editing moved to Settings) */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20,
      }}>
        <div style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          {txt.editProfile}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Name</div>
            <div style={{ fontSize: 'var(--font-body)', color: 'var(--text-primary)' }}>{user.name || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Email (private)</div>
            <div style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)' }}>{user.email || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Phone</div>
            <div style={{ fontSize: 'var(--font-body)', color: 'var(--text-primary)' }}>{user.phone || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Photo URL</div>
            <div style={{ fontSize: 'var(--font-body)', color: 'var(--text-primary)' }}>{user.photo_url || 'No photo set'}</div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
          ✏️ Edit your profile in <span style={{ color: 'var(--accent-blue)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/settings')}>Settings</span>.
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
    </div>
  )
}