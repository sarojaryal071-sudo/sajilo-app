import React from 'react'
import { useContent } from '../../hooks/useContent.js'
import config from '../../config/ui/configResolver.js'

export default function DayScheduleCard({ elementConfig, overrideData }) {
  const c = config.colors; const r = config.radius; const f = config.font; const s = config.spacing
  const w = config.worker; const ws = w.schedule || {}; const wts = ws.timeSlots || {}
  const days = elementConfig.content?.days || []
  const schedule = overrideData?.schedule || []
  const onSave = overrideData?.onSaveSchedule
  const addSlotLabel = useContent('worker.schedule.addSlot', '+ Add Time Slot')
  const startLabel = useContent('worker.schedule.startTime', 'Start')
  const endLabel = useContent('worker.schedule.endTime', 'End')
  const removeLabel = useContent('worker.schedule.remove', '×')
  const maxSlots = elementConfig.content?.maxSlotsPerDay || 5

  const getDaySlots = (dayIndex) => { const day = schedule.find(d => d.day_of_week === dayIndex); return day?.slots || [] }
  const updateDaySlots = (dayIndex, newSlots) => {
    const updated = schedule.map(d => d.day_of_week === dayIndex ? { ...d, slots: newSlots } : d)
    if (!updated.find(d => d.day_of_week === dayIndex)) updated.push({ day_of_week: dayIndex, slots: newSlots })
    onSave?.(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: ws.list?.gap || '10px' }}>
      {days.map((day, dayIndex) => {
        const daySlots = getDaySlots(dayIndex)
        return (
          <div key={day} style={{ background: ws.dayCard?.background || c.bgSurface, border: ws.dayCard?.border || `1px solid ${c.border}`, borderRadius: ws.dayCard?.borderRadius || r.md || '12px', padding: ws.dayCard?.padding || '12px' }}>
            <div style={{ fontSize: ws.dayName?.fontSize || f.body || '16px', fontWeight: ws.dayName?.fontWeight || 600, color: ws.dayName?.color || c.textPrimary, marginBottom: ws.dayName?.marginBottom || '8px' }}>{day}</div>
            {daySlots.map((slot, slotIdx) => (
              <div key={slotIdx} style={{ display: wts.slotRow?.display || 'flex', alignItems: wts.slotRow?.alignItems || 'center', gap: wts.slotRow?.gap || '8px', padding: wts.slotRow?.padding || '6px 0' }}>
                <span style={{ fontSize: wts.timeLabel?.fontSize || '14px', color: wts.timeLabel?.color || c.textSecondary }}>{startLabel}:</span>
                <input type="time" value={slot.start || ''} onChange={e => { const u = [...daySlots]; u[slotIdx] = { ...u[slotIdx], start: e.target.value }; updateDaySlots(dayIndex, u) }} style={{ padding: wts.timeInput?.padding || '6px 10px', borderRadius: wts.timeInput?.borderRadius || r.sm || '8px', border: wts.timeInput?.border || `1px solid ${c.border}`, fontSize: wts.timeInput?.fontSize || '14px', background: wts.timeInput?.background || c.bgSurface, color: wts.timeInput?.color || c.textPrimary, width: wts.timeInput?.width || '100px' }} />
                <span style={{ fontSize: wts.timeLabel?.fontSize || '14px', color: wts.timeLabel?.color || c.textSecondary }}>{endLabel}:</span>
                <input type="time" value={slot.end || ''} onChange={e => { const u = [...daySlots]; u[slotIdx] = { ...u[slotIdx], end: e.target.value }; updateDaySlots(dayIndex, u) }} style={{ padding: wts.timeInput?.padding || '6px 10px', borderRadius: wts.timeInput?.borderRadius || r.sm || '8px', border: wts.timeInput?.border || `1px solid ${c.border}`, fontSize: wts.timeInput?.fontSize || '14px', background: wts.timeInput?.background || c.bgSurface, color: wts.timeInput?.color || c.textPrimary, width: wts.timeInput?.width || '100px' }} />
                <button onClick={() => updateDaySlots(dayIndex, daySlots.filter((_, i) => i !== slotIdx))} style={{ padding: wts.removeBtn?.padding || '4px 8px', borderRadius: wts.removeBtn?.borderRadius || r.sm || '8px', border: wts.removeBtn?.border || `1px solid ${c.accentRed}`, background: 'transparent', color: wts.removeBtn?.color || c.accentRed, fontSize: wts.removeBtn?.fontSize || '12px', cursor: 'pointer', fontWeight: 500 }}>{removeLabel}</button>
              </div>
            ))}
            {daySlots.length < maxSlots ? (
              <button onClick={() => updateDaySlots(dayIndex, [...daySlots, { start: '', end: '' }])} style={{ padding: wts.addSlotBtn?.padding || '6px 12px', borderRadius: wts.addSlotBtn?.borderRadius || r.sm || '8px', border: wts.addSlotBtn?.border || `1px dashed ${c.border}`, background: 'transparent', color: wts.addSlotBtn?.color || c.accentBlue, fontSize: wts.addSlotBtn?.fontSize || '14px', cursor: 'pointer', fontWeight: 500, width: '100%', marginTop: wts.addSlotBtn?.marginTop || '4px' }}>{addSlotLabel}</button>
            ) : (
              <div style={{ fontSize: wts.maxReached?.fontSize || '12px', color: wts.maxReached?.color || c.textSecondary, textAlign: 'center', padding: wts.maxReached?.padding || '4px' }}>Max {maxSlots} slots per day</div>
            )}
          </div>
        )
      })}
    </div>
  )
}