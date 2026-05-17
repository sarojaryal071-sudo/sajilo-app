import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from '../services/api.js'
import { useSocket } from '../hooks/useSocket.js'
import { SOCKET_EVENTS } from '../config/socketEvents.js'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])
  const [activeBooking, setActiveBooking] = useState(null)
  const [paymentMap, setPaymentMap] = useState({})
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

    // Fetch customer payments (only for customers)
    try {
      const meRes = await api.getMe()
      const user = meRes?.data || meRes
      const customerId = user?.id || null
      const role = user?.role
      if (customerId && role === 'customer') {
        const payRes = await api.getCustomerPayments(customerId)
        const payments = payRes.payments || []
        const map = {}
        payments.forEach(p => { map[p.booking_id] = p })
        setPaymentMap(map)
      } else {
        setPaymentMap({})
      }
    } catch (err) {
      console.error('Failed to fetch customer payments:', err)
      setPaymentMap({})
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token')
    if (token) fetchBookings()
  }, [fetchBookings])

  // ── Socket lifecycle sync ──
  useEffect(() => {
    if (!socket) return

    const handleConnect = () => {
      fetchBookings()
    }

    socket.on('connect', handleConnect)

        const lifecycleEvents = [
    SOCKET_EVENTS.BOOKING_ACCEPTED, SOCKET_EVENTS.BOOKING_REJECTED, SOCKET_EVENTS.BOOKING_ONWAY,
    SOCKET_EVENTS.BOOKING_WORKING, SOCKET_EVENTS.BOOKING_COMPLETED, SOCKET_EVENTS.BOOKING_CANCELLED,
    SOCKET_EVENTS.BOOKING_UPDATED,
    SOCKET_EVENTS.REVIEW_CREATED,
    SOCKET_EVENTS.PAYMENT_UPDATED,
  ]

  lifecycleEvents.forEach(event => {
    socket.on(event, () => {
      fetchBookings()
    })
  })

  socket.on(SOCKET_EVENTS.BOOKING_CREATED, () => {
    fetchBookings()
  })

  return () => {
    socket.off('connect')
    socket.off('disconnect')
    lifecycleEvents.forEach(event => socket.off(event))
    socket.off(SOCKET_EVENTS.BOOKING_CREATED)
  }
  
  }, [socket, fetchBookings])

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
    paymentMap,
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

export { BookingContext }