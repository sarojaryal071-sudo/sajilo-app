import { useState } from 'react'
import { workers } from '../config/data.js'
import Calendar from '../components/Calendar.jsx'

const jobSizes = [
  { id: 'small', label: 'Small Job', desc: 'Single outlet, light fixture', price: 'Rs 500-1500' },
  { id: 'medium', label: 'Medium Job', desc: 'Circuit breaker, multiple outlets', price: 'Rs 1500-4000' },
  { id: 'large', label: 'Large Job', desc: 'Full rewire, new installation', price: 'Rs 4000-10000' },
]

const HOURS = ['01','02','03','04','05','06','07','08','09','10','11','12']
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export default function DetailScreen({ navigate, workerId, previousTab }) {
  const [selectedJob, setSelectedJob] = useState('medium')
  const [urgency, setUrgency] = useState('now')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHour, setSelectedHour] = useState('09')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const [isAM, setIsAM] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)

  const worker = workers.find(w => w.id === workerId)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (!worker) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--text-secondary)' }}>Worker not found.</p>
        <button onClick={() => navigate(previousTab)} style={{
          marginTop: 16,
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          background: 'var(--bg-surface2)',
          color: 'var(--accent-blue)',
          cursor: 'pointer',
        }}>
          ← Back
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate(previousTab)}
        style={{
          background: 'var(--bg-surface2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontSize: 'var(--font-body)',
          color: 'var(--text-secondary)',
          marginBottom: 16,
          fontWeight: 500,
          padding: '6px 14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'var(--accent-blue-light)'
          e.target.style.color = 'var(--accent-blue)'
          e.target.style.borderColor = 'var(--accent-blue)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'var(--bg-surface2)'
          e.target.style.color = 'var(--text-secondary)'
          e.target.style.borderColor = 'var(--border)'
        }}
      >
        ← Back
      </button>

      {/* Worker Header */}
      <div style={{
        height: 160,
        background: worker.bg || '#EBF3FF',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          {worker.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>

      {/* Worker Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
      }}>
        <div>
          <div style={{
            fontSize: 'var(--font-large)',
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}>
            {worker.name}
          </div>
          <div style={{
            fontSize: 'var(--font-body)',
            color: 'var(--text-secondary)',
            marginTop: 3,
          }}>
            ⭐ {worker.rating} · {worker.role} · {worker.location}
          </div>
        </div>
        <div style={{
          background: 'var(--accent-orange-light)',
          color: 'var(--accent-orange)',
          fontSize: 'var(--font-body)',
          fontWeight: 700,
          padding: '6px 12px',
          borderRadius: 20,
        }}>
          Rs 500-2500/hr
        </div>
      </div>

      <hr style={{
        border: 'none',
        borderTop: '1px solid var(--border)',
        margin: '16px 0',
      }} />

      {/* Job Size Selection */}
      <div style={{
        fontSize: 'var(--font-body)',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: 10,
      }}>
        Select Job Size
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 20,
      }}>
        {jobSizes.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job.id)}
            style={{
              border: selectedJob === job.id
                ? '2px solid var(--accent-blue)'
                : '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 14,
              cursor: 'pointer',
              background: selectedJob === job.id
                ? 'var(--accent-blue-light)'
                : 'var(--bg-surface)',
              position: 'relative',
            }}
          >
            <div style={{
              fontSize: 'var(--font-body)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 2,
            }}>
              {job.label}
            </div>
            <div style={{
              fontSize: 'var(--font-body-sm)',
              color: 'var(--text-secondary)',
            }}>
              {job.desc}
            </div>
            <span style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 'var(--font-body)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>
              {job.price}
            </span>
          </div>
        ))}
      </div>

      {/* When */}
      <div style={{
        fontSize: 'var(--font-body)',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: 10,
      }}>
        When?
      </div>
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 16,
      }}>
        {[
          { key: 'now', label: 'Now (~12 min)' },
          { key: 'schedule', label: 'Schedule' },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setUrgency(opt.key)}
            style={{
              flex: 1,
              padding: 11,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--font-body)',
              fontWeight: 500,
              border: urgency === opt.key
                ? '2px solid var(--accent-orange)'
                : '1px solid var(--border)',
              background: urgency === opt.key
                ? 'var(--accent-orange-light)'
                : 'transparent',
              color: urgency === opt.key
                ? 'var(--accent-orange)'
                : 'var(--text-primary)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

                      {urgency === 'schedule' && (
        <div style={{
          display: 'flex',
          gap: 6,
          marginBottom: 20,
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              style={{
                width: '100%',
                padding: '8px 6px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface2)',
                color: selectedDate ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: 'var(--font-body-sm)',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {selectedDate ? formatDate(selectedDate) : '📅 Date'}
            </button>
            {showCalendar && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: 4,
                zIndex: 1000,
              }}>
                <Calendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  onClose={() => setShowCalendar(false)}
                />
              </div>
            )}
          </div>

          <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} style={{
            width: 48, padding: '8px 2px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)', background: 'var(--bg-surface2)',
            color: 'var(--text-primary)', fontSize: 'var(--font-body-sm)', cursor: 'pointer',
          }}>
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>

          <span style={{ color: 'var(--text-secondary)' }}>:</span>

          <select value={selectedMinute} onChange={(e) => setSelectedMinute(e.target.value)} style={{
            width: 48, padding: '8px 2px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)', background: 'var(--bg-surface2)',
            color: 'var(--text-primary)', fontSize: 'var(--font-body-sm)', cursor: 'pointer',
          }}>
            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <button onClick={() => setIsAM(!isAM)} style={{
            padding: '8px 8px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: isAM ? 'var(--accent-blue)' : 'var(--bg-surface2)',
            color: isAM ? '#fff' : 'var(--text-secondary)',
            fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer',
          }}>
            {isAM ? 'AM' : 'PM'}
          </button>
        </div>
      )}

      {/* Payment Note */}
      <div style={{
        background: 'var(--bg-surface2)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        fontSize: 'var(--font-body-sm)',
        color: 'var(--text-secondary)',
        marginBottom: 20,
      }}>
        💳 Pay via eSewa, Khalti, or cash · Platform fee 15%
      </div>

      {/* Book Button */}
      <button
        onClick={() => navigate('tracking')}
        style={{
          width: '100%',
          background: 'var(--accent-orange)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          padding: 14,
          fontSize: 'var(--font-title)',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Book Worker → ({jobSizes.find(j => j.id === selectedJob)?.price || 'Rs 1500-4000'})
      </button>
    </div>
  )
}