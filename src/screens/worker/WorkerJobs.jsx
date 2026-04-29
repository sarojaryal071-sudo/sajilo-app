import { useWorker } from '../../contexts/WorkerContext.jsx'

export default function WorkerJobs() {
  const { bookings, loading, acceptBooking, rejectBooking, updateBookingStatus } = useWorker()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  const handleAction = async (id, action) => {
    if (action === 'accept') await acceptBooking(id)
    else if (action === 'reject') await rejectBooking(id)
    else await updateBookingStatus(id, action)
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