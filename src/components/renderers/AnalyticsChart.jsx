import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'

export default function AnalyticsChart({ elementConfig, overrideData }) {
  const w = config.worker; const wd = w.dashboard?.analytics || {}
  const title = useContent('worker.analytics', 'Analytics')
  const weeklyData = overrideData?.weeklyEarnings || []
  const monthlyData = overrideData?.monthlyEarnings || []
  const chartMode = overrideData?.chartMode || 'weekly'
  const setChartMode = overrideData?.onSetChartMode || (() => {})
  const currentData = chartMode === 'monthly' ? monthlyData : weeklyData
  const hasData = currentData.length > 0 && currentData.some(v => v > 0)
  const [chartType, setChartType] = React.useState('bar')
  const chartColors = wd.chartColors || ['var(--accent-blue)', 'var(--accent-green)', 'var(--accent-orange)', '#8B5CF6', '#EC4899']
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const labels = chartMode === 'monthly'
    ? monthlyData.map((_, i) => { const d = new Date(); d.setMonth(d.getMonth() - (monthlyData.length - 1 - i)); return monthLabels[d.getMonth()] })
    : weeklyData.map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (weeklyData.length - 1 - i)); return dayLabels[d.getDay()] })

  return (
    <div style={{ background: wd.background || 'var(--bg-surface)', borderRadius: wd.borderRadius || 'var(--radius-lg)', padding: wd.padding || '20px', marginBottom: wd.marginBottom || '16px', boxShadow: wd.boxShadow || '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 'var(--font-title)', fontWeight: 700 }}>{title}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['bar','line','pie'].map(type => <button key={type} onClick={() => setChartType(type)} style={{ padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: chartType === type ? 'var(--accent-blue)' : 'transparent', color: chartType === type ? '#fff' : 'var(--text-secondary)', fontSize: 'var(--font-caption)', cursor: 'pointer' }}>{type==='bar'?'📊':type==='line'?'📈':'🥧'}</button>)}
          <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
          {['weekly','monthly'].map(mode => <button key={mode} onClick={() => setChartMode(mode)} style={{ padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: chartMode === mode ? 'var(--accent-blue)' : 'transparent', color: chartMode === mode ? '#fff' : 'var(--text-secondary)', fontSize: 'var(--font-caption)', cursor: 'pointer' }}>{mode==='weekly'?'Week':'Month'}</button>)}
        </div>
      </div>
      {!hasData ? (
        <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No earnings data yet</div>
      ) : (
        <div style={{ height: '140px', position: 'relative' }}>
          {chartType === 'bar' && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: '100%', padding: '4px 0' }}>
              {currentData.map((h, i) => { const max = Math.max(...currentData, 1); return <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}><div style={{ width: '100%', height: `${(h/max)*100}%`, background: chartColors[i%chartColors.length], borderRadius: '4px 4px 0 0', minHeight: h>0?2:0 }} /><span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: 4 }}>{labels[i]}</span></div> })}
            </div>
          )}
          {chartType === 'line' && (
            <svg width="100%" height="100%" viewBox="0 0 300 140" preserveAspectRatio="none">
              <polyline fill="none" stroke={chartColors[0]} strokeWidth="3" points={currentData.map((v,i)=>{ const max=Math.max(...currentData,1); return `${(i/(currentData.length-1||1))*300},${140-((v/max)*100)}` }).join(' ')} />
              {currentData.map((v,i)=>{ const max=Math.max(...currentData,1); return <circle key={i} cx={(i/(currentData.length-1||1))*300} cy={140-((v/max)*100)} r="4" fill={chartColors[i%chartColors.length]} /> })}
            </svg>
          )}
          {chartType === 'pie' && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                {currentData.reduce((acc,val,i)=>{ const total=currentData.reduce((s,x)=>s+x,0); if(total===0)return acc; const slice=(val/total)*360; const start=acc.offset; const end=start+slice; const x1=50+40*Math.cos((start-90)*Math.PI/180); const y1=50+40*Math.sin((start-90)*Math.PI/180); const x2=50+40*Math.cos((end-90)*Math.PI/180); const y2=50+40*Math.sin((end-90)*Math.PI/180); return {offset:end, elements:[...acc.elements,<path key={i} d={`M50,50 L${x1},${y1} A40,40 0 ${slice>180?1:0},1 ${x2},${y2} Z`} fill={chartColors[i%chartColors.length]} />]} },{offset:0,elements:[]}).elements}
                <circle cx="50" cy="50" r="20" fill="var(--bg-surface)" />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  )
}