import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fieldRegistry from '../../config/fieldRegistry.js'
import contentRegistry from '../../config/contentRegistry.js'
import { allRequiredFilled } from '../../utils/validateFields.js'

function getContent(key, fallback = '') {
  const lang = localStorage.getItem('sajilo_lang') || 'en'
  const entry = contentRegistry[key]
  if (entry && entry[lang]) return entry[lang]
  if (entry && entry.en) return entry.en
  return fallback || key
}

export default function WorkerApply() {
  const navigate = useNavigate()
  const CARDS = Array.isArray(fieldRegistry.workerApplyCards) ? fieldRegistry.workerApplyCards : []
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [formData, setFormData] = useState({})
  const [showErrors, setShowErrors] = useState(false) // false, true (missing fields), or 'age'
  const [photoGender, setPhotoGender] = useState('male')
  const [secondaryRoles, setSecondaryRoles] = useState([])
  const [notifyLater, setNotifyLater] = useState(false)
  const [showPasswords, setShowPasswords] = useState({})

  const currentCard = CARDS[currentCardIndex] || { titleKey: '', fields: [] }
  const cardTitle = getContent(currentCard.titleKey, 'Worker Application')
  const nextLabel = getContent('worker.apply.next', 'Next')
  const prevLabel = getContent('worker.apply.previous', 'Previous')
  const missingFieldsMsg = getContent('worker.apply.missingFields', 'Please fill all required fields.')
  const notifLabel = getContent('worker.apply.notificationLabel', 'How would you like to receive notifications?')

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (showErrors) setShowErrors(false)
  }
  const checkAllRequired = () => {
    const allFields = CARDS.flatMap(c => c.fields || [])
    return allRequiredFilled(allFields, formData)
  }

    const checkAgeValid = () => {
    if (!formData.dob) return false  // No DOB = invalid
    const dob = new Date(formData.dob)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age >= 18
  }

     const handleNext = () => {
    if (currentCardIndex < CARDS.length - 1) {
      setCurrentCardIndex(i => i + 1)
      setShowErrors(false)
    } else {
      if (formData.dob && !checkAgeValid()) {
        setShowErrors('age')
        return
      }
      if (!checkAllRequired()) {
        setShowErrors(true)
        return
      }
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentCardIndex > 0) setCurrentCardIndex(i => i - 1)
    setShowErrors(false)
  }

      const handleSubmit = async () => {
    const finalData = { ...formData, secondaryRoles }
    
    // Save application data
    localStorage.setItem('sajilo_worker_application', JSON.stringify(finalData))
    
    // Create pending worker user session
    localStorage.setItem('sajilo_user', JSON.stringify({
      id: Date.now(),
      email: formData.email,
      role: 'worker',
      status: 'pending',
      name: formData.fullName || formData.displayName || 'Applicant',
      application_submitted: true,
      phone: formData.phone,
      primaryRole: formData.primaryRole,
    }))
    
    // Set a fake token so WorkerContext can initialize
    localStorage.setItem('sajilo_token', JSON.stringify({ pending: true, ts: Date.now() }))
    
    navigate('/worker/pending')
  }
    

  const isFieldError = (field) => {
    if (showErrors === 'age' && field.name === 'dob') return true
    if (showErrors === true && field.required && !formData[field.name]) return true
    return false
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-blue)' }}>Sajilo</span>
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>{cardTitle}</h2>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>
        Step {currentCardIndex + 1} of {CARDS.length || 1}
      </p>

            {showErrors && (
        <div style={{
          background: '#fee2e2', color: '#DC2626', padding: '10px 14px',
          borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
          marginBottom: 16, textAlign: 'center', animation: 'shake 0.4s ease'
        }}>
          {showErrors === 'age' 
            ? getContent('worker.apply.ageError', 'You must be 18 or older to apply.')
            : missingFieldsMsg}
        </div>
      )}

      {(currentCard.fields || []).map(field => {
        const val = formData[field.name] || ''
        const label = getContent(field.labelKey, field.name)
        const hasError = isFieldError(field)

        

        // ── Notification section label ──
        if (field.name === 'notifyEmail') {
          return (
            <div key="notif-group">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, marginTop: 4 }}>
                {notifLabel}
              </div>
              {/* Render all notification checkboxes */}
              {(currentCard.fields || []).filter(f => f.name.startsWith('notify')).map(nf => {
                const nfVal = nf.name === 'notifyLater' ? notifyLater : formData[nf.name] || false
                const nfLabel = getContent(nf.labelKey, nf.name)
                const isDisabled = nf.name !== 'notifyLater' && notifyLater
                return (
                  <label key={nf.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 }}>
                    <input type="checkbox"
                      checked={!!nfVal}
                      disabled={isDisabled}
                      onChange={e => {
                        if (nf.name === 'notifyLater') {
                          setNotifyLater(e.target.checked)
                          if (e.target.checked) {
                            // Clear all other notification choices
                            handleFieldChange('notifyEmail', false)
                            handleFieldChange('notifySms', false)
                            handleFieldChange('notifyApp', false)
                          }
                        } else {
                          handleFieldChange(nf.name, e.target.checked)
                        }
                      }}
                      style={{ width: 18, height: 18, accentColor: 'var(--accent-blue)' }} />
                    <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{nfLabel}</span>
                  </label>
                )
              })}
            </div>
          )
        }
        // Skip other notify fields (handled in group above)
        if (field.name === 'notifySms' || field.name === 'notifyApp' || field.name === 'notifyLater') {
          return null
        }

                // ── Password (show/hide toggle) ──
        if (field.type === 'password') {
          const shown = showPasswords[field.name] || false
          return (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: hasError ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {label}{field.required && <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input type={shown ? 'text' : 'password'} value={val} onChange={e => handleFieldChange(field.name, e.target.value)}
                  placeholder={getContent(field.placeholderKey, '')} required={field.required}
                  style={{ width: '100%', padding: '12px 44px 12px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${hasError ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', outline: 'none' }} />
                <span onClick={() => setShowPasswords(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 16, userSelect: 'none' }}>
                  {shown ? '🙈' : '👁'}
                </span>
              </div>
            </div>
          )
        }

        // ── Checkbox ──
        if (field.type === 'checkbox') {
          return (
            <label key={field.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!val} onChange={e => handleFieldChange(field.name, e.target.checked)}
                style={{ width: 18, height: 18, accentColor: hasError ? 'var(--accent-red)' : 'var(--accent-blue)' }} />
              <span style={{ color: hasError ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {label}{field.required && <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>}
              </span>
            </label>
          )
        }

                // ── Datepicker (full button, no typing) ──
        if (field.type === 'datepicker') {
          const maxDate = new Date()
          maxDate.setFullYear(maxDate.getFullYear() - 18)
          const maxDateStr = maxDate.toISOString().split('T')[0]
          const dateInputId = `date-${field.name}`
          
          return (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: hasError ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {label}{field.required && <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input id={dateInputId} type="date" value={val} onChange={e => handleFieldChange(field.name, e.target.value)}
                  max={maxDateStr} required={field.required}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
                <button type="button" onClick={() => document.getElementById(dateInputId)?.showPicker()}
                  style={{
                    width: '100%', padding: 12, borderRadius: 'var(--radius-md)',
                    border: `1px solid ${hasError ? 'var(--accent-red)' : 'var(--border)'}`,
                    background: 'var(--bg-surface2)', cursor: 'pointer',
                    fontSize: 'var(--font-body)', textAlign: 'left',
                    color: val ? 'var(--text-primary)' : 'var(--text-secondary)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                  <span>{val || 'Select date...'}</span>
                  <span>📅</span>
                </button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{getContent('worker.apply.ageRequirement', 'Must be 18+')}</div>
            </div>
          )
        }
        // ── Photo (square tile + gender avatar) ──
        if (field.type === 'photo' || field.type === 'imageUpload') {
          return (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: hasError ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {label}{field.required && <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>}
              </label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 100, height: 100, borderRadius: 'var(--radius-md)',
                  border: `2px dashed ${hasError ? 'var(--accent-red)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-surface2)', cursor: 'pointer', overflow: 'hidden',
                  position: 'relative', flexShrink: 0
                }}>
                  {val ? (
                    <img src={val} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 36 }}>{photoGender === 'male' ? '👨' : '👩'}</span>
                  )}
                  <input type="file" accept="image/*" capture="environment"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleFieldChange(field.name, URL.createObjectURL(file))
                    }}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
                <select value={photoGender} onChange={e => setPhotoGender(e.target.value)}
                  style={{ padding: 8, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', fontSize: 13 }}>
                  <option value="male">👨 Male</option>
                  <option value="female">👩 Female</option>
                </select>
              </div>
            </div>
          )
        }

        // ── Secondary Roles (max 2, tags) ──
        if (field.name === 'secondaryRoles') {
          const isMaxed = secondaryRoles.length >= 2
          return (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--text-primary)' }}>
                {label} <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>(max 2)</span>
              </label>
              {secondaryRoles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {secondaryRoles.map(role => (
                    <span key={role} style={{
                      padding: '6px 10px', borderRadius: 20, background: 'var(--accent-blue-light)', color: 'var(--accent-blue)',
                      fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
                    }}>
                      {getContent((field.options || []).find(o => o.value === role)?.labelKey, role)}
                      <span onClick={() => setSecondaryRoles(prev => prev.filter(r => r !== role))}
                        style={{ cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>×</span>
                    </span>
                  ))}
                </div>
              )}
              <select value="" onChange={e => {
                const v = e.target.value
                if (v && !secondaryRoles.includes(v) && secondaryRoles.length < 2) {
                  setSecondaryRoles(prev => [...prev, v])
                }
              }} style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', cursor: 'pointer' }}>
                <option value="">Select skill...</option>
                {(field.options || []).map(o => (
                  <option key={o.value} value={o.value}
                    disabled={secondaryRoles.includes(o.value) || isMaxed || o.value === formData.primaryRole}
                    style={{ color: secondaryRoles.includes(o.value) ? '#aaa' : 'inherit' }}>
                    {getContent(o.labelKey, o.value)} {secondaryRoles.includes(o.value) ? '✓' : ''}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        // ── Select ──
                if (field.type === 'select') {
          // Group options by availability if they have a 'group' field
          const groups = {}
          ;(field.options || []).forEach(o => {
            const g = o.group || 'available'
            if (!groups[g]) groups[g] = []
            groups[g].push(o)
          })
          const hasGroups = Object.keys(groups).length > 1

          return (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: hasError ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {label}{field.required && <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>}
              </label>
              <select value={val} onChange={e => handleFieldChange(field.name, e.target.value)}
                required={field.required}
                style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: `1px solid ${hasError ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', outline: 'none' }}>
                <option value="">Select...</option>
                {hasGroups ? (
                  Object.entries(groups).map(([group, opts]) => (
                    <optgroup key={group} label={group === 'comingSoon' ? getContent('city.comingSoon', 'Coming Soon') : getContent('city.available', 'Available Now')}>
                      {opts.map(o => (
                        <option key={o.value} value={o.value}>{getContent(o.labelKey, o.value)}</option>
                      ))}
                    </optgroup>
                  ))
                ) : (
                  (field.options || []).map(o => (
                    <option key={o.value} value={o.value}>{getContent(o.labelKey, o.value)}</option>
                  ))
                )}
              </select>
            </div>
          )
        }

        // ── Textarea ──
        if (field.type === 'textarea') {
          return (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: hasError ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {label}{field.required && <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>}
              </label>
              <textarea value={val} onChange={e => handleFieldChange(field.name, e.target.value)}
                placeholder={getContent(field.placeholderKey, '')} required={field.required} rows={3}
                style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: `1px solid ${hasError ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', outline: 'none', resize: 'vertical' }} />
            </div>
          )
        }

        // ── Default: text/email/number input ──
        return (
          <div key={field.name} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: hasError ? 'var(--accent-red)' : 'var(--text-primary)' }}>
              {label}{field.required && <span style={{ color: 'var(--accent-red)', marginLeft: 2 }}>★</span>}
            </label>
            <input type={field.type || 'text'} value={val} onChange={e => handleFieldChange(field.name, e.target.value)}
              placeholder={getContent(field.placeholderKey, '')} required={field.required}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: `1px solid ${hasError ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', outline: 'none' }} />
          </div>
        )
      })}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        {currentCardIndex > 0 && (
          <button onClick={handlePrev} style={{ flex: 1, padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', cursor: 'pointer' }}>
            ← {prevLabel}
          </button>
        )}
        <button onClick={handleNext} style={{ flex: 1, padding: 12, borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-blue)', color: '#fff', cursor: 'pointer' }}>
          {currentCardIndex === CARDS.length - 1 ? 'Submit' : nextLabel} →
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </div>
  )
}