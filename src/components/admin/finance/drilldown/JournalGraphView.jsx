export default function JournalGraphView({ entry }) {
  if (!entry) return null;

  const nodes = [];
  if (entry.ledger_entry_id) nodes.push({ label: 'Ledger', id: entry.ledger_entry_id });
  if (entry.expense_id) nodes.push({ label: 'Expense', id: entry.expense_id });
  if (entry.journal_id) nodes.push({ label: 'Manual', id: entry.journal_id });
  nodes.push({ label: 'Journal', id: entry.id });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, overflowX: 'auto' }}>
      {nodes.map((n, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: 'var(--bg-surface2)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12,
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 600 }}>{n.label}</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>#{typeof n.id === 'string' ? n.id.slice(0, 8) : n.id}</div>
          </div>
          {i < nodes.length - 1 && <span style={{ fontSize: 18, color: 'var(--text-secondary)' }}>→</span>}
        </div>
      ))}
    </div>
  );
}