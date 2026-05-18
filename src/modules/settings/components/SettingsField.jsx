import { useState } from 'react';

export default function SettingsField({ field, value, onChange }) {
  const [localValue, setLocalValue] = useState(value ?? '');

  const handleChange = (e) => {
    const newVal = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setLocalValue(newVal);
    onChange(newVal);
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <input
            type={field.type}
            value={localValue}
            onChange={handleChange}
            placeholder={field.label}
            style={inputStyle}
          />
        );
      case 'toggle':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!localValue}
              onChange={handleChange}
            />
            <span style={{ fontSize: 13 }}>{field.label}</span>
          </label>
        );
      case 'select':
        return (
          <select value={localValue} onChange={handleChange} style={inputStyle}>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={localValue ? localValue.slice(0, 16) : ''}
            onChange={handleChange}
            style={inputStyle}
          />
        );
      default:
        return (
          <input
            type="text"
            value={localValue}
            onChange={handleChange}
            style={inputStyle}
          />
        );
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid var(--border)',
    background: 'var(--bg-surface2)',
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {field.type !== 'toggle' && (
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
          {field.label}
        </label>
      )}
      {renderInput()}
    </div>
  );
}