export default function JournalStatsBar({ stats }) {
  const cards = [
    { label: 'Total Entries', value: stats.total ?? 0 },
    { label: 'Manual Entries', value: stats.manual ?? 0 },
    { label: 'Expense Entries', value: stats.expense ?? 0 },
    { label: 'Unmatched', value: stats.unmatched ?? 0 },
  ];

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
      {cards.map(card => (
        <div key={card.label} style={{
          flex: '1 1 120px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '10px 14px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{card.label}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)' }}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}