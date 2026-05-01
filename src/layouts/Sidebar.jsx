import { useState, useEffect, useRef } from 'react'
import { locations } from '../config/data.js'
import Calendar from '../components/Calendar.jsx'
import { useContent } from '../hooks/useContent.js'

const HOURS = ['01','02','03','04','05','06','07','08','09','10','11','12']
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export default function Sidebar() {
  const [selectedLocation, setSelectedLocation] = useState('Kathmandu')
  const [radius, setRadius] = useState(10)
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(5000)
  const [rating, setRating] = useState(0)
  const [availability, setAvailability] = useState('all')
  const [showHour, setShowHour] = useState(false)
  const [showMinute, setShowMinute] = useState(false)
  const [selectedHour, setSelectedHour] = useState('09')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const [isAM, setIsAM] = useState(true)
  const [sidebarDate, setSidebarDate] = useState('')
  const [showSideCalendar, setShowSideCalendar] = useState(false)

  const hourRef = useRef(null)
  const minuteRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (hourRef.current && !hourRef.current.contains(e.target)) setShowHour(false)
      if (minuteRef.current && !minuteRef.current.contains(e.target)) setShowMinute(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return useContent('calendar.selectDate')
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const handleReset = () => {
    setSelectedLocation('Kathmandu')
    setRadius(10)
    setPriceMin(0)
    setPriceMax(5000)
    setRating(0)
    setAvailability('all')
    setSelectedHour('09')
    setSelectedMinute('00')
    setIsAM(true)
    setSidebarDate('')
  }

  return (
    <aside style={{
      width: 248, flexShrink: 0, background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)', padding: '20px 14px',
      display: 'flex', flexDirection: 'column', gap: 18,
      overflowY: 'auto', height: '100%',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
        {useContent('sidebar.filters')}
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
          {useContent('sidebar.location')}
        </div>
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} style={{
          width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
          background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13,
          outline: 'none', cursor: 'pointer',
        }}>
          {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
          {useContent('sidebar.radius')} — {radius} km
        </div>
        <input type="range" min={1} max={50} value={radius} onChange={(e) => setRadius(Number(e.target.value))} style={{
          width: '100%', accentColor: 'var(--accent-blue)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>
          <span>1 km</span><span>50 km</span>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
          {useContent('sidebar.priceRange')}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="number" value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} placeholder="0" style={{
            width: 70, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
            background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
          }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>—</span>
          <input type="number" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} placeholder="5000" style={{
            width: 70, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
            background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
          }} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
          {useContent('sidebar.minRating')}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} onClick={() => setRating(n)} style={{
              fontSize: 20, cursor: 'pointer',
              color: rating >= n ? '#f59e0b' : 'var(--border)',
            }}>★</span>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
          {useContent('sidebar.availability')}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: useContent('sidebar.all') },
            { key: 'now', label: useContent('sidebar.now') },
            { key: 'scheduled', label: useContent('sidebar.scheduled') },
          ].map((opt) => (
            <div key={opt.key} onClick={() => setAvailability(opt.key)} style={{
              padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer',
              background: availability === opt.key ? 'var(--accent-blue)' : 'var(--bg-surface2)',
              color: availability === opt.key ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${availability === opt.key ? 'var(--accent-blue)' : 'var(--border)'}`,
            }}>{opt.label}</div>
          ))}
        </div>
      </div>

      {availability === 'scheduled' && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
            {useContent('sidebar.dateTime')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowSideCalendar(!showSideCalendar)} style={{
                width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--bg-surface2)', color: sidebarDate ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
              }}>
                {sidebarDate ? formatDate(sidebarDate) : '📅 ' + useContent('calendar.selectDate')}
              </button>
              {showSideCalendar && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 300 }}>
                  <Calendar value={sidebarDate} onChange={setSidebarDate} onClose={() => setShowSideCalendar(false)} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div ref={hourRef} style={{ position: 'relative', width: 60 }}>
                <button onClick={() => { setShowHour(!showHour); setShowMinute(false); }} style={{
                  width: '100%', padding: '8px 4px', borderRadius: 6, border: '1px solid var(--border)',
                  background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13,
                  cursor: 'pointer', textAlign: 'center',
                }}>{selectedHour}</button>
                {showHour && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, zIndex: 200,
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 6, width: 60, maxHeight: 150, overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', scrollbarWidth: 'none',
                  }}>
                    {HOURS.map((h) => (
                      <div key={h} onClick={() => { setSelectedHour(h); setShowHour(false); }}
                      style={{ padding: '6px 4px', fontSize: 13, cursor: 'pointer', textAlign: 'center', background: selectedHour === h ? 'var(--accent-blue-light)' : 'transparent', color: selectedHour === h ? 'var(--accent-blue)' : 'var(--text-primary)' }}
                      onMouseEnter={(e) => { e.target.style.background = 'var(--accent-blue-light)'; e.target.style.color = 'var(--accent-blue)'; }}
                      onMouseLeave={(e) => { e.target.style.background = selectedHour === h ? 'var(--accent-blue-light)' : 'transparent'; e.target.style.color = selectedHour === h ? 'var(--accent-blue)' : 'var(--text-primary)'; }}
                      >{h}</div>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>:</span>
              <div ref={minuteRef} style={{ position: 'relative', width: 60 }}>
                <button onClick={() => { setShowMinute(!showMinute); setShowHour(false); }} style={{
                  width: '100%', padding: '8px 4px', borderRadius: 6, border: '1px solid var(--border)',
                  background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13,
                  cursor: 'pointer', textAlign: 'center',
                }}>{selectedMinute}</button>
                {showMinute && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, zIndex: 200,
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 6, width: 60, maxHeight: 150, overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', scrollbarWidth: 'none',
                  }}>
                    {MINUTES.map((m) => (
                      <div key={m} onClick={() => { setSelectedMinute(m); setShowMinute(false); }}
                      style={{ padding: '6px 4px', fontSize: 13, cursor: 'pointer', textAlign: 'center', background: selectedMinute === m ? 'var(--accent-blue-light)' : 'transparent', color: selectedMinute === m ? 'var(--accent-blue)' : 'var(--text-primary)' }}
                      onMouseEnter={(e) => { e.target.style.background = 'var(--accent-blue-light)'; e.target.style.color = 'var(--accent-blue)'; }}
                      onMouseLeave={(e) => { e.target.style.background = selectedMinute === m ? 'var(--accent-blue-light)' : 'transparent'; e.target.style.color = selectedMinute === m ? 'var(--accent-blue)' : 'var(--text-primary)'; }}
                      >{m}</div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setIsAM(!isAM)} style={{
                padding: '8px 6px', borderRadius: 6, border: '1px solid var(--border)',
                background: isAM ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                color: isAM ? '#fff' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>{isAM ? useContent('time.am') : useContent('time.pm')}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
        <button style={{
          padding: '10px', borderRadius: 6, border: 'none', background: 'var(--accent-blue)',
          color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%',
        }}>
          {useContent('sidebar.apply')}
        </button>
        <button onClick={handleReset} style={{
          padding: '9px', borderRadius: 6, border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--text-secondary)', fontSize: 13,
          fontWeight: 500, cursor: 'pointer', width: '100%',
        }}>
          {useContent('sidebar.reset')}
        </button>
      </div>
    </aside>
  )
}
