import { useState } from 'react'
import { registerUser } from '../config/auth.js'
import BrandPanel from '../components/BrandPanel.jsx'
import SignupForm from '../components/auth/SignupForm.jsx'

export default function SignupScreen({ navigate, t }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async ({ name, email, password, role }) => {
    setError('')
    setLoading(true)
    const result = await registerUser(email, password, role, name)
    if (result.success) {
      setSuccess('Account created! Welcome to Sajilo.')
      setTimeout(() => { localStorage.setItem('sajilo_user', JSON.stringify(result.user)); navigate('/home') }, 1000)
    } else { setError(result.error || 'Signup failed'); setLoading(false) }
  }

  return (
    <div className="auth-page" style={{ display: 'flex', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      <div className="brand-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}><BrandPanel /></div>
      <div className="form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div className="auth-card" style={{ width: '100%', maxWidth: 430, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(24px, 5vw, 40px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Create Account</h2>
          <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 24 }}>Join Sajilo today</p>
          <SignupForm onSubmit={handleSubmit} loading={loading} error={error} success={success} navigate={navigate} />
        </div>
      </div>
      <style>{`
        .auth-page, .auth-page .form-side, .auth-page .form-side * { --bg-primary: #f0f2f6 !important; --bg-surface: #ffffff !important; --bg-surface2: #f7f8fa !important; --text-primary: #1a1d23 !important; --text-secondary: #6b7280 !important; --border: #e5e7eb !important; --accent-blue: #1A6FD4 !important; --accent-blue-light: #EBF3FF !important; --accent-green: #2D9E6B !important; --accent-green-light: #E8F5EF !important; }
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