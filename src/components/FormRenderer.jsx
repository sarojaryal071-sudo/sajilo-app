import { useContent } from '../hooks/useContent.js'
import { getComponent } from '../config/componentDictionary.js'

export default function FormRenderer({ fields, formData, setFormData, error, loading, submitLabel, onSubmit }) {
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData) }} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {fields.map(field => {
        const value = formData[field.name] || ''
        const def = getComponent(field.componentType || field.type + 'Input') || {}

        const renderField = () => {
          switch (def.renderAs || field.type) {
            case 'select':
              return (
                <select value={value} onChange={(e) => handleChange(field.name, e.target.value)} required={field.required}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none', cursor: 'pointer' }}>
                  <option value="">{useContent('field.select')}</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{useContent(opt.labelKey)}</option>
                  ))}
                </select>
              )

            case 'textarea':
              return (
                <textarea value={value} onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={useContent(field.placeholderKey)} required={field.required} rows={3}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none', resize: 'vertical' }} />
              )

            case 'imageUpload':
              return (
                <input type="file" accept={def.accepts || 'image/*'}
                  onChange={(e) => handleChange(field.name, e.target.files[0])}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }} />
              )

            default:
              return (
                <input type={def.inputType || field.type || 'text'} value={value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={useContent(field.placeholderKey)} required={field.required}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border)'}`, background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body)', outline: 'none' }} />
              )
          }
        }

        return (
          <div key={field.name}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
              {useContent(field.labelKey)}
              {field.required && <span style={{ color: 'var(--accent-red)', marginLeft: '2px' }}>★</span>}
            </label>
            {renderField()}
          </div>
        )
      })}

      {error && (
        <div style={{ fontSize: 12, color: 'var(--accent-red)', fontWeight: 500 }}>{error}</div>
      )}

      <button type="submit" disabled={loading}
        style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', background: loading ? '#94a3b8' : 'var(--accent-blue)', color: '#fff', fontSize: 'var(--font-body)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', marginTop: 4, transition: 'all 0.2s' }}>
        {loading ? 'Submitting...' : submitLabel || 'Submit'}
      </button>
    </form>
  )
}