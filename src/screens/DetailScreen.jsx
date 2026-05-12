import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar.jsx'
import { useContent } from '../hooks/useContent.js'
import { api } from '../services/api.js'
import { useBooking } from '../contexts/BookingContext.jsx'
import { dispatchBookingCommand } from '../utils/bookingCommandDispatcher.js'

const jobSizes = [
  { id: 'small', labelKey: 'detail.small', descKey: 'detail.smallDesc', price: 'Rs 500-1500' },
  { id: 'medium', labelKey: 'detail.medium', descKey: 'detail.mediumDesc', price: 'Rs 1500-4000' },
  { id: 'large', labelKey: 'detail.large', descKey: 'detail.largeDesc', price: 'Rs 4000-10000' },
]

const HOURS = ['01','02','03','04','05','06','07','08','09','10','11','12']
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

const CANCEL_REASONS = [
  'Worker not responding',
  'Found another worker',
  'Job no longer needed',
  'Price too high',
  'Changing schedule',
]

export default function DetailScreen({ navigate, workerId }) {
  const [selectedJob, setSelectedJob] = useState('medium')
  const [selectedServiceIds, setSelectedServiceIds] = useState([])
  const [selectedProfessionId, setSelectedProfessionId] = useState(null)
  const [expandedSizes, setExpandedSizes] = useState({})
  const [urgency, setUrgency] = useState('now')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHour, setSelectedHour] = useState('09')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const [isAM, setIsAM] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)
  const [booking, setBooking] = useState(false)

  // Cancel popup state
  const [showCancel, setShowCancel] = useState(false)
  const [cancelReasons, setCancelReasons] = useState([])
  const [cancelNote, setCancelNote] = useState('')

  const { bookings } = useBooking()

  // Find an active booking for this worker (any status that can be cancelled)
  const activeBooking = bookings?.find(
    b => b.worker_id === workerId && ['pending', 'accepted', 'onway'].includes(b.status)
  )

 const handleBook = async () => {
    const token = localStorage.getItem('sajilo_token')
    if (!token) { navigate('/login'); return }
    setBooking(true)
    try {
      await api.createBooking({
        workerId: worker.id,
        serviceName: worker.job || 'General Service',
        jobSize: selectedJob,
        urgency,
        selectedServices: selectedServiceIds.map(id => ({ service_id: id })),
      })
      navigate('/bookings')
    } catch (err) {
      alert('Booking failed. Try again.')
    }
    setBooking(false)
  }

  const handleCancel = async (reason) => {
    try {
      await dispatchBookingCommand({
        action: 'cancel',
        bookingId: activeBooking.id,
        reason: reason || null,
      })
      setShowCancel(false)
      navigate('/bookings')
    } catch (err) {
      alert(err.message || 'Cancel failed')
    }
  }

  const toggleReason = (reason) => {
    setCancelReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    )
  }

  const txt = {
    back: useContent('detail.back', '← Back'),
    selectJob: useContent('detail.selectJob'),
    small: useContent('detail.small'),
    medium: useContent('detail.medium'),
    large: useContent('detail.large'),
    when: useContent('detail.when'),
    now: useContent('detail.now'),
    schedule: useContent('detail.schedule'),
    book: useContent('detail.book'),
    date: useContent('auth.login.identifier.placeholder'),
  }

  const [worker, setWorker] = useState(null)
  const [workerServices, setWorkerServices] = useState([])
  const [filterProfession, setFilterProfession] = useState(null)

  // Flatten all services and attach profession info
  const allServices = workerServices.flatMap(prof =>
    (prof.services || []).map(svc => ({ ...svc, profession: prof }))
  );

  // Filter by selected profession pill
  const filteredServices = filterProfession
    ? allServices.filter(s => s.profession.id === filterProfession)
    : allServices;

  const toggleSize = (size) => {
    setExpandedSizes(prev => ({ ...prev, [size]: !prev[size] }));
  };

  useEffect(() => {
    api.getWorkerById(workerId).then(d => {
      if (d.success) setWorker(d.data)
    })
    api.getWorkerPublicServices(workerId).then(d => {
      if (d.success) setWorkerServices(d.data?.professions || [])
    }).catch(() => {})
  }, [workerId])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/search')
  }

    console.log('🔍 workerServices:', workerServices);
  if (!worker) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--text-secondary)' }}>Worker not found</p>
        <button onClick={handleBack} style={{ marginTop: 16, padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--accent-blue)', cursor: 'pointer' }}>{txt.back}</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={handleBack} style={{ background: 'var(--bg-surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 16, fontWeight: 500, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'all 0.15s' }}
        onMouseEnter={(e) => { e.target.style.background = 'var(--accent-blue-light)'; e.target.style.color = 'var(--accent-blue)'; e.target.style.borderColor = 'var(--accent-blue)' }}
        onMouseLeave={(e) => { e.target.style.background = 'var(--bg-surface2)'; e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border)' }}
      >{txt.back}</button>

      <div style={{ height: 160, background: worker.bg || '#EBF3FF', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>
          {worker.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: 'var(--text-primary)' }}>{worker.name}</div>
          <div style={{ fontSize: 'var(--font-body)', color: 'var(--text-secondary)', marginTop: 3 }}>
            ⭐ {worker.average_rating != null ? Number(worker.average_rating).toFixed(1) : '—'}
            {worker.role ? ` · ${worker.role}` : ''}
            {worker.location ? ` · ${worker.location}` : ''}
          </div>
        </div>
        <div style={{ background: 'var(--accent-orange-light)', color: 'var(--accent-orange)', fontSize: 'var(--font-body)', fontWeight: 700, padding: '6px 12px', borderRadius: 20 }}>Rs 500-2500/hr</div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />

      {workerServices.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {(workerServices.length > 1
            ? [{ id: null, name: 'All', icon: '🔧' }, ...workerServices]
            : workerServices
          ).map(prof => (
            <button
              key={prof.id ?? 'all'}
              onClick={() => setFilterProfession(prof.id)}
              style={{
                padding: '8px 16px', borderRadius: 20,
                border: '1px solid var(--border)',
                background: filterProfession === prof.id ? 'var(--accent-blue)' : 'transparent',
                color: filterProfession === prof.id ? '#fff' : 'var(--text-secondary)',
                fontSize: 'var(--font-body-sm)', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {prof.icon && <span style={{ marginRight: 4 }}>{prof.icon}</span>}
              {prof.name}
            </button>
          ))}
        </div>
      )}
            {['small', 'medium', 'large'].map(size => {
        const servicesInSize = filteredServices.filter(s => {
          const price = parseFloat(s.worker_price) || 0;
          if (size === 'small') return price >= 0 && price <= 1000;
          if (size === 'medium') return price > 1000 && price <= 3000;
          return price > 3000;
        });
        const isExpanded = expandedSizes[size];
        return (
          <div key={size} style={{ marginBottom: 12 }}>
            <div
              onClick={() => toggleSize(size)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: isExpanded ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {size.charAt(0).toUpperCase() + size.slice(1)} job
                </div>
                <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>
                  Rs {size === 'small' ? '500-1000' : size === 'medium' ? '1000-3000' : '3000+'}
                </div>
              </div>
              <span style={{ fontSize: 'var(--font-body-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {servicesInSize.length} service{servicesInSize.length !== 1 && 's'}
              </span>
            </div>
            {isExpanded && (
              <div style={{ padding: '8px 0 0' }}>
                {servicesInSize.length === 0 ? (
                  <div style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 'var(--font-body-sm)' }}>
                    No services listed
                  </div>
                ) : (
                  servicesInSize.map(svc => (
                    <div
                      key={svc.service_id || svc.custom_label}
                      onClick={() => {
                        setSelectedServiceIds(prev =>
                          prev.includes(svc.service_id)
                            ? prev.filter(id => id !== svc.service_id)
                            : [...prev, svc.service_id]
                        );
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px', borderBottom: '1px solid var(--border)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: 16, height: 16, borderRadius: '50%',
                          border: selectedServiceIds.includes(svc.service_id)
                            ? '4px solid var(--accent-blue)'
                            : '2px solid var(--border)',
                          background: selectedServiceIds.includes(svc.service_id) ? 'var(--accent-blue)' : '#fff',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {svc.label}
                        </div>
                        {(svc.label_np || svc.custom_label_np) && (
                          <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{svc.label_np || svc.custom_label_np}</div>
                        )}
                      </div>
                      <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 700, color: 'var(--accent-green)' }}>
                        Rs {parseFloat(svc.worker_price).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ fontSize: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>{txt.when}</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[{ key: 'now', label: txt.now }, { key: 'schedule', label: txt.schedule }].map((opt) => (
          <button key={opt.key} onClick={() => setUrgency(opt.key)} style={{ flex: 1, padding: 11, borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--font-body)', fontWeight: 500, border: urgency === opt.key ? '2px solid var(--accent-orange)' : '1px solid var(--border)', background: urgency === opt.key ? 'var(--accent-orange-light)' : 'transparent', color: urgency === opt.key ? 'var(--accent-orange)' : 'var(--text-primary)' }}>{opt.label}</button>
        ))}
      </div>

      {urgency === 'schedule' && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <button onClick={() => setShowCalendar(!showCalendar)} style={{ width: '100%', padding: '8px 6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: selectedDate ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: 'var(--font-body-sm)', cursor: 'pointer', textAlign: 'center' }}>
              {selectedDate ? formatDate(selectedDate) : '📅 Date'}
            </button>
            {showCalendar && <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 4, zIndex: 1000 }}><Calendar value={selectedDate} onChange={setSelectedDate} onClose={() => setShowCalendar(false)} /></div>}
          </div>
          <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} style={{ width: 48, padding: '8px 2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body-sm)', cursor: 'pointer' }}>{HOURS.map(h => <option key={h} value={h}>{h}</option>)}</select>
          <span style={{ color: 'var(--text-secondary)' }}>:</span>
          <select value={selectedMinute} onChange={(e) => setSelectedMinute(e.target.value)} style={{ width: 48, padding: '8px 2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 'var(--font-body-sm)', cursor: 'pointer' }}>{MINUTES.map(m => <option key={m} value={m}>{m}</option>)}</select>
          <button onClick={() => setIsAM(!isAM)} style={{ padding: '8px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: isAM ? 'var(--accent-blue)' : 'var(--bg-surface2)', color: isAM ? '#fff' : 'var(--text-secondary)', fontSize: 'var(--font-body-sm)', fontWeight: 600, cursor: 'pointer' }}>{isAM ? 'AM' : 'PM'}</button>
        </div>
      )}

      <div style={{ background: 'var(--bg-surface2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 20 }}>
        💳 Pay via eSewa, Khalti, or cash · Platform fee 15%
      </div>

            {/* ── Bottom action button (Book now / Cancel booking) ── */}
      {activeBooking ? (
        <>
          <button
            onClick={() => setShowCancel(true)}
            style={{
              width: '100%', background: 'var(--accent-red)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', padding: 14,
              fontSize: 'var(--font-title)', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Cancel booking
          </button>

          {/* ── Floating cancel popup card ── */}
          {showCancel && (
            <>
              {/* translucent backdrop */}
              <div
                onClick={() => setShowCancel(false)}
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.35)', zIndex: 9998,
                }}
              />

              {/* centered card */}
              <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%', maxWidth: 400,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                zIndex: 9999,
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              }}>
                <div style={{
                  fontSize: 16, fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: 14,
                }}>
                  Cancel your booking?
                </div>

                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
                  Why are you cancelling? (optional)
                </div>

                {CANCEL_REASONS.map(reason => (
                  <label key={reason} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 6, fontSize: 13,
                    color: 'var(--text-primary)', cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      checked={cancelReasons.includes(reason)}
                      onChange={() => toggleReason(reason)}
                    />
                    {reason}
                  </label>
                ))}

                <textarea
                  value={cancelNote}
                  onChange={e => setCancelNote(e.target.value)}
                  placeholder="Add a note (will help us improve)"
                  rows={2}
                  style={{
                    width: '100%', marginTop: 10, padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-surface2)',
                    color: 'var(--text-primary)', fontSize: 12,
                    resize: 'vertical',
                  }}
                />

                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button
                    onClick={() => handleCancel(
                      [...cancelReasons, cancelNote].filter(Boolean).join(', ')
                    )}
                    style={{
                      flex: 1, padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none', background: 'var(--accent-red)',
                      color: '#fff', fontWeight: 600,
                      fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    Confirm cancellation
                  </button>
                  <button
                    onClick={() => {
                      setShowCancel(false)
                      setCancelReasons([])
                      setCancelNote('')
                    }}
                    style={{
                      flex: 1, padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontWeight: 600, fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <button onClick={handleBook} disabled={booking || selectedServiceIds.length === 0} style={{ width: '100%', background: 'var(--accent-orange)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: 14, fontSize: 'var(--font-title)', fontWeight: 700, cursor: selectedServiceIds.length === 0 ? 'not-allowed' : 'pointer', opacity: selectedServiceIds.length === 0 ? 0.6 : 1 }}>
          {(() => {
            if (booking) return 'Booking...';
            const total = selectedServiceIds.reduce((sum, id) => {
              const svc = allServices.find(s => s.service_id === id);
              return sum + (parseFloat(svc?.worker_price) || 0);
            }, 0);
            if (total > 0) return `${txt.book} · Rs ${total.toLocaleString()}`;
            return `${txt.book} (select services)`;
          })()}
        </button>
      )}
    </div>
  )
}