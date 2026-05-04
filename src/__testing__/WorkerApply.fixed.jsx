import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fieldRegistry from '../config/fieldRegistry.js'
import contentRegistry from '../config/contentRegistry.js'

// Helper: get content without hooks — reads directly from registry
function getContent(key, fallback = '') {
  const lang = localStorage.getItem('sajilo_lang') || 'en'
  const entry = contentRegistry[key]
  if (entry && entry[lang]) return entry[lang]
  if (entry && entry.en) return entry.en
  return fallback || key
}

export default function WorkerApplyFixed() {
  const navigate = useNavigate()
  const CARDS = Array.isArray(fieldRegistry.workerApplyCards) ? fieldRegistry.workerApplyCards : []
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [formData, setFormData] = useState({})
  
  const currentCard = CARDS[currentCardIndex] || { titleKey: '', fields: [] }
  const cardTitle = getContent(currentCard.titleKey, 'Worker Application')
  const nextLabel = getContent('worker.apply.next', 'Next')
  const prevLabel = getContent('worker.apply.previous', 'Previous')

  const handleFieldChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))
  
  // Card navigation — only cares about card count, not contents
  const handleNext = () => {
    if (currentCardIndex < CARDS.length - 1) {
      setCurrentCardIndex(i => i + 1)
    } else {
      handleSubmit()
    }
  }
  
  const handlePrev = () => {
    if (currentCardIndex > 0) setCurrentCardIndex(i => i - 1)
  }

  const handleSubmit = () => {
    localStorage.setItem('sajilo_worker_application', JSON.stringify(formData))
    navigate('/login')
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

      {/* Fields — labels read from registry WITHOUT hooks */}
      {(currentCard.fields || []).map(field => {
        const val = formData[field.name] || ''
        const label = getContent(field.labelKey, field.name)

        if (field.type === 'checkbox') {
          return (
            <label key={field.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!val} onChange={e => handleFieldChange(field.name, e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--accent-blue)' }} />
              <span>{label}{field.required && <span style={{ color: 'var(--accent-red)' }}> ★</span>}</span>
            </label>
          )
        }

        if (field.type === 'select') {
          return (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}{field.required && ' ★'}</label>
              <select value={val} onChange={e => handleFieldChange(field.name, e.target.value)}
                style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)' }}>
                <option value="">Select...</option>
                {(field.options || []).map(o => <option key={o.value} value={o.value}>{o.value}</option>)}
              </select>
            </div>
          )
        }

        return (
          <div key={field.name} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}{field.required && ' ★'}</label>
            <input type={field.type || 'text'} value={val} onChange={e => handleFieldChange(field.name, e.target.value)}
              placeholder={getContent(field.placeholderKey, '')} required={field.required}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface2)' }} />
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
    </div>
  )
}
