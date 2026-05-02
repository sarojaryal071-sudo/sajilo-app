// Communication Core — central exports for the communication backbone
// Panels import from here to access the bus, events, and adapters

export { default as messageBus } from './core/messageBus.js'
export { subscribe, unsubscribe, isSubscribed, cleanup } from './core/subscriptionManager.js'
export { default as EVENT_MAP } from './registry/eventMap.js'
export { connectSocket, sendMessage, getSocket } from './adapters/socketAdapter.js'