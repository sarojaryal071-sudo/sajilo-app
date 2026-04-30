import { useState } from 'react'
import { useFeatureFlag } from '../../hooks/useFeatureFlag.js'
import { useContent } from '../../hooks/useContent.js'
import AuthSection from './AuthSection.jsx'
import { useStyle } from '../../hooks/useStyle.js'

export default function LoginForm({ onSubmit, loading, error, success, navigate }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const showGoogle = useFeatureFlag('googleLogin')
  const showApple = useFeatureFlag('appleLogin')
  const showForgotPassword = useFeatureFlag('forgotPassword')
  const showRememberMe = useFeatureFlag('rememberMe')
  const showTerms = useFeatureFlag('termsText')
  const showDivider = useFeatureFlag('socialDivider')
  const showLogo = useFeatureFlag('loginLogo')
  const logoStyle = useStyle('loginLogo')
  const buttonStyle = useStyle('loginButton')
  const formGap = useStyle('formGap')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ identifier, password, rememberMe })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      
      <AuthSection visible={showLogo} style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ color: 'var(--accent-blue)', ...logoStyle }}>Sajilo</div>
      </AuthSection>

      <AuthSection>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
          {useContent('auth.login.identifier.label')}
        </label>
        <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
          placeholder={useContent('auth.login.identifier.placeholder')} required
          style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-blue-light)' }}
          onBlur={(e) => { e.target.style.borderColor = error ? 'var(--accent-red)' : 'var(--border)'; e.target.style.boxShadow = 'none' }}
        />
      </AuthSection>

      <AuthSection>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
          {useContent('auth.login.password.label')}
        </label>
        <div style={{ position: 'relative' }}>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={useContent('auth.login.password.placeholder')}
            style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-blue-light)' }}
            onBlur={(e) => { e.target.style.borderColor = error ? 'var(--accent-red)' : 'var(--border)'; e.target.style.boxShadow = 'none' }}
          />
          <span onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)}
            onTouchStart={() => setShowPassword(true)} onTouchEnd={() => setShowPassword(false)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 16, userSelect: 'none', opacity: 0.5, color: 'var(--text-secondary)' }}>
            👁
          </span>
        </div>
      </AuthSection>

      <AuthSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {showRememberMe && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ cursor: 'pointer' }} />
              {useContent('auth.login.rememberMe')}
            </label>
          )}
          {showForgotPassword && (
            <span style={{ fontSize: 12, color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 500 }}>
              {useContent('auth.login.forgotPassword')}
            </span>
          )}
        </div>
      </AuthSection>

      {error && (
        <AuthSection>
          <div className="error-shake" style={{ fontSize: 12, color: 'var(--accent-red)', fontWeight: 500 }}>{error}</div>
        </AuthSection>
      )}

      {success && (
        <AuthSection>
          <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600, background: 'var(--accent-green-light)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', animation: 'pulse 0.5s ease' }}>{success}</div>
        </AuthSection>
      )}

      <AuthSection>
        <button type="submit" disabled={loading} className="btn-click"
          style={{
            width: '100%',
            padding: buttonStyle.padding,
            borderRadius: buttonStyle.borderRadius,
            border: 'none',
            background: loading ? '#94a3b8' : buttonStyle.backgroundColor,
            color: buttonStyle.color,
            fontSize: buttonStyle.fontSize,
            fontWeight: buttonStyle.fontWeight,
            cursor: loading ? 'wait' : 'pointer',
            marginTop: 4,
            transition: 'all 0.2s',
            transform: loading ? 'scale(0.98)' : 'scale(1)',
          }}
          onMouseEnter={(e) => { if (!loading) e.target.style.opacity = '0.9' }}
          onMouseLeave={(e) => { if (!loading) e.target.style.opacity = '1' }}>
          {loading ? <span className="loading-dots">{useContent('auth.login.button.loading')}<span>.</span><span>.</span><span>.</span></span> : useContent('auth.login.button')}
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
          {useContent('auth.login.signupText')}{' '}
          <span onClick={() => navigate('/signup')} style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600 }}>
            {useContent('auth.login.signupLink')}
          </span>
        </p>
      </AuthSection>

    </form>
  )
}