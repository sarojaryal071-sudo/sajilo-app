import FinanceDataTable from '../../../../components/admin/finance/FinanceDataTable';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';

export default function ExpenseTable({ expenses = [], loading, onRowClick }) {
  const columns = [
    { key: 'expense_date', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
    { key: 'title', label: 'Title' },
    { key: 'vendor_name', label: 'Vendor', render: (val) => val || '—' },
    { key: 'category_name', label: 'Category', render: (val) => val || '—' },
    { key: 'cost_center_code', label: 'Cost Center', render: (val) => val || '—' },
    { key: 'amount', label: 'Amount', render: (val) => `Rs ${parseFloat(val || 0).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (val) => <FinanceStatusPill status={val} /> },
    { key: 'expense_type', label: 'Type', render: (val) => val || '—' },
    { key: 'is_recurring', label: 'Recurring', render: (_, row) => row.expense_type === 'RECURRING' ? '🔁' : '' },
  ];

  return (
    <FinanceDataTable
      columns={columns}
      rows={expenses}
      loading={loading}
      emptyMessage="No expenses found"
      onRowClick={onRowClick}
    />
  );
}