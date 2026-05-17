import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function SkillTag({ elementConfig, overrideData }) {
  const c = config.colors; const f = config.font; const w = config.worker; const wp = w.profile || {}
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {})
  const label = useContent(elementConfig.content?.labelKey, elementConfig.content?.label || '')
  return <span style={{ padding: wp.skillTag?.padding || '4px 10px', borderRadius: wp.skillTag?.borderRadius || '12px', background: wp.skillTag?.background || c.accentBlueLight, color: wp.skillTag?.color || c.accentBlue, fontSize: wp.skillTag?.fontSize || f.bodySm || '14px', fontWeight: wp.skillTag?.fontWeight || 500, ...overrideStyles }}>{label}</span>
}