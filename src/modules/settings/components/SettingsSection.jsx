import SettingsField from './SettingsField';

export default function SettingsSection({ sectionKey, label, fields, values, onChange, editable = true }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderRadius: 10,
      border: '1px solid var(--border)',
      padding: 20,
      marginBottom: 20,
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
        {label}
      </h3>
      {fields.map(field => {
        const fieldValue = values?.[field.key] ?? field.value ?? '';
        const handleFieldChange = (newValue) => {
          onChange(sectionKey, field.key, newValue);
        };
        if (!editable) {
          // Static display
          return (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                {field.label}
              </label>
              <div style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: 'var(--bg-surface2)',
                color: 'var(--text-primary)',
                fontSize: 13,
              }}>
                {fieldValue}
              </div>
            </div>
          );
        }
        return (
          <SettingsField
            key={field.key}
            field={field}
            value={fieldValue}
            onChange={handleFieldChange}
          />
        );
      })}
    </div>
  );
}