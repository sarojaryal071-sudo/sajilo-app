// sajilo-app/src/modules/settings/engine/fields/ReadOnlyField.jsx
export default function ReadOnlyField({ field, value }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
        {field.label}
      </div>
      <div style={{
        fontSize: 14,
        color: 'var(--text-primary)',
        marginTop: 4,
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'var(--bg-surface2)',
      }}>
        {value || '—'}
      </div>
    </div>
  );
}