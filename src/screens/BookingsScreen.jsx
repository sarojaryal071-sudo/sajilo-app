import { useBooking } from '../contexts/BookingContext.jsx'
import { useContent } from '../hooks/useContent.js'
import ElementRenderer from '../components/ElementRenderer.jsx'

export default function BookingsScreen({ navigate }) {
  const { bookings, loading } = useBooking()
  const title = useContent('bookings.title', 'My Bookings')

  const handleChatSend = (bookingId, text) => {
    // Will wire to socket chat
    console.log('Chat:', bookingId, text)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>{title}</h2>
      <ElementRenderer elementId="bookingTrackCard" overrideData={{ bookings, onChatSend: handleChatSend }} />
    </div>
  )
}