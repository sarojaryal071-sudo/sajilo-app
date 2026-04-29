import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => { loadBookings() }, [])

  const loadBookings = async () => {
    try {
      const res = await api.getMyBookings()
      setBookings(res.data || [])
    } catch (err) { console.error(err) }
  }

  const filtered = bookings.filter(b => {
    if (filter === 'Active') return ['pending', 'accepted', 'onway', 'working'].includes(b.status)
    if (filter === 'Completed') return b.status === 'completed'
    if (filter === 'Cancelled') return b.status === 'cancelled'
    return true
  }).filter(b => b.service_name?.toLowerCase().includes(search.toLowerCase()))

  const statusColor = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', color: '#D97706' },
      accepted: { bg: '#dbeafe', color: '#2563EB' },
      onway: { bg: '#dbeafe', color: '#2563EB' },
      working: { bg: '#dcfce7', color: '#16A34A' },
      completed: { bg: '#dcfce7', color: '#16A34A' },
      cancelled: { bg: '#fee2e2', color: '#DC2626' },
    }
    return colors[status] || { bg: '#f1f5f9', color: '#64748b' }
  }

  const openDetail = (booking) => setSelected(booking)
  const closeDetail = () => setSelected(null)

  const openModal = (action) => setModal({ booking: selected, action })
  const closeModal = () => setModal(null)

  const confirmAction = async () => {
    if (modal.action === 'cancel') {
      await api.updateBookingStatus(modal.booking.id, 'cancelled')
    }
    setModal(null)
    setSelected(null)
    loadBookings()
  }

  const steps = ['pending', 'accepted', 'onway', 'working', 'completed']
  const currentStepIndex = selected ? steps.indexOf(selected.status) : -1

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Bookings</h2>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, background: 'var(--bg-surface)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
        <input placeholder="Search by service name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{
          flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, outline: 'none',
          background: 'var(--bg-surface2)', color: 'var(--text-primary)',
        }} />
        {['All', 'Active', 'Completed', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 6, border: filter === f ? '1px solid var(--accent-blue)' : '1px solid var(--border)',
            background: filter === f ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
            color: filter === f ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 0.8fr 0.8fr 0.6fr 0.7fr', padding: '10px 16px', background: 'var(--bg-surface2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          <span>ID</span><span>Service</span><span>Customer</span><span>Worker</span><span>Amount</span><span>Status</span>
        </div>
        {filtered.map((b) => (
          <div key={b.id} onClick={() => openDetail(b)} style={{
            display: 'grid', gridTemplateColumns: '0.5fr 1fr 0.8fr 0.8fr 0.6fr 0.7fr', padding: '12px 16px',
            borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 13, cursor: 'pointer',
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>#{b.id}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{b.service_name}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{b.customer_name || '—'}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{b.worker_name || '—'}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Rs {b.price || 0}</span>
            <span style={{
              padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
              background: statusColor(b.status).bg, color: statusColor(b.status).color,
              display: 'inline-block', width: 'fit-content',
            }}>{b.status}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 13 }}>No bookings found</div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={closeDetail}>
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 14, padding: 28, width: 520, maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Booking #{selected.id}</h3>
              <button onClick={closeDetail} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase' }}>Status Timeline</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, left: 10, right: 10, height: 2, background: 'var(--border)' }} />
                <div style={{ position: 'absolute', top: 12, left: 10, width: `${(currentStepIndex / 4) * 95}%`, height: 2, background: 'var(--accent-blue)' }} />
                {steps.map((s, i) => (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: i <= currentStepIndex ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                      border: `2px solid ${i <= currentStepIndex ? 'var(--accent-blue)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: i <= currentStepIndex ? '#fff' : 'var(--text-secondary)',
                    }}>{i < currentStepIndex ? '✓' : i + 1}</div>
                    <span style={{ fontSize: 9, color: 'var(--text-secondary)', textAlign: 'center' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-surface2)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Customer</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.customer_name || '—'}</div>
              </div>
              <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-surface2)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Worker</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.worker_name || '—'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: 10, borderRadius: 8, background: 'var(--bg-surface2)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Service</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.service_name}</div>
              </div>
              <div style={{ flex: 1, padding: 10, borderRadius: 8, background: 'var(--bg-surface2)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Amount</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Rs {selected.price || 0}</div>
              </div>
            </div>

            {['pending', 'accepted', 'onway', 'working'].includes(selected.status) && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => openModal('cancel')} style={{
                  flex: 1, padding: '10px 0', borderRadius: 8,
                  border: '1px solid var(--accent-red)', background: 'transparent',
                  color: 'var(--accent-red)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>Cancel Booking</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
        }} onClick={closeModal}>
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 14, padding: 28, width: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-red)', marginBottom: 8 }}>Cancel Booking</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Cancel booking #{modal.booking.id}? This will notify both customer and worker.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={closeModal} style={{
                flex: 1, padding: '10px 0', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--bg-surface)',
                color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Go Back</button>
              <button onClick={confirmAction} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: 'var(--accent-red)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}