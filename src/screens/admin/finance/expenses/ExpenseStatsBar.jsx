export default function ExpenseStatsBar({ stats }) {
  const cards = [
    { label: 'Total Expenses', value: stats.total, color: 'var(--accent-blue)' },
    { label: 'Pending Approval', value: stats.pending, color: 'var(--accent-orange)' },
    { label: 'Approved', value: stats.approved, color: 'var(--accent-green)' },
    { label: 'Paid', value: stats.paid, color: 'var(--accent-blue)' },
    { label: 'Recurring (Monthly)', value: `Rs ${(stats.recurringTotal || 0).toLocaleString()}`, color: 'var(--accent-green)' },
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
          <div style={{ fontSize: 18, fontWeight: 700, color: card.color }}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}