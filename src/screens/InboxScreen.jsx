import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContent } from '../hooks/useContent.js'
import { useSocket } from '../hooks/useSocket.js'
import { useNotification } from '../contexts/NotificationContext.jsx'
import conversationState from '../services/chat/ConversationStateManager.js'
import { API_URL } from '../services/api.js'
import { getCurrentUser } from '../config/auth.js'

const FALLBACK_ADMIN_ID = 32

export default function InboxScreen() {
  const [searchParams] = useSearchParams()
  const targetBookingId = searchParams.get('bookingId')

  const [activeTab, setActiveTab] = useState('messages')
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [unreadConversations, setUnreadConversations] = useState(conversationState.getUnreadCount())
  const [adminId, setAdminId] = useState(FALLBACK_ADMIN_ID)
  const messagesEndRef = useRef(null)

  const { socket } = useSocket()
  const { notifications, unreadCount: notifUnread } = useNotification()

  const currentUser = getCurrentUser()
  const currentUserId = currentUser?.id

  // Fetch admin ID
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/admin/support`)
        const json = await res.json()
        if (json.success && json.data?.id) setAdminId(json.data.id)
      } catch (err) { /* keep fallback */ }
    })()
  }, [])

  const tabMessages = useContent('inbox.tab.messages', 'Messages')
  const tabNotifications = useContent('inbox.tab.notifications', 'Notifications')
  const chatPlaceholder = useContent('chat.placeholder', 'Type your message...')
  const chatSend = useContent('chat.send', 'Send')
  const newChatLabel = useContent('chat.newChat', 'New Message')
  const liveSupportLabel = useContent('chat.liveSupport', 'Live Support')
  const backLabel = useContent('chat.back', '← Back')
  const noConversations = useContent('chat.noConversations', 'No conversations yet')
  const noNotifications = useContent('notifications.empty', 'No notifications yet')

  useEffect(() => {
    const unsub = conversationState.onChange((count) => setUnreadConversations(count))
    return unsub
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token')
    if (!token) return
    fetch(`${API_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => {
      const list = d.data || []
      setConversations(list)
      if (targetBookingId && list.length > 0) {
        const targetConv = list.find(c => c.booking_id === Number(targetBookingId))
        if (targetConv) openConversation(targetConv)
      }
    })
  }, [targetBookingId])

  useEffect(() => {
    if (!socket) return
    socket.on('new_message', (msg) => {
      if (activeConv && msg.conversation_id === activeConv.id) {
        setMessages(prev => [...prev, msg])
      }
    })
    socket.on('message_sent', (msg) => {
      setMessages(prev => prev.map(m => m.id === msg.pendingId ? { ...msg } : m))
      if (activeConv && activeConv.id === 'new') {
        const realConvId = msg.conversation_id
        if (realConvId) {
          fetch(`${API_URL}/chat/conversations`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('sajilo_token')}` }
          }).then(r => r.json()).then(d => {
            const updatedList = d.data || []
            setConversations(updatedList)
            const newConv = updatedList.find(c => c.id === realConvId)
            if (newConv) {
              setActiveConv(newConv)
              conversationState.setRead(newConv.id)
            }
          })
        }
      }
    })
    socket.on('conversation_updated', (conv) => {
      setConversations(prev => {
        const existing = prev.find(c => c.id === conv.id)
        if (existing) return prev.map(c => c.id === conv.id ? { ...c, ...conv } : c)
        return [conv, ...prev]
      })
    })
    return () => {
      socket.off('new_message')
      socket.off('message_sent')
      socket.off('conversation_updated')
    }
  }, [socket, activeConv])

  // Lock body scroll when overlay is visible
  useEffect(() => {
    if (activeConv) {
      document.body.classList.add('inbox-conversation-open')
    } else {
      document.body.classList.remove('inbox-conversation-open')
    }
    return () => document.body.classList.remove('inbox-conversation-open')
  }, [activeConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!chatInput.trim() || !activeConv) return
    const text = chatInput.trim()
    socket.emit('send_message', {
      receiverId: activeConv.other_id || adminId,
      text,
      bookingId: activeConv.booking_id || null,
    })
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text, sender_name: 'You', sender_id: currentUserId }])
    setChatInput('')
  }

  const openConversation = async (conv) => {
    setActiveConv(conv)
    conversationState.setRead(conv.id)
    const token = localStorage.getItem('sajilo_token')
    try {
      const res = await fetch(`${API_URL}/chat/conversations/${conv.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setMessages(data.data || [])
    } catch (e) { console.error(e) }
  }

  const openNewSupportChat = () => {
    setActiveConv({ id: 'new', name: 'Support Chat', other_id: adminId, booking_id: null })
    setMessages([])
  }

  const isOwnMessage = (msg) => {
    if (msg.from === 'user') return true
    if (msg.sender_id && currentUserId && msg.sender_id === currentUserId) return true
    return false
  }

  // ── Conversation overlay (fixed full‑screen, only when activeConv is set) ──
  const renderConversationOverlay = () => {
    if (!activeConv) return null
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Messenger‑style header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface2)', flexShrink: 0
        }}>
          <button onClick={() => setActiveConv(null)} style={{
            background: 'none', border: 'none', fontSize: 18,
            cursor: 'pointer', color: 'var(--accent-blue)', padding: 0, lineHeight: 1
          }}>←</button>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--accent-blue-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'var(--accent-blue)',
            flexShrink: 0
          }}>
            {(activeConv.other_name || activeConv.name || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            {activeConv.other_name || activeConv.name || 'Chat'}
          </div>
        </div>

        {/* Scrollable messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12, minHeight: 0 }}>
          {messages.map(msg => {
            const isOwn = isOwnMessage(msg)
            return (
              <div key={msg.id} style={{
                display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start',
                marginBottom: 8
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
                  background: isOwn ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                  color: isOwn ? '#fff' : 'var(--text-primary)',
                  fontSize: 13, lineHeight: 1.5
                }}>
                  {!isOwn && msg.sender_name && (
                    <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>
                      {msg.sender_name}
                    </div>
                  )}
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

        {/* Fixed input at bottom */}
        <div style={{
          display: 'flex', gap: 8,
          padding: '12px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          flexShrink: 0
        }}>
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
    )
  }

  // ── Normal Inbox UI (tabs + list) ──
  return (
    <>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
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

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, marginTop: 12 }}>
          {activeTab === 'messages' ? (
            /* Conversation list (NO conversation view – it's in the overlay) */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flexShrink: 0 }}>
                <button onClick={openNewSupportChat} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  margin: '12px 16px', padding: '10px 14px',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-blue)',
                  background: 'var(--accent-blue-light)', color: 'var(--accent-blue)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', width: 'calc(100% - 32px)'
                }}>✏️ {liveSupportLabel}</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
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
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💬</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: unread ? 700 : 500, color: 'var(--text-primary)' }}>{chat.other_name || 'Support Chat'}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.last_message || 'No messages'}</div>
                        </div>
                        {unread && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0 }} />}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          ) : (
            /* Notifications tab */
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>{noNotifications}</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', opacity: n.read ? 0.6 : 1, cursor: 'pointer' }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 700, color: 'var(--text-primary)' }}>{n.title || n.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{n.time}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full‑screen conversation overlay (rendered outside normal flow) */}
      {renderConversationOverlay()}
    </>
  )
}