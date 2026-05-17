import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import FinanceSectionCard from '../../../../components/admin/finance/FinanceSectionCard';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';
import FinanceLoadingState from '../../../../components/admin/finance/FinanceLoadingState';
import FinanceEmptyState from '../../../../components/admin/finance/FinanceEmptyState';

export default function CashFlowRiskPanel() {
  const [cf, setCf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    fetch(`${API_URL}/admin/accounting/reports/cash-flow-trace`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => { if (res.success) setCf(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FinanceLoadingState text="Loading cash flow..." />;
  if (!cf) return null;

  const net = cf.netCashFlow || 0;
  const inflow = cf.totalInflow || 0;
  const outflow = cf.totalOutflow || 0;

  return (
    <FinanceSectionCard title="Cash Flow Overview">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Total Inflow</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-green)' }}>Rs {inflow.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Total Outflow</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-red)' }}>Rs {outflow.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Net Cash Flow</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: net >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            Rs {net.toLocaleString()}
          </div>
        </div>
      </div>
    </FinanceSectionCard>
  );
}