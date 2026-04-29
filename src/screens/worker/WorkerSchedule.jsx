import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SLOTS = ['morning', 'afternoon', 'evening']

export default function WorkerSchedule() {
  const [schedule, setSchedule] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadSchedule() }, [])

  const loadSchedule = async () => {
    try {
      const res = await api.getWorkerSchedule()
      setSchedule(res.data || [])
    } catch (err) { console.error(err) }
  }

  const toggleSlot = async (dayIndex, slot) => {
    const existing = schedule.find(s => s.day_of_week === dayIndex)
    let updated

    if (existing) {
      updated = schedule.map(s =>
        s.day_of_week === dayIndex ? { ...s, [slot]: !s[slot] } : s
      )
    } else {
      updated = [...schedule, {
        day_of_week: dayIndex,
        morning: false,
        afternoon: false,
        evening: false,
        [slot]: true,
      }]
    }

    setSchedule(updated)
    setSaving(true)
    try {
      await api.saveWorkerSchedule(updated)
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const isActive = (dayIndex, slot) => {
    const day = schedule.find(s => s.day_of_week === dayIndex)
    return day ? day[slot] : false
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
        Availability Schedule
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DAYS.map((day, dayIndex) => (
          <div key={day} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 12,
          }}>
            <div style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              {day}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {SLOTS.map((slot) => (
                <button key={slot} onClick={() => toggleSlot(dayIndex, slot)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', cursor: 'pointer',
                  fontSize: 'var(--font-body-sm)', fontWeight: 500,
                  background: isActive(dayIndex, slot) ? 'var(--accent-green-light)' : 'var(--bg-surface2)',
                  color: isActive(dayIndex, slot) ? 'var(--accent-green)' : 'var(--text-secondary)',
                }}>
                  {slot.charAt(0).toUpperCase() + slot.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {saving && <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-secondary)', fontSize: 'var(--font-body-sm)' }}>Saving...</div>}
    </div>
  )
}