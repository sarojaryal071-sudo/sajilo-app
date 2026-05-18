// sajilo-app/src/modules/settings/engine/FieldRenderer.jsx
import fieldTypes from './fieldTypes';

/**
 * @param {Object} field – { key, label, type, options, … }
 * @param {any} value – current value
 * @param {function} onChange – (newValue) => void
 */
export default function FieldRenderer({ field, value, onChange, onFocus, onBlur }) {
  const Component = fieldTypes[field.type];
  if (!Component) {
    // Unknown type – fallback read‑only display
    return (
      <div style={{ padding: '8px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
        Unknown field type: {field.type}
      </div>
    );
  }

  return (
    <Component
      field={field}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}