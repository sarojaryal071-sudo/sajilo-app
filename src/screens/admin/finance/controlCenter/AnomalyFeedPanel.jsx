import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import FinanceSectionCard from '../../../../components/admin/finance/FinanceSectionCard';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';
import FinanceLoadingState from '../../../../components/admin/finance/FinanceLoadingState';
import FinanceEmptyState from '../../../../components/admin/finance/FinanceEmptyState';

export default function AnomalyFeedPanel() {
  const [anomalies, setAnomalies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    fetch(`${API_URL}/admin/control/anomalies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => { if (res.success) setAnomalies(res.data.all || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FinanceLoadingState text="Scanning anomalies..." />;
  if (!anomalies || anomalies.length === 0) {
    return (
      <FinanceSectionCard title="Anomaly Feed">
        <FinanceEmptyState icon="✅" title="No anomalies detected" description="The system is clean." />
      </FinanceSectionCard>
    );
  }

  return (
    <FinanceSectionCard title="Anomaly Feed">
      {anomalies.slice(0, 5).map((a, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
          <span>
            <FinanceStatusPill status={a.severity === 'HIGH' ? 'critical' : a.severity === 'MEDIUM' ? 'warning' : 'active'} label={a.type} />
            <span style={{ marginLeft: 8, color: 'var(--text-primary)' }}>{a.description}</span>
          </span>
          <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(a.evidence?.[0]?.t1 || a.evidence?.[0]?.timestamp || Date.now()).toLocaleDateString()}</span>
        </div>
      ))}
    </FinanceSectionCard>
  );
}