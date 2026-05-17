const VIEWS = [
  { key: 'all',       label: 'All Expenses' },
  { key: 'recurring', label: 'Recurring' },
  { key: 'vendors',   label: 'Vendors' },
];

export default function ExpenseViewSwitcher({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
      {VIEWS.map(v => (
        <button
          key={v.key}
          onClick={() => onChange(v.key)}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'transparent',
            color: active === v.key ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontSize: 13,
            fontWeight: active === v.key ? 600 : 400,
            cursor: 'pointer',
            borderBottom: active === v.key ? '2px solid var(--accent-blue)' : '2px solid transparent',
            transition: 'all 0.15s',
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}