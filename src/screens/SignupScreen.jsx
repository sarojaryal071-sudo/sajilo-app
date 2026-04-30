import { useState } from 'react'
import { registerUser } from '../config/auth.js'
import BrandPanel from '../components/BrandPanel.jsx'

export default function SignupScreen({ navigate, t }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await registerUser(email, password, role, name)
    if (result.success) {
      const roleMessages = { customer: 'Account created! Welcome to Sajilo. Find trusted workers near you.', worker: 'Account created! Welcome to Sajilo. Start earning by helping people in your area.' }
      setSuccess(roleMessages[role] || 'Account created! Welcome to Sajilo.')
      setTimeout(() => { localStorage.setItem('sajilo_user', JSON.stringify(result.user)); navigate('/home'); }, 1000)
    } else { setError(result.error || 'Signup failed'); setLoading(false) }
  }

  return (
    <div className="auth-page" style={{ display: 'flex', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      <div className="brand-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)', position: 'relative', overflow: 'hidden' }}><BrandPanel /></div>
      <div className="form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div className="auth-card" style={{ width: '100%', maxWidth: 430, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(24px, 5vw, 40px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Create Account</h2>
          <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 24 }}>Join Sajilo today</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }} /></div>
            <div><label style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }} /></div>
            <div><label style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Password</label><div style={{ position: 'relative' }}><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }} /><span onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)} onTouchStart={() => setShowPassword(true)} onTouchEnd={() => setShowPassword(false)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 16, userSelect: 'none', opacity: 0.5, color: 'var(--text-secondary)' }}>👁</span></div></div>
            <div><label style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>I want to</label><select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none', cursor: 'pointer' }}><option value="customer">Hire workers</option><option value="worker">Work as a service provider</option></select></div>
            {error && <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--accent-red)', fontWeight: 500 }}>{error}</div>}
            {success && <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--accent-green)', fontWeight: 600, background: 'var(--accent-green-light)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>{success}</div>}
            <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', background: loading ? '#94a3b8' : 'var(--accent-green)', color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', marginTop: 4, transition: 'all 0.2s', transform: loading ? 'scale(0.98)' : 'scale(1)' }}>{loading ? <span className="loading-dots">Creating account<span>.</span><span>.</span><span>.</span></span> : 'Create Account'}</button>
          </form>
          <p style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 16 }}>Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600 }}>Sign in</span></p>
        </div>
      </div>
      <style>{`
        .auth-page, .auth-page .form-side, .auth-page .form-side * { --bg-primary: #f0f2f6 !important; --bg-surface: #ffffff !important; --bg-surface2: #f7f8fa !important; --text-primary: #1a1d23 !important; --text-secondary: #6b7280 !important; --border: #e5e7eb !important; --accent-blue: #1A6FD4 !important; --accent-blue-light: #EBF3FF !important; --accent-green: #2D9E6B !important; --accent-green-light: #E8F5EF !important; }
        @media (max-width: 768px) {
          .brand-side { position: absolute !important; inset: 0 !important; opacity: 1 !important; pointer-events: none !important; }
          .form-side { flex: none !important; width: 100% !important; height: 100vh !important; height: 100dvh !important; overflow: hidden; }
          .auth-card { box-shadow: 0 12px 48px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1) !important; margin: 0; background: #ffffff !important; padding: 20px !important; overflow-y: auto; width: 100% !important; max-width: 430px !important; align-self: center !important; }
        }
      `}</style>
    </div>
  )
}