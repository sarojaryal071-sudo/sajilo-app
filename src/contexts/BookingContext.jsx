import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from '../services/api.js'
import { useSocket } from '../hooks/useSocket.js'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])
  const [activeBooking, setActiveBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const { socket } = useSocket()

  // ── Fetch all bookings on mount ──
  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.getMyBookings()
      if (res?.data) setBookings(res.data)
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token')
    if (token) fetchBookings()
  }, [fetchBookings])

  // ── Socket lifecycle sync ──
  useEffect(() => {
    if (!socket) return

    const lifecycleEvents = [
      'booking.accepted', 'booking.rejected', 'booking.onway',
      'booking.working', 'booking.completed', 'booking.cancelled'
    ]

    lifecycleEvents.forEach(event => {
      socket.on(event, (data) => {
        setBookings(prev => prev.map(b =>
          b.id === data.bookingId ? { ...b, status: data.status, updated_at: data.updatedAt } : b
        ))
        // Also update active booking if it matches
        setActiveBooking(prev => prev?.id === data.bookingId ? { ...prev, status: data.status } : prev)
      })
    })

    // New booking created (for worker)
    socket.on('booking.created', (booking) => {
      setBookings(prev => [booking, ...prev])
    })

    return () => {
      lifecycleEvents.forEach(event => socket.off(event))
      socket.off('booking.created')
    }
  }, [socket])

  // ── Create booking ──
  const createBooking = useCallback(async (bookingData) => {
    setLoading(true)
    try {
      const res = await api.createBooking(bookingData)
      const newBooking = res.data
      setBookings(prev => [newBooking, ...prev])
      setActiveBooking(newBooking)
      return newBooking
    } catch (err) {
      console.error('Failed to create booking:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Update booking status ──
  const updateBookingStatus = useCallback(async (bookingId, status) => {
    try {
      await api.updateBookingStatus(bookingId, status)
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status } : b
      ))
      setActiveBooking(prev => prev?.id === bookingId ? { ...prev, status } : prev)
    } catch (err) {
      console.error('Failed to update booking:', err)
    }
  }, [])

  const value = {
    bookings,
    activeBooking,
    loading,
    createBooking,
    updateBookingStatus,
    setActiveBooking,
    refreshBookings: fetchBookings,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  return useContext(BookingContext)
}