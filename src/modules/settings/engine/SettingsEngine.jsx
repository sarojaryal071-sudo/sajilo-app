// sajilo-app/src/modules/settings/engine/SettingsEngine.jsx
import React, { useState, useCallback } from 'react';
import FieldRenderer from './FieldRenderer';
import FieldShell from './FieldShell';

export default function SettingsEngine({ registry, values, onChange, saveStates = {}, onRetrySection }) {
  const [focusedField, setFocusedField] = useState(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const [collapsedSections, setCollapsedSections] = useState(() => {
    try {
      const saved = localStorage.getItem('sajilo_settings_collapsed');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const toggleCollapse = useCallback((sectionKey) => {
    setCollapsedSections(prev => {
      const next = { ...prev, [sectionKey]: !prev[sectionKey] };
      localStorage.setItem('sajilo_settings_collapsed', JSON.stringify(next));
      return next;
    });
  }, []);

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
        const sectionKey = section.key;
        const isCollapsed = collapsedSections[sectionKey] || false;

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
            {/* Section title + collapse toggle + status */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {section.title}
                </div>
                {isMobile && (
                  <button
                    onClick={() => toggleCollapse(sectionKey)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 18,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'transform 0.2s',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                      lineHeight: 1,
                    }}
                    aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
                  >
                    ›
                  </button>
                )}
              </div>
              {saveStates[sectionKey] && saveStates[sectionKey] !== 'idle' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color:
                      saveStates[sectionKey] === 'saving' ? 'var(--accent-blue)' :
                      saveStates[sectionKey] === 'saved' ? 'var(--accent-green)' :
                      'var(--accent-red)',
                  }}
                >
                  {saveStates[sectionKey] === 'saving' && (
                    <>
                      <span style={{
                        width: 12, height: 12,
                        border: '2px solid var(--accent-blue)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                      }} />
                      Saving…
                    </>
                  )}
                  {saveStates[sectionKey] === 'saved' && (
                    <>
                      ✓ Saved
                    </>
                  )}
                  {saveStates[sectionKey] === 'error' && (
                    <>
                      ⚠ Couldn't save
                      <button
                        onClick={() => onRetrySection && onRetrySection(sectionKey)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-red)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Retry
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Field rows (collapsible on mobile with smooth animation) */}
            <div style={{
              maxHeight: (isMobile && isCollapsed) ? '0px' : '4000px',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}>
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
                        onFocus={() => setFocusedField(fieldKey)}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </FieldShell>
                );
              })}
            </div>
          </div>
        );
      })}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}