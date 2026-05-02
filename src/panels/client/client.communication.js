// Client Communication — connects the client panel to the communication backbone
// Provides subscribe/send functions without touching CommunicationCenter logic

import messageBus from '../../communication-core/core/messageBus.js'
import EVENT_MAP from '../../communication-core/registry/eventMap.js'
import { sendMessage } from '../../communication-core/adapters/socketAdapter.js'
import { subscribe as registerSubscription, isSubscribed, unsubscribe, cleanup } from '../../communication-core/core/subscriptionManager.js'

const PANEL = 'client'

// Subscribe to new chat messages — only subscribes once
export function onNewMessage(callback) {
  if (isSubscribed(PANEL, EVENT_MAP.CHAT_NEW_MESSAGE)) return
  registerSubscription(PANEL, EVENT_MAP.CHAT_NEW_MESSAGE, callback)
  messageBus.on(EVENT_MAP.CHAT_NEW_MESSAGE, callback)
}

// Subscribe to message sent confirmations
export function onMessageSent(callback) {
  if (isSubscribed(PANEL, EVENT_MAP.CHAT_MESSAGE_SENT)) return
  registerSubscription(PANEL, EVENT_MAP.CHAT_MESSAGE_SENT, callback)
  messageBus.on(EVENT_MAP.CHAT_MESSAGE_SENT, callback)
}

// Subscribe to conversation updates
export function onConversationUpdated(callback) {
  if (isSubscribed(PANEL, EVENT_MAP.CHAT_CONVERSATION_UPDATED)) return
  registerSubscription(PANEL, EVENT_MAP.CHAT_CONVERSATION_UPDATED, callback)
  messageBus.on(EVENT_MAP.CHAT_CONVERSATION_UPDATED, callback)
}

// Subscribe to new notifications
export function onNotification(callback) {
  if (isSubscribed(PANEL, EVENT_MAP.NOTIFICATION_NEW)) return
  registerSubscription(PANEL, EVENT_MAP.NOTIFICATION_NEW, callback)
  messageBus.on(EVENT_MAP.NOTIFICATION_NEW, callback)
}

// Send a chat message
export function sendChatMessage(payload) {
  sendMessage(payload)
}

// Cleanup all subscriptions for this panel
export function disconnect() {
  unsubscribe(PANEL, EVENT_MAP.CHAT_NEW_MESSAGE)
  unsubscribe(PANEL, EVENT_MAP.CHAT_MESSAGE_SENT)
  unsubscribe(PANEL, EVENT_MAP.CHAT_CONVERSATION_UPDATED)
  unsubscribe(PANEL, EVENT_MAP.NOTIFICATION_NEW)
  cleanup(PANEL)
}