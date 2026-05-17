import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';
import FinanceSectionCard from '../../../../components/admin/finance/FinanceSectionCard';
import FinanceLoadingState from '../../../../components/admin/finance/FinanceLoadingState';

export default function RiskScorePanel() {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    fetch(`${API_URL}/admin/control/risk-score`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => { if (res.success) setRisk(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FinanceLoadingState text="Loading risk score..." />;
  if (!risk) return null;

  return (
    <FinanceSectionCard
      title="Risk Score"
      subtitle={`Score: ${risk.score}/100`}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <FinanceStatusPill
          status={risk.status === 'STABLE' ? 'healthy' : risk.status === 'WARNING' ? 'warning' : 'critical'}
          label={risk.status}
        />
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Trend: {risk.trend} &nbsp;|&nbsp;
          Mismatches: {risk.breakdown?.mismatchedLedgerEntries ?? 0}
        </div>
      </div>
    </FinanceSectionCard>
  );
}