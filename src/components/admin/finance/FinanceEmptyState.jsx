export default function FinanceEmptyState({
  icon = '📭',
  title = 'No data',
  description = 'There is nothing to display yet.',
}) {
  return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12 }}>{description}</div>
    </div>
  );
}