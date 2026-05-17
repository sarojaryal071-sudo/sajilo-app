import { flattenContentObject } from '../../../utils/flattenContentObject.js';
import { setNestedValue } from '../../../utils/setNestedValue.js';

export default function ContentEditor({ content = {}, onChange }) {
  const flat = flattenContentObject(content);
  const keys = Object.keys(flat).sort();

  if (keys.length === 0) {
    return <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No content keys configured.</div>;
  }

  const sections = {};
  keys.forEach(key => {
    const section = key.split('.')[0];
    if (!sections[section]) sections[section] = [];
    sections[section].push(key);
  });

  return (
    <div>
      {Object.entries(sections).map(([section, sectionKeys]) => (
        <div key={section} style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.45)',
            textTransform: 'uppercase', letterSpacing: '1px',
            marginBottom: 8, paddingBottom: 6,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}>
            {section}
          </div>
          {sectionKeys.map(key => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2, color: 'var(--text-secondary)' }}>
                {key.replace(/\./g, ' › ')}
              </label>
              <input
                type="text"
                value={flat[key] || ''}
                onChange={(e) => {
                  const updated = setNestedValue(
                    JSON.parse(JSON.stringify(content)),
                    key,
                    e.target.value
                  );
                  onChange(updated);
                }}
                style={{
                  width: '100%', padding: '6px 10px',
                  borderRadius: 6, border: '1px solid var(--border)',
                  fontSize: 12, background: 'var(--bg-surface)',
                  color: 'var(--text-primary)', outline: 'none',
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}