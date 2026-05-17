import FinanceDataTable from '../../../../components/admin/finance/FinanceDataTable';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';

export default function VendorSummaryPanel({ vendorSummary, loading, onVendorClick }) {
  const columns = [
    { key: 'vendor_name', label: 'Vendor' },
    { key: 'total_spent', label: 'Total Spent', render: (val) => `Rs ${parseFloat(val || 0).toLocaleString()}` },
    { key: 'count', label: 'Expenses' },
    { key: 'last_expense', label: 'Last Expense', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
  ];

  return (
    <FinanceDataTable
      columns={columns}
      rows={vendorSummary}
      loading={loading}
      emptyMessage="No vendor data yet"
      onRowClick={(row) => onVendorClick && onVendorClick(row.vendor_id)}
    />
  );
}