import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api.js'
import { getSocket } from '../services/realtime/socketClient'
import { dispatchBookingCommand } from '../utils/bookingCommandDispatcher.js'

const WorkerContext = createContext()

export function WorkerProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [activeJob, setActiveJob] = useState(null)
  const [earnings, setEarnings] = useState({ total_earnings: 0, completed_jobs: 0 })
  const [schedule, setSchedule] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.getWorkerProfile(),
        api.getWorkerBookings(),
        api.getWorkerEarnings(),
        api.getWorkerSchedule(),
      ])

      if (results[0].status === 'fulfilled') {
        setProfile(prev => ({
          ...results[0].value.data,
          is_online: prev?.is_online ?? results[0].value.data?.is_online ?? false,
        }))
      }
      if (results[1].status === 'fulfilled') setBookings(results[1].value.data || [])
      if (results[2].status === 'fulfilled') setEarnings(results[2].value.data || { total_earnings: 0, completed_jobs: 0 })
      if (results[3].status === 'fulfilled') setSchedule(results[3].value.data || [])
    } catch (err) {
      console.error('Failed to load worker data:', err)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Track the worker's active job (onway/working) for the dashboard map card
  useEffect(() => {
    const active = bookings.find(b => b.status === 'onway' || b.status === 'working')
    setActiveJob(active || null)
  }, [bookings])

  // Listen for new booking requests via real‑time socket
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleRefresh = () => loadAll()

    socket.on('booking.created', handleRefresh)

    const lifecycleEvents = [
      'booking.accepted', 'booking.rejected', 'booking.onway',
      'booking.working', 'booking.completed', 'booking.cancelled'
    ]
    lifecycleEvents.forEach(event => socket.on(event, handleRefresh))

    return () => {
      socket.off('booking.created', handleRefresh)
      lifecycleEvents.forEach(event => socket.off(event, handleRefresh))
    }
  }, [loadAll])

  const toggleOnline = async () => {
    const newStatus = !profile?.is_online
    setProfile(prev => ({ ...prev, is_online: newStatus }))
    try {
      await api.updateWorkerProfile({ is_online: newStatus })
    } catch (err) {
      setProfile(prev => ({ ...prev, is_online: !newStatus }))
    }
  }

  const updateProfile = async (fields) => {
    await api.updateWorkerProfile(fields)
    await loadAll()
  }

  // ── Accept, Reject, Update status – with immediate local refresh ──
  const acceptBooking = async (id) => {
    try {
      await dispatchBookingCommand({ action: 'accept', bookingId: id })
      await loadAll()                     // ← immediate refresh after API success
    } catch (err) {
      console.error('Accept failed:', err)
    }
  }

  const rejectBooking = async (id) => {
    try {
      await dispatchBookingCommand({ action: 'reject', bookingId: id })
      await loadAll()
    } catch (err) {
      console.error('Reject failed:', err)
    }
  }

  const updateBookingStatus = async (id, status) => {
    try {
      await dispatchBookingCommand({ action: status, bookingId: id })
      await loadAll()
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  const saveSchedule = async (newSchedule) => {
    await api.saveWorkerSchedule(newSchedule)
    setSchedule(newSchedule)
  }

  const saveServices = async (newServices) => {
    await api.saveWorkerServices(newServices)
    setServices(newServices)
  }

  const value = {
    profile, bookings, earnings, schedule, loading, activeJob,
    toggleOnline, updateProfile, acceptBooking, rejectBooking,
    updateBookingStatus, saveSchedule, loadAll, services, saveServices,
  }

  return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>
}

export function useWorker() {
  return useContext(WorkerContext)
}