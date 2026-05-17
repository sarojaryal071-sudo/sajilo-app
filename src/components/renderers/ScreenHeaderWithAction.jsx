import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function ScreenHeaderWithAction({ elementConfig, overrideData }) {
  const c = config.colors; const r = config.radius; const f = config.font; const w = config.worker
  const wp = w.profile || {}
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {})
  const title = useContent(elementConfig.content?.titleKey, 'My Profile')
  const editLabel = useContent(elementConfig.content?.editButtonKey, 'Edit')
  const saveLabel = useContent(elementConfig.content?.saveButtonKey, 'Save')
  const savingLabel = useContent(elementConfig.content?.savingButtonKey, 'Saving...')
  const isEditing = overrideData?.isEditing ?? false; const isSaving = overrideData?.isSaving ?? false
  let buttonLabel = editLabel
  if (isEditing && isSaving) buttonLabel = savingLabel
  else if (isEditing) buttonLabel = saveLabel

  return (
    <div style={{ display: wp.header?.display || 'flex', justifyContent: wp.header?.justifyContent || 'space-between', alignItems: wp.header?.alignItems || 'center', marginBottom: wp.header?.marginBottom || '20px', ...overrideStyles }}>
      <h2 style={{ fontSize: wp.heading?.fontSize || f.heading || '24px', fontWeight: wp.heading?.fontWeight || 700, color: wp.heading?.color || c.textPrimary }}>{title}</h2>
      <button onClick={() => isEditing ? overrideData?.onSave?.() : overrideData?.onEdit?.()} style={{ padding: wp.editBtn?.padding || '8px 16px', borderRadius: wp.editBtn?.borderRadius || r.sm || '8px', border: 'none', background: isEditing ? (wp.editBtnSave?.background || c.accentGreen) : (wp.editBtnEdit?.background || c.accentBlue), color: '#fff', fontSize: wp.editBtn?.fontSize || '14px', fontWeight: wp.editBtn?.fontWeight || 600, cursor: 'pointer' }}>{buttonLabel}</button>
    </div>
  )
}