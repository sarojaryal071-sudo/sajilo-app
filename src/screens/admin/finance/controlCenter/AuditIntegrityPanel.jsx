import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import FinanceSectionCard from '../../../../components/admin/finance/FinanceSectionCard';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';
import FinanceLoadingState from '../../../../components/admin/finance/FinanceLoadingState';
import FinanceEmptyState from '../../../../components/admin/finance/FinanceEmptyState';

export default function AuditIntegrityPanel() {
  const [integrity, setIntegrity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    fetch(`${API_URL}/admin/accounting/integrity/source-report`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => { if (res.success) setIntegrity(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FinanceLoadingState text="Checking integrity..." />;
  if (!integrity) return null;

  const orphanCount = integrity.orphanEntries ?? integrity.orphan_entries ?? 0;
  const total = integrity.totalEntries ?? integrity.total_entries ?? 0;

  return (
    <FinanceSectionCard title="Audit Integrity">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Total Entries</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{total}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Orphan Entries</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: orphanCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {orphanCount}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Status</div>
          <FinanceStatusPill status={orphanCount === 0 ? 'healthy' : 'critical'} label={orphanCount === 0 ? 'Clean' : 'Issues'} />
        </div>
      </div>
    </FinanceSectionCard>
  );
}