import { useState } from 'react';

const COMPONENT_TYPES = ['button', 'card', 'input', 'navigation', 'header', 'modal', 'badge'];

const VARIANT_OPTIONS = {
  button: ['filled', 'outline', 'soft', 'glass'],
  card: ['flat', 'elevated', 'glass', 'soft'],
  input: ['outline', 'filled', 'soft'],
  navigation: ['classic', 'compact', 'floating'],
  header: ['default', 'compact', 'transparent'],
  modal: ['default', 'glass', 'soft'],
  badge: ['filled', 'outline', 'soft'],
};

const RADIUS_OPTIONS = ['none', 'soft', 'rounded', 'pill', 'modal'];

export default function VariantEditor({ variants = {}, onChange }) {
  const [activeComponent, setActiveComponent] = useState(COMPONENT_TYPES[0]);

  const current = variants[activeComponent] || {};

  const update = (key, value) => {
    const updated = {
      ...variants,
      [activeComponent]: { ...current, [key]: value },
    };
    onChange(updated);
  };

  return (
    <div>
      {/* Component type selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {COMPONENT_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveComponent(type)}
            style={{
              padding: '4px 12px',
              borderRadius: 16,
              border: activeComponent === type ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
              background: activeComponent === type ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
              color: activeComponent === type ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Variant selector */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Variant</label>
        <select
          value={current.variant || ''}
          onChange={e => update('variant', e.target.value)}
          style={{
            width: '100%', padding: '6px 10px', borderRadius: 6,
            border: '1px solid var(--border)', fontSize: 12, background: 'var(--bg-surface2)',
            color: 'var(--text-primary)', outline: 'none',
          }}
        >
          <option value="">Default</option>
          {(VARIANT_OPTIONS[activeComponent] || []).map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* Radius selector */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Radius</label>
        <select
          value={current.radius || ''}
          onChange={e => update('radius', e.target.value)}
          style={{
            width: '100%', padding: '6px 10px', borderRadius: 6,
            border: '1px solid var(--border)', fontSize: 12, background: 'var(--bg-surface2)',
            color: 'var(--text-primary)', outline: 'none',
          }}
        >
          <option value="">Default</option>
          {RADIUS_OPTIONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Hover behavior (cards only) */}
      {activeComponent === 'card' && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Hover Effect</label>
          <select
            value={current.hover || ''}
            onChange={e => update('hover', e.target.value)}
            style={{
              width: '100%', padding: '6px 10px', borderRadius: 6,
              border: '1px solid var(--border)', fontSize: 12, background: 'var(--bg-surface2)',
              color: 'var(--text-primary)', outline: 'none',
            }}
          >
            <option value="">None</option>
            <option value="lift">Lift</option>
            <option value="glow">Glow</option>
            <option value="scale">Scale</option>
          </select>
        </div>
      )}
    </div>
  );
}