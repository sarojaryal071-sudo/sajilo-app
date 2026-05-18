// sajilo-app/src/modules/settings/engine/fields/SelectField.jsx
export default function SelectField({ field, value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <select
      value={value || ''}
      onChange={handleChange}
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
    >
      <option value="" disabled>Select...</option>
      {(field.options || []).map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}