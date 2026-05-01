import { useContent } from '../hooks/useContent.js'
import { getComponent } from '../config/componentDictionary.js'

export default function FormRenderer({ fields, formData, setFormData, error, loading, submitLabel, onSubmit, hideSubmit }) {
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Resolve all labels at top level — no conditional hooks
  const selectPlaceholder = useContent('field.select')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData) }} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {fields.map(field => {
        const value = formData[field.name] || ''
        const def = getComponent(field.componentType || field.type + 'Input') || {}

        // Get label once per field at map level
        const label = useContent(field.labelKey)
        const placeholder = field.placeholderKey ? useContent(field.placeholderKey) : ''

        if (field.type === 'checkbox') {
          return (
            <div key={field.name}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!value} onChange={(e) => handleChange(field.name, e.target.checked)} required={field.required}
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
              {field.required && <span style={{ color: 'var(--accent-red)', marginLeft: '2px' }}>★</span>}
            </label>
            {field.type === 'select' ? (
              <select value={value} onChange={(e) => handleChange(field.name, e.target.value)} required={field.required}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none', cursor: 'pointer' }}>
                <option value="">{selectPlaceholder}</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{useContent(opt.labelKey)}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea value={value} onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={placeholder} required={field.required} rows={3}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none', resize: 'vertical' }} />
            ) : field.type === 'imageUpload' ? (
              <input type="file" accept={def.accepts || 'image/*'}
                onChange={(e) => handleChange(field.name, e.target.files[0])}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }} />
            ) : (
              <input type={def.inputType || field.type || 'text'} value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={placeholder} required={field.required}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }} />
            )}
          </div>
        )
      })}

      {error && (
        <div style={{ fontSize: 12, color: 'var(--accent-red)', fontWeight: 500 }}>{error}</div>
      )}

      {!hideSubmit && (
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', background: loading ? '#94a3b8' : 'var(--accent-blue)', color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', marginTop: 4, transition: 'all 0.2s' }}>
          {loading ? 'Submitting...' : submitLabel || 'Submit'}
        </button>
      )}
    </form>
  )
}