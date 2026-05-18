// sajilo-app/src/modules/settings/engine/fields/RepeatableGroupField.jsx
import useRepeatableGroup from '../hooks/useRepeatableGroup';
import { createDefaultPayment, paymentTypes, validatePayment } from '../schemas/paymentSchema';

function PaymentCard({ entry, index, onUpdate, onRemove, onSetPrimary, errors }) {
  const handleChange = (field, value) => {
    const patch = { [field]: value };
    if (field === 'type') {
      patch.place = '';
    }
    onUpdate(index, patch);
  };

  return (
    <div style={{
      background: 'var(--bg-surface2)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      padding: 14,
      marginBottom: 12,
      position: 'relative',
    }}>
      {/* Primary badge */}
      {entry.isPrimary && (
        <span style={{
          position: 'absolute', top: 6, right: 6,
          background: 'var(--accent-green)', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
        }}>
          PRIMARY
        </span>
      )}

      {/* Type selector */}
      <select
        value={entry.type}
        onChange={(e) => handleChange('type', e.target.value)}
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

      {/* Place / Provider name */}
      <input
        type="text"
        placeholder={entry.type === 'bank' ? 'Bank Name' : entry.type === 'wallet' ? 'Wallet Provider' : 'Cash'}
        value={entry.place}
        onChange={(e) => handleChange('place', e.target.value)}
        style={inputStyle}
      />
      {errors?.place && <div style={errorStyle}>{errors.place}</div>}

      {/* Account Name */}
      <input
        type="text"
        placeholder="Account Holder Name"
        value={entry.accountName}
        onChange={(e) => handleChange('accountName', e.target.value)}
        style={inputStyle}
      />
      {errors?.accountName && <div style={errorStyle}>{errors.accountName}</div>}

      {/* Account Number */}
      <input
        type="text"
        placeholder="Account Number / Wallet ID"
        value={entry.accountNumber}
        onChange={(e) => handleChange('accountNumber', e.target.value)}
        style={inputStyle}
      />
      {errors?.accountNumber && <div style={errorStyle}>{errors.accountNumber}</div>}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={() => onSetPrimary(index)}
          disabled={entry.isPrimary}
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

  // Validate all entries for display
  const errors = (value || []).map(validatePayment);

  return (
    <div>
      {(value || []).map((entry, index) => (
        <PaymentCard
          key={entry.id || index}
          entry={entry}
          index={index}
          onUpdate={updateEntry}
          onRemove={removeEntry}
          onSetPrimary={setPrimary}
          errors={errors[index]}
        />
      ))}
      <button
        onClick={addEntry}
        style={{
          width: '100%', padding: '10px 0', borderRadius: 8,
          border: '1px dashed var(--border)', background: 'transparent',
          color: 'var(--accent-blue)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}
      >
        + Add Payment Method
      </button>
    </div>
  );
}