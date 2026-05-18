// sajilo-app/src/modules/settings/engine/fields/ActionField.jsx
export default function ActionField({ field, value, onChange }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange && onChange();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={field.label}
      onClick={() => onChange && onChange()}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        cursor: 'pointer',
        outline: 'none',
        borderRadius: 6,
        transition: 'background 0.15s',
      }}
      onFocus={(e) => e.currentTarget.style.background = 'var(--accent-blue-light)'}
      onBlur={(e) => e.currentTarget.style.background = 'transparent'}
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