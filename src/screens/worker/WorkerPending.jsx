import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandPanel from '../../components/BrandPanel.jsx'
import { useAnimation } from '../../hooks/useAnimation.js'
import { useContent } from '../../hooks/useContent.js'
import { useStyle } from '../../hooks/useStyle.js'
import { getSocket } from '../../services/realtime/socketClient'

const DEFAULT_STAGES = [
  { key: 'submitted', labelKey: 'worker.stage.submitted', descKey: 'worker.stage.submittedDesc', iconKey: 'worker.stage.submittedIcon' },
  { key: 'review', labelKey: 'worker.stage.review', descKey: 'worker.stage.reviewDesc', iconKey: 'worker.stage.reviewIcon' },
  { key: 'documents', labelKey: 'worker.stage.documents', descKey: 'worker.stage.documentsDesc', iconKey: 'worker.stage.documentsIcon' },
  { key: 'decision', labelKey: 'worker.stage.decision', descKey: 'worker.stage.decisionDesc', iconKey: 'worker.stage.decisionIcon' },
]

export default function WorkerPending() {
  const navigate = useNavigate()
  const [appData, setAppData] = useState(null)

  // ── All hooks at top (before any conditional returns) ──
  const { style: animStyle, animated: Animated } = useAnimation('WorkerPending', 'card')
  const navbarStyle = useStyle('pendingNavbar') || {}
  const navBtnStyle = useStyle('pendingNavBtn') || {}
  const logoutBtnStyle = useStyle('pendingLogoutBtn') || {}
  const mobileBarStyle = useStyle('pendingMobileBar') || {}

  const brandName = useContent('worker.pendingBrandName') || 'Sajilo'
  const title = useContent('worker.applicationTitle') || 'Application Status'
  const subtitle = useContent('worker.applicationSubtitle') || 'Track your application progress'
  const themeLabel = useContent('worker.theme') || 'Theme'
  const logoutLabel = useContent('worker.logout') || 'Logout'
  const navbarTitle = useContent('worker.pendingNavbarTitle') || 'Application Status'
  const adminNote = useContent('worker.adminNote') || 'Note from Admin'
  const reapply = useContent('worker.reapply') || 'Reapply'

  const stageSubmittedLabel = useContent('worker.stage.submitted')
  const stageReviewLabel = useContent('worker.stage.review')
  const stageDocumentsLabel = useContent('worker.stage.documents')
  const stageDecisionLabel = useContent('worker.stage.decision')
  const stageSubmittedDesc = useContent('worker.stage.submittedDesc')
  const stageReviewDesc = useContent('worker.stage.reviewDesc')
  const stageDocumentsDesc = useContent('worker.stage.documentsDesc')
  const stageDecisionDesc = useContent('worker.stage.decisionDesc')
  const statusSubmitted = useContent('worker.status.submitted')
  const statusReview = useContent('worker.status.review')
  const statusDocuments = useContent('worker.status.documents')
  const statusDecision = useContent('worker.status.decision')
  const approvedMsg = useContent('worker.status.approvedMsg')
  const rejectedMsg = useContent('worker.status.rejectedMsg')
  const approvedIcon = useContent('worker.status.approvedIcon')
  const rejectedIcon = useContent('worker.status.rejectedIcon')
  const uploadDocs = useContent('worker.uploadDocuments') || 'Upload Documents'

  // Welcome & Rejection content hooks
  const welcomeTitle = useContent('worker.welcomeTitle', '🎉 Congratulations!')
  const welcomeMsg = useContent('worker.welcomeMsg', 'Welcome to Sajilo family.')
  const proceedLabel = useContent('worker.proceedToLogin', 'Proceed to Login')
  const rejectedTitle = useContent('worker.rejectedTitle', 'Application Needs Review')
  const rejectedMsg2 = useContent('worker.rejectedMsg', 'We are having some issues with your application. Please review and take necessary action.')
  const reviewLabel = useContent('worker.seeReview', 'See Review')

  const [dark, setDark] = useState(() => localStorage.getItem('sajilo_theme') === 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('sajilo_lang') || 'en')

  useEffect(() => {
    const saved = localStorage.getItem('sajilo_worker_application')
    const userStr = localStorage.getItem('sajilo_user')
    const user = userStr ? JSON.parse(userStr) : null
    const isWelcomed = localStorage.getItem('sajilo_worker_welcomed') === 'true'

    if (user?.status === 'active' && isWelcomed) {
      navigate('/login', { replace: true })
      return
    }

    if (saved) setAppData({ ...JSON.parse(saved), user })
  }, [navigate])

    // Real‑time listener for admin approval
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleApproved = (data) => {
      // Update the stored user status and display_id
      const userStr = localStorage.getItem('sajilo_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        user.status = data.status || 'active'
        if (data.display_id) user.display_id = data.display_id
        localStorage.setItem('sajilo_user', JSON.stringify(user))
      }

      // Re‑read the application data so the approved screen appears immediately
      const saved = localStorage.getItem('sajilo_worker_application')
      if (saved) {
        const updatedUser = JSON.parse(localStorage.getItem('sajilo_user'))
        setAppData({ ...JSON.parse(saved), user: updatedUser })
      }
    }

    socket.on('worker:approved', handleApproved)
    return () => socket.off('worker:approved', handleApproved)
  }, [])

  const profile = appData?.user || {}
  const STAGES = DEFAULT_STAGES
  const stage = profile?.verification_status || 'submitted'
  const stageIndex = STAGES.findIndex(s => s.key === stage)
  const currentStage = stageIndex >= 0 ? stageIndex : 0
  const isApproved = profile?.status === 'active'
  const isRejected = profile?.status === 'rejected'
  const notes = profile?.application_notes || ''

  const toggleTheme = () => { const n = !dark; setDark(n); localStorage.setItem('sajilo_theme', n ? 'dark' : 'light') }
  const handleLangChange = (e) => { setLang(e.target.value); localStorage.setItem('sajilo_lang', e.target.value); window.dispatchEvent(new Event('langChange')) }
  const handleLogout = () => { localStorage.clear(); window.location.href = '/login' }

  const getFooterIcon = () => {
    if (isApproved) return approvedIcon
    if (isRejected) return rejectedIcon
    return '⏳'
  }

  const getFooterMessage = () => {
    if (isApproved) return approvedMsg
    if (isRejected) return rejectedMsg
    const messages = { submitted: statusSubmitted, review: statusReview, documents: statusDocuments, decision: statusDecision }
    return messages[stage] || statusSubmitted
  }

  const getFooterBg = () => {
    if (isApproved) return '#dcfce7'
    if (isRejected) return '#fee2e2'
    return 'var(--bg-surface2)'
  }

  const getFooterColor = () => {
    if (isApproved) return '#16A34A'
    if (isRejected) return '#DC2626'
    return 'var(--text-primary)'
  }

  const getStageLabel = (s) => {
    const labels = { submitted: stageSubmittedLabel, review: stageReviewLabel, documents: stageDocumentsLabel, decision: stageDecisionLabel }
    return labels[s.key] || s.key
  }

  const getStageDesc = (s) => {
    const descs = { submitted: stageSubmittedDesc, review: stageReviewDesc, documents: stageDocumentsDesc, decision: stageDecisionDesc }
    return descs[s.key] || ''
  }

  // ── No application found ──
  if (!appData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
          <p>No application found.</p>
          <button onClick={() => navigate('/worker/apply')} style={{ marginTop: 12, padding: '10px 20px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-blue)', color: '#fff', cursor: 'pointer' }}>
            Apply Now
          </button>
        </div>
      </div>
    )
  }

    // ── APPROVED ──
  if (appData?.user?.status === 'active') {
    const handleProceed = () => {
      localStorage.setItem('sajilo_worker_welcomed', 'true')
      localStorage.removeItem('sajilo_worker_application')
      navigate('/login', { replace: true })
    }
    // Gather data for display
    const workerName = appData?.fullName || appData?.displayName || profile?.name || ''
    const profession = appData?.primaryRole || ''
    const workerId = profile?.display_id || ''

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 430, width: '90%', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>{welcomeTitle}</h2>
          <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>{welcomeMsg}</p>

          {/* Worker details */}
          {workerName && (
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              {workerName}
            </p>
          )}
          {profession && (
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>
              {profession}
            </p>
          )}
          {workerId && (
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 24 }}>
              {workerId}
            </p>
          )}

          <button onClick={handleProceed} style={{ width: '100%', padding: 14, borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-blue)', color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>
            {proceedLabel}
          </button>
        </div>
      </div>
    )
  }

  // ── REJECTED ──
  if (appData?.user?.status === 'rejected') {
    const handleReview = () => {
      navigate('/worker/apply')
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 430, width: '90%', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>{rejectedTitle}</h2>
          <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>{rejectedMsg2}</p>
          <button onClick={handleReview} style={{ width: '100%', padding: 14, borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-blue)', color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>
            {reviewLabel}
          </button>
        </div>
      </div>
    )
  }

  // ── PENDING (default) ──
  return (
    <div className="auth-page" data-theme={dark ? 'dark' : 'light'} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      
      <div className="pending-navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: navbarStyle.padding || '10px 20px', background: navbarStyle.background || 'var(--bg-surface)', borderBottom: navbarStyle.border || '1px solid var(--border)', flexShrink: 0, ...navbarStyle }}>
        <span style={{ fontSize: navbarStyle.fontSize || 'var(--font-body-lg)', fontWeight: 600, color: navbarStyle.color || 'var(--text-primary)' }}>
          {appData?.fullName || appData?.displayName || navbarTitle}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: navBtnStyle.gap || 10 }}>
          <button onClick={toggleTheme} style={{ width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface2)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 14 }}>{dark ? '☀️' : '🌙'}</button>
          <select value={lang} onChange={handleLangChange} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none' }}><option value="en">EN</option><option value="ne">ने</option></select>
          <button onClick={handleLogout} style={{ padding: logoutBtnStyle.padding || '6px 12px', borderRadius: logoutBtnStyle.borderRadius || 'var(--radius-sm)', border: '1px solid var(--accent-red)', background: 'transparent', color: 'var(--accent-red)', fontSize: logoutBtnStyle.fontSize || 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer' }}>{logoutLabel}</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div className="brand-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)', position: 'sticky', top: 0, height: '100%', overflow: 'hidden' }}><BrandPanel /></div>
        <div className="form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1, overflow: 'hidden', touchAction: 'none', overscrollBehavior: 'none' }}>
          <Animated.div style={{ width: '100%', maxWidth: 430, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 5vw, 44px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflowY: 'auto', maxHeight: '80vh', ...animStyle }}>
            
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-blue)' }}>{brandName}</span>
            </div>
            <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, textAlign: 'center' }}>{title}</h2>
            <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 28, textAlign: 'center' }}>{subtitle}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
              {STAGES.map((s, i) => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: i < currentStage ? 'var(--accent-blue)' : i === currentStage ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                    border: `2px solid ${i > currentStage ? 'var(--border)' : 'var(--accent-blue)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700,
                    color: i <= currentStage ? '#fff' : 'var(--text-secondary)',
                    boxShadow: i === currentStage ? '0 0 0 5px var(--accent-blue-light)' : 'none',
                    transition: 'all 0.4s ease', marginTop: 1,
                  }}>
                    {i < currentStage ? '✓' : i === currentStage ? '●' : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: i === currentStage ? 600 : 500, color: i > currentStage ? 'var(--text-secondary)' : 'var(--text-primary)', marginBottom: 3 }}>
                      {getStageLabel(s)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {getStageDesc(s)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {notes && (
              <div style={{ background: '#fef3c7', border: '1px solid #D97706', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#D97706', marginBottom: 4 }}>📋 {adminNote}</div>
                <p style={{ fontSize: 12, color: '#92400e', margin: 0 }}>{notes}</p>
              </div>
            )}

            <div style={{ textAlign: 'center', padding: 16, background: getFooterBg(), borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{getFooterIcon()}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: getFooterColor(), margin: 0 }}>{getFooterMessage()}</p>
              {isRejected && (
                <button onClick={() => navigate('/worker/apply')} style={{ marginTop: 10, padding: '8px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-blue)', background: 'var(--accent-blue)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{reapply}</button>
              )}
            </div>
          </Animated.div>
        </div>
      </div>

      <div className="pending-mobile-bar" style={{ display: 'none', height: 60, background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, alignItems: 'center', justifyContent: 'space-around', padding: '0 16px', ...mobileBarStyle }}>
        <button onClick={toggleTheme} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 12px', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 500 }}>
          <span style={{ fontSize: 18 }}>{dark ? '☀️' : '🌙'}</span>{themeLabel}
        </button>
        <select value={lang} onChange={handleLangChange} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, textAlign: 'center', outline: 'none' }}>
          <option value="en">EN</option><option value="ne">ने</option>
        </select>
        <button onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 12px', color: 'var(--accent-red)', fontSize: 10, fontWeight: 500 }}>
          <span style={{ fontSize: 18 }}>🚪</span>{logoutLabel}
        </button>
      </div>

      <style>{`
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