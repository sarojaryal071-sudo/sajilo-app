// Shared socket.io client instance — single connection reused across all components
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'
// const SOCKET_URL = 'https://sajilo-backend-c7mi.onrender.com'  // PRODUCTION

let socket = null

// Returns existing socket or creates new authenticated connection
export function getSocket() {
  const token = localStorage.getItem('sajilo_token')
  if (!token) return null
  
  if (!socket || !socket.connected) {
    if (socket) {
      socket.disconnect()
      socket = null
    }
    
    socket = io(SOCKET_URL, { 
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
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