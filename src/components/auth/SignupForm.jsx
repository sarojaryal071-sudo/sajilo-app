import { useState } from 'react'
import { useFeatureFlag } from '../../hooks/useFeatureFlag.js'
import { useContent } from '../../hooks/useContent.js'
import AuthSection from './AuthSection.jsx'

export default function SignupForm({ onSubmit, loading, error, success, navigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const showGoogle = useFeatureFlag('googleLogin')
  const showApple = useFeatureFlag('appleLogin')
  const showTerms = useFeatureFlag('termsText')
  const showDivider = useFeatureFlag('socialDivider')
  const showLogo = useFeatureFlag('signupLogo')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, email, password, confirmPassword, role })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>

      <AuthSection visible={showLogo} style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)' }}>Sajilo</div>
      </AuthSection>

      <AuthSection>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
          {useContent('auth.signup.name.label')}
        </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder={useContent('auth.signup.name.placeholder')} required
          style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }}
        />
      </AuthSection>

      <AuthSection>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
          {useContent('auth.signup.email.label')}
        </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder={useContent('auth.signup.email.placeholder')} required
          style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }}
        />
      </AuthSection>

      <AuthSection>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
          {useContent('auth.signup.password.label')}
        </label>
        <div style={{ position: 'relative' }}>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={useContent('auth.signup.password.placeholder')} required
            style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }}
          />
          <span onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)}
            onTouchStart={() => setShowPassword(true)} onTouchEnd={() => setShowPassword(false)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 16, userSelect: 'none', opacity: 0.5, color: 'var(--text-secondary)' }}>👁</span>
        </div>
      </AuthSection>

      <AuthSection>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
          Confirm Password
        </label>
        <div style={{ position: 'relative' }}>
          <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••" required
            style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }}
          />
          <span onMouseDown={() => setShowConfirm(true)} onMouseUp={() => setShowConfirm(false)} onMouseLeave={() => setShowConfirm(false)}
            onTouchStart={() => setShowConfirm(true)} onTouchEnd={() => setShowConfirm(false)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 16, userSelect: 'none', opacity: 0.5, color: 'var(--text-secondary)' }}>👁</span>
        </div>
      </AuthSection>

      <AuthSection>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
          {useContent('auth.signup.role.label')}
        </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none', cursor: 'pointer' }}>
          <option value="customer">{useContent('auth.signup.role.customer')}</option>
          <option value="worker">{useContent('auth.signup.role.worker')}</option>
        </select>
      </AuthSection>

      {error && (
        <AuthSection>
          <div style={{ fontSize: 12, color: 'var(--accent-red)', fontWeight: 500 }}>{error}</div>
        </AuthSection>
      )}

      {success && (
        <AuthSection>
          <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600, background: 'var(--accent-green-light)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>{success}</div>
        </AuthSection>
      )}

      <AuthSection>
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', background: loading ? '#94a3b8' : 'var(--accent-green)', color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', marginTop: 4, transition: 'all 0.2s', transform: loading ? 'scale(0.98)' : 'scale(1)' }}>
          {loading ? <span className="loading-dots">{useContent('auth.signup.button.loading')}<span>.</span><span>.</span><span>.</span></span> : useContent('auth.signup.button')}
        </button>
      </AuthSection>

      <AuthSection visible={showDivider}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{useContent('auth.login.divider')}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
      </AuthSection>

      <AuthSection visible={showGoogle || showApple}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {showGoogle && (
            <button type="button" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              G {useContent('auth.login.google')}
            </button>
          )}
          {showApple && (
            <button type="button" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: '#000', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
               {useContent('auth.login.apple')}
            </button>
          )}
        </div>
      </AuthSection>

      <AuthSection visible={showTerms}>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center' }}>
          {useContent('auth.login.terms')}{' '}
          <span style={{ color: 'var(--accent-blue)', cursor: 'pointer' }}>{useContent('auth.login.termsLink')}</span>
          {' & '}
          <span style={{ color: 'var(--accent-blue)', cursor: 'pointer' }}>{useContent('auth.login.privacyLink')}</span>
        </p>
      </AuthSection>

      <AuthSection>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
          {useContent('auth.signup.loginText')}{' '}
          <span onClick={() => navigate('/login')} style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600 }}>
            {useContent('auth.signup.loginLink')}
          </span>
        </p>
      </AuthSection>

    </form>
  )
}