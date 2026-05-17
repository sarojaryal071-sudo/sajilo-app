import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';

export default function JournalTypeTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: active === tab.key ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
            background: active === tab.key ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
            color: active === tab.key ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: active === tab.key ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              background: 'var(--bg-surface2)',
              borderRadius: 10,
              padding: '0 6px',
              fontSize: 10,
              fontWeight: 600,
              lineHeight: '18px',
            }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}