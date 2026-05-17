export default function FinanceSubTabBar({ tabs = [], activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            padding: '8px 14px',
            border: 'none',
            background: 'transparent',
            color: activeTab === tab.key ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: activeTab === tab.key ? 600 : 400,
            cursor: 'pointer',
            borderBottom: activeTab === tab.key ? '2px solid var(--accent-blue)' : '2px solid transparent',
            transition: 'all 0.15s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}