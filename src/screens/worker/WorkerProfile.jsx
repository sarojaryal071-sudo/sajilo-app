import { useState, useEffect } from 'react'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import ElementRenderer from '../../components/ElementRenderer.jsx'
import { api } from '../../services/api.js'
import { useSocket } from '../../hooks/useSocket.js'
import { API_URL } from '../../services/api.js'

// ── Reward points calculation (same as client) ──
const JOB_SIZE_POINTS = {
  small: 2,
  medium: 5,
  large: 15,
}

function calcRewardPoints(bookings) {
  return (bookings || [])
    .filter(b => b.status === 'completed')
    .reduce((total, b) => total + (JOB_SIZE_POINTS[b.job_size] || 0), 0)
}

export default function WorkerProfile() {
  const { profile, bookings, updateProfile } = useWorker()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const [showLocationModal, setShowLocationModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [locationReason, setLocationReason] = useState('')
  const [locationPassword, setLocationPassword] = useState('')
  const [locationConfirmPassword, setLocationConfirmPassword] = useState('')
  const [locations, setLocations] = useState([])

  // ── Reviews state ──
  const [workerRating, setWorkerRating] = useState({ average_rating: 0, review_count: 0, reviews: [] })
  const [paymentChannels, setPaymentChannels] = useState([])
  const [showAddChannel, setShowAddChannel] = useState(false)
  const [editingChannelId, setEditingChannelId] = useState(null)
  const [channelForm, setChannelForm] = useState({ provider: '', account_holder: '', account_number: '', qr_image_url: '' })
  const [reviewsLoading, setReviewsLoading] = useState(true)

  // Reward points
  const rewardPoints = calcRewardPoints(bookings)

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${API_URL}/locations`)
        const json = await resp.json()
        if (json.success) setLocations(json.data || [])
      } catch (err) { /* ignore */ }
    })()
  }, [])

  // Fetch payment channels on mount
  useEffect(() => {
    api.getPaymentChannels()
      .then(res => { if (res?.success) setPaymentChannels(res.data) })
      .catch(() => {})
  }, [])

  // Fetch worker reviews on mount and when profile.id is available
  useEffect(() => {
    if (!profile?.id) return
    setReviewsLoading(true)
    api.getWorkerReviews(profile.id)
      .then(res => {
        if (res?.success && res.data) {
          setWorkerRating(res.data)
        }
      })
      .catch(console.error)
      .finally(() => setReviewsLoading(false))
  }, [profile?.id])

    // Listen for live review.created events and refresh reviews
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket || !profile?.id) return

    const handleReviewCreated = () => {
      api.getWorkerReviews(profile.id)
        .then(res => {
          if (res?.success && res.data) {
            setWorkerRating(res.data)
          }
        })
        .catch(console.error)
    }

    socket.on('review.created', handleReviewCreated)
    return () => socket.off('review.created', handleReviewCreated)
  }, [socket, profile?.id])

  if (!profile) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  const startEdit = () => {
    setName(profile?.name || '')
    setPhone(profile?.phone || '')
    setBio(profile?.bio || '')
    setSkills((profile?.skills || []).join(', '))
    setHourlyRate(profile?.hourly_rate || '')
    setPhotoUrl(profile?.photo_url || '')
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    await updateProfile({
      name,
      phone,
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      hourly_rate: parseInt(hourlyRate) || 500,
      photo_url: photoUrl,
    })
    setSaving(false)
    setEditing(false)
  }

  const displayProfile = editing
    ? { ...profile, name, phone, bio, skills: skills.split(',').map(s => s.trim()).filter(Boolean), hourly_rate: parseInt(hourlyRate) || 500, photo_url: photoUrl }
    : profile

  const primaryProfession = profile?.primary_skill || 'Not set'
  const secondaryProfessions = profile?.secondary_roles || []

  const handleLocationChangeSubmit = (e) => {
    e.preventDefault()
    alert('Location change request feature coming soon.')
    setShowLocationModal(false)
  }

  return (
    <div>
      {/* Worker identity card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: profile.photo_url ? 'transparent' : 'var(--accent-blue-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, color: 'var(--accent-blue)',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {profile.photo_url ? (
            <img src={profile.photo_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            profile.name?.charAt(0)?.toUpperCase() || 'W'
          )}
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {profile.name || 'Worker'}
          </div>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
            {primaryProfession}
            {secondaryProfessions.length > 0 && ` + ${secondaryProfessions.join(', ')}`}
          </div>
          <div style={{ fontSize: 12, color: 'var(--accent-blue)', fontWeight: 600, marginTop: 4 }}>
            {profile.client_id || ''}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            📍 {profile.service_area || 'Not set'}
            <button onClick={() => setShowLocationModal(true)} style={{
              marginLeft: 8, padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)',
              background: 'var(--bg-surface2)', color: 'var(--accent-blue)', fontSize: 11, cursor: 'pointer'
            }}>Change Location</button>
          </div>
        </div>
      </div>

      {/* Reward Points Card (unchanged) */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 22, marginBottom: 16,
      }}>
        <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
          Reward Points
        </div>
        <div style={{ fontSize: 'var(--font-xxl)', fontWeight: 800, color: 'var(--accent-green)', marginBottom: 4 }}>
          {rewardPoints} pts
        </div>
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
          {rewardPoints === 0
            ? 'Complete jobs to earn reward points'
            : `${rewardPoints} point${rewardPoints > 1 ? 's' : ''} = Rs ${rewardPoints}`}
        </div>
        {rewardPoints > 0 && (
          <button disabled style={{
            marginTop: 12, padding: '8px 16px', borderRadius: 6,
            border: '1px solid var(--accent-green)', background: 'var(--accent-green-light)',
            color: 'var(--accent-green)', fontWeight: 600, cursor: 'not-allowed', opacity: 0.6
          }}>
            Exchange for Cash (coming soon)
          </button>
        )}
      </div>

      {/* Location Change Modal (unchanged) */}
      {showLocationModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 24, maxWidth: 400, width: '90%' }}>
            <h3 style={{ marginBottom: 16 }}>Request Location Change</h3>
            <form onSubmit={handleLocationChangeSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>New City</label>
                <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} required
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)' }}>
                  <option value="">Select...</option>
                  {locations.map(loc => (
                    <option key={loc.value} value={loc.value}>{loc.label} ({loc.status})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Reason</label>
                <textarea value={locationReason} onChange={e => setLocationReason(e.target.value)} rows={2} required
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
                <input type="password" value={locationPassword} onChange={e => setLocationPassword(e.target.value)} required
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Confirm Password</label>
                <input type="password" value={locationConfirmPassword} onChange={e => setLocationConfirmPassword(e.target.value)} required
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowLocationModal(false)} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: 10, borderRadius: 6, border: 'none', background: 'var(--accent-blue)', color: '#fff', cursor: 'pointer' }}>Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editable profile section (rendered by ElementRenderer) */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 16,
      }}>
        <ElementRenderer
          elementId="profileAvatar"
          overrideData={{ profile: displayProfile }}
        />
        <ElementRenderer
          elementId="profileFieldGroup"
          overrideData={{
            profile: displayProfile,
            isEditing: editing,
          }}
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={editing ? handleSave : startEdit} disabled={saving} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: editing ? (saving ? '#94a3b8' : 'var(--accent-green)') : 'var(--accent-blue)',
            color: '#fff', fontWeight: 600, cursor: 'pointer'
          }}>
            {editing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
          </button>
        </div>
      </div>

            {/* ── Reviews Section (compact) ── */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          Reviews
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
            ★ {workerRating.average_rating != null ? Number(workerRating.average_rating).toFixed(1) : '0.0'}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            ({workerRating.review_count || 0} review{workerRating.review_count !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      {/* ── Payment Channels ── */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--text-primary)' }}>
              💳 Payment Channels
            </div>
            <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
              Add how clients can pay you
            </div>
          </div>
          <button onClick={() => { setShowAddChannel(true); setEditingChannelId(null); setChannelForm({ provider: '', account_holder: '', account_number: '', qr_image_url: '' }); }} style={{
            padding: '6px 14px', borderRadius: 6, border: '1px solid var(--accent-blue)',
            background: 'transparent', color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>+ Add</button>
        </div>

        {paymentChannels.length === 0 && !showAddChannel && (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)', fontSize: 13 }}>
            No payment channels added yet.
          </div>
        )}

        {/* Channel list */}
        {paymentChannels.map(ch => (
          <div key={ch.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {ch.provider?.toUpperCase()} — {ch.account_number || ch.account_holder}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {ch.account_holder} · {ch.is_active ? '🟢 Active' : '🔴 Inactive'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => {
                setEditingChannelId(ch.id);
                setChannelForm({ provider: ch.provider, account_holder: ch.account_holder || '', account_number: ch.account_number || '', qr_image_url: ch.qr_image_url || '' });
                setShowAddChannel(true);
              }} style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer' }}>Edit</button>
              <button onClick={async () => {
                if (confirm('Remove this channel?')) {
                  await api.deletePaymentChannel(ch.id);
                  setPaymentChannels(prev => prev.filter(c => c.id !== ch.id));
                }
              }} style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid var(--accent-red)', background: 'transparent', color: 'var(--accent-red)', fontSize: 11, cursor: 'pointer' }}>Remove</button>
            </div>
          </div>
        ))}

        {/* Add / Edit form */}
        {showAddChannel && (
          <div style={{ marginTop: 12, padding: 14, background: 'var(--bg-surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
              {editingChannelId ? 'Edit Channel' : 'New Channel'}
            </div>
            <select value={channelForm.provider} onChange={e => setChannelForm(f => ({ ...f, provider: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13, marginBottom: 8 }}>
              <option value="">Select provider...</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="imepay">IME Pay</option>
              <option value="bank">Bank Transfer</option>
            </select>
            <input placeholder="Account Holder Name" value={channelForm.account_holder} onChange={e => setChannelForm(f => ({ ...f, account_holder: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13, marginBottom: 8 }} />
            <input placeholder="Account Number / Wallet ID" value={channelForm.account_number} onChange={e => setChannelForm(f => ({ ...f, account_number: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13, marginBottom: 8 }} />
            <input placeholder="QR Image URL (optional)" value={channelForm.qr_image_url} onChange={e => setChannelForm(f => ({ ...f, qr_image_url: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13, marginBottom: 10 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={async () => {
                if (!channelForm.provider || !channelForm.account_number) return alert('Provider and account number are required');
                if (editingChannelId) {
                  const res = await api.updatePaymentChannel(editingChannelId, channelForm);
                  if (res?.success) {
                    setPaymentChannels(prev => prev.map(c => c.id === editingChannelId ? res.data : c));
                    setShowAddChannel(false);
                  }
                } else {
                  const res = await api.addPaymentChannel(channelForm);
                  if (res?.success) {
                    setPaymentChannels(prev => [...prev, res.data]);
                    setShowAddChannel(false);
                  }
                }
              }} style={{ flex: 1, padding: 8, borderRadius: 6, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {editingChannelId ? 'Update' : 'Save'}
              </button>
              <button onClick={() => { setShowAddChannel(false); setEditingChannelId(null); }} style={{ padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      
      <ElementRenderer
        elementId="profileStatsRow"
        overrideData={{ profile }}
      />
    </div>
  )
}