// sajilo-app/src/modules/settings/engine/fields/ToggleField.jsx
export default function ToggleField({ field, value, onChange }) {
  const checked = !!value;

  const handleChange = (e) => {
    onChange(e.target.checked);
  };

  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      padding: '8px 0',
    }}>
      <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>
        {field.label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        style={{
          width: 18,
          height: 18,
          cursor: 'pointer',
          accentColor: 'var(--accent-blue)',
        }}
      />
    </label>
  );
}