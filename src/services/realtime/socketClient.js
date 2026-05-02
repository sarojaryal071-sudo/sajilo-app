// Shared socket.io client instance — single connection reused across all components to avoid duplicate sockets
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'
let socket = null

// Returns the existing socket or creates a new authenticated connection
export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem('sajilo_token')
    if (!token) return null
    socket = io(SOCKET_URL, { auth: { token } })
  }
  return socket
}

// Disconnects and clears the socket instance — used on logout
export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}