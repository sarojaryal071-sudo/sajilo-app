import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function StatusText({ elementConfig, overrideData }) {
  const c = config.colors; const f = config.font; const w = config.worker; const ws = w.schedule || {}
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {})
  const message = useContent(elementConfig.content?.messageKey || elementConfig.content?.savingKey, '')
  return <div style={{ textAlign: 'center', marginTop: ws.saving?.marginTop || '12px', color: ws.saving?.color || c.textSecondary, fontSize: ws.saving?.fontSize || f.bodySm || '14px', ...overrideStyles }}>{message}</div>
}