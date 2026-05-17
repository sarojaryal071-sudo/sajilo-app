const SOURCE_CONFIG = {
  ledger:   { label: 'Ledger',   icon: '📋', color: 'var(--accent-blue-light)', textColor: 'var(--accent-blue)' },
  expense:  { label: 'Expense',  icon: '💰', color: '#fef3c7', textColor: '#92400e' },
  manual:   { label: 'Manual',   icon: '📖', color: '#f3f4f6', textColor: '#374151' },
  recurring:{ label: 'Recurring',icon: '🔁', color: '#dcfce7', textColor: '#166534' },
  backfill: { label: 'Backfill', icon: '🔄', color: '#f3f4f6', textColor: '#374151' },
  unknown:  { label: 'Unknown',  icon: '❓', color: '#fee2e2', textColor: '#991b1b' },
};

export default function JournalSourceBadge({ source }) {
  const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.unknown;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '1px 8px',
      borderRadius: 10,
      fontSize: 11,
      fontWeight: 500,
      background: config.color,
      color: config.textColor,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 12 }}>{config.icon}</span>
      {config.label}
    </span>
  );
}