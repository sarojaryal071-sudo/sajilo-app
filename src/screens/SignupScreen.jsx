import { useState } from 'react'

export default function SignupScreen({ navigate, t }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/login')
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
        Create Account
      </h2>
      <p style={{
        fontSize: 'var(--font-body)', color: 'var(--text-secondary)',
        marginBottom: 24, textAlign: 'center',
      }}>
        Join Sajilo today
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{
            fontSize: 'var(--font-body-sm)', fontWeight: 600,
            color: 'var(--text-primary)', display: 'block', marginBottom: 4,
          }}>
            Full Name
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your name" required
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: 'var(--bg-surface2)',
              color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{
            fontSize: 'var(--font-body-sm)', fontWeight: 600,
            color: 'var(--text-primary)', display: 'block', marginBottom: 4,
          }}>
            Email
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com" required
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: 'var(--bg-surface2)',
              color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none',
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
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters" required
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: 'var(--bg-surface2)',
              color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{
            fontSize: 'var(--font-body-sm)', fontWeight: 600,
            color: 'var(--text-primary)', display: 'block', marginBottom: 4,
          }}>
            I want to
          </label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{
            width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)', background: 'var(--bg-surface2)',
            color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none',
            cursor: 'pointer',
          }}>
            <option value="customer">Hire workers</option>
            <option value="worker">Work as a service provider</option>
          </select>
        </div>

        <button type="submit" style={{
          padding: '12px', borderRadius: 'var(--radius-sm)',
          border: 'none', background: 'var(--accent-green)',
          color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600,
          cursor: 'pointer', marginTop: 4,
        }}>
          Create Account
        </button>
      </form>

      <p style={{
        fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)',
        textAlign: 'center', marginTop: 16,
      }}>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} style={{
          color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600,
        }}>
          Sign in
        </span>
      </p>
    </div>
  )
}