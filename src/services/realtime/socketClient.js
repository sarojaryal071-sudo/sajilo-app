// Shared socket.io client instance — single connection reused across all components to avoid duplicate sockets
import { io } from 'socket.io-client'

const SOCKET_URL = 'https://sajilo-backend-c7mi.onrender.com'
let socket = null

// Returns existing socket or creates new authenticated connection
export function getSocket() {
  const token = localStorage.getItem('sajilo_token')
  if (!token) return null
  
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, { 
      auth: { token },
      transports: ['websocket', 'polling']
    })
  }
  return socket
}

// Reconnects socket with fresh token — call after login
export function reconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
  return getSocket()
}

// Disconnects and clears socket — used on logout
export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}