// useSocket hook — returns shared socket instance
// Reconnects when token changes (login/logout)
import { useState, useEffect, useMemo } from 'react'
import { getSocket } from '../services/realtime/socketClient.js'

export function useSocket() {
  const [connected, setConnected] = useState(false)
  const token = localStorage.getItem('sajilo_token')
  
  // Re-create socket when token changes
  const socket = useMemo(() => getSocket(), [token])

  useEffect(() => {
    if (!socket) return
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    
    // Check if already connected
    if (socket.connected) setConnected(true)
    
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [socket])

  return { socket, connected }
}