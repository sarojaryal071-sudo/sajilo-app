import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent.js'
import { useSocket } from '../hooks/useSocket.js'
import conversationState from '../services/chat/ConversationStateManager.js'
import { API_URL } from '../services/api.js'
import { getCurrentUser } from '../config/auth.js'
import { useUnifiedNotifications } from '../governance/useUnifiedNotifications.js'

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
  const [unreadConvIds, setUnreadConvIds] = useState(() => new Set(conversationState.getUnreadIds?.() || []))
  const [adminId, setAdminId] = useState(FALLBACK_ADMIN_ID)
  const messagesEndRef = useRef(null)

  const { socket } = useSocket()
  const navigate = useNavigate()

  // ── Unified notification layer ──
  const {
    unifiedNotifications,        // normalized array: { id, title, message, time, icon, read, … }
    notificationUnreadCount,     // pure notification unread count
    systemNotices,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    clearSystemNotices,
  } = useUnifiedNotifications()

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

  // Keep React in sync with conversation unread state
  useEffect(() => {
    const unsub = conversationState.onChange((count) => {
      setUnreadConversations(count)
      setUnreadConvIds(new Set(conversationState.getUnreadIds?.() || []))
    })
    return unsub
  }, [])

  // Fetch conversations initially (and when targetBookingId changes)
  useEffect(() => {
    const token = localStorage.getItem('sajilo_token')
    if (!token) return
    fetch(`${API_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => {
      const list = d.data || []
      setConversations(list)
      list.forEach(c => {
        if (c.unread === '1') conversationState.setUnread(c.id)
      })
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

    const refreshConversations = () => {
      const token = localStorage.getItem('sajilo_token')
      if (!token) return
      fetch(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()).then(d => {
        const list = d.data || []
        setConversations(list)
        conversationState.syncFromList(list)
        setUnreadConvIds(new Set(list.filter(c => c.unread === '1').map(c => c.id)))
      })
    }
    socket.on('booking.completed', refreshConversations)
    socket.on('booking.cancelled', refreshConversations)

    return () => {
      socket.off('new_message')
      socket.off('message_sent')
      socket.off('conversation_updated')
      socket.off('booking.completed', refreshConversations)
      socket.off('booking.cancelled', refreshConversations)
    }
  }, [socket, activeConv])

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
    setMessages(prev => [...prev, {
      id: Date.now(),
      from: 'user',
      text,
      sender_name: 'You',
      sender_id: currentUserId,
      created_at: new Date().toISOString()
    }])
    setChatInput('')
  }

  const openConversation = async (conv) => {
    setActiveConv(conv)
    conversationState.setRead(conv.id)
    setUnreadConvIds(prev => { const next = new Set(prev); next.delete(conv.id); return next })
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

  // ── Conversation overlay (unchanged) ──
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

  // ── Inbox UI (tabs + lists) ──
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
            {notificationUnreadCount > 0 && (
              <span style={{
                background: 'var(--accent-red)', color: '#fff',
                fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px'
              }}>{notificationUnreadCount}</span>
            )}
          </button>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, marginTop: 12 }}>
          {activeTab === 'messages' ? (
            /* Conversation list (unchanged) */
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
                    const unread = unreadConvIds.has(chat.id) || chat.unread === '1'
                    const lastMsgTime = chat.last_message_at
                      ? new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''
                    return (
                      <div key={chat.id} onClick={() => openConversation(chat)} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', borderBottom: '1px solid var(--border)',
                        cursor: 'pointer', background: unread ? 'var(--accent-blue-light)' : 'transparent',
                      }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💬</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: unread ? 700 : 500, color: 'var(--text-primary)' }}>
                              {chat.other_name || 'Support Chat'}
                            </div>
                            {lastMsgTime && (
                              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginLeft: 8 }}>{lastMsgTime}</div>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chat.last_message || 'No messages'}
                          </div>
                        </div>
                        {unread && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0 }} />}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          ) : (
            /* ── Modernised Notifications tab ── */
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {/* Bulk action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
                {notificationUnreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent-blue)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                )}
                {unifiedNotifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent-blue)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Clear all
                  </button>
                )}
                {systemNotices.length > 0 && (
                  <button
                    onClick={clearSystemNotices}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent-red)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Clear system
                  </button>
                )}
              </div>

              {/* System notices */}
              {systemNotices.length > 0 && (
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  {systemNotices.map(notice => (
                    <div key={notice.id} style={{
                      padding: '10px 16px', borderBottom: '1px solid var(--border)',
                      background: notice.severity === 'critical' ? '#fee2e2' : notice.severity === 'warning' ? '#fef3c7' : '#dbeafe',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{notice.title}</div>
                      <div style={{ fontSize: 12 }}>{notice.message}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notifications list */}
              {unifiedNotifications.length === 0 && systemNotices.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                  {noNotifications}
                </div>
              ) : (
                unifiedNotifications.map(n => {
                  const isRead = n.read
                  const timeStr = n.time ? new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

                  const handleTap = async () => {
                    if (!isRead) {
                      try { await markAsRead(n.id) } catch (_) {}
                    }
                    // Optional navigation based on entityType – can be extended later
                    // const path = getPath(n.type); if (path) navigate(path);
                  }

                  return (
                    <div key={n.id} onClick={handleTap} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                      opacity: isRead ? 0.6 : 1,
                      cursor: 'pointer',
                      background: isRead ? 'transparent' : 'var(--accent-blue-light)',
                    }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon || '🔔'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: isRead ? 400 : 700, color: 'var(--text-primary)' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                          {timeStr}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>

      {renderConversationOverlay()}
    </>
  )
}