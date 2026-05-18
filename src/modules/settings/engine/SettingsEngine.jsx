// sajilo-app/src/modules/settings/engine/SettingsEngine.jsx
import React, { useState } from 'react';
import FieldRenderer from './FieldRenderer';
import FieldShell from './FieldShell';

/**
 * @param {Object[]} registry - Array of section objects.
 * @param {string} registry[].title - Section title.
 * @param {Object[]} registry[].fields - Array of field objects.
 * @param {Object} values - Current settings values (nested object).
 * @param {function} onChange - (sectionKey, fieldKey, value) => void
 */
export default function SettingsEngine({ registry, values, onChange }) {
  const [focusedField, setFocusedField] = useState(null);

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
              const fieldKey = `${sectionKey}.${field.key}`;
              const isFocused = focusedField === fieldKey;

              return (
                <FieldShell key={field.key} focused={isFocused}>
                  {fieldIndex > 0 && (
                    <div
                      style={{
                        height: 1,
                        background: 'var(--border)',
                        margin: '4px 0',
                      }}
                    />
                  )}
                  <div style={{
                    minHeight: 48,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '10px 0',
                  }}>
                    {/* Label for non‑toggle fields */}
                    {field.type !== 'toggle' && field.type !== 'action' && (
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          marginBottom: 6,
                        }}
                      >
                        {field.label}
                      </div>
                    )}
                    <FieldRenderer
                      field={field}
                      value={fieldValue}
                      onChange={handleFieldChange}
                      onFocus={() => {
                        console.log('FOCUS', fieldKey);
                        setFocusedField(fieldKey);
                      }}
                      onBlur={() => {
                        console.log('BLUR', fieldKey);
                        setFocusedField(null);
                      }}
                    />
                  </div>
                </FieldShell>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}