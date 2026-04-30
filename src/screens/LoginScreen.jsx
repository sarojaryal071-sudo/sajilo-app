import { useState } from 'react'
import { loginUser } from '../config/auth.js'
import BrandPanel from '../components/BrandPanel.jsx'
import LoginForm from '../components/auth/LoginForm.jsx'

export default function LoginScreen({ navigate, t, onLogin }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

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

  return (
    <div className="auth-page" style={{ display: 'flex', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      <div className="brand-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)', position: 'relative', overflow: 'hidden' }}><BrandPanel /></div>
      <div className="form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div className="auth-card" style={{ width: '100%', maxWidth: 430, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 5vw, 44px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Welcome back</h2>
          <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 24 }}>Sign in to continue</p>
          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} success={success} navigate={navigate} />
        </div>
      </div>
      <style>{`
        .auth-page, .auth-page .form-side, .auth-page .form-side * { --bg-primary: #f0f2f6 !important; --bg-surface: #ffffff !important; --bg-surface2: #f7f8fa !important; --text-primary: #1a1d23 !important; --text-secondary: #6b7280 !important; --border: #e5e7eb !important; --accent-blue: #1A6FD4 !important; --accent-blue-light: #EBF3FF !important; }
        @media (max-width: 768px) {
          .brand-side { position: absolute !important; inset: 0 !important; opacity: 1 !important; pointer-events: none !important; }
          .auth-page { overflow-y: auto; overscroll-behavior: none; }
          .form-side { flex: none !important; width: 100% !important; min-height: 100vh !important; min-height: 100dvh !important; }
          .auth-card { box-shadow: 0 12px 48px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1) !important; margin: 0; background: #ffffff !important; padding: 20px !important; width: 100% !important; max-width: 430px !important; align-self: center !important; }
        }
      `}</style>
    </div>
  )
}