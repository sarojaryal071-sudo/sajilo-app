// src/components/reviews/InvoiceOverlay.jsx
// Phase 8 — Lightweight invoice overlay for client.
// Now supports Pay with Cash button when payment is pending_cash.

import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent.js'
import { getPaymentStatusConfig, getPaymentMethodLabel, INVOICE_LABELS } from '../../config/paymentRegistry.js'
import { api, API_URL } from '../../services/api.js'

export default function InvoiceOverlay({ payment, booking, onClose, onPaymentCompleted }) {
  const labels = INVOICE_LABELS
  const [cashIntentSent, setCashIntentSent] = useState(false)
  const [channels, setChannels] = useState([])
  const [paidChannels, setPaidChannels] = useState({})

  // Fetch worker payment channels on mount
  useEffect(() => {
    if (booking?.worker_id) {
      const token = localStorage.getItem('sajilo_token')
      fetch(`${API_URL}/payment-channels/public/${booking.worker_id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(r => r.json())
        .then(d => { if (d?.success) setChannels(d.data || []) })
        .catch(() => {})
    }
  }, [booking?.worker_id])

  if (!payment || !booking) return null

  const statusConfig = getPaymentStatusConfig(payment.status)
  const methodLabel = getPaymentMethodLabel(payment.method)

  const handlePayCash = async () => {
    try {
      await api.initiateCashPayment(booking.id)
      setCashIntentSent(true)
    } catch (err) {
      alert(err.message || 'Failed to send payment request')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 9998,
        }}
      />

      {/* Modal card */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 420,
          maxHeight: '80vh',
          overflowY: 'auto',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          zIndex: 9999,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Title */}
        <div style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 20,
          textAlign: 'center',
        }}>
          {labels.title}
        </div>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InvoiceRow label={labels.bookingId} value={`#${booking.id}`} />
          <InvoiceRow label={labels.worker} value={booking.worker_name || `Worker ${booking.worker_client_id || booking.worker_id}` || '—'} />
          <InvoiceRow label={labels.serviceName} value={booking.service_name || '—'} />
          {booking.job_size && <InvoiceRow label="Job Size" value={booking.job_size} />}
          <InvoiceRow label={labels.date} value={new Date(booking.updated_at || booking.created_at).toLocaleDateString()} />
          <InvoiceRow label={labels.method} value={methodLabel} />
          <InvoiceRow
            label={labels.status}
            value={statusConfig.label}
            valueColor={statusConfig.badgeColor}
          />
          <InvoiceRow label={labels.subtotal} value={`Rs ${payment.subtotal || 0}`} />
          {payment.discount_amount > 0 && (
            <InvoiceRow label="Discount" value={`− Rs ${payment.discount_amount}`} valueColor="var(--accent-red)" />
          )}
          {payment.extra_items_json && Array.isArray(payment.extra_items_json) && payment.extra_items_json.length > 0 && payment.extra_items_json.map((item, i) => (
            <InvoiceRow key={i} label={item.label || `Extra ${i + 1}`} value={`+ Rs ${parseFloat(item.amount).toLocaleString()}`} valueColor="var(--accent-green)" />
          ))}
          {payment.platform_fee > 0 && (
            <InvoiceRow label={labels.platformFee} value={`Rs ${payment.platform_fee}`} />
          )}
          <InvoiceRow label={labels.workerAmount} value={`Rs ${payment.worker_amount || 0}`} />
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 4 }} />
          <InvoiceRow label={labels.total} value={`Rs ${payment.final_total || payment.total || 0}`} bold />
          {payment.invoice_number && (
            <InvoiceRow label={labels.invoiceNumber} value={payment.invoice_number} />
          )}
          {payment.paid_at && (
            <InvoiceRow label={labels.paidAt} value={new Date(payment.paid_at).toLocaleString()} />
          )}
        </div>

                {/* Pay with Cash button (only when pending_cash or awaiting_cash_confirmation) */}
        {(payment.status === 'pending_cash' || payment.status === 'awaiting_cash_confirmation') && (
          cashIntentSent ? (
            <div style={{
              width: '100%',
              marginTop: 20,
              padding: '12px 0',
              borderRadius: 'var(--radius-sm)',
              background: '#ECFDF5',
              color: '#059669',
              fontSize: 14,
              fontWeight: 600,
              textAlign: 'center',
              border: '1px solid #059669',
            }}>
              ✅ Waiting for worker confirmation
            </div>
          ) : (
            <button onClick={handlePayCash} style={{
              width: '100%',
              padding: '12px 0',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--accent-green)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
            }}>
              💵 Pay with Cash
            </button>
          )
        )}

        {/* Digital payment options */}
        {channels.length > 0 && (payment.status === 'pending_cash' || payment.status === 'awaiting_cash_confirmation') && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Pay via</div>
            {channels.filter(c => c.is_active !== false).map(ch => (
              <div key={ch.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                    {ch.provider?.toUpperCase()}
                  </div>
                  {ch.qr_image_url && <img src={ch.qr_image_url} alt="QR" style={{ width: 80, height: 80, borderRadius: 6 }} />}
                </div>
                {ch.masked_account_number && (
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
                    {ch.masked_account_number}
                  </div>
                )}
                {ch.display_name && (
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    {ch.display_name}
                  </div>
                )}
                {paidChannels[ch.id] ? (
                  <div style={{ padding: 6, background: '#ECFDF5', borderRadius: 4, color: '#059669', fontSize: 12, textAlign: 'center' }}>
                    ✅ Payment completed
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await api.confirmDigitalPayment(booking.id, { payment_channel_id: ch.id, provider: ch.provider })
                        setPaidChannels(prev => ({ ...prev, [ch.id]: true }))
                      } catch (err) { alert(err.message) }
                    }}
                    style={{
                      padding: '6px 12px', borderRadius: 6, border: '1px solid var(--accent-blue)',
                      background: 'transparent', color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Pay via {ch.provider}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: 10,
            padding: '10px 0',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {labels.closeButton}
        </button>
      </div>
    </>
  )
}

// Helper for a single row
function InvoiceRow({ label, value, bold, valueColor }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--font-body-sm)',
    }}>
      <span style={{
        color: 'var(--text-secondary)',
        fontWeight: 500,
        flex: 1,
      }}>
        {label}
      </span>
      <span style={{
        color: valueColor || 'var(--text-primary)',
        fontWeight: bold ? 700 : 500,
        textAlign: 'right',
        flex: 1,
      }}>
        {value}
      </span>
    </div>
  )
}