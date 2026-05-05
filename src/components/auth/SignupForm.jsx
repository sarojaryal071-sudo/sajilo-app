import { useState, useEffect, useRef } from 'react'
import { useContent } from '../../hooks/useContent.js'

export default function SignupForm({ onSubmit, loading, error, success, navigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // ─── Soft‑coded animation replay without remounting ───
  const [errorAnimTime, setErrorAnimTime] = useState(0)
  const errorRef = useRef(null)

  // Each time `error` string changes → restart animation
  useEffect(() => {
    if (error) {
      setErrorAnimTime(Date.now())
      // Remove + re-add animation class to restart
      if (errorRef.current) {
        errorRef.current.style.animation = 'none'
        requestAnimationFrame(() => {
          if (errorRef.current) {
            errorRef.current.style.animation = 'shake 0.4s ease'
          }
        })
      }
    }
  }, [error])

  // ─── All content hooks at TOP LEVEL, never in JSX ───
  const brandText = useContent('brand.name', 'Sajilo')
  const nameLabel = useContent('auth.signup.name.label', 'Full Name')
  const namePlaceholder = useContent('auth.signup.name.placeholder', 'Enter your full name')
  const emailLabel = useContent('auth.signup.email.label', 'Email')
  const emailPlaceholder = useContent('auth.signup.email.placeholder', 'you@example.com')
  const phoneLabel = useContent('field.phone', 'Phone Number')
  const phonePlaceholder = useContent('field.phonePlaceholder', 'Enter your phone number')
  const passwordLabel = useContent('auth.signup.password.label', 'Password')
  const passwordPlaceholder = useContent('auth.signup.password.placeholder', 'Create a password')
  const confirmLabel = useContent('auth.signup.confirmPassword.label', 'Confirm Password')
  const confirmPlaceholder = useContent('auth.signup.confirmPassword.placeholder', 'Re-enter your password')
  const createAccountBtn = useContent('auth.signup.button', 'Create Account')
  const creatingAccountText = useContent('auth.signup.button.loading', 'Creating account...')
  const loginText = useContent('auth.signup.loginText', 'Already have an account?')
  const loginLink = useContent('auth.signup.loginLink', 'Log in')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name, email, password, confirmPassword, phone, role: 'customer' })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>

      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)' }}>{brandText}</div>
      </div>

      <div>
        <label style={l}>
          {nameLabel}
          <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>
        </label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder={namePlaceholder} style={i} />
      </div>

      <div>
        <label style={l}>
          {emailLabel}
          <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>
        </label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder={emailPlaceholder} style={i} />
      </div>

      <div>
        <label style={l}>{phoneLabel}</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
          placeholder={phonePlaceholder} style={i} />
      </div>

      <div>
        <label style={l}>
          {passwordLabel}
          <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>
        </label>
        <input type={showPassword?'text':'password'} value={password} onChange={e => setPassword(e.target.value)}
          placeholder={passwordPlaceholder} style={i} />
        <span onClick={()=>setShowPassword(!showPassword)} style={{fontSize:13,cursor:'pointer',color:'var(--accent-blue)'}}>
          {showPassword ? 'Hide' : 'Show'}
        </span>
      </div>

      <div>
        <label style={l}>
          {confirmLabel}
          <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>
        </label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          placeholder={confirmPlaceholder} style={i} />
      </div>

      {/* Error box – always mounted, visibility + animation controlled by state */}
      <div
        ref={errorRef}
        style={{
          background: '#fee2e2',
          color: '#DC2626',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: 16,
          textAlign: 'center',
          animation: 'none',
          display: error ? 'block' : 'none',
        }}
        role="alert"
      >
        {error}
      </div>

      {success && <div style={{color:'var(--accent-green)',fontSize:13,textAlign:'center'}}>{success}</div>}

      <button type="submit" disabled={loading} style={{...btn, opacity:loading?0.6:1}}>
        {loading ? creatingAccountText : createAccountBtn}
      </button>

      <div style={{textAlign:'center',fontSize:13,color:'var(--text-secondary)'}}>
        {loginText}{' '}
        <span onClick={()=>navigate?.('/login')} style={{color:'var(--accent-blue)',fontWeight:600,cursor:'pointer'}}>
          {loginLink}
        </span>
      </div>
    </form>
  )
}

const l = {fontSize:12,fontWeight:600,color:'var(--text-primary)',display:'block',marginBottom:4}
const i = {width:'100%',padding:'12px 14px',borderRadius:'var(--radius-md)',border:'1px solid var(--border)',background:'var(--bg-surface2)',color:'var(--text-primary)',fontSize:'var(--font-body)',outline:'none'}
const btn = {padding:'14px',borderRadius:'var(--radius-md)',border:'none',background:'var(--accent-blue)',color:'#fff',fontSize:'var(--font-body)',fontWeight:600,cursor:'pointer',marginTop:4}