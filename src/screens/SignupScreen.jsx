import { useState, useEffect, useRef } from 'react'
import { registerUser } from '../config/auth.js'
import BrandPanel from '../components/BrandPanel.jsx'
import SignupForm from '../components/auth/SignupForm.jsx'
import { useSpring, animated } from '@react-spring/web'
import { useAnimation } from '../hooks/useAnimation.js'

export default function SignupScreen({ navigate, t, onLogin }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const cardRef = useRef(null)
  const [{ y }, api] = useSpring(() => ({ y: 0 }))

  const { style: animStyle } = useAnimation('SignupScreen', 'card')

  useEffect(() => {
    document.documentElement.classList.add('auth-locked')
    return () => document.documentElement.classList.remove('auth-locked')
  }, [])

  const handleSubmit = async ({ name, email, password, role }) => {
    setError('')
    setLoading(true)
    try {
      const result = await registerUser(email, password, role, name)

      if (result.success) {
        localStorage.setItem('sajilo_user', JSON.stringify(result.user))
        if (result.token) localStorage.setItem('sajilo_token', result.token)
        setSuccess('Account created! Welcome to Sajilo.')
        if (onLogin) onLogin(result.user)

        setTimeout(() => {
          navigate(result.user.role === 'worker' ? '/worker/apply' : '/home')
        }, 1000)
      } else {
        setError(result.error || 'Signup failed')
        setLoading(false)
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
      setLoading(false)
    }
  }

  const startY = useRef(0)
  const isDragging = useRef(false)

  const handlePointerDown = (e) => {
    const tag = e.target.tagName?.toLowerCase()
    const isInteractive = ['input', 'button', 'select', 'a', 'span', 'label'].includes(tag)
    if (isInteractive) return
    isDragging.current = true
    startY.current = e.touches ? e.touches[0].clientY : e.clientY
    cardRef.current?.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    const currentY = e.touches ? e.touches[0].clientY : e.clientY
    const delta = Math.max(currentY - startY.current, 0)
    api.start({ y: delta > 200 ? 200 : delta })
  }

  const handlePointerUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    api.start({ y: 0 })
    if (y.get() >= 150) window.location.reload()
  }

  return (
    <div className="auth-page" style={{ display: 'flex', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      
      <div className="brand-side" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)',
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden'
      }}>
        <BrandPanel />
      </div>

      <div className="form-side" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', position: 'relative', zIndex: 1, overflow: 'hidden'
      }}>
        <animated.div
          ref={cardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            ...animStyle,
            transform: y.to((v) => `translateY(${v}px)`),
            width: '100%',
            maxWidth: 430,
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(24px, 5vw, 40px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            maxHeight: '100vh',
            boxSizing: 'border-box',
            touchAction: 'none',
          }}
        >
          <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Create Account</h2>
          <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 24 }}>Join Sajilo today</p>
          <SignupForm onSubmit={handleSubmit} loading={loading} error={error} success={success} navigate={navigate} />
        </animated.div>
      </div>

      <style>{`
        .auth-page, .auth-page .form-side, .auth-page .form-side * {
          --bg-primary: #f0f2f6 !important;
          --bg-surface: #ffffff !important;
          --bg-surface2: #f7f8fa !important;
          --text-primary: #1a1d23 !important;
          --text-secondary: #6b7280 !important;
          --border: #e5e7eb !important;
          --accent-blue: #1A6FD4 !important;
          --accent-blue-light: #EBF3FF !important;
          --accent-green: #2D9E6B !important;
          --accent-green-light: #E8F5EF !important;
        }
        @media (max-width: 768px) {
          .brand-side { position: absolute !important; inset: 0 !important; opacity: 1 !important; pointer-events: none !important; }
          .auth-page { overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; }
          .form-side { flex: none !important; width: 100% !important; min-height: 100vh !important; min-height: 100dvh !important; }
        }
      `}</style>
    </div>
  )
}