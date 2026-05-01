import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandPanel from '../../components/BrandPanel.jsx'
import { useWorker } from '../../contexts/WorkerContext.jsx'
import { getCurrentUser } from '../../config/auth.js'
import { useAnimation } from '../../hooks/useAnimation.js'
import { useContent } from '../../hooks/useContent.js'
import { useStyle } from '../../hooks/useStyle.js'

const DEFAULT_STAGES = [
  { key: 'submitted', labelKey: 'worker.stage.submitted', descKey: 'worker.stage.submittedDesc', iconKey: 'worker.stage.submittedIcon' },
  { key: 'review', labelKey: 'worker.stage.review', descKey: 'worker.stage.reviewDesc', iconKey: 'worker.stage.reviewIcon' },
  { key: 'documents', labelKey: 'worker.stage.documents', descKey: 'worker.stage.documentsDesc', iconKey: 'worker.stage.documentsIcon' },
  { key: 'decision', labelKey: 'worker.stage.decision', descKey: 'worker.stage.decisionDesc', iconKey: 'worker.stage.decisionIcon' },
]

export default function WorkerPending() {
  const navigate = useNavigate()
  const { profile, loadAll } = useWorker()

  // ═══ ALL HOOKS AT TOP — NO CONDITIONS BEFORE THEM ═══
  const { style: animStyle, animated: Animated } = useAnimation('WorkerPending', 'card')
  const navbarStyle = useStyle('pendingNavbar') || {}
  const navBtnStyle = useStyle('pendingNavBtn') || {}
  const logoutBtnStyle = useStyle('pendingLogoutBtn') || {}
  const mobileBarStyle = useStyle('pendingMobileBar') || {}

  // All useContent calls at top level
  const brandName = useContent('worker.pendingBrandName') || 'Sajilo'
  const title = useContent('worker.applicationTitle')
  const subtitle = useContent('worker.applicationSubtitle')
  const themeLabel = useContent('worker.theme') || 'Theme'
  const logoutLabel = useContent('worker.logout') || 'Logout'
  const navbarTitle = useContent('worker.pendingNavbarTitle') || 'Application Status'
  const uploadDocs = useContent('worker.uploadDocuments') || 'Upload Documents'
  const adminNote = useContent('worker.adminNote') || 'Note from Admin'
  const reapply = useContent('worker.reapply') || 'Reapply'
  const approvedIcon = useContent('worker.status.approvedIcon') || '🎉'
  const rejectedIcon = useContent('worker.status.rejectedIcon') || '❌'
  const approvedMsg = useContent('worker.status.approvedMsg')
  const rejectedMsg = useContent('worker.status.rejectedMsg')
  const statusSubmitted = useContent('worker.status.submitted')
  const statusReview = useContent('worker.status.review')
  const statusDocuments = useContent('worker.status.documents')
  const statusDecision = useContent('worker.status.decision')
  const stageSubmittedLabel = useContent('worker.stage.submitted')
  const stageReviewLabel = useContent('worker.stage.review')
  const stageDocumentsLabel = useContent('worker.stage.documents')
  const stageDecisionLabel = useContent('worker.stage.decision')
  const stageSubmittedDesc = useContent('worker.stage.submittedDesc')
  const stageReviewDesc = useContent('worker.stage.reviewDesc')
  const stageDocumentsDesc = useContent('worker.stage.documentsDesc')
  const stageDecisionDesc = useContent('worker.stage.decisionDesc')

  const STAGES = profile?.application_stages || DEFAULT_STAGES
  const stage = profile?.verification_status || 'submitted'
  const stageIndex = STAGES.findIndex(s => s.key === stage)
  const notes = profile?.application_notes || ''
  const isApproved = stage === 'approved'
  const isRejected = stage === 'rejected'

  // ═══ STATE & REFS ═══
  const cardRef = useRef(null)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const [dark, setDark] = useState(() => localStorage.getItem('sajilo_theme') === 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('sajilo_lang') || 'en')

  // ═══ EFFECTS ═══
  useEffect(() => {
    const user = getCurrentUser()
    if (user && profile && (user.role !== 'worker' || user.status !== 'pending')) {
      navigate('/login')
    }
  }, [navigate, profile])

  useEffect(() => {
    document.documentElement.classList.add('auth-locked')
    return () => document.documentElement.classList.remove('auth-locked')
  }, [])

  useEffect(() => {
    document.documentElement.style.overscrollBehavior = (dragY === 0 && !isDragging) ? 'auto' : 'none'
    return () => { document.documentElement.style.overscrollBehavior = 'auto' }
  }, [dragY, isDragging])

  // ═══ HELPERS ═══
  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('sajilo_theme', next ? 'dark' : 'light')
  }

  const handleLangChange = (e) => {
    const val = e.target.value
    setLang(val)
    localStorage.setItem('sajilo_lang', val)
    window.dispatchEvent(new Event('langChange'))
  }

  const handleLogout = () => {
    localStorage.removeItem('sajilo_user')
    localStorage.removeItem('sajilo_token')
    window.location.href = '/login'
  }

  const onPointerDown = (e) => {
    setIsDragging(true)
    dragStart.current = e.clientY - dragY
    e.target.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!isDragging) return
    setDragY((e.clientY - dragStart.current) * 0.2)
  }
  const onPointerUp = () => {
    setIsDragging(false)
    if (dragY > 120) {
      loadAll ? loadAll().then(() => window.location.reload()) : window.location.reload()
    }
    setDragY(0)
  }

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

  return (
    <div className="auth-page" data-theme={dark ? 'dark' : 'light'} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      
      <div className="pending-navbar" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: navbarStyle.padding || '10px 20px', background: navbarStyle.background || 'var(--bg-surface)',
        borderBottom: navbarStyle.border || '1px solid var(--border)', flexShrink: 0, ...navbarStyle,
      }}>
        <span style={{ fontSize: navbarStyle.fontSize || 'var(--font-body-lg)', fontWeight: navbarStyle.fontWeight || 600, color: navbarStyle.color || 'var(--text-primary)' }}>
          {profile?.name || navbarTitle}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: navBtnStyle.gap || 10 }}>
          <button onClick={toggleTheme} style={{
            width: navBtnStyle.width || 30, height: navBtnStyle.height || 30, borderRadius: navBtnStyle.borderRadius || 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: navBtnStyle.background || 'var(--bg-surface2)', border: navBtnStyle.border || '1px solid var(--border)',
            cursor: 'pointer', fontSize: navBtnStyle.fontSize || 14,
          }}>{dark ? '☀️' : '🌙'}</button>
          <select value={lang} onChange={handleLangChange} style={{
            padding: navBtnStyle.selectPadding || '4px 6px', borderRadius: navBtnStyle.borderRadius || 6,
            border: navBtnStyle.border || '1px solid var(--border)', background: navBtnStyle.background || 'var(--bg-surface2)',
            color: navBtnStyle.color || 'var(--text-primary)', fontSize: navBtnStyle.selectFontSize || 12,
            fontWeight: 600, cursor: 'pointer', outline: 'none',
          }}>
            <option value="en">EN</option><option value="ne">ने</option>
          </select>
          <button onClick={handleLogout} style={{
            padding: logoutBtnStyle.padding || '6px 12px', borderRadius: logoutBtnStyle.borderRadius || 'var(--radius-sm)',
            border: logoutBtnStyle.border || '1px solid var(--accent-red)', background: logoutBtnStyle.background || 'transparent',
            color: logoutBtnStyle.color || 'var(--accent-red)', fontSize: logoutBtnStyle.fontSize || 'var(--font-body-sm)',
            fontWeight: 600, cursor: 'pointer',
          }}>{logoutLabel}</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div className="brand-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1A6FD4 0%, #2D1B69 100%)', position: 'sticky', top: 0, height: '100%', overflow: 'hidden' }}>
          <BrandPanel />
        </div>
        <div className="form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1, overflow: 'hidden', touchAction: 'none', overscrollBehavior: 'none' }}>
          <Animated.div
            ref={cardRef}
            className="auth-card"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              width: '100%', maxWidth: 430, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 5vw, 44px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              transform: isDragging ? `translateY(${dragY}px)` : 'translateY(0px)',
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              touchAction: 'none', cursor: isDragging ? 'grabbing' : 'default',
              overflowY: 'auto', maxHeight: '80vh',
              ...animStyle,
            }}>
            
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '-0.5px' }}>{brandName}</span>
            </div>
            <h2 style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, textAlign: 'center' }}>{title}</h2>
            <p style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 28, textAlign: 'center' }}>{subtitle}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
              {STAGES.map((s, i) => {
                const isCurrent = i === stageIndex
                const isDone = i < stageIndex
                const isFuture = i > stageIndex
                return (
                  <div key={s.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: isDone ? 'var(--accent-blue)' : isCurrent ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                      border: `2px solid ${isFuture ? 'var(--border)' : 'var(--accent-blue)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700,
                      color: isDone || isCurrent ? '#fff' : 'var(--text-secondary)',
                      boxShadow: isCurrent ? '0 0 0 5px var(--accent-blue-light)' : 'none',
                      transition: 'all 0.4s ease', marginTop: 1,
                    }}>
                      {isDone ? '✓' : isCurrent ? '⏳' : i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: isCurrent ? 600 : 500, color: isFuture ? 'var(--text-secondary)' : 'var(--text-primary)', marginBottom: 3 }}>
                        {getStageLabel(s)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {getStageDesc(s)}
                      </div>
                      {s.key === 'documents' && isCurrent && (
                        <button onClick={() => {}} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
                          padding: '8px 14px', borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--accent-blue)', background: 'var(--accent-blue-light)',
                          color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>📁 {uploadDocs}</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {notes && (
              <div style={{ background: '#fef3c7', border: '1px solid #D97706', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#D97706', marginBottom: 4 }}>📋 {adminNote}</div>
                <p style={{ fontSize: 12, color: '#92400e', margin: 0 }}>{notes}</p>
              </div>
            )}

            <div style={{ textAlign: 'center', padding: 16, background: getFooterBg(), borderRadius: 'var(--radius-md)', transition: 'all 0.4s ease' }}>
              <div style={{ fontSize: 28, marginBottom: 6, animation: 'pulse 2s infinite' }}>{getFooterIcon()}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: getFooterColor(), margin: 0 }}>{getFooterMessage()}</p>
              {isRejected && (
                <button onClick={() => navigate('/worker/apply')} style={{
                  marginTop: 10, padding: '8px 18px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--accent-blue)', background: 'var(--accent-blue)',
                  color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>{reapply}</button>
              )}
            </div>

          </Animated.div>
        </div>
      </div>

      <div className="pending-mobile-bar" style={{
        display: 'none', height: mobileBarStyle.height || 60,
        background: mobileBarStyle.background || 'var(--bg-surface)',
        borderTop: mobileBarStyle.border || '1px solid var(--border)',
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        alignItems: 'center', justifyContent: 'space-around',
        padding: mobileBarStyle.padding || '0 16px', ...mobileBarStyle,
      }}>
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
        .auth-page, .auth-page .form-side, .auth-page .form-side * {
          --bg-primary: #f0f2f6 !important; --bg-surface: #ffffff !important; --bg-surface2: #f7f8fa !important;
          --text-primary: #1a1d23 !important; --text-secondary: #6b7280 !important; --border: #e5e7eb !important;
          --accent-blue: #1A6FD4 !important; --accent-blue-light: #EBF3FF !important; --accent-red: #DC2626 !important;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @media (max-width: 768px) {
          .brand-side { position: absolute !important; inset: 0 !important; opacity: 1 !important; pointer-events: none !important; }
          .auth-page { overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; }
          .form-side { flex: none !important; width: 100% !important; min-height: 100vh !important; min-height: 100dvh !important; padding-bottom: 80px !important; }
          .auth-card { box-shadow: 0 12px 48px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1) !important; margin: 0; background: #ffffff !important; padding: 20px !important; width: 100% !important; max-width: 430px !important; align-self: center !important; }
          .pending-mobile-bar { display: flex !important; }
        }
      `}</style>
    </div>
  )
}