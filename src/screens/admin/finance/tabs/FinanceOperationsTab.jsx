import { FinanceSectionCard } from '../../../../components/admin/finance/index.js';

export default function FinanceOperationsTab({ providerBreakdown, operationalMetrics }) {
  const hasProviderData = providerBreakdown && providerBreakdown.length > 0;
  const hasOperationalData = operationalMetrics !== null && operationalMetrics !== undefined;

  if (!hasProviderData && !hasOperationalData) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        No payment operation data available.
      </div>
    );
  }

  return (
    <FinanceSectionCard title="Payment Operations">
      {hasProviderData && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {providerBreakdown.map(p => (
            <div key={p.provider} style={{
              flex: '1 1 90px',
              background: 'var(--bg-surface)',
              borderRadius: 6,
              padding: '8px 10px',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {p.provider}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-blue)' }}>
                {p.count}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                Rs {parseInt(p.total).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {operationalMetrics && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 90px',
            background: 'var(--bg-surface)',
            borderRadius: 6,
            padding: '8px 10px',
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Pending</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-orange)' }}>
              {operationalMetrics.pendingConfirmations}
            </div>
          </div>
          <div style={{
            flex: '1 1 90px',
            background: 'var(--bg-surface)',
            borderRadius: 6,
            padding: '8px 10px',
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Overdue</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-red)' }}>
              {operationalMetrics.overdueConfirmations}
            </div>
          </div>
        </div>
      )}
    </FinanceSectionCard>
  );
}