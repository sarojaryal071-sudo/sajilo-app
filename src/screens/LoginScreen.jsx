import { useState, useEffect } from 'react'
import { loginUser } from '../config/auth.js'
import BrandPanel from '../components/BrandPanel.jsx'
import LoginForm from '../components/auth/LoginForm.jsx'
import { useState, useEffect, useRef } from 'react'

export default function LoginScreen({ navigate, t, onLogin }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const cardRef = useRef(null)

  // Lock body scroll on auth page — remove on leave
  useEffect(() => {
    document.documentElement.classList.add('auth-locked')
    return () => document.documentElement.classList.remove('auth-locked')
  }, [])

  const handleSubmit = async (formData) => {
    const identifier = formData.identifier
    const password = formData.password
    setError('')
    setLoading(true)
    const result = await loginUser(identifier, password)
    if (!result.success) { setError(result.error); setLoading(false); return }
    const roleMessages = { customer: 'Welcome back! Find trusted workers near you.', worker: 'Ready to work? Check your dashboard for new jobs.', admin: 'Welcome back, Admin.' }
    setSuccess(roleMessages[result.user.role] || 'Welcome back!')
    setTimeout(() => { onLogin(result.user); localStorage.setItem('sajilo_user', JSON.stringify(result.user)); if (result.user.role === 'admin') navigate('/admin/dashboard'); else if (result.user.role === 'worker') navigate('/worker/dashboard'); else navigate('/home') }, 800)
  }

  const onPointerDown = (e) => {
  setIsDragging(true)
  dragStart.current = e.clientY - dragY
  e.target.setPointerCapture(e.pointerId)
}

const onPointerMove = (e) => {
  if (!isDragging) return
  const delta = (e.clientY - dragStart.current) * 0.2
  setDragY(delta)
}

const onPointerUp = () => {
  setIsDragging(false)
  setDragY(0)
}

  return (
    <div className="auth-page" style={{ display: 'flex', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      <div className="brand-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}><BrandPanel /></div>
      <div className="form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div className="auth-card"
  ref={cardRef}
  onPointerDown={onPointerDown}
  onPointerMove={onPointerMove}
  onPointerUp={onPointerUp}
  onPointerCancel={onPointerUp}
  style={{
    width: '100%', maxWidth: 430, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 5vw, 44px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    transform: `translateY(${dragY}px)`,
    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    touchAction: 'none',
    cursor: isDragging ? 'grabbing' : 'default',
  }}>
          <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Welcome back</h2>
          <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 24 }}>Sign in to continue</p>
          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} success={success} navigate={navigate} />
        </div>
      </div>
      <style>{`
        .auth-page, .auth-page .form-side, .auth-page .form-side * { --bg-primary: #f0f2f6 !important; --bg-surface: #ffffff !important; --bg-surface2: #f7f8fa !important; --text-primary: #1a1d23 !important; --text-secondary: #6b7280 !important; --border: #e5e7eb !important; --accent-blue: #1A6FD4 !important; --accent-blue-light: #EBF3FF !important; }
        @media (max-width: 768px) {
          .brand-side { position: absolute !important; inset: 0 !important; opacity: 1 !important; pointer-events: none !important; }
          .auth-page { overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; }
          .form-side { flex: none !important; width: 100% !important; min-height: 100vh !important; min-height: 100dvh !important; }
          .auth-card { box-shadow: 0 12px 48px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1) !important; margin: 0; background: #ffffff !important; padding: 20px !important; width: 100% !important; max-width: 430px !important; align-self: center !important; }
        }
      `}</style>
    </div>
  )
}