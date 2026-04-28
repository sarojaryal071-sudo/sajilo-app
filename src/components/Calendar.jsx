import { useState, useRef, useEffect } from 'react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function Calendar({ value, onChange, onClose }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(value ? new Date(value).getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(value ? new Date(value).getMonth() : today.getMonth())
  const [tempDate, setTempDate] = useState(value || null)
  const [hoverDay, setHoverDay] = useState(null)
  const ref = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
    setHoverDay(null)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
    setHoverDay(null)
  }

  const selectDay = (day) => {
    const d = new Date(viewYear, viewMonth, day)
    setTempDate(d.toISOString().split('T')[0])
  }

  const isSelected = (day) => {
    if (!tempDate) return false
    const d = new Date(tempDate)
    return day === d.getDate() && viewMonth === d.getMonth() && viewYear === d.getFullYear()
  }

  const isToday = (day) => {
    return day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
  }

  const getBg = (day) => {
    if (isSelected(day)) return 'var(--accent-blue)'
    if (hoverDay === day) return 'var(--accent-blue-light)'
    if (isToday(day)) return 'var(--accent-blue-light)'
    return 'transparent'
  }

  const getColor = (day) => {
    if (isSelected(day)) return '#fff'
    if (hoverDay === day || isToday(day)) return 'var(--accent-blue)'
    return 'var(--text-secondary)'
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div ref={ref} style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: 14,
      boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
      width: 250,
      position: 'relative',
      zIndex: 1000,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}>
        <button onClick={prevMonth} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 16, padding: '2px 8px',
        }}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 16, padding: '2px 8px',
        }}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', padding: '3px 0' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 12 }}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={'e' + i} />
        ))}
        {days.map((day) => (
          <div
            key={day}
            onClick={() => selectDay(day)}
            onMouseEnter={() => setHoverDay(day)}
            onMouseLeave={() => setHoverDay(null)}
            style={{
              textAlign: 'center', padding: '6px 0', fontSize: 12, cursor: 'pointer', borderRadius: 6,
              background: getBg(day),
              color: getColor(day),
              fontWeight: isSelected(day) || isToday(day) || hoverDay === day ? 600 : 400,
              transition: 'background 0.1s',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => { setTempDate(null); onClose(); }} style={{
          flex: 1, padding: '6px 0', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)', background: 'transparent',
          color: 'var(--text-secondary)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
        }}>Clear</button>
        <button onClick={() => {
          const t = today.toISOString().split('T')[0]
          setTempDate(t)
          setViewYear(today.getFullYear())
          setViewMonth(today.getMonth())
        }} style={{
          flex: 1, padding: '6px 0', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--accent-blue)', background: 'transparent',
          color: 'var(--accent-blue)', fontSize: 11, fontWeight: 600, cursor: 'pointer',
        }}>Today</button>
        <button onClick={() => { if (tempDate) onChange(tempDate); onClose(); }} style={{
          flex: 1, padding: '6px 0', borderRadius: 'var(--radius-sm)',
          border: 'none', background: 'var(--accent-blue)',
          color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer',
        }}>OK</button>
      </div>
    </div>
  )
}