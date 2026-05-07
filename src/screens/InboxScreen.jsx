import { useState, useRef, useEffect, useCallback } from 'react'
import { useContent } from '../hooks/useContent.js'
import { useSocket } from '../hooks/useSocket.js'
import { useNotification } from '../contexts/NotificationContext.jsx'
import conversationState from '../services/chat/ConversationStateManager.js'

const SUPPORT_ID = 32   // localhost admin; will be replaced by environment later

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState('messages')   // 'messages' | 'notifications'
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [unreadConversations, setUnreadConversations] = useState(conversationState.getUnreadCount())
  const messagesEndRef = useRef(null)

  const { socket } = useSocket()
  const { notifications, unreadCount: notifUnread } = useNotification()

  // ── Soft‑coded text ──
  const tabMessages = useContent('inbox.tab.messages', 'Messages')
  const tabNotifications = useContent('inbox.tab.notifications', 'Notifications')
  const chatTitle = useContent('chat.title', 'Support Chat')
  const chatPlaceholder = useContent('chat.placeholder', 'Type your message...')
  const chatSend = useContent('chat.send', 'Send')
  const newChatLabel = useContent('chat.newChat', 'New Message')
  const backLabel = useContent('chat.back', '← Back')
  const noConversations = useContent('chat.noConversations', 'No conversations yet')
  const noNotifications = useContent('notifications.empty', 'No notifications yet')

  // ── Subscribe to conversation unread changes ──
  useEffect(() => {
    const unsub = conversationState.onChange((count) => {
      setUnreadConversations(count)
    })
    return unsub
  }, [])

  // ── Load conversations ──
  useEffect(() => {
    const token = localStorage.getItem('sajilo_token')
    if (!token) return
    fetch('http://localhost:5000/api/chat/conversations', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => {
      if (d.data?.length > 0) setConversations(d.data)
    })
  }, [])

  // ── Socket listeners ──
  useEffect(() => {
    if (!socket) return
    socket.on('new_message', (msg) => {
      if (activeConv && msg.conversation_id === activeConv.id) {
        setMessages(prev => [...prev, { ...msg, from: msg.sender_role === 'admin' ? 'support' : 'user' }])
      }
    })
    socket.on('message_sent', (msg) => {
      setMessages(prev => prev.map(m => m.id === msg.pendingId ? { ...msg, from: 'user' } : m))
    })
    return () => {
      socket.off('new_message')
      socket.off('message_sent')
    }
  }, [socket, activeConv])

  // ── Auto‑scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!chatInput.trim() || !activeConv) return
    const text = chatInput.trim()
    socket.emit('send_message', {
      receiverId: activeConv.other_id || SUPPORT_ID,
      text,
      bookingId: activeConv.booking_id || null,
    })
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text, sender_name: 'You' }])
    setChatInput('')
  }

  const openConversation = async (conv) => {
    setActiveConv(conv)
    conversationState.setRead(conv.id)          // mark as read
    const token = localStorage.getItem('sajilo_token')
    try {
      const res = await fetch(`http://localhost:5000/api/chat/conversations/${conv.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      const normalized = (data.data || []).map(msg => ({
        ...msg,
        from: msg.sender_role === 'admin' ? 'support' : 'user'
      }))
      setMessages(normalized)
    } catch (e) {
      console.error(e)
    }
  }

  const openNewChat = () => {
    setActiveConv({ id: 'new', name: 'Support Chat', other_id: SUPPORT_ID })
    setMessages([])
  }

  // ── Layout ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 800, margin: '0 auto', width: '100%' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setActiveTab('messages')} style={{
          flex: 1, padding: '12px', border: 'none',
          background: activeTab === 'messages' ? 'var(--accent-blue-light)' : 'transparent',
          color: activeTab === 'messages' ? 'var(--accent-blue)' : 'var(--text-secondary)',
          fontSize: 'var(--font-body)', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          position: 'relative'
        }}>
          💬 {tabMessages}
          {unreadConversations > 0 && (
            <span style={{
              background: 'var(--accent-red)', color: '#fff',
              fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px'
            }}>{unreadConversations}</span>
          )}
        </button>
        <button onClick={() => setActiveTab('notifications')} style={{
          flex: 1, padding: '12px', border: 'none',
          background: activeTab === 'notifications' ? 'var(--accent-blue-light)' : 'transparent',
          color: activeTab === 'notifications' ? 'var(--accent-blue)' : 'var(--text-secondary)',
          fontSize: 'var(--font-body)', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          position: 'relative'
        }}>
          🔔 {tabNotifications}
          {notifUnread > 0 && (
            <span style={{
              background: 'var(--accent-red)', color: '#fff',
              fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px'
            }}>{notifUnread}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'messages' ? (
          activeConv ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <button onClick={() => setActiveConv(null)} style={{
                padding: '8px 16px', border: 'none', background: 'var(--bg-surface2)',
                color: 'var(--accent-blue)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                textAlign: 'left', borderBottom: '1px solid var(--border)'
              }}>{backLabel}</button>
              <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                {messages.map(msg => {
                  const isOwn = msg.from === 'user' || msg.sender_name === 'You'
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                      <div style={{
                        maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
                        background: isOwn ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                        color: isOwn ? '#fff' : 'var(--text-primary)',
                        fontSize: 13, lineHeight: 1.5
                      }}>
                        {msg.sender_name && <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{msg.sender_name}</div>}
                        {msg.text}
                        <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--border)' }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={chatPlaceholder}
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 20,
                    border: '1px solid var(--border)', background: 'var(--bg-surface2)',
                    color: 'var(--text-primary)', fontSize: 13, outline: 'none'
                  }}
                />
                <button onClick={handleSend} style={{
                  padding: '10px 16px', borderRadius: 20, border: 'none',
                  background: 'var(--accent-blue)', color: '#fff',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}>{chatSend}</button>
              </div>
            </div>
          ) : (
            <div>
              <button onClick={openNewChat} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                margin: '12px 16px', padding: '10px 14px',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-blue)',
                background: 'var(--accent-blue-light)', color: 'var(--accent-blue)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>✏️ {newChatLabel}</button>
              {conversations.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>{noConversations}</div>
              ) : (
                conversations.map(chat => {
                  const unread = conversationState.isUnread(chat.id)
                  return (
                    <div key={chat.id} onClick={() => openConversation(chat)} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', borderBottom: '1px solid var(--border)',
                      cursor: 'pointer', background: unread ? 'var(--accent-blue-light)' : 'transparent',
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'var(--bg-surface2)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, flexShrink: 0
                      }}>💬</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: unread ? 700 : 500, color: 'var(--text-primary)' }}>
                          {chat.other_name || 'Support Chat'}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {chat.last_message || 'No messages'}
                        </div>
                      </div>
                      {unread && (
                        <span style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: 'var(--accent-blue)', flexShrink: 0
                        }} />
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )
        ) : (
          /* ── Notifications ── */
          <div>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>{noNotifications}</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px', borderBottom: '1px solid var(--border)',
                  opacity: n.read ? 0.6 : 1, cursor: 'pointer'
                }}>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 700, color: 'var(--text-primary)' }}>
                    {n.title || n.message}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{n.time}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}