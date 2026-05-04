// CommunicationCenter — floating chat bubble and popup for customer and worker panels with real-time messaging
import { useState, useRef, useEffect, useMemo } from 'react'
import { useFeatureFlag } from '../../hooks/useFeatureFlag.js'
import { useContent } from '../../hooks/useContent.js'
import { useStyle } from '../../hooks/useStyle.js'
import { useSocket } from '../../hooks/useSocket.js'
import conversationState from '../../services/chat/ConversationStateManager.js'


const SUPPORT_ID = 32  // localhost admin (A001)
// const SUPPORT_ID = 6  // Render admin  
// Admin user ID for support chat — messages route to this user

const API_URL = 'http://localhost:5000/api'
// const API_URL = 'https://sajilo-backend-c7mi.onrender.com/api'  // PRODUCTION

export default function CommunicationCenter() {
  const [showChat, setShowChat] = useState(false)
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [chatBadge, setChatBadge] = useState(0)
  const messagesEndRef = useRef(null)
  const chatRef = useRef(null)

  const { socket } = useSocket()
  const chatEnabled = useFeatureFlag('liveChat')
  console.log('[BUBBLE] chatEnabled:', chatEnabled)
  const positionStyle = useStyle('commCenterPosition') || {}

  const chatTitle = useContent('chat.title') || 'Support Chat'
  const chatPlaceholder = useContent('chat.placeholder') || 'Type your message...'
  const chatSend = useContent('chat.send') || 'Send'
  const chatOnline = useContent('chat.online') || 'Online'
  const newChatLabel = useContent('chat.newChat') || 'New Message'
  const backLabel = useContent('chat.back') || '← Back'

  // Loads conversations from backend
  useEffect(() => {
    const token = localStorage.getItem('sajilo_token')
    if (!token) return
    fetch(`${API_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => {
      if (d.data?.length > 0) setConversations(d.data)
    })
  }, [])

  // Closes chat when clicking outside the popup
  useEffect(() => {
    const handleClick = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) setShowChat(false)
    }
    if (showChat) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showChat])

  // Subscribe to conversation state changes for badge
 const [, refresh] = useState(0)

  useEffect(() => {
  const unsub = conversationState.onChange((count) => {
    console.log('[BADGE] count changed:', count)
    setChatBadge(count)
  })
  return unsub
}, [])
  // Socket listeners
  useEffect(() => {
    if (!socket) return
    socket.on('new_message', (msg) => {
  console.log('[WORKER NEW_MSG]', msg.text)
  setMessages(prev => [...prev, { ...msg, from: msg.sender_role === 'admin' ? 'support' : 'user' }])
  if (msg.conversation_id) {
    conversationState.setUnread(msg.conversation_id)
    console.log('[SET UNREAD]', msg.conversation_id, 'unread count:', conversationState.getUnreadCount())
  }
})
    socket.on('message_sent', (msg) => {
      setMessages(prev => prev.map(m => m.id === pendingId ? { ...msg, from: 'user' } : m))
      setPendingId(null)
    })
    socket.on('message_error', (err) => console.error('Chat error:', err))
    socket.on('conversation_updated', (conversation) => {
      setConversations(prev => {
        if (prev.find(c => c.id === conversation.id)) return prev
        return [conversation, ...prev]
      })
    })
    return () => {
      socket.off('new_message')
      socket.off('message_sent')
      socket.off('message_error')
      socket.off('conversation_updated')
    }
  }, [socket, pendingId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!chatInput.trim()) return
    const text = chatInput.trim()
    const tempId = Date.now()
    setPendingId(tempId)
    console.log('[SEND] socket:', !!socket, 'receiverId:', activeChat?.other_id || SUPPORT_ID)
if (socket) {
  socket.emit('send_message', { receiverId: activeChat?.other_id || SUPPORT_ID, text, bookingId: activeChat?.bookingId || null })
}
    if (socket) {
      socket.emit('send_message', { receiverId: activeChat?.other_id || SUPPORT_ID, text, bookingId: activeChat?.bookingId || null })
    }
    setMessages(prev => [...prev, { id: tempId, from: 'user', text, sender_name: 'You', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setChatInput('')
  }

  const openConversation = (conv) => {
    setActiveChat(conv)
        conversationState.setRead(conv.id)
    const token = localStorage.getItem('sajilo_token')
    fetch(`${API_URL}/chat/conversations/${conv.id}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => {
      const normalized = (d.data || []).map(msg => ({
        ...msg,
        from: msg.sender_role === 'admin' ? 'support' : 'user'
      }))
      setMessages(normalized)
    })
  }

  const openNewChat = () => {
    setActiveChat({ id: 'new', name: 'Support Chat', other_id: SUPPORT_ID })
    setMessages([])
  }

  if (!chatEnabled) return null

  return (
    <div style={{ position: 'fixed', bottom: positionStyle.bottom || 80, right: positionStyle.right || 20, zIndex: 9999 }}>
      <div ref={chatRef} style={{ position: 'relative' }}>
        {showChat && (
          <div style={{ position: 'absolute', bottom: 52, right: 0, width: 340, height: 440, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--accent-blue)', color: '#fff' }}>
              <div><div style={{ fontSize: 14, fontWeight: 700 }}>{activeChat ? (activeChat.other_name || activeChat.name) : chatTitle}</div><div style={{ fontSize: 11, opacity: 0.85 }}>🟢 {chatOnline}</div></div>
              <button onClick={() => { setShowChat(false); setActiveChat(null) }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            {activeChat ? (
              <>
                <button onClick={() => setActiveChat(null)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', border: 'none', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{backLabel}</button>
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {messages.map(msg => {
                    const isOwn = msg.from === 'user' || msg.sender_name === 'You'
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 14, background: isOwn ? 'var(--accent-blue)' : 'var(--bg-surface2)', color: isOwn ? '#fff' : 'var(--text-primary)', fontSize: 13 }}>
                          {msg.sender_name && <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{msg.sender_name}</div>}
                          {msg.text}
                          <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : msg.time}</div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={chatPlaceholder} style={{ flex: 1, padding: '10px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                  <button onClick={handleSend} style={{ padding: '10px 16px', borderRadius: 20, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{chatSend}</button>
                </div>
              </>
            ) : (
              <>
                <button onClick={openNewChat} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 16px', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-blue)', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>✏️ {newChatLabel}</button>
                <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid var(--border)' }}>
                  {conversations.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>No conversations yet</div>
                  ) : (
                    conversations.map(chat => (
                      <div key={chat.id} onClick={() => openConversation(chat)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💬</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 13, fontWeight: conversationState.isUnread(chat.id) ? 700 : 400, color: 'var(--text-primary)' }}>{chat.other_name || 'Support Chat'}</span></div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.last_message || 'No messages'}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
        <button onClick={() => setShowChat(!showChat)} style={{ 
          width: 44, height: 44, borderRadius: '50%', 
          background: showChat ? 'var(--accent-blue)' : 'var(--bg-surface)', 
          border: '2px solid var(--border)', cursor: 'pointer', fontSize: 18, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'relative' 
        }}>
          {showChat ? '✕' : '💬'}
          {chatBadge > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              background: 'var(--accent-red)', color: '#fff',
              fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {chatBadge}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}