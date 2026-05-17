import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'
import ElementRenderer from '../ElementRenderer.jsx'

export default function SubtabContainer({ elementConfig, overrideData }) {
  const c = config.colors; const r = config.radius; const f = config.font; const w = config.worker; const ws = w.schedule?.subtabs || {}
  const subtabs = elementConfig.content?.defaultSubtabs || []
  const [activeTabId, setActiveTabId] = React.useState(subtabs[0]?.id || null)

  return (
    <div>
      <div style={{ display: ws.bar?.display || 'flex', gap: ws.bar?.gap || '4px', marginBottom: ws.bar?.marginBottom || '20px', borderBottom: ws.bar?.borderBottom || `2px solid ${c.border}`, paddingBottom: ws.bar?.paddingBottom || '0', overflowX: 'auto' }}>
        {subtabs.map(tab => {
          const isActive = tab.id === activeTabId; const label = useContent(tab.labelKey, tab.id)
          return <button key={tab.id} onClick={() => setActiveTabId(tab.id)} style={{ padding: ws.tab?.padding || '10px 18px', fontSize: ws.tab?.fontSize || '14px', fontWeight: isActive ? (ws.tabActive?.fontWeight || 600) : (ws.tab?.fontWeight || 500), color: isActive ? (ws.tabActive?.color || c.accentBlue) : (ws.tab?.color || c.textSecondary), background: ws.tab?.background || 'transparent', border: 'none', borderBottom: `2px solid ${isActive ? (ws.tabActive?.borderBottomColor || c.accentBlue) : 'transparent'}`, cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: '-2px' }}>{label}</button>
        })}
      </div>
      <div>
        {subtabs.map(tab => {
          if (tab.id !== activeTabId) return null
          if (!tab.elementId) {
            const emptyText = useContent('worker.schedule.empty', 'Configure this section from the Admin Panel.')
            return <div key={tab.id} style={{ textAlign: ws.emptySubtab?.textAlign || 'center', padding: ws.emptySubtab?.padding || '40px', color: ws.emptySubtab?.color || c.textSecondary, fontSize: ws.emptySubtab?.fontSize || f.body || '16px', border: ws.emptySubtab?.border || `2px dashed ${c.border}`, borderRadius: ws.emptySubtab?.borderRadius || r.md || '12px', background: ws.emptySubtab?.background || c.bgSurface }}>{emptyText}</div>
          }
          return <ElementRenderer key={tab.id} elementId={tab.elementId} overrideData={overrideData} />
        })}
      </div>
    </div>
  )
}