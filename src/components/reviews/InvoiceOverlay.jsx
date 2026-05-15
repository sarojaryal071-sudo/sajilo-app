import { useState, useEffect } from 'react';
import { useContent } from '../../hooks/useContent.js';
import { getPaymentStatusConfig, getPaymentMethodLabel, INVOICE_LABELS } from '../../config/paymentRegistry.js';
import { api, API_URL } from '../../services/api.js';

export default function InvoiceOverlay({ payment, booking, onClose, onPaymentCompleted }) {
  const labels = INVOICE_LABELS;
  const [channels, setChannels] = useState([]);
  const [paidDigital, setPaidDigital] = useState(false);

  useEffect(() => {
    if (booking?.worker_id) {
      const token = localStorage.getItem('sajilo_token');
      fetch(`${API_URL}/payment-channels?workerId=${booking.worker_id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(r => r.json())
        .then(d => { if (d?.success) setChannels(d.data || []); })
        .catch(() => {});
    }
  }, [booking?.worker_id]);

  if (!payment || !booking) return null;

  const statusConfig = getPaymentStatusConfig(payment.status);
  const methodLabel = getPaymentMethodLabel(payment.method);
  const canPayCash = payment.status === 'pending_cash' || payment.status === 'awaiting_cash_confirmation';
  const canPayDigital = payment.status === 'unpaid' || payment.status === 'awaiting_digital_confirmation';

  const handlePayCash = async () => {
    try {
      await api.confirmCashPayment(booking.id);
      alert('Payment confirmed!');
      onPaymentCompleted ? onPaymentCompleted() : (onClose(), window.location.reload());
    } catch (err) { alert(err.message); }
  };

  const handleInitiateDigital = async () => {
    try {
      await api.initiateDigitalPayment(booking.id);
      setPaidDigital(true);
    } catch (err) { alert(err.message); }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 9998 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 420, maxHeight: '80vh', overflowY: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, zIndex: 9999, boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, textAlign: 'center' }}>{labels.title}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InvoiceRow label={labels.bookingId} value={`#${booking.id}`} />
          <InvoiceRow label={labels.worker} value={booking.worker_name || `Worker ${booking.worker_client_id || booking.worker_id}`} />
          <InvoiceRow label={labels.serviceName} value={booking.service_name || '—'} />
          {booking.job_size && <InvoiceRow label="Job Size" value={booking.job_size} />}
          <InvoiceRow label={labels.date} value={new Date(booking.updated_at || booking.created_at).toLocaleDateString()} />
          <InvoiceRow label={labels.method} value={methodLabel} />
          <InvoiceRow label={labels.status} value={statusConfig.label} valueColor={statusConfig.badgeColor} />
          <InvoiceRow label={labels.subtotal} value={`Rs ${payment.subtotal || 0}`} />
          {payment.discount_amount > 0 && <InvoiceRow label="Discount" value={`− Rs ${payment.discount_amount}`} valueColor="var(--accent-red)" />}
          {payment.extra_items_json && Array.isArray(payment.extra_items_json) && payment.extra_items_json.length > 0 && payment.extra_items_json.map((item, i) => (
            <InvoiceRow key={i} label={item.label || `Extra ${i + 1}`} value={`+ Rs ${parseFloat(item.amount).toLocaleString()}`} valueColor="var(--accent-green)" />
          ))}
          {payment.platform_fee > 0 && <InvoiceRow label={labels.platformFee} value={`Rs ${payment.platform_fee}`} />}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 4 }} />
          <InvoiceRow label={payment.status === 'paid' ? 'Total Paid' : 'Total'} value={`Rs ${payment.final_total || payment.total || 0}`} bold />
          {payment.invoice_number && <InvoiceRow label={labels.invoiceNumber} value={payment.invoice_number} />}
          {payment.paid_at && <InvoiceRow label={labels.paidAt} value={new Date(payment.paid_at).toLocaleString()} />}
        </div>

        {/* Digital payment channels */}
        {canPayDigital && channels.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Pay via</div>
            {channels.filter(c => c.is_active).map(ch => (
              <div key={ch.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600 }}>{ch.provider?.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ch.account_number}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ch.account_holder}</div>
                {ch.qr_image_url && <img src={ch.qr_image_url} alt="QR" style={{ width: 120, height: 120, marginTop: 4 }} />}
              </div>
            ))}
            {!paidDigital && (
              <button onClick={handleInitiateDigital} style={{ width: '100%', marginTop: 10, padding: 10, borderRadius: 6, border: 'none', background: 'var(--accent-blue)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                I Have Paid
              </button>
            )}
            {paidDigital && (
              <div style={{ marginTop: 10, padding: 8, background: '#ECFDF5', borderRadius: 6, color: '#059669', fontSize: 12, textAlign: 'center' }}>
                ✅ Payment confirmation sent to worker. They will confirm shortly.
              </div>
            )}
          </div>
        )}

        {/* Pay with Cash button */}
        {canPayCash && (
          <button onClick={handlePayCash} style={{ width: '100%', marginTop: 16, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--accent-green)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            💵 Pay with Cash
          </button>
        )}

        <button onClick={onClose} style={{ width: '100%', marginTop: 10, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{labels.closeButton}</button>
      </div>
    </>
  );
}

function InvoiceRow({ label, value, bold, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-body-sm)' }}>
      <span style={{ color: 'var(--text-secondary)', fontWeight: 500, flex: 1 }}>{label}</span>
      <span style={{ color: valueColor || 'var(--text-primary)', fontWeight: bold ? 700 : 500, textAlign: 'right', flex: 1 }}>{value}</span>
    </div>
  );
}