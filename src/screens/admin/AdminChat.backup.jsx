// AdminChat — admin panel view for managing all user conversations and replying in real-time
import { useState, useRef, useEffect, useMemo } from 'react'
import { useSocket } from '../../hooks/useSocket.js'

export default function AdminChat() {
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const activeConvRef = useRef(null)

  const token = localStorage.getItem('sajilo_token')
  const apiUrl = 'http://localhost:5000'
  const { socket } = useSocket()

  // Keeps activeConv in sync with ref for use inside socket handler
  useEffect(() => {
    activeConvRef.current = activeConv
  }, [activeConv])

  // Loads all conversations from the backend
  useEffect(() => {
    if (!token) return
    fetch(`${apiUrl}/api/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setConversations(d.data || []))
  }, [token])

  // Listens for new messages in real-time and refreshes conversation list
  useEffect(() => {
    if (!socket) return
    const handler = (msg) => {
      if (activeConvRef.current && msg.conversation_id === activeConvRef.current.id) {
        setMessages(prev => [...prev, msg])
      }
      fetch(`${apiUrl}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()).then(d => setConversations(d.data || []))
    }
    socket.on('new_message', handler)
    return () => socket.off('new_message', handler)
  }, [socket, token])

  // Auto-scrolls to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Opens a conversation and loads its message history
  const openConversation = (conv) => {
    setActiveConv(conv)
    fetch(`${apiUrl}/api/chat/conversations/${conv.id}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setMessages(d.data || []))
  }

  // Sends a reply to the active conversation via socket
  const handleSend = () => {
    if (!input.trim() || !activeConv || !socket) return
    const receiverId = activeConv.other_id
    socket.emit('send_message', { receiverId, text: input.trim(), bookingId: activeConv.booking_id })
    setMessages(prev => [...prev, { id: Date.now(), sender_role: 'admin', text: input.trim(), created_at: new Date().toISOString() }])
    setInput('')
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 130px)', background: 'var(--bg-surface)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div style={{ width: 300, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Messages</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>No conversations yet</div>
          ) : (
            conversations.map(c => (
              <div key={c.id} onClick={() => openConversation(c)} style={{
                padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                background: activeConv?.id === c.id ? 'var(--accent-blue-light)' : 'transparent',
                display: 'flex', gap: 12, alignItems: 'center'
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {c.other_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.other_name}</span>
                    {c.unread > 0 && <span style={{ background: 'var(--accent-blue)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, flexShrink: 0 }}>{c.unread}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.last_message || 'No messages'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{c.other_role}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
        {activeConv ? (
          <>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💬</span> {activeConv.other_name} <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 400 }}>({activeConv.other_role})</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {messages.map(m => {
                const isAdmin = m.sender_role === 'admin' || m.sender_id === 'admin'
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '70%', padding: '10px 16px', borderRadius: 16, borderBottomRightRadius: isAdmin ? 4 : 16, borderBottomLeftRadius: isAdmin ? 16 : 4, background: isAdmin ? 'var(--accent-blue)' : 'var(--bg-surface)', color: isAdmin ? '#fff' : 'var(--text-primary)', fontSize: 13, lineHeight: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      {m.text}
                      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7, textAlign: 'right' }}>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a reply..." style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: '1px solid var(--border)', background: 'var(--bg-primary)', fontSize: 13, outline: 'none' }} />
              <button onClick={handleSend} style={{ padding: '10px 20px', borderRadius: 24, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>Select a conversation to start chatting</div>
        )}
      </div>
    </div>
  )
}