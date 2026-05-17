import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import FinanceSectionCard from '../../../../components/admin/finance/FinanceSectionCard';
import FinanceDataTable from '../../../../components/admin/finance/FinanceDataTable';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';
import FinanceLoadingState from '../../../../components/admin/finance/FinanceLoadingState';
import FinanceEmptyState from '../../../../components/admin/finance/FinanceEmptyState';
import { ReconciliationDetailDrawer } from '../../../../components/admin/finance/drilldown/index.js';

export default function ReconciliationStatusPanel() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReconItem, setSelectedReconItem] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    fetch(`${API_URL}/admin/accounting/reconciliation/report`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => { if (res.success) setReport(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FinanceLoadingState text="Loading reconciliation..." />;
  if (!report) return null;

  const rows = [
    ...(report.missing || []).map(i => ({ ...i, type: 'missing' })),
    ...(report.mismatched || []).map(i => ({ ...i, type: 'mismatched' })),
    ...(report.orphanAccounting || []).map(i => ({ ...i, type: 'orphan' })),
  ];

  if (rows.length === 0) {
    return (
      <FinanceSectionCard title="Reconciliation">
        <FinanceEmptyState icon="✅" title="All entries reconciled" description="No missing or mismatched entries." />
      </FinanceSectionCard>
    );
  }

  const columns = [
    { key: 'type', label: 'Type', render: (val) => <FinanceStatusPill status={val === 'missing' ? 'warning' : val === 'mismatched' ? 'critical' : 'inactive'} label={val} /> },
    { key: 'ledger_id', label: 'Ledger ID' },
    { key: 'accounting_entry_id', label: 'Accounting Entry', render: (val) => val ? val.slice(0,8) : '—' },
    { key: 'ledger_amount', label: 'Ledger Amount', render: (val) => val ? `Rs ${parseFloat(val).toLocaleString()}` : '—' },
    { key: 'accounting_amount', label: 'Accounting Amount', render: (val) => val ? `Rs ${parseFloat(val).toLocaleString()}` : '—' },
  ];

  return (
    <FinanceSectionCard title="Reconciliation Issues">
      <FinanceDataTable
        columns={columns}
        rows={rows}
        onRowClick={(row) => setSelectedReconItem(row)}
        emptyMessage="No issues"
      />
      <ReconciliationDetailDrawer
        open={!!selectedReconItem}
        onClose={() => setSelectedReconItem(null)}
        item={selectedReconItem}
      />
    </FinanceSectionCard>
  );
}