import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function EditableFieldGroup({ elementConfig, overrideData }) {
  const c = config.colors; const r = config.radius; const f = config.font; const w = config.worker; const wp = w.profile || {}
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {})
  const profile = overrideData?.profile || {}
  const fields = elementConfig.content?.fields || []
  const isEditing = overrideData?.isEditing ?? false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: wp.fieldGroup?.gap || '12px', ...overrideStyles }}>
      {fields.map((field, idx) => {
        const label = useContent(field.labelKey, field.name)
        const value = profile[field.name] || ''
        return (
          <div key={idx}>
            <div style={{ fontSize: wp.fieldLabel?.fontSize || '14px', fontWeight: wp.fieldLabel?.fontWeight || 600, color: wp.fieldLabel?.color || c.textSecondary, marginBottom: wp.fieldLabel?.marginBottom || '4px' }}>{label}</div>
            {isEditing ? (
              field.type === 'textarea' ? (
                <textarea defaultValue={value} rows={3} style={{ padding: wp.fieldTextarea?.padding || '8px 10px', borderRadius: wp.fieldTextarea?.borderRadius || r.sm || '8px', border: wp.fieldTextarea?.border || `1px solid ${c.border}`, width: '100%', fontSize: wp.fieldTextarea?.fontSize || f.body || '16px', resize: 'vertical' }} />
              ) : (
                <input defaultValue={value} type={field.type === 'number' ? 'number' : 'text'} style={{ padding: wp.fieldInput?.padding || '8px 10px', borderRadius: wp.fieldInput?.borderRadius || r.sm || '8px', border: wp.fieldInput?.border || `1px solid ${c.border}`, width: '100%', fontSize: wp.fieldInput?.fontSize || f.body || '16px' }} />
              )
            ) : (
              <div style={{ color: wp.fieldValue?.color || c.textPrimary, fontSize: wp.fieldValue?.fontSize || f.body || '16px' }}>
                {field.name === 'skills' ? (Array.isArray(value) && value.length > 0 ? value.map((s, i) => <span key={i} style={{ padding: wp.skillTag?.padding || '4px 10px', borderRadius: wp.skillTag?.borderRadius || '12px', background: wp.skillTag?.background || c.accentBlueLight, color: wp.skillTag?.color || c.accentBlue, fontSize: wp.skillTag?.fontSize || '14px', fontWeight: wp.skillTag?.fontWeight || 500, marginRight: '6px' }}>{s}</span>) : 'No skills added') : (value || 'Not set')}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}