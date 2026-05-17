import React from 'react'
import { useContent } from '../../hooks/useContent.js'

export default function DataTableRenderer({ elementConfig, overrideData }) {
  const columns = (elementConfig.content?.columns || []).filter(c => c.visible).sort((a, b) => a.order - b.order)
  const data = overrideData?.data || []
  const onAction = overrideData?.onAction

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-body-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            {columns.map(col => <th key={col.id} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>{useContent(col.labelKey, col.id)}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
              {columns.map(col => (
                <td key={col.id} style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>
                  {col.type === 'actions' ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      {row.status === 'pending' && (
                        <>
                          <button onClick={() => overrideData?.onReview?.(row)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: 'var(--accent-blue)', color: '#fff', cursor: 'pointer', fontSize: 12 }}>Review</button>
                          <button onClick={() => onAction?.('approve', row)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: 'var(--accent-green)', color: '#fff', cursor: 'pointer', fontSize: 12 }}>Approve</button>
                          <button onClick={() => onAction?.('reject', row)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: 'var(--accent-red)', color: '#fff', cursor: 'pointer', fontSize: 12 }}>Reject</button>
                        </>
                      )}
                      {row.status === 'active' && <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Active</span>}
                      {row.status === 'rejected' && <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>Rejected</span>}
                    </div>
                  ) : (row[col.id] || '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}