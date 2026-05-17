import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'

export default function ServiceTableRenderer({ elementConfig, overrideData }) {
  const c = config.colors; const r = config.radius; const f = config.font; const w = config.worker; const ws = w.schedule?.services || {}
  const columns = elementConfig.content?.columns || []
  const services = overrideData?.services || []
  const addLabel = useContent(elementConfig.content?.addLabelKey, '+ Add Service')
  const removeLabel = useContent(elementConfig.content?.removeLabelKey, 'Remove')
  const onSave = overrideData?.onSaveServices

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: ws.table?.gap || '8px' }}>
      <div style={{ display: 'flex', gap: ws.header?.gap || '8px', padding: ws.header?.padding || '8px 12px', background: ws.header?.background || c.bgSurface2, borderRadius: ws.header?.borderRadius || r.sm || '8px', fontWeight: ws.header?.fontWeight || 600, fontSize: ws.header?.fontSize || '14px', color: ws.header?.color || c.textSecondary }}>
        {columns.map(col => <span key={col.id} style={{ flex: 1 }}>{useContent(col.labelKey, col.id)}</span>)}
        <span style={{ width: '50px' }}></span>
      </div>
      {services.map((svc, idx) => (
        <div key={idx} style={{ display: 'flex', gap: ws.row?.gap || '8px', padding: ws.row?.padding || '10px 12px', background: ws.row?.background || c.bgSurface, border: ws.row?.border || `1px solid ${c.border}`, borderRadius: ws.row?.borderRadius || r.md || '12px', alignItems: 'center' }}>
          {columns.map(col => {
            if (col.type === 'toggle') {
              const isActive = svc[col.id] !== false
              return <div key={col.id} style={{ flex: 1 }}><button onClick={() => { const u = [...services]; u[idx] = { ...u[idx], [col.id]: !isActive }; onSave?.(u) }} style={{ width: ws.toggle?.width || '40px', height: ws.toggle?.height || '22px', borderRadius: ws.toggle?.borderRadius || '11px', border: 'none', cursor: 'pointer', position: 'relative', background: isActive ? (ws.toggleActive?.background || c.accentGreen) : (ws.toggleInactive?.background || c.border) }}><span style={{ width: ws.toggleDot?.width || '18px', height: ws.toggleDot?.height || '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: isActive ? '20px' : '2px', transition: 'left 0.2s' }} /></button></div>
            }
            if (col.type === 'select') {
              return <select key={col.id} value={svc[col.id] || ''} onChange={e => { const u = [...services]; u[idx] = { ...u[idx], [col.id]: e.target.value }; onSave?.(u) }} style={{ padding: ws.select?.padding || '6px 8px', borderRadius: ws.select?.borderRadius || r.sm || '8px', border: ws.select?.border || `1px solid ${c.border}`, fontSize: ws.select?.fontSize || '14px', background: ws.select?.background || c.bgSurface, color: ws.select?.color || c.textPrimary, flex: 1 }}>{(col.options || []).map(o => <option key={o.value} value={o.value}>{useContent(o.labelKey, o.value)}</option>)}</select>
            }
            return <input key={col.id} type={col.type || 'text'} value={svc[col.id] || ''} onChange={e => { const u = [...services]; u[idx] = { ...u[idx], [col.id]: col.type === 'number' ? Number(e.target.value) : e.target.value }; onSave?.(u) }} style={{ padding: ws.input?.padding || '6px 8px', borderRadius: ws.input?.borderRadius || r.sm || '8px', border: ws.input?.border || `1px solid ${c.border}`, fontSize: ws.input?.fontSize || '14px', background: ws.input?.background || c.bgSurface, color: ws.input?.color || c.textPrimary, flex: 1 }} />
          })}
          <button onClick={() => onSave?.(services.filter((_, i) => i !== idx))} style={{ padding: ws.removeBtn?.padding || '4px 8px', borderRadius: ws.removeBtn?.borderRadius || r.sm || '8px', border: ws.removeBtn?.border || `1px solid ${c.accentRed}`, background: 'transparent', color: ws.removeBtn?.color || c.accentRed, fontSize: ws.removeBtn?.fontSize || '12px', cursor: 'pointer', fontWeight: 500, flexShrink: 0 }}>{removeLabel}</button>
        </div>
      ))}
      <button onClick={() => { const newRow = {}; columns.forEach(c => { newRow[c.id] = c.type === 'toggle' ? true : c.type === 'number' ? 0 : '' }); onSave?.([...services, newRow]) }} style={{ padding: ws.addBtn?.padding || '6px 12px', borderRadius: ws.addBtn?.borderRadius || r.sm || '8px', border: ws.addBtn?.border || `1px dashed ${c.border}`, background: 'transparent', color: ws.addBtn?.color || c.accentBlue, fontSize: ws.addBtn?.fontSize || '14px', cursor: 'pointer', fontWeight: 500, width: '100%' }}>{addLabel}</button>
    </div>
  )
}