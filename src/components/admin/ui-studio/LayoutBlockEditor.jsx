export default function LayoutBlockEditor({ blocks = [], onChange }) {
  const move = (index, direction) => {
    const updated = [...blocks];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= updated.length) return;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    // Update order fields
    updated.forEach((b, i) => (b.order = i + 1));
    onChange(updated);
  };

  const toggle = (index) => {
    const updated = [...blocks];
    updated[index].enabled = !updated[index].enabled;
    onChange(updated);
  };

  const updateProp = (index, key, value) => {
    const updated = [...blocks];
    updated[index].props = { ...updated[index].props, [key]: value };
    onChange(updated);
  };

  if (!blocks || blocks.length === 0) return <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No blocks configured.</div>;

  return (
    <div>
      {blocks.map((block, i) => (
        <div key={block.id} style={{ marginBottom: 12, padding: 10, border: '1px solid var(--border)', borderRadius: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{block.id}</span>
            <button
              onClick={() => toggle(i)}
              style={{
                padding: '2px 10px', borderRadius: 12, border: '1px solid var(--border)',
                background: block.enabled ? 'var(--accent-green)' : 'var(--bg-surface2)',
                color: block.enabled ? '#fff' : 'var(--text-secondary)', fontSize: 10, cursor: 'pointer',
              }}
            >
              {block.enabled ? 'On' : 'Off'}
            </button>
          </div>
          {block.enabled && (
            <>
              <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                <button onClick={() => move(i, -1)} disabled={i === 0} style={{ padding: '2px 8px', fontSize: 10, cursor: 'pointer' }}>↑</button>
                <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} style={{ padding: '2px 8px', fontSize: 10, cursor: 'pointer' }}>↓</button>
              </div>
              <div style={{ marginBottom: 4 }}>
                <label style={{ fontSize: 10, display: 'block' }}>Title</label>
                <input
                  type="text"
                  value={block.props?.title || ''}
                  onChange={e => updateProp(i, 'title', e.target.value)}
                  style={{ width: '100%', padding: '4px 8px', fontSize: 11, borderRadius: 4, border: '1px solid var(--border)' }}
                />
              </div>
              <div style={{ marginBottom: 4 }}>
                <label style={{ fontSize: 10, display: 'block' }}>Subtitle</label>
                <input
                  type="text"
                  value={block.props?.subtitle || ''}
                  onChange={e => updateProp(i, 'subtitle', e.target.value)}
                  style={{ width: '100%', padding: '4px 8px', fontSize: 11, borderRadius: 4, border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, display: 'block' }}>Button text</label>
                <input
                  type="text"
                  value={block.props?.buttonText || ''}
                  onChange={e => updateProp(i, 'buttonText', e.target.value)}
                  style={{ width: '100%', padding: '4px 8px', fontSize: 11, borderRadius: 4, border: '1px solid var(--border)' }}
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}