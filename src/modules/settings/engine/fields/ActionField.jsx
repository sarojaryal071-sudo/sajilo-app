// sajilo-app/src/modules/settings/engine/fields/ActionField.jsx
export default function ActionField({ field, value, onChange }) {
  // This field doesn't have a value; it's a tappable row.
  return (
    <div
      onClick={() => onChange && onChange()} // notify parent, e.g., open modal
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        cursor: 'pointer',
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
          {field.label}
        </div>
        {field.description && (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            {field.description}
          </div>
        )}
      </div>
      <span style={{ fontSize: 18, color: 'var(--text-secondary)' }}>›</span>
    </div>
  );
}