import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../../hooks/useContent.js'
import { resolveBookingActions } from '../../utils/bookingActionResolver.js'
import { dispatchBookingCommand } from '../../utils/bookingCommandDispatcher.js'
import { formatDateSeparator } from '../../utils/dateGrouping.js'
import { getPaymentStatusConfig, getPaymentMethodLabel } from '../../config/paymentRegistry.js'
import ReviewModal from '../reviews/ReviewModal.jsx'
import InvoiceOverlay from '../reviews/InvoiceOverlay.jsx'

export default function BookingTrackCardRenderer({ elementConfig, overrideData }) {
  const navigate = useNavigate()
  const bookings = overrideData?.bookings || []
  const stages = elementConfig.content?.stages || []
  const stageOrder = stages.map(s => s.key)
  const chatAfter = elementConfig.content?.chatEnabledAfter || 'accepted'
  const chatAfterIdx = stageOrder.indexOf(chatAfter)
  const chatDisableAfter = elementConfig.content?.chatDisabledAfter || null
  const chatDisableIdx = chatDisableAfter ? stageOrder.indexOf(chatDisableAfter) : -1
  const trackEnabled = elementConfig.content?.trackEnabled !== false
  const showRewardPoints = elementConfig.content?.showRewardPoints === true
  const rewardRate = elementConfig.content?.rewardPointsRate || 0.1
  const emptyMsg = useContent('bookings.noBookings', 'No bookings yet')
  const userRole = overrideData?.role || 'customer'

  const [confirmCancelId, setConfirmCancelId] = React.useState(null)
  const [reviewBookingId, setReviewBookingId] = React.useState(null)
  const [invoiceBookingId, setInvoiceBookingId] = React.useState(null)
  const [cancelReasons, setCancelReasons] = React.useState([])
  const [cancelNote, setCancelNote] = React.useState('')

  const toggleReason = (reason) => {
    setCancelReasons(prev => prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason])
  }

  const stageLabels = {}
  stages.forEach(s => { stageLabels[s.key] = useContent(s.labelKey, s.key) })

  if (bookings.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px', color: 'var(--text-secondary)',
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
        <p style={{ fontSize: 'var(--font-body)' }}>{emptyMsg}</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {bookings.map((booking, idx) => {
        if (booking.type === 'dateSeparator') {
          return (
            <div key={`sep-${idx}`} style={{
              padding: '10px 0 6px 0', fontSize: 'var(--font-body-sm)', fontWeight: 600,
              color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', marginBottom: '4px',
            }}>
              {formatDateSeparator(booking.date)}
            </div>
          )
        }

        const currentIdx = stageOrder.indexOf(booking.status)
        const chatVisible = currentIdx >= chatAfterIdx && (chatDisableIdx === -1 || currentIdx < chatDisableIdx)
        const customerActions = resolveBookingActions(booking, userRole)
        const showCancel = customerActions.length > 0

        return (
          <div key={booking.id} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '12px',
          }}>
            {/* Top row: Service type / Profession ··· Booking ID / Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 2 }}>
                  {booking.job_size ? (booking.job_size.charAt(0).toUpperCase() + booking.job_size.slice(1)) : '–'} · {booking.service_name || '—'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 2 }}>
                  #{booking.id}
                </div>
                <span style={{
                  fontSize: 'var(--font-caption)', fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                  background: booking.status === 'rejected' ? 'var(--accent-red-light)' : 'var(--accent-blue-light)',
                  color: booking.status === 'rejected' ? 'var(--accent-red)' : 'var(--accent-blue)',
                }}>
                  {stageLabels[booking.status] || booking.status}
                </span>
                {booking.status === 'completed' && overrideData.paymentMap?.[booking.id] && (
                  <span style={{
                    fontSize: 'var(--font-caption)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                    background: getPaymentStatusConfig(overrideData.paymentMap[booking.id].status).badgeColor,
                    color: getPaymentStatusConfig(overrideData.paymentMap[booking.id].status).textColor,
                    marginLeft: '6px', whiteSpace: 'nowrap', display: 'inline-block', marginTop: '4px',
                  }}>
                    {((status) => {
                      const method = getPaymentMethodLabel(overrideData.paymentMap[booking.id].method)
                      if (status === 'pending_cash' || status === 'awaiting_cash_confirmation') return `Pay by ${method}`
                      if (status === 'paid') return `Paid by ${method}`
                      return `${getPaymentStatusConfig(status).label} · ${method}`
                    })(overrideData.paymentMap[booking.id].status)}
                  </span>
                )}
              </div>
            </div>

            {/* Timeline bar */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: '14px', padding: '0 6px' }}>
              <div style={{
                position: 'absolute', top: '11px', left: '18px', right: '18px', height: '2px',
                background: 'var(--border)', zIndex: 0,
              }} />
              {stages.map((stage, i) => {
                const isDone = i <= currentIdx
                const isCurrent = i === currentIdx
                return (
                  <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: isDone ? 'var(--accent-blue)' : 'var(--bg-surface2)',
                      border: isCurrent ? '3px solid var(--accent-blue)' : isDone ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: isDone ? '#fff' : 'var(--text-secondary)',
                    }}>
                      {stage.icon}
                    </div>
                    <span style={{
                      fontSize: '8px', color: isCurrent ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      fontWeight: isCurrent ? 600 : 400, textAlign: 'center', marginTop: '4px', maxWidth: '40px',
                    }}>
                      {stageLabels[stage.key]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Bottom section */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              {/* Row 1: Worker ID + Track Worker */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>Worker ID:</span>
                  <span style={{ fontWeight: 600, marginLeft: 6, color: 'var(--text-primary)' }}>
                    {booking.worker_client_id || booking.worker_id || '—'}
                  </span>
                </div>
                {trackEnabled && (booking.status === 'accepted' || booking.status === 'onway') && booking.worker_id && (
                  <button onClick={() => navigate(`/tracking/${booking.worker_id}`)} style={{
                    padding: '4px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-blue)',
                    background: 'transparent', color: 'var(--accent-blue)', fontSize: 'var(--font-caption)',
                    fontWeight: 600, cursor: 'pointer',
                  }}>
                    📍 Track Worker
                  </button>
                )}
              </div>

              {/* Row 2: Price + Reward points */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>Price:</span>
                  <span style={{ fontWeight: 600, marginLeft: 6, color: 'var(--accent-green)' }}>
                    Rs {overrideData.paymentMap?.[booking.id]?.final_total || booking.price || 0}
                  </span>
                </div>
                {showRewardPoints && (
                  <div>
                    <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>Reward Points:</span>
                    <span style={{ fontWeight: 600, marginLeft: 6, color: 'var(--text-primary)' }}>
                      {Math.round((overrideData.paymentMap?.[booking.id]?.final_total || booking.price || 0) * rewardRate)} pts
                    </span>
                  </div>
                )}
              </div>

              {/* Cancel button */}
              {showCancel && (
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  {customerActions.map(btn => (
                    <button key={btn.id} onClick={() => setConfirmCancelId(booking.id)} style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-red)',
                      background: 'transparent', color: 'var(--accent-red)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Cancel overlay */}
              {confirmCancelId === booking.id && (
                <>
                  <div onClick={() => { setConfirmCancelId(null); setCancelReasons([]); setCancelNote('') }} style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.35)', zIndex: 9998,
                  }} />
                  <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '90%', maxWidth: 400, background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: 24, zIndex: 9999, boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                      Cancel your booking?
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
                      Why are you cancelling? (optional)
                    </div>
                    {['Worker not responding','Found another worker','Job no longer needed','Price too high','Changing schedule'].map(reason => (
                      <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={cancelReasons.includes(reason)} onChange={() => toggleReason(reason)} />
                        {reason}
                      </label>
                    ))}
                    <textarea value={cancelNote} onChange={e => setCancelNote(e.target.value)} placeholder="Add a note (will help us improve)" rows={2} style={{
                      width: '100%', marginTop: 10, padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)',
                      fontSize: 12, resize: 'vertical',
                    }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <button onClick={async () => {
                        try {
                          await dispatchBookingCommand({
                            action: 'cancel', bookingId: confirmCancelId,
                            reason: [...cancelReasons, cancelNote].filter(Boolean).join(', '),
                          })
                          setConfirmCancelId(null); setCancelReasons([]); setCancelNote('')
                        } catch (err) { alert(err.message || 'Cancel failed'); setConfirmCancelId(null) }
                      }} style={{
                        flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none',
                        background: 'var(--accent-red)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                      }}>
                        Confirm cancellation
                      </button>
                      <button onClick={() => { setConfirmCancelId(null); setCancelReasons([]); setCancelNote('') }} style={{
                        flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                        background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                      }}>
                        Back
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Leave Review button */}
              {booking.status === 'completed' && !booking.reviewed && (
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <button onClick={() => setReviewBookingId(booking.id)} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-green)',
                    background: 'transparent', color: 'var(--accent-green)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                    ⭐ Leave Review
                  </button>
                </div>
              )}

              {/* Invoice button */}
              {booking.status === 'completed' && overrideData.paymentMap?.[booking.id] && (
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <button onClick={() => setInvoiceBookingId(booking.id)} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-blue)',
                    background: 'transparent', color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                    🧾 Invoice
                  </button>
                </div>
              )}

              {/* Review Modal */}
              {reviewBookingId === booking.id && (
                <ReviewModal
                  bookingId={booking.id}
                  workerName={booking.worker_name || 'Worker'}
                  onClose={() => setReviewBookingId(null)}
                  onSubmitted={() => setReviewBookingId(null)}
                />
              )}

              {/* Message button */}
              {chatVisible && (
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <button onClick={e => { e.stopPropagation(); if (booking.id) navigate(`/inbox?bookingId=${booking.id}`) }} style={{
                    padding: '8px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-blue)',
                    background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', fontSize: 'var(--font-body-sm)',
                    fontWeight: 600, cursor: 'pointer',
                  }}>
                    💬 Message
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Invoice overlay for client */}
      {invoiceBookingId && overrideData?.paymentMap?.[invoiceBookingId] && (
        <InvoiceOverlay
          payment={overrideData.paymentMap[invoiceBookingId]}
          booking={bookings.find(b => b.id === invoiceBookingId)}
          onClose={() => setInvoiceBookingId(null)}
          onPaymentCompleted={() => setInvoiceBookingId(null)}
        />
      )}
    </div>
  )
}