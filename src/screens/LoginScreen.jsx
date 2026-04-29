import { useState } from 'react'
import { loginUser } from '../config/auth.js'
import BrandPanel from '../components/BrandPanel.jsx'

export default function LoginScreen({ navigate, t, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await loginUser(email, password)

    if (!result.success) {
      setError(result.error)
      return
    }

    onLogin(result.user)
    localStorage.setItem('sajilo_user', JSON.stringify(result.user))

    if (result.user.role === 'admin') navigate('/admin/dashboard')
    else if (result.user.role === 'worker') navigate('/worker/dashboard')
    else navigate('/home')
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'var(--bg-primary)',
    }}>
      {/* Brand Panel — Left on desktop, background on mobile */}
      <div style={{
        flex: 1, display: 'flex', position: 'relative',
      }}>
        <BrandPanel />
      </div>

      {/* Login Form — Right on desktop, floating card on mobile */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px', position: 'relative', zIndex: 1,
      }}>
        <div className="auth-card" style={{
          width: '100%', maxWidth: 420,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: 40,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{
            fontSize: 'var(--font-large)', fontWeight: 800,
            color: 'var(--text-primary)', marginBottom: 4,
          }}>
            Welcome back
          </h2>
          <p style={{
            fontSize: 'var(--font-body)', color: 'var(--text-secondary)',
            marginBottom: 28,
          }}>
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                fontSize: 'var(--font-body-sm)', fontWeight: 600,
                color: 'var(--text-primary)', display: 'block', marginBottom: 6,
              }}>
                Email
              </label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@email.com" required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`,
                  background: 'var(--bg-surface2)', color: 'var(--text-primary)',
                  fontSize: 'var(--font-body)', outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{
                fontSize: 'var(--font-body-sm)', fontWeight: 600,
                color: 'var(--text-primary)', display: 'block', marginBottom: 6,
              }}>
                Password
              </label>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••" required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`,
                  background: 'var(--bg-surface2)', color: 'var(--text-primary)',
                  fontSize: 'var(--font-body)', outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--accent-red)', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <button type="submit" style={{
              padding: '14px', borderRadius: 'var(--radius-sm)',
              border: 'none', background: 'var(--accent-blue)',
              color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600,
              cursor: 'pointer', marginTop: 8,
            }}>
              Sign In
            </button>
          </form>

          <p style={{
            fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)',
            textAlign: 'center', marginTop: 24,
          }}>
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')} style={{
              color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600,
            }}>
              Sign up
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-card {
            background: rgba(255,255,255,0.95) !important;
            backdrop-filter: blur(10px) !important;
            padding: 28px !important;
          }
          [data-theme="dark"] .auth-card {
            background: rgba(26,29,37,0.95) !important;
          }
        }
      `}</style>
    </div>
  )
}