import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandPanel from '../../components/BrandPanel.jsx'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import { getCurrentUser } from '../../config/auth.js'
import { useAnimation } from '../../hooks/useAnimation.js'
import { useContent } from '../../hooks/useContent.js'
import { useStyle } from '../../hooks/useStyle.js'
import fieldRegistry from '../../config/fieldRegistry.js'

const CARDS = fieldRegistry.workerApplyCards || []

export default function WorkerApply() {
  const navigate = useNavigate()
  const { profile } = useWorker()
  const [currentCard, setCurrentCard] = useState(0)
  const [formData, setFormData] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { style: animStyle, animated: Animated } = useAnimation('WorkerApply', 'card')
  const popupAnim = useAnimation('WorkerApply', 'popup')
  const navbarStyle = useStyle('pendingNavbar') || {}
  const navBtnStyle = useStyle('pendingNavBtn') || {}
  const logoutBtnStyle = useStyle('pendingLogoutBtn') || {}
  const mobileBarStyle = useStyle('pendingMobileBar') || {}
  const nextBtnStyle = useStyle('applyNextBtn') || {}
  const prevBtnStyle = useStyle('applyPrevBtn') || {}
  const confirmBtnStyle = useStyle('applyConfirmBtn') || {}

  const brandName = useContent('worker.pendingBrandName') || 'Sajilo'
  const title = useContent('worker.applyTitle')
  const themeLabel = useContent('worker.theme') || 'Theme'
  const logoutLabel = useContent('worker.logout') || 'Logout'
  const navbarTitle = useContent('worker.pendingNavbarTitle') || 'Application'
  const nextLabel = useContent('worker.apply.next') || 'Next'
  const prevLabel = useContent('worker.apply.previous') || 'Previous'
  const confirmLabel = useContent('worker.apply.confirm') || 'Confirm'
  const progressLabel = useContent('worker.apply.progress') || 'Step'
  const popupTitle = useContent('worker.apply.confirmTitle') || 'Confirm Submission'
  const popupMsg = useContent('worker.apply.confirmMsg') || 'You cannot make any changes after you submit the application. Are you sure to submit the application?'
  const popupCancel = useContent('worker.apply.cancel') || 'Cancel'
  const popupSubmit = useContent('worker.applySubmit') || 'Submit'
  const successText = useContent('worker.applySuccess')

    // Field labels — all called at top level, same count every render
  const lName = useContent('auth.signup.name.label')
  const lPhone = useContent('field.phone')
  const lEmail = useContent('auth.signup.email.label')
  const lDob = useContent('worker.apply.dob')
  const lPrimaryRole = useContent('worker.apply.primaryRole')
  const lSecondaryRoles = useContent('worker.apply.secondaryRoles')
  const lAddress = useContent('worker.apply.address')
  const lServiceArea = useContent('worker.apply.serviceArea')
  const lGovId = useContent('worker.apply.govId')
  const lSelfie = useContent('worker.apply.selfie')
  const lAvailability = useContent('worker.apply.availability')
  const lNotifications = useContent('worker.apply.notifications')
  const lAcceptTerms = useContent('worker.apply.acceptTerms')
  const lBackgroundCheck = useContent('worker.apply.backgroundCheck')
  const lSafetyAgreement = useContent('worker.apply.safetyAgreement')
  const pName = useContent('auth.signup.name.placeholder')
  const pPhone = useContent('field.phonePlaceholder')
  const pEmail = useContent('auth.signup.email.placeholder')
  const pAddress = useContent('worker.apply.addressPlaceholder')
  const pServiceArea = useContent('worker.apply.serviceAreaPlaceholder')
  const pGovId = useContent('worker.apply.govIdPlaceholder')
  const selectPlaceholder = useContent('field.select')

    const labelMap = {
    'auth.signup.name.label': lName, 'field.phone': lPhone, 'auth.signup.email.label': lEmail,
    'worker.apply.dob': lDob, 'worker.apply.primaryRole': lPrimaryRole,
    'worker.apply.secondaryRoles': lSecondaryRoles, 'worker.apply.address': lAddress,
    'worker.apply.serviceArea': lServiceArea, 'worker.apply.govId': lGovId,
    'worker.apply.selfie': lSelfie, 'worker.apply.availability': lAvailability,
    'worker.apply.notifications': lNotifications, 'worker.apply.acceptTerms': lAcceptTerms,
    'worker.apply.backgroundCheck': lBackgroundCheck, 'worker.apply.safetyAgreement': lSafetyAgreement,
  }
  const placeholderMap = {
    'auth.signup.name.placeholder': pName, 'field.phonePlaceholder': pPhone,
    'auth.signup.email.placeholder': pEmail, 'worker.apply.addressPlaceholder': pAddress,
    'worker.apply.serviceAreaPlaceholder': pServiceArea, 'worker.apply.govIdPlaceholder': pGovId,
  }

  const [dark, setDark] = useState(() => localStorage.getItem('sajilo_theme') === 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('sajilo_lang') || 'en')

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) { navigate('/login'); return }
    if (user.role !== 'worker' || user.status !== 'pending') { navigate('/login'); return }
    if (user.application_submitted) { navigate('/worker/pending'); return }
  }, [navigate])

  const toggleTheme = () => { const n = !dark; setDark(n); localStorage.setItem('sajilo_theme', n ? 'dark' : 'light') }
  const handleLangChange = (e) => { setLang(e.target.value); localStorage.setItem('sajilo_lang', e.target.value); window.dispatchEvent(new Event('langChange')) }
  const handleLogout = () => { localStorage.removeItem('sajilo_user'); localStorage.removeItem('sajilo_token'); window.location.href = '/login' }

  const goNext = () => { if (currentCard < CARDS.length - 1) setCurrentCard(currentCard + 1) }
  const goPrev = () => { if (currentCard > 0) setCurrentCard(currentCard - 1) }

  const allRequiredFilled = () => {
    const allFields = CARDS.flatMap(c => c.fields || [])
    const required = allFields.filter(f => f.required)
    return required.every(f => formData[f.name])
  }

  const handleConfirmClick = () => {
    if (!allRequiredFilled()) return
    setShowConfirm(true)
  }

  const handleSubmit = () => {
    const user = getCurrentUser()
    const updatedUser = { ...user, ...formData, application_submitted: true, application_date: new Date().toISOString() }
    localStorage.setItem('sajilo_user', JSON.stringify(updatedUser))
    setShowConfirm(false)
    setSubmitted(true)
    setTimeout(() => navigate('/worker/pending'), 2000)
  }

  const card = CARDS[currentCard]
  const isFirst = currentCard === 0
  const isLast = currentCard === CARDS.length - 1
  const canConfirm = allRequiredFilled()

  return (
    <div className="auth-page" data-theme={dark ? 'dark' : 'light'} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      
      <div className="pending-navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: navbarStyle.padding || '10px 20px', background: navbarStyle.background || 'var(--bg-surface)', borderBottom: navbarStyle.border || '1px solid var(--border)', flexShrink: 0, ...navbarStyle }}>
        <span style={{ fontSize: navbarStyle.fontSize || 'var(--font-body-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>{profile?.name || navbarTitle}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: navBtnStyle.gap || 10 }}>
          <button onClick={toggleTheme} style={{ width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface2)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 14 }}>{dark ? '☀️' : '🌙'}</button>
          <select value={lang} onChange={handleLangChange} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none' }}><option value="en">EN</option><option value="ne">ने</option></select>
          <button onClick={handleLogout} style={{ padding: logoutBtnStyle.padding || '6px 12px', borderRadius: logoutBtnStyle.borderRadius || 'var(--radius-sm)', border: '1px solid var(--accent-red)', background: 'transparent', color: 'var(--accent-red)', fontSize: logoutBtnStyle.fontSize || 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer' }}>{logoutLabel}</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div className="brand-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)', position: 'sticky', top: 0, height: '100%', overflow: 'hidden' }}><BrandPanel /></div>
        <div className="form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1, overflow: 'hidden', touchAction: 'none', overscrollBehavior: 'none' }}>
          <Animated.div style={{ width: '100%', maxWidth: 430, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 5vw, 44px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)', ...animStyle }}>
            
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--accent-green)', fontWeight: 600, fontSize: 'var(--font-body)' }}>{successText}</div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-blue)' }}>{brandName}</span>
                </div>
                <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, textAlign: 'center' }}>{title}</h2>
                <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 8, textAlign: 'center' }}>{useContent(card.titleKey)}</p>
                <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>{progressLabel} {currentCard + 1} / {CARDS.length}</div>

                                       <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(card.fields || []).map(field => {
                const value = formData[field.name] || ''
                const label = labelMap[field.labelKey] || field.labelKey
                const placeholder = placeholderMap[field.placeholderKey] || field.placeholderKey || ''

                if (field.type === 'checkbox') {
                  return (
                    <div key={field.name}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <input type="checkbox" checked={!!value} onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.checked }))} required={field.required}
                          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--accent-blue)' }} />
                        <span style={{ fontSize: 'var(--font-body)', color: 'var(--text-primary)' }}>{label}</span>
                        {field.required && <span style={{ color: 'var(--accent-red)' }}>★</span>}
                      </label>
                    </div>
                  )
                }

                return (
                  <div key={field.name}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                      {label}
                      {field.required && <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>}
                    </label>
                    <input type={field.type || 'text'} value={value}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      placeholder={placeholder} required={field.required}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }} />
                  </div>
                )
              })}
            </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  {!isFirst && (
                    <button onClick={goPrev} style={{ flex: 1, padding: prevBtnStyle.padding || '12px', borderRadius: prevBtnStyle.borderRadius || 'var(--radius-md)', border: prevBtnStyle.border || '1px solid var(--border)', background: prevBtnStyle.background || 'var(--bg-surface2)', color: prevBtnStyle.color || 'var(--text-primary)', fontSize: prevBtnStyle.fontSize || '13px', fontWeight: prevBtnStyle.fontWeight || 600, cursor: 'pointer' }}>← {prevLabel}</button>
                  )}
                  {!isLast && (
                    <button onClick={goNext} style={{ flex: 1, padding: nextBtnStyle.padding || '12px', borderRadius: nextBtnStyle.borderRadius || 'var(--radius-md)', border: nextBtnStyle.border || 'none', background: nextBtnStyle.background || 'var(--accent-blue)', color: nextBtnStyle.color || '#fff', fontSize: nextBtnStyle.fontSize || '13px', fontWeight: nextBtnStyle.fontWeight || 600, cursor: 'pointer' }}>{nextLabel} →</button>
                  )}
                  {isLast && (
                    <button onClick={handleConfirmClick} disabled={!canConfirm} style={{ flex: 1, padding: confirmBtnStyle.padding || '12px', borderRadius: confirmBtnStyle.borderRadius || 'var(--radius-md)', border: confirmBtnStyle.border || 'none', background: canConfirm ? (confirmBtnStyle.background || 'var(--accent-green)') : '#94a3b8', color: confirmBtnStyle.color || '#fff', fontSize: confirmBtnStyle.fontSize || '13px', fontWeight: confirmBtnStyle.fontWeight || 600, cursor: canConfirm ? 'pointer' : 'not-allowed', opacity: canConfirm ? 1 : 0.6 }}>{confirmLabel}</button>
                  )}
                </div>
              </>
            )}
          </Animated.div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setShowConfirm(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <popupAnim.animated.div style={{ position: 'relative', width: '90%', maxWidth: 380, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(24px, 5vw, 32px)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', textAlign: 'center', ...popupAnim.style }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <h3 style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{popupTitle}</h3>
            <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>{popupMsg}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{popupCancel}</button>
              <button onClick={handleSubmit} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-green)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{popupSubmit}</button>
            </div>
          </popupAnim.animated.div>
        </div>
      )}

      <div className="pending-mobile-bar" style={{ display: 'none', height: 60, background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, alignItems: 'center', justifyContent: 'space-around', padding: '0 16px', ...mobileBarStyle }}>
        <button onClick={toggleTheme} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 12px', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 500 }}><span style={{ fontSize: 18 }}>{dark ? '☀️' : '🌙'}</span>{themeLabel}</button>
        <select value={lang} onChange={handleLangChange} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, textAlign: 'center', outline: 'none' }}><option value="en">EN</option><option value="ne">ने</option></select>
        <button onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 12px', color: 'var(--accent-red)', fontSize: 10, fontWeight: 500 }}><span style={{ fontSize: 18 }}>🚪</span>{logoutLabel}</button>
      </div>

      <style>{`
        .auth-page, .auth-page .form-side, .auth-page .form-side * { --bg-primary: #f0f2f6 !important; --bg-surface: #ffffff !important; --bg-surface2: #f7f8fa !important; --text-primary: #1a1d23 !important; --text-secondary: #6b7280 !important; --border: #e5e7eb !important; --accent-blue: #1A6FD4 !important; --accent-blue-light: #EBF3FF !important; --accent-red: #DC2626 !important; --accent-green: #16A34A !important; }
        @media (max-width: 768px) {
          .brand-side { position: absolute !important; inset: 0 !important; opacity: 1 !important; pointer-events: none !important; }
          .auth-page { overflow-y: auto; overscroll-behavior-y: contain; }
          .form-side { flex: none !important; width: 100% !important; min-height: 100vh !important; min-height: 100dvh !important; padding-bottom: 80px !important; }
          .pending-mobile-bar { display: flex !important; }
        }
      `}</style>
    </div>
  )
}