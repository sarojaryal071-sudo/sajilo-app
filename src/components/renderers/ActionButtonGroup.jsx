// src/components/renderers/ActionButtonGroup.jsx
// Generic action button renderer — no business logic, no domain knowledge
// Used by ElementRenderer for ALL action buttons across the platform

import React from 'react'

const VARIANT_STYLES = {
  success: { background: 'var(--accent-green)', color: '#fff', border: 'none' },
  danger: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
  primary: { background: 'var(--accent-blue)', color: '#fff', border: 'none' },
}

export default function ActionButtonGroup({ actions, payload, onAction }) {
  if (!actions || actions.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {actions.map((action) => {
        if (action.visible === false) return null

        const variantStyle = VARIANT_STYLES[action.variant] || VARIANT_STYLES.primary

        return (
          <button
            key={action.id}
            disabled={action.disabled}
            onClick={() => {
              // Dispatch generic event upward — ElementRenderer/Page handles business logic
              onAction?.({
                type: action.action,
                payload: payload || {},
              })
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: action.disabled ? 'not-allowed' : 'pointer',
              opacity: action.disabled ? 0.5 : 1,
              fontSize: '14px',
              fontWeight: 600,
              ...variantStyle,
            }}
          >
            {action.label || action.id}
          </button>
        )
      })}
    </div>
  )
}
