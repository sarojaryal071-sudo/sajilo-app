import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

export default function WorkerJobs() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const res = await api.getWorkerBookings()
      setBookings(res.data || [])
    } catch (err) {
      console.error('Failed to load bookings:', err)
    }
    setLoading(false)
  }

  const handleAction = async (id, action) => {
    try {
      if (action === 'accept') await api.acceptBooking(id)
      else if (action === 'reject') await api.rejectBooking(id)
      else await api.updateBookingStatus(id, action)
      loadBookings()
    } catch (err) {
      console.error('Action failed:', err)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        My Jobs
      </h2>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
          No job requests yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {booking.service_name}
                </span>
                <span style={{
                  fontSize: 'var(--font-caption)', fontWeight: 700, padding: '2px 10px', borderRadius: 12,
                  background: booking.status === 'pending' ? 'var(--accent-orange-light)' : 'var(--accent-blue-light)',
                  color: booking.status === 'pending' ? 'var(--accent-orange)' : 'var(--accent-blue)',
                }}>
                  {booking.status}
                </span>
              </div>
              <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
                Customer: {booking.customer_name} | {booking.job_size}
              </div>

              {booking.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleAction(booking.id, 'accept')} style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
                    background: 'var(--accent-green)', color: '#fff', cursor: 'pointer',
                    fontSize: 'var(--font-body-sm)', fontWeight: 600,
                  }}>Accept</button>
                  <button onClick={() => handleAction(booking.id, 'reject')} style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-secondary)', cursor: 'pointer',
                    fontSize: 'var(--font-body-sm)', fontWeight: 600,
                  }}>Reject</button>
                </div>
              )}

              {booking.status === 'accepted' && (
                <button onClick={() => handleAction(booking.id, 'onway')} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
                  background: 'var(--accent-blue)', color: '#fff', cursor: 'pointer',
                  fontSize: 'var(--font-body-sm)', fontWeight: 600,
                }}>Start Travel</button>
              )}

              {booking.status === 'onway' && (
                <button onClick={() => handleAction(booking.id, 'working')} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
                  background: 'var(--accent-blue)', color: '#fff', cursor: 'pointer',
                  fontSize: 'var(--font-body-sm)', fontWeight: 600,
                }}>Start Work</button>
              )}

              {booking.status === 'working' && (
                <button onClick={() => handleAction(booking.id, 'completed')} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
                  background: 'var(--accent-green)', color: '#fff', cursor: 'pointer',
                  fontSize: 'var(--font-body-sm)', fontWeight: 600,
                }}>Complete Job</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}