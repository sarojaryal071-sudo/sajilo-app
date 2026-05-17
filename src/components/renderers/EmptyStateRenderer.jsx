import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'
import { useStyle } from '../../hooks/useStyle.js'

export default function EmptyStateRenderer({ elementConfig, overrideData }) {
  const c = config.colors
  const overrideStyles = useStyle(elementConfig.style?.styleRef, {})
  const message = useContent(elementConfig.content?.messageKey, 'Nothing to show')
  return <div style={{ textAlign: 'center', padding: '40px', color: c.textSecondary, ...overrideStyles }}>{message}</div>
}