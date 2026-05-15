// src/components/reviews/WorkerInvoiceOverlay.jsx
import React, { useState, useMemo } from 'react';
import { api } from '../../services/api.js';

/**
 * WorkerInvoiceOverlay
 * Allows worker to review, edit, and confirm the invoice.
 * The worker only sets the final amount – the client chooses the payment method later.
 */
export default function WorkerInvoiceOverlay({ payment, booking, onClose, onConfirmed }) {
  // Editable fields
  const [discount, setDiscount] = useState(parseFloat(payment?.discount_amount || 0));
  const [extraItems, setExtraItems] = useState(
    (payment?.extra_items_json && Array.isArray(payment.extra_items_json)
      ? payment.extra_items_json
      : []
    ).map(item => ({
      label: item.label || '',
      amount: parseFloat(item.amount) || 0,
    }))
  );
  const [saving, setSaving] = useState(false);

  // Base amount from payment
  const baseAmount = parseFloat(payment?.subtotal || 0);

  // Local preview of final total (display only)
  const extraTotal = useMemo(() =>
    extraItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0),
    [extraItems]
  );
  const finalPreview = baseAmount - parseFloat(discount || 0) + extraTotal;

  // Extra items management
  const addExtraItem = () => setExtraItems([...extraItems, { label: '', amount: 0 }]);
  const removeExtraItem = (idx) => setExtraItems(extraItems.filter((_, i) => i !== idx));
  const updateExtraItem = (idx, field, value) => {
    const updated = [...extraItems];
    updated[idx] = { ...updated[idx], [field]: field === 'amount' ? parseFloat(value) || 0 : value };
    setExtraItems(updated);
  };

  const handleConfirm = async () => {
    if (finalPreview < 0) {
      alert('Final amount cannot be negative.');
      return;
    }
    setSaving(true);
    try {
      // Always use 'cash' as the default method – client can override later
      await api.confirmInvoice(booking.id, {
        discount_amount: discount,
        extra_items: extraItems.filter(it => it.label.trim() !== '' || it.amount > 0),
        payment_method: 'cash',
      });
      if (onConfirmed) onConfirmed();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to confirm invoice');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.35)', zIndex: 9998,
        }}
      />

      {/* Overlay card */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 420,
        maxHeight: '85vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        zIndex: 9999,
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Title */}
        <div style={{
          fontSize: 18, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 20, textAlign: 'center',
        }}>
          Invoice
        </div>

        {/* Booking info */}
        <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 16 }}>
          <div>Booking #{booking.id}</div>
          <div>Client: {booking.customer_client_id || booking.customer_name || '—'}</div>
          <div>Service: {booking.service_name || '—'}</div>
          <div>Date: {new Date(booking.updated_at || booking.created_at).toLocaleDateString()}</div>
        </div>

        {/* Base price */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 'var(--font-body)', color: 'var(--text-primary)',
          marginBottom: 12, fontWeight: 500,
        }}>
          <span>Base Price</span>
          <span>Rs {baseAmount}</span>
        </div>

        {/* Discount */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', flex: 1 }}>
            Discount
          </span>
          <input
            type="number"
            min="0"
            step="any"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            style={{
              width: 80, padding: '6px 8px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', fontSize: 'var(--font-body-sm)',
              background: 'var(--bg-surface2)', color: 'var(--text-primary)',
            }}
          />
          <span style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>Rs</span>
        </div>

        {/* Extra charges */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 8 }}>
            Extra Charges
          </div>
          {extraItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <input
                type="text"
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateExtraItem(idx, 'label', e.target.value)}
                style={{
                  flex: 1, padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', fontSize: 'var(--font-body-sm)',
                  background: 'var(--bg-surface2)', color: 'var(--text-primary)',
                }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={item.amount || ''}
                onChange={(e) => updateExtraItem(idx, 'amount', e.target.value)}
                style={{
                  width: 70, padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', fontSize: 'var(--font-body-sm)',
                  background: 'var(--bg-surface2)', color: 'var(--text-primary)',
                }}
                step="any"
              />
              <button
                onClick={() => removeExtraItem(idx)}
                style={{
                  padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--accent-red)', background: 'transparent',
                  color: 'var(--accent-red)', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addExtraItem}
            style={{
              padding: '6px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border)', background: 'transparent',
              color: 'var(--accent-blue)', fontSize: 'var(--font-caption)',
              fontWeight: 500, cursor: 'pointer', width: '100%',
            }}
          >
            + Add Extra Charge
          </button>
        </div>

        {/* Final total preview */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 12,
          display: 'flex', justifyContent: 'space-between',
          fontSize: 'var(--font-body)', fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 16,
        }}>
          <span>Final Total</span>
          <span>Rs {finalPreview.toFixed(2)}</span>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={saving}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: saving ? 'var(--border)' : 'var(--accent-green)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Confirming...' : 'Confirm Invoice'}
        </button>

        {/* Cancel */}
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
          Cancel
        </button>
      </div>
    </>
  );
}