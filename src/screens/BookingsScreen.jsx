import { useState } from 'react'
import { useBooking } from '../contexts/BookingContext.jsx'
import { useContent } from '../hooks/useContent.js'
import ElementRenderer from '../components/ElementRenderer.jsx'
import { groupBookingsByCompletedDate } from '../utils/dateGrouping.js'

export default function BookingsScreen({ navigate }) {
  const { bookings, loading } = useBooking()
  const [filter, setFilter] = useState('all')

  const title = useContent('bookings.title', 'My Bookings')

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  // Apply filter
  let filtered = bookings || []
  if (filter === 'pending') {
    filtered = filtered.filter(b => b.status === 'pending')
  } else if (filter === 'completed') {
    filtered = filtered.filter(b => b.status === 'completed')
  }

  // Only group by date when showing completed jobs
  const displayBookings = filter === 'completed' ? groupBookingsByCompletedDate(filtered) : filtered

  const filters = [
    { key: 'all', label: useContent('bookings.filter.all', 'All') },
    { key: 'pending', label: useContent('bookings.filter.pending', 'Pending') },
    { key: 'completed', label: useContent('bookings.filter.completed', 'Completed') },
  ]

  console.log('BOOKINGS DISPLAY:', displayBookings)

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{title}</h2>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: filter === f.key ? 'var(--accent-blue)' : 'transparent',
              color: filter === f.key ? '#fff' : 'var(--text-secondary)',
              fontSize: 'var(--font-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ElementRenderer
        elementId="bookingTrackCard"
        overrideData={{ bookings: displayBookings }}
      />
    </div>
  )
}