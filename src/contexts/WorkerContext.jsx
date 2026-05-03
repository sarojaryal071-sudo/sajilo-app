import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api.js'

const WorkerContext = createContext()

export function WorkerProvider({ children }) {
  const [profile, setProfile] = useState(null)
  
  const [bookings, setBookings] = useState([])
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

  const acceptBooking = async (id) => {
    await api.acceptBooking(id)
    await loadAll()
  }

  const rejectBooking = async (id) => {
    await api.rejectBooking(id)
    await loadAll()
  }

  const updateBookingStatus = async (id, status) => {
    await api.updateBookingStatus(id, status)
    await loadAll()
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
    profile, bookings, earnings, schedule, loading,
    toggleOnline, updateProfile, acceptBooking, rejectBooking,
    updateBookingStatus, saveSchedule, loadAll, services, saveServices,
  }

  return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>
}

export function useWorker() {
  return useContext(WorkerContext)
}