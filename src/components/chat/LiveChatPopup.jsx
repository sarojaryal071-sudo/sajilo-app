import { useState, useRef, useEffect } from 'react'
import { useFeatureFlag } from '../../hooks/useFeatureFlag.js'
import { useContent } from '../../hooks/useContent.js'
import { useAnimation } from '../../hooks/useAnimation.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function LiveChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, from: 'support', text: 'Hello! How can we help you today?', time: 'Just now' },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const chatEnabled = useFeatureFlag('liveChat')

  // 🔧 Admin-configurable position via useStyle
  const positionStyle = useStyle('chatPosition') || {}
  const bubbleAnim = useAnimation('LiveChat', 'bubble')
  const windowAnim = useAnimation('LiveChat', 'window')

  const chatTitle = useContent('chat.title') || 'Support Chat'
  const placeholder = useContent('chat.placeholder') || 'Type your message...'
  const sendLabel = useContent('chat.send') || 'Send'
  const onlineLabel = useContent('chat.online') || 'Online'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: input.trim(), time: 'Just now' }])
    setInput('')
  }

  if (!chatEnabled) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: positionStyle.bottom || 20,
      right: positionStyle.right || 20,
      left: positionStyle.left,
      top: positionStyle.top,
      zIndex: 1000,
    }}>
      {isOpen && (
        <windowAnim.animated.div style={{
          width: 340, height: 440, background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          marginBottom: 12, border: '1px solid var(--border)',
          ...windowAnim.style,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--accent-blue)', color: '#fff' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{chatTitle}</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>🟢 {onlineLabel}</div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
                  background: msg.from === 'user' ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                  color: msg.from === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: 13, lineHeight: 1.4,
                  borderBottomRightRadius: msg.from === 'user' ? 4 : 14,
                  borderBottomLeftRadius: msg.from === 'user' ? 14 : 4,
                }}>
                  {msg.text}
                  <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={placeholder}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
            <button onClick={handleSend} style={{ padding: '10px 16px', borderRadius: 20, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{sendLabel}</button>
          </div>
        </windowAnim.animated.div>
      )}
      <bubbleAnim.animated.div onClick={() => setIsOpen(!isOpen)} style={{
        width: 52, height: 52, borderRadius: '50%', background: 'var(--accent-blue)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,111,212,0.3)',
        marginLeft: positionStyle.left ? '0' : 'auto',
        fontSize: 22, color: '#fff',
        ...bubbleAnim.style,
      }}>
        {isOpen ? '✕' : '💬'}
      </bubbleAnim.animated.div>
    </div>
  )
}