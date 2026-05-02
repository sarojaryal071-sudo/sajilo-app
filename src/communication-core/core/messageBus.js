// MessageBus — central event emitter for the communication backbone
// All panels send and receive events through this bus
// Prevents duplicate listeners and provides cleanup

class MessageBus {
  constructor() {
    this.listeners = {}
  }

  // Subscribe to an event — returns unsubscribe function
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set()
    }
    this.listeners[event].add(callback)

    // Return cleanup function
    return () => {
      this.listeners[event]?.delete(callback)
    }
  }

  // Emit an event to all subscribers
  emit(event, payload) {
    const handlers = this.listeners[event]
    if (handlers) {
      handlers.forEach(callback => {
        try {
          callback(payload)
        } catch (err) {
          console.error(`[MessageBus] Error in handler for ${event}:`, err)
        }
      })
    }
  }

  // Remove all listeners for an event
  clear(event) {
    delete this.listeners[event]
  }

  // Remove all listeners
  clearAll() {
    this.listeners = {}
  }
}

// Single instance — shared across all panels
const messageBus = new MessageBus()
export default messageBus