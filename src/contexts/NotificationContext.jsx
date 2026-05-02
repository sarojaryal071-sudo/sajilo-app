// NotificationContext — centralized notification state via socket only
// Stores all incoming notifications but exposes filtered streams
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useSocket } from '../hooks/useSocket.js'
import { isSystemNotification } from '../utils/notificationFilters.js'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [allNotifications, setAllNotifications] = useState([])
  const { socket } = useSocket()
  const seenIds = useRef(new Set())

  // Stores all incoming notifications — raw stream
  useEffect(() => {
    if (!socket) return
    socket.on('notification_new', (notif) => {
      console.log('[NOTIF RAW]', { type: notif.type, id: notif.id, title: notif.title })
      if (seenIds.current.has(notif.id)) return
      seenIds.current.add(notif.id)
      setAllNotifications(prev => [{ ...notif, read: false }, ...prev])
    })
    return () => socket.off('notification_new')
  }, [socket])

  // Derived: system notifications only — for the bell
  const systemNotifications = allNotifications.filter(n => isSystemNotification(n))

  // Derived: unread system count only
  const unreadCount = systemNotifications.filter(n => !n.read).length

  // Marks a notification as read
  const markAsRead = useCallback((notificationId) => {
    if (socket) {
      socket.emit('notification_read', { notificationId })
    }
    setAllNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n))
  }, [socket])

  return (
    <NotificationContext.Provider value={{ notifications: systemNotifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}