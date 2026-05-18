// sajilo-app/src/modules/settings/engine/fields/RepeatableGroupField.jsx
import { useRef, useEffect } from 'react';
import useRepeatableGroup from '../hooks/useRepeatableGroup';
import { createDefaultPayment, paymentTypes, validatePayment } from '../schemas/paymentSchema';

function PaymentCard({ entry, index, total, onUpdate, onRemove, onSetPrimary, errors }) {
  const firstInputRef = useRef(null);
  const isFirst = index === 0;
  const cardLabel = `Payment method ${index + 1} of ${total}`;

  useEffect(() => {
    if (index === total - 1 && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [index, total]);

  const handleChange = (field, value) => {
    const patch = { [field]: value };
    if (field === 'type') {
      patch.place = '';
    }
    onUpdate(index, patch);
  };

  const handleFocus = (e) => {
    e.target.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div
      role="group"
      aria-label={cardLabel}
      style={{
        background: 'var(--bg-surface2)',
        borderRadius: 8,
        border: entry.isPrimary ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
        padding: 14,
        marginBottom: 12,
        position: 'relative',
        animation: (index === total - 1 && total > 1) ? 'slideDown 0.2s ease' : 'none',
      }}
    >
      {entry.isPrimary && (
        <span
          aria-label="Primary payment method"
          style={{
            position: 'absolute', top: 6, right: 6,
            background: 'var(--accent-green)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
          }}
        >
          PRIMARY
        </span>
      )}

      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
        Type
      </label>
      <select
        ref={!isFirst ? null : firstInputRef}
        value={entry.type}
        onChange={(e) => handleChange('type', e.target.value)}
        onFocus={handleFocus}
        aria-label="Payment type"
        style={{
          width: '100%', padding: '8px 10px', borderRadius: 6,
          border: '1px solid var(--border)', background: 'var(--bg-surface)',
          color: 'var(--text-primary)', fontSize: 13, marginBottom: 8,
        }}
      >
        {paymentTypes.map(t => (
          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
        ))}
      </select>

      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
        {entry.type === 'bank' ? 'Bank Name' : entry.type === 'wallet' ? 'Wallet Provider' : 'Cash'}
      </label>
      <input
        type="text"
        placeholder="Enter name"
        value={entry.place}
        onChange={(e) => handleChange('place', e.target.value)}
        onFocus={handleFocus}
        aria-label="Provider name"
        style={inputStyle}
      />
      {errors?.place && <div style={errorStyle}>{errors.place}</div>}

      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
        Account Holder
      </label>
      <input
        type="text"
        placeholder="Account holder name"
        value={entry.accountName}
        onChange={(e) => handleChange('accountName', e.target.value)}
        onFocus={handleFocus}
        aria-label="Account holder name"
        style={inputStyle}
      />
      {errors?.accountName && <div style={errorStyle}>{errors.accountName}</div>}

      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
        Account Number / ID
      </label>
      <input
        type="text"
        placeholder="Account number or wallet ID"
        value={entry.accountNumber}
        onChange={(e) => handleChange('accountNumber', e.target.value)}
        onFocus={handleFocus}
        aria-label="Account number"
        style={inputStyle}
      />
      {errors?.accountNumber && <div style={errorStyle}>{errors.accountNumber}</div>}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={() => onSetPrimary(index)}
          disabled={entry.isPrimary}
          aria-label={entry.isPrimary ? 'Primary payment method' : `Set as primary payment method`}
          style={{
            flex: 1, padding: '6px 0', borderRadius: 6,
            border: '1px solid var(--accent-blue)', background: entry.isPrimary ? 'var(--accent-blue)' : 'transparent',
            color: entry.isPrimary ? '#fff' : 'var(--accent-blue)', fontSize: 12, fontWeight: 600,
            cursor: entry.isPrimary ? 'default' : 'pointer',
          }}
        >
          {entry.isPrimary ? 'Primary' : 'Set as Primary'}
        </button>
        <button
          onClick={() => onRemove(index)}
          aria-label={`Remove payment method ${index + 1}`}
          style={{
            padding: '6px 12px', borderRadius: 6,
            border: '1px solid var(--accent-red)', background: 'transparent',
            color: 'var(--accent-red)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  fontSize: 13,
  marginBottom: 8,
  outline: 'none',
};

const errorStyle = {
  fontSize: 11,
  color: 'var(--accent-red)',
  marginTop: -6,
  marginBottom: 8,
};

export default function RepeatableGroupField({ field, value = [], onChange }) {
  const {
    addEntry,
    updateEntry,
    removeEntry,
    setPrimary,
  } = useRepeatableGroup(value, onChange, createDefaultPayment);

  const errors = (value || []).map(validatePayment);

  return (
    <div role="list" aria-label="Payment methods">
      {(value || []).map((entry, index) => (
        <PaymentCard
          key={entry.id || index}
          entry={entry}
          index={index}
          total={value.length}
          onUpdate={updateEntry}
          onRemove={removeEntry}
          onSetPrimary={setPrimary}
          errors={errors[index]}
        />
      ))}
      <button
        onClick={addEntry}
        aria-label="Add payment method"
        style={{
          width: '100%', padding: '10px 0', borderRadius: 8,
          border: '1px dashed var(--border)', background: 'transparent',
          color: 'var(--accent-blue)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}
      >
        + Add Payment Method
      </button>
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}