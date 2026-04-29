import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'
import { services } from '../../config/data.js'

export default function AdminNotifications() {
  const [workers, setWorkers] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('all')
  const [priority, setPriority] = useState('normal')
  const [sent, setSent] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    loadWorkers()
    loadHistory()
  }, [])

  const loadWorkers = async () => {
    try {
      const res = await api.getAdminWorkers()
      setWorkers(res.data || [])
    } catch (err) { console.error(err) }
  }

  const loadHistory = async () => {
    try {
      const res = await api.getNotifications()
      setHistory(res.data || [])
    } catch (err) { console.error(err) }
  }

  const onlineCount = workers.filter(w => w.is_online).length

  const getAudienceLabel = () => {
    if (audience === 'all') return `All Workers (${workers.length})`
    if (audience === 'online') return `Online Workers (${onlineCount})`
    const cat = services.find(s => s.id === audience)
    if (cat) {
      const count = workers.filter(w => (w.skills || []).some(s => s.toLowerCase() === cat.name.toLowerCase())).length
      return `${cat.name} (${count} workers)`
    }
    return audience
  }

  const handleSend = async () => {
    try {
      const catName = audience !== 'all' && audience !== 'online'
        ? services.find(s => s.id === audience)?.name
        : null

      await api.sendNotification({
        title,
        message,
        priority,
        target: {
          type: audience === 'all' ? 'all' : audience === 'online' ? 'online' : 'category',
          category: catName,
        },
      })
      setSent(true)
      setTitle('')
      setMessage('')
      setTimeout(() => setSent(false), 3000)
      loadHistory()
    } catch (err) {
      console.error('Failed to send:', err)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        Notifications
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
            Compose Notification
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                fontSize: 13, outline: 'none', background: 'var(--bg-surface2)', color: 'var(--text-primary)',
              }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Notification message..." style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                fontSize: 13, outline: 'none', resize: 'none', overflowY: 'auto',
                background: 'var(--bg-surface2)', color: 'var(--text-primary)',
              }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Audience</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                fontSize: 13, outline: 'none', cursor: 'pointer', background: 'var(--bg-surface2)', color: 'var(--text-primary)',
              }}>
                <option value="all">All Workers</option>
                <option value="online">Online Workers</option>
                <optgroup label="By Category">
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              </select>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{getAudienceLabel()}</div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Priority</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['normal', 'high'].map((p) => (
                  <button key={p} onClick={() => setPriority(p)} style={{
                    padding: '6px 16px', borderRadius: 6,
                    border: priority === p ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                    background: priority === p ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
                    color: priority === p ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
                  }}>{p}</button>
                ))}
              </div>
            </div>
            <button onClick={handleSend} disabled={!title || !message} style={{
              padding: '12px 0', borderRadius: 8, border: 'none',
              background: (!title || !message) ? '#cbd5e1' : sent ? '#16A34A' : 'var(--accent-blue)',
              color: '#fff', fontSize: 14, fontWeight: 600, cursor: (!title || !message) ? 'not-allowed' : 'pointer',
            }}>
              {sent ? '✓ Sent Successfully' : 'Send Notification'}
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Preview</h3>
          <div style={{
            background: priority === 'high' ? '#fef2f2' : 'var(--bg-surface2)',
            borderRadius: 10, padding: 16,
            border: priority === 'high' ? '2px solid var(--accent-red)' : '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{getAudienceLabel()}</span>
              <span style={{
                padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                background: priority === 'high' ? '#fee2e2' : '#dbeafe',
                color: priority === 'high' ? 'var(--accent-red)' : 'var(--accent-blue)',
              }}>{priority}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title || 'Notification Title'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{message || 'Your notification message will appear here...'}</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 10 }}>Just now · Sajilo Admin</div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, padding: 12, borderRadius: 8, background: 'var(--bg-surface2)', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-blue)' }}>{workers.length}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Total Workers</div>
            </div>
            <div style={{ flex: 1, padding: 12, borderRadius: 8, background: 'var(--bg-surface2)', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#16A34A' }}>{onlineCount}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Online Now</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)', padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Sent History</h3>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)', fontSize: 13 }}>No notifications sent yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((h) => (
              <div key={h.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{h.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {h.target_type === 'category' ? h.target_category : h.target_type} · {new Date(h.created_at).toLocaleString()}
                  </div>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                  background: h.priority === 'high' ? '#fee2e2' : '#dbeafe',
                  color: h.priority === 'high' ? 'var(--accent-red)' : 'var(--accent-blue)',
                }}>{h.priority}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}