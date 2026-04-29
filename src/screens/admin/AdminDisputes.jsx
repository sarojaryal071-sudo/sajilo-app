import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function AdminDisputes() {
  const [bookings, setBookings] = useState([])

  useEffect(() => { loadBookings() }, [])

  const loadBookings = async () => {
    try {
      const res = await api.getMyBookings()
      setBookings(res.data || [])
    } catch (err) { console.error(err) }
  }

  const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

  const handleRefund = async (id) => {
    await api.updateBookingStatus(id, 'cancelled')
    loadBookings()
  }

  const handleClose = (id) => {
    console.log('Dispute closed:', id)
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        Dispute Management
      </h2>

      {cancelledBookings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, background: 'var(--bg-surface)',
          borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-secondary)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <p style={{ fontSize: 14 }}>No disputes or cancelled bookings.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cancelledBookings.map((b) => (
            <div key={b.id} style={{
              background: 'var(--bg-surface)', borderRadius: 10,
              border: '1px solid var(--border)', padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Booking #{b.id} — {b.service_name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Customer: {b.customer_name || '—'} · Worker: {b.worker_name || '—'}
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                  background: '#fee2e2', color: 'var(--accent-red)', height: 'fit-content',
                }}>Cancelled</span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, padding: 10, borderRadius: 8, background: 'var(--bg-surface2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Amount</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Rs {b.price || 0}</div>
                </div>
                <div style={{ flex: 1, padding: 10, borderRadius: 8, background: 'var(--bg-surface2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Job Size</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{b.job_size || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => handleRefund(b.id)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 6,
                  border: '1px solid var(--accent-orange)', background: 'transparent',
                  color: 'var(--accent-orange)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Mark Refunded</button>
                <button onClick={() => handleClose(b.id)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 6,
                  border: '1px solid var(--accent-green)', background: 'transparent',
                  color: 'var(--accent-green)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Close Dispute</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}