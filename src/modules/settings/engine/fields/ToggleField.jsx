// sajilo-app/src/modules/settings/engine/fields/ToggleField.jsx
import { useRef } from 'react';

export default function ToggleField({ field, value, onChange }) {
  const checked = !!value;
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <label
      role="switch"
      aria-checked={checked}
      aria-label={field.label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        minHeight: 44,
        padding: '4px 0',
        userSelect: 'none',
        outline: 'none',
        borderRadius: 8,
        transition: 'box-shadow 0.15s',
      }}
      onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-blue)'}
      onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>
        {field.label}
      </span>
      <div
        style={{
          position: 'relative',
          width: 44,
          height: 24,
          borderRadius: 12,
          background: checked ? 'var(--accent-blue)' : 'var(--border)',
          transition: 'background 0.15s ease',
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            margin: 0,
          }}
          tabIndex={-1}
        />
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 22 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left 0.15s ease',
          }}
        />
      </div>
    </label>
  );
}