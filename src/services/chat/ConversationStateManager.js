// ConversationStateManager — shared unread tracking for admin, client, and worker panels
// Pure frontend state — no backend changes required

class ConversationStateManager {
  constructor() {
    this.unreadConversations = new Set()
    this.listeners = []
  }

  // Mark a conversation as having unread messages
  setUnread(conversationId) {
    this.unreadConversations.add(conversationId)
    this._notify()
  }

  // Mark a conversation as read (all messages seen)
  setRead(conversationId) {
    this.unreadConversations.delete(conversationId)
    this._notify()
  }

  // Check if a conversation has unread messages
  isUnread(conversationId) {
    return this.unreadConversations.has(conversationId)
  }

  // Get total unread conversation count
  getUnreadCount() {
    return this.unreadConversations.size
  }

  // Subscribe to state changes
  onChange(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  // Notify all listeners of state change
  _notify() {
    this.listeners.forEach(cb => cb(this.getUnreadCount()))
  }
}

// Single shared instance across all panels
const conversationState = new ConversationStateManager()
export default conversationState