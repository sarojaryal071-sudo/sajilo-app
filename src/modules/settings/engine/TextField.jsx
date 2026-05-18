// sajilo-app/src/modules/settings/engine/fields/TextField.jsx
export default function TextField({ field, value, onChange, onFocus, onBlur }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const inputType = field.type === 'email' ? 'email'
    : field.type === 'phone' ? 'tel'
    : field.type === 'number' ? 'number'
    : 'text';

  return (
    <input
      type={inputType}
      value={value || ''}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={field.placeholder || field.label}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'var(--bg-surface2)',
        color: 'var(--text-primary)',
        fontSize: 14,
        outline: 'none',
      }}
    />
  );
}