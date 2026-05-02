// EventMap — centralized event name registry for the communication backbone
// Prevents event name mismatches across all panels and core systems

const EVENT_MAP = {
  CHAT_NEW_MESSAGE: 'chat:new_message',
  CHAT_MESSAGE_SENT: 'chat:message_sent',
  CHAT_CONVERSATION_UPDATED: 'chat:conversation_updated',
  CHAT_ERROR: 'chat:error',

  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  SYSTEM_ERROR: 'system:error',
}

export default EVENT_MAP