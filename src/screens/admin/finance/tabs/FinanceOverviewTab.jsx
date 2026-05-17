import { StatCard } from '../FinanceComponents';

export default function FinanceOverviewTab({ overview }) {
  if (!overview) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        No financial overview data available.
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: 10,
      marginBottom: 20,
    }}>
      <StatCard label="Total Invoiced"       value={`Rs ${(overview.totalInvoiced || 0).toLocaleString()}`} />
      <StatCard label="Total Collected"      value={`Rs ${(overview.totalCollected || 0).toLocaleString()}`} />
      <StatCard label="Platform Commission"  value={`Rs ${(overview.totalCommission || 0).toLocaleString()}`} />
      <StatCard label="Outstanding Dues"     value={`Rs ${(overview.outstandingCommission || 0).toLocaleString()}`} />
      <StatCard label="Total Settled"        value={`Rs ${(overview.totalSettled || 0).toLocaleString()}`} />
    </div>
  );
}