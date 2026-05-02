// SocketAdapter — bridges existing socketClient to the MessageBus
// Passes socket events to the bus, and bus events to the socket
// Does NOT modify socketClient or any backend logic

import messageBus from '../core/messageBus.js'
import EVENT_MAP from '../registry/eventMap.js'

let socket = null

// Connects an existing socket instance to the message bus
export function connectSocket(existingSocket) {
  if (!existingSocket) return
  socket = existingSocket

  // Forward socket events to messageBus
  socket.on('new_message', (msg) => {
    messageBus.emit(EVENT_MAP.CHAT_NEW_MESSAGE, msg)
  })

  socket.on('message_sent', (msg) => {
    messageBus.emit(EVENT_MAP.CHAT_MESSAGE_SENT, msg)
  })

  socket.on('message_error', (err) => {
    messageBus.emit(EVENT_MAP.CHAT_ERROR, err)
  })

  socket.on('conversation_updated', (conv) => {
    messageBus.emit(EVENT_MAP.CHAT_CONVERSATION_UPDATED, conv)
  })

  socket.on('notification_new', (notif) => {
    messageBus.emit(EVENT_MAP.NOTIFICATION_NEW, notif)
  })
}

// Sends a chat message through the socket
export function sendMessage(payload) {
  if (socket) {
    socket.emit('send_message', payload)
  }
}

// Returns the current socket instance
export function getSocket() {
  return socket
}