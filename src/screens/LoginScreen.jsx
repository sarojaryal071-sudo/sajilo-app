import { useState } from 'react'
import { loginUser } from '../config/auth.js'

export default function LoginScreen({ navigate, t, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = loginUser(email, password)
    
    if (!result.success) {
      setError(result.error)
      return
    }
    
    onLogin(result.user)
    
    if (result.user.role === 'admin') navigate('/admin/dashboard')
    else if (result.user.role === 'worker') navigate('/worker/dashboard')
    else navigate('/home')
  }

  return (
    <div style={{
      maxWidth: 400, margin: '60px auto', padding: 32,
      background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
    }}>
      <h2 style={{
        fontSize: 'var(--font-large)', fontWeight: 800,
        color: 'var(--text-primary)', marginBottom: 4, textAlign: 'center',
      }}>
        Welcome to Sajilo
      </h2>
      <p style={{
        fontSize: 'var(--font-body)', color: 'var(--text-secondary)',
        marginBottom: 24, textAlign: 'center',
      }}>
        Sign in to continue
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{
            fontSize: 'var(--font-body-sm)', fontWeight: 600,
            color: 'var(--text-primary)', display: 'block', marginBottom: 4,
          }}>
            Email
          </label>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="you@email.com" required
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
              border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`,
              background: 'var(--bg-surface2)', color: 'var(--text-primary)',
              fontSize: 'var(--font-body)', outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{
            fontSize: 'var(--font-body-sm)', fontWeight: 600,
            color: 'var(--text-primary)', display: 'block', marginBottom: 4,
          }}>
            Password
          </label>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••" required
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
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
          padding: '12px', borderRadius: 'var(--radius-sm)',
          border: 'none', background: 'var(--accent-blue)',
          color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600,
          cursor: 'pointer', marginTop: 4,
        }}>
          Sign In
        </button>
      </form>

      <p style={{
        fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)',
        textAlign: 'center', marginTop: 16,
      }}>
        Don't have an account?{' '}
        <span onClick={() => navigate('/signup')} style={{
          color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600,
        }}>
          Sign up
        </span>
      </p>
    </div>
  )
}