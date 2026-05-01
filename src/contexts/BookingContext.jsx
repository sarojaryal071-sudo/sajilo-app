import { createContext, useContext, useState, useCallback } from 'react'
import { api } from '../services/api.js'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [activeBooking, setActiveBooking] = useState(null)
  const [loading, setLoading] = useState(false)

  const createBooking = useCallback(async (bookingData) => {
    setLoading(true)
    try {
      const res = await api.createBooking(bookingData)
      setActiveBooking(res.data)
      return res.data
    } catch (err) {
      console.error('Failed to create booking:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (bookingId, status) => {
    try {
      await api.updateBookingStatus(bookingId, status)
      setActiveBooking(prev => prev ? { ...prev, status } : null)
    } catch (err) {
      console.error('Failed to update booking:', err)
    }
  }, [])

  return (
    <BookingContext.Provider value={{ activeBooking, loading, createBooking, updateStatus, setActiveBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  return useContext(BookingContext)
}