// src/components/reviews/InvoiceOverlay.jsx
// Phase 8 — Lightweight invoice overlay for client.
// Now supports Pay with Cash button when payment is pending_cash.

import { useContent } from '../../hooks/useContent.js'
import { getPaymentStatusConfig, getPaymentMethodLabel, INVOICE_LABELS } from '../../config/paymentRegistry.js'
import { api } from '../../services/api.js'

export default function InvoiceOverlay({ payment, booking, onClose, onPaymentCompleted }) {
  const labels = INVOICE_LABELS

  if (!payment || !booking) return null

  const statusConfig = getPaymentStatusConfig(payment.status)
  const methodLabel = getPaymentMethodLabel(payment.method)

  const handlePayCash = async () => {
    try {
      await api.confirmCashPayment(booking.id)
      alert('Payment confirmed successfully!')
      if (onPaymentCompleted) {
        onPaymentCompleted()
      } else {
        onClose()
        window.location.reload()
      }
    } catch (err) {
      alert(err.message || 'Payment failed')
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
          {payment.platform_fee > 0 && (
            <InvoiceRow label={labels.platformFee} value={`Rs ${payment.platform_fee}`} />
          )}
          <InvoiceRow label={labels.workerAmount} value={`Rs ${payment.worker_amount || 0}`} />
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 4 }} />
          <InvoiceRow label={labels.total} value={`Rs ${payment.total || 0}`} bold />
          {payment.invoice_number && (
            <InvoiceRow label={labels.invoiceNumber} value={payment.invoice_number} />
          )}
          {payment.paid_at && (
            <InvoiceRow label={labels.paidAt} value={new Date(payment.paid_at).toLocaleString()} />
          )}
        </div>

        {/* Pay with Cash button (only when pending_cash) */}
        {payment.status === 'pending_cash' && (
          <button
            onClick={handlePayCash}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '12px 0',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--accent-green)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            💵 Pay with Cash
          </button>
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