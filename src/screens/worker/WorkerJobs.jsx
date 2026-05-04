import { useState } from 'react'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import ElementRenderer from '../../components/ElementRenderer.jsx'

export default function WorkerJobs() {
  const { bookings, loading, acceptBooking, rejectBooking, updateBookingStatus } = useWorker()
  const [filter, setFilter] = useState('all')

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  const handleAction = async (id, action) => {
    if (action === 'accept') await acceptBooking(id)
    else if (action === 'reject') await rejectBooking(id)
    else await updateBookingStatus(id, action)
  }

  // Filter bookings
  let filteredBookings = bookings || []
  if (filter === 'pending') filteredBookings = filteredBookings.filter(b => b.status === 'pending')
  else if (filter === 'accepted') filteredBookings = filteredBookings.filter(b => b.status === 'accepted')
  else if (filter === 'active') filteredBookings = filteredBookings.filter(b => ['accepted', 'onway', 'working'].includes(b.status))
  else if (filter === 'completed') filteredBookings = filteredBookings.filter(b => b.status === 'completed')

  return (
    <div>
      <ElementRenderer elementId="jobsHeading" overrideData={{}} />
          
      <ElementRenderer
        elementId="jobCard"
        overrideData={{ bookings: filteredBookings, onAction: handleAction }}
      />
    </div>
  )
}