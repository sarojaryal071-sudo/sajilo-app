import FinanceDataTable from '../../../../components/admin/finance/FinanceDataTable';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';

export default function RecurringSummaryPanel({ recurringExpenses, loading, onRowClick }) {
  const columns = [
    { key: 'rule_name', label: 'Rule Name' },
    { key: 'frequency', label: 'Frequency', render: (val) => val || '—' },
    { key: 'next_date', label: 'Next Run', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
    { key: 'amount', label: 'Amount', render: (val) => `Rs ${parseFloat(val || 0).toLocaleString()}` },
    { key: 'amount_type', label: 'Type', render: (val) => val || 'FIXED' },
    { key: 'status', label: 'Status', render: (val) => <FinanceStatusPill status={val} /> },
  ];

  return (
    <FinanceDataTable
      columns={columns}
      rows={recurringExpenses}
      loading={loading}
      emptyMessage="No recurring expenses found"
      onRowClick={onRowClick}
    />
  );
}