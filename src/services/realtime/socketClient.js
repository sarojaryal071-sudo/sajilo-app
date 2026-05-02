// Shared socket.io client instance — single connection reused across all components to avoid duplicate sockets
import { io } from 'socket.io-client'

// Force production URL when deployed — comment/uncomment for local dev
const SOCKET_URL = 'https://sajilo-backend-c7mi.onrender.com'
// const SOCKET_URL = import.meta.env.PROD 
//   ? 'https://sajilo-backend-c7mi.onrender.com'
//   : 'http://localhost:5000'

let socket = null

export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem('sajilo_token')
    if (!token) return null
    socket = io(SOCKET_URL, { auth: { token } })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}