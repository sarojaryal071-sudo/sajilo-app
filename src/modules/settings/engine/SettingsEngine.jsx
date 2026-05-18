// sajilo-app/src/modules/settings/engine/SettingsEngine.jsx
import React from 'react';
import FieldRenderer from './FieldRenderer';

/**
 * @param {Object[]} registry - Array of section objects.
 * @param {string} registry[].title - Section title.
 * @param {Object[]} registry[].fields - Array of field objects.
 * @param {Object} values - Current settings values (nested object).
 * @param {function} onChange - (sectionKey, fieldKey, value) => void
 */
export default function SettingsEngine({ registry, values, onChange }) {
  if (!Array.isArray(registry) || registry.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
        No settings sections available.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {registry.map((section, sectionIndex) => {
        const sectionKey = section.key; // e.g. "account"
        return (
          <div
            key={sectionKey || sectionIndex}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 12,
              border: '1px solid var(--border)',
              padding: '24px 20px',
              marginBottom: 24,
              transition: 'box-shadow 0.2s ease',
            }}
          >
            {/* Section title */}
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              {section.title}
            </div>

            {/* Field rows */}
            {section.fields.map((field, fieldIndex) => {
              const fieldValue = values?.[sectionKey]?.[field.key] ?? field.value ?? '';
              const handleFieldChange = (newValue) => {
                onChange(sectionKey, field.key, newValue);
              };

              return (
                <React.Fragment key={field.key}>
                  {fieldIndex > 0 && (
                    <div
                      style={{
                        height: 1,
                        background: 'var(--border)',
                        margin: '12px 0',
                      }}
                    />
                  )}
                  <div style={{ padding: '8px 0' }}>
                    {/* Label for non‑toggle fields */}
                    {field.type !== 'toggle' && field.type !== 'action' && (
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                          marginBottom: 8,
                        }}
                      >
                        {field.label}
                      </div>
                    )}
                    <FieldRenderer
                      field={field}
                      value={fieldValue}
                      onChange={handleFieldChange}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}