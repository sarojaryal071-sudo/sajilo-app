import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';
import FinanceSectionCard from '../../../../components/admin/finance/FinanceSectionCard';
import FinanceLoadingState from '../../../../components/admin/finance/FinanceLoadingState';

export default function ControlHealthOverview() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    fetch(`${API_URL}/admin/accounting/health`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => { if (res.success) setHealth(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FinanceLoadingState text="Loading health status..." />;
  if (!health) return null;

  return (
    <FinanceSectionCard
      title="System Health"
      subtitle={`Score: ${health.healthScore}/100`}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <FinanceStatusPill
          status={health.status === 'OK' ? 'healthy' : health.status === 'WARNING' ? 'warning' : 'critical'}
          label={health.status}
        />
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {health.metrics?.missingLedgerEntries ?? 0} missing entries &nbsp;|&nbsp;
          {health.metrics?.mismatchedLedgerEntries ?? 0} mismatched &nbsp;|&nbsp;
          {health.issues?.length ?? 0} issues
        </div>
      </div>
    </FinanceSectionCard>
  );
}