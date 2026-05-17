import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'

export default function FilterTabs({ elementConfig, overrideData }) {
  const w = config.worker; const wj = w.jobs || {}
  const tabs = elementConfig.content?.tabs || []
  const [activeTab, setActiveTab] = React.useState(tabs.find(t => t.default)?.id || tabs[0]?.id || 'all')

  return (
    <div style={{ display: wj.filters?.display || 'flex', gap: wj.filters?.gap || '6px', marginBottom: wj.filters?.marginBottom || '16px', overflowX: 'auto', padding: '4px 0' }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => { setActiveTab(tab.id); overrideData?.onFilter?.(tab.id) }} style={{ padding: wj.filterTab?.padding || '8px 16px', borderRadius: wj.filterTab?.borderRadius || '20px', border: wj.filterTab?.border || '1px solid var(--border)', background: activeTab === tab.id ? (wj.filterTabActive?.background || 'var(--accent-blue)') : (wj.filterTab?.background || 'transparent'), color: activeTab === tab.id ? (wj.filterTabActive?.color || '#fff') : (wj.filterTab?.color || 'var(--text-secondary)'), fontSize: wj.filterTab?.fontSize || 'var(--font-body-sm)', fontWeight: wj.filterTab?.fontWeight || 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {useContent(tab.labelKey, tab.id)}
        </button>
      ))}
    </div>
  )
}