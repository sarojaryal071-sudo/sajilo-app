// Shared socket.io client instance — single connection reused across all components
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.PROD
  ? 'https://sajilo-backend-c7mi.onrender.com'
  : 'http://localhost:5000'

  
let socket = null

// Returns existing socket or creates new authenticated connection
export function getSocket() {
  const token = localStorage.getItem('sajilo_token')
  if (!token) return null

  // If socket already exists and is connected or still connecting, reuse it
  if (socket && (socket.connected || socket.active)) return socket

  // Clean up only a truly dead socket (disconnected and not reconnecting)
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }

  socket = io(SOCKET_URL, { 
    auth: { token },
    transports: ['websocket', 'polling'],
    upgrade: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 20000,
  })

  return socket
}

// Reconnects socket with fresh token — call after login
export function reconnectSocket() {
  const token = localStorage.getItem('sajilo_token')
  if (!token) return null
  
  if (socket) {
    socket.disconnect()
    socket = null
  }
  
  socket = io(SOCKET_URL, { 
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
  })
  
  return socket
}

// Disconnects and clears socket — used on logout
export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}