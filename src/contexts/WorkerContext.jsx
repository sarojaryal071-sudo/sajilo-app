import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api.js'
import { getSocket } from '../services/realtime/socketClient'
import { SOCKET_EVENTS } from '../config/socketEvents.js'
import { dispatchBookingCommand } from '../utils/bookingCommandDispatcher.js'

const WorkerContext = createContext()

export function WorkerProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [activeJob, setActiveJob] = useState(null)
  const [earnings, setEarnings] = useState({ total_earnings: 0, completed_jobs: 0, today_earnings: 0, today_jobs: 0 })
  const [schedule, setSchedule] = useState([])
  const [services, setServices] = useState([])
  const [paymentMap, setPaymentMap] = useState({})
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.getWorkerProfile(),
        api.getWorkerBookings(),
        api.getWorkerSchedule(),
      ])

      let profileData = null
      if (results[0].status === 'fulfilled') {
        profileData = results[0].value.data
        setProfile(prev => ({
          ...profileData,
          is_online: prev?.is_online ?? profileData?.is_online ?? false,
        }))
      }
      if (results[1].status === 'fulfilled') setBookings(results[1].value.data || [])
      if (results[2].status === 'fulfilled') setSchedule(results[2].value.data || [])

      // Fetch payment data once we have the worker ID
      if (profileData) {
        try {
          const paymentsRes = await api.getWorkerPayments(profileData.id)
          const payments = paymentsRes.payments || []
          const map = {}
          payments.forEach(p => { map[p.booking_id] = p })
          setPaymentMap(map)
        } catch (err) {
          console.error('Failed to fetch worker payments:', err)
        }
      }
    } catch (err) {
      console.error('Failed to load worker data:', err)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Fetch today + lifetime metrics from dashboard endpoint
  useEffect(() => {
    api.getWorkerDashboardMetrics()
      .then(res => {
        if (res?.success && res.data) {
          setEarnings(prev => ({
            ...prev,
            today_earnings: res.data.today?.earnings || 0,
            today_jobs: res.data.today?.completedJobs || 0,
            total_earnings: res.data.lifetime?.totalEarnings || prev?.total_earnings || 0,
            completed_jobs: res.data.lifetime?.completedJobs || prev?.completed_jobs || 0,
            total_earnings: res.data.lifetime?.totalEarnings || prev?.total_earnings || 0,
            completed_jobs: res.data.lifetime?.completedJobs || prev?.completed_jobs || 0,
          }))
        }
      })
      .catch(() => {})
  }, [])

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

    const handleTodayRefresh = () => {
      handleRefresh()
      api.getWorkerDashboardMetrics()
        .then(res => {
          if (res?.success && res.data) {
            setEarnings(prev => ({
              ...prev,
              today_earnings: res.data.today?.earnings || 0,
              today_jobs: res.data.today?.completedJobs || 0,
            }))
          }
        })
        .catch(() => {})
    }

    socket.on(SOCKET_EVENTS.BOOKING_CREATED, handleTodayRefresh)

      const lifecycleEvents = [
    SOCKET_EVENTS.BOOKING_ACCEPTED, SOCKET_EVENTS.BOOKING_REJECTED, SOCKET_EVENTS.BOOKING_ONWAY,
    SOCKET_EVENTS.BOOKING_WORKING, SOCKET_EVENTS.BOOKING_COMPLETED, SOCKET_EVENTS.BOOKING_CANCELLED,
    SOCKET_EVENTS.BOOKING_UPDATED,
    SOCKET_EVENTS.REVIEW_CREATED,
    SOCKET_EVENTS.PAYMENT_UPDATED,
  ]
  lifecycleEvents.forEach(event => socket.on(event, handleTodayRefresh))

    return () => {
      socket.off(SOCKET_EVENTS.BOOKING_CREATED, handleTodayRefresh)
      lifecycleEvents.forEach(event => socket.off(event, handleTodayRefresh))
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
    paymentMap,
  }

  return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>
}

export function useWorker() {
  return useContext(WorkerContext)
}