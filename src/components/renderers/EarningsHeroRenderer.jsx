import React from "react";
import { useContent } from "../../hooks/useContent.js";
import config from "../../config/ui/configResolver.js";
import { useStyle } from "../../hooks/useStyle.js";

export default function EarningsHeroRenderer({ elementConfig, overrideData }) {
  const c = config.colors; const s = config.spacing; const r = config.radius; const f = config.font;
  const w = config.worker; const overrideStyles = useStyle(elementConfig.style?.styleRef, {});
  const earnings = overrideData?.earnings || {};
  const label = useContent(elementConfig.content?.labelKey, "Total Earnings");
  const subLabel = useContent(elementConfig.content?.subLabelKey, "completed jobs");
  const amount = earnings[elementConfig.content?.amountField] || 0;
  const count = earnings[elementConfig.content?.subField] || 0;
  const we = w.earnings || {};
  const financialOverview = overrideData?.financialOverview;

  return (
    <div style={{
      background: we.hero?.background || `linear-gradient(135deg, ${c.accentBlue}, #1A56DB)`,
      borderRadius: we.hero?.borderRadius || r.lg || '16px', padding: we.hero?.padding || s.spacious || '24px',
      marginBottom: we.hero?.marginBottom || '20px', color: '#fff', display: 'flex', flexWrap: 'wrap',
      alignItems: 'flex-start', gap: '16px', ...overrideStyles,
    }}>
      <div style={{ flex:'1 1 180px', minWidth:0 }}>
        <div style={{ fontSize: we.heroLabel?.fontSize || '14px', opacity: we.heroLabel?.opacity||0.8, marginBottom: we.heroLabel?.marginBottom||'4px' }}>{label}</div>
        <div style={{ fontSize: we.heroAmount?.fontSize || '32px', fontWeight: we.heroAmount?.fontWeight||800 }}>Rs {amount.toLocaleString()}</div>
        <div style={{ fontSize: we.heroSub?.fontSize || '14px', opacity: we.heroSub?.opacity||0.8, marginTop: we.heroSub?.marginTop||'8px' }}>{count} {subLabel}</div>
      </div>
      {financialOverview && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 12px', fontSize:'12px', opacity:.95, flex:'0 0 auto', minWidth:'160px' }}>
          {[{label:'Invoiced',value:financialOverview.invoiced},{label:'Collected',value:financialOverview.collected},{label:'Commission',value:financialOverview.commission},{label:'Net',value:financialOverview.net}].map(item=>(
            <div key={item.label} style={{ display:'flex', justifyContent:'space-between', gap:'8px' }}>
              <span style={{opacity:.75}}>{item.label}</span>
              <span style={{fontWeight:600}}>{item.value===0&&item.label!=='Net'?'—':`Rs ${item.value.toLocaleString()}`}</span>
            </div>
          ))}
          {financialOverview.dues>0 && (
            <div style={{ gridColumn:'1/-1', display:'flex', justifyContent:'space-between', gap:'8px', borderTop:'1px solid rgba(255,255,255,0.2)', marginTop:'4px', paddingTop:'4px' }}>
              <span style={{opacity:.75}}>Due</span>
              <span style={{fontWeight:700, color:'#FFD700'}}>Rs {financialOverview.dues.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}