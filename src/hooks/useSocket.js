// useSocket hook — provides shared socket instance and connection state to any component
import { useState, useEffect, useMemo } from 'react'
import { getSocket } from '../services/realtime/socketClient.js'

export function useSocket() {
  const [connected, setConnected] = useState(false)
  const socket = useMemo(() => getSocket(), [])

  // Listen for connection and disconnection events
  useEffect(() => {
    if (!socket) return
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [socket])

  return { socket, connected }
}