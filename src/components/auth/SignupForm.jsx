import { useState } from 'react'
import { useContent } from '../../hooks/useContent.js'

export default function SignupForm({ onSubmit, loading, error, success, navigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, email, password, confirmPassword, phone, role: 'customer' })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>

      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)' }}>Sajilo</div>
      </div>

      <div>
        <label style={l}>{useContent('auth.signup.name.label')}</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder={useContent('auth.signup.name.placeholder')} required style={i} />
      </div>

      <div>
        <label style={l}>{useContent('auth.signup.email.label')}</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder={useContent('auth.signup.email.placeholder')} required style={i} />
      </div>

      <div>
        <label style={l}>{useContent('field.phone')}</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder={useContent('field.phonePlaceholder')} style={i} />
      </div>

      <div>
        <label style={l}>{useContent('auth.signup.password.label')}</label>
        <div style={{ position: 'relative' }}>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={useContent('auth.signup.password.placeholder')} required style={{ ...i, paddingRight: 44 }} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            style={eyeBtn}>{showPassword ? '🙈' : '👁'}</button>
        </div>
      </div>

      <div>
        <label style={l}>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password" required style={i} />
      </div>

      {error && <div style={{ color: 'var(--accent-red)', fontSize: 13, textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'var(--accent-green)', fontSize: 13, textAlign: 'center' }}>{success}</div>}

      <button type="submit" disabled={loading}
        style={{ ...btn, opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Creating account...' : useContent('auth.signup.button')}
      </button>

      <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
        {useContent('auth.signup.loginText')}{' '}
        <span onClick={() => navigate?.('/login')} style={{ color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer' }}>
          {useContent('auth.signup.loginLink')}
        </span>
      </div>
    </form>
  )
}

const l = { fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }
const i = { width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }
const btn = { padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-blue)', color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600, cursor: 'pointer', marginTop: 4 }
const eyeBtn = { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-secondary)' }