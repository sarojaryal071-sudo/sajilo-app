import FinanceDataTable from '../../../../components/admin/finance/FinanceDataTable';
import FinanceStatusPill from '../../../../components/admin/finance/FinanceStatusPill';
import JournalSourceBadge from './JournalSourceBadge'; // unused now, can be removed later
import { getJournalIdentity, getJournalSourceLabel, getJournalBadgeVariant } from '../../../../utils/finance/journalIdentity.js';
import { getPrimarySourceRoute } from '../../../../utils/finance/journalLinkResolver.js';

export default function JournalTable({ entries = [], onRowClick, loading = false }) {
  const columns = [
    {
      key: 'identity',
      label: 'Source Identity',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 12 }}>{getJournalIdentity(row)}</span>
          <FinanceStatusPill status={getJournalBadgeVariant(row)} label={getJournalSourceLabel(row)} />
        </div>
      ),
    },
    { key: 'id', label: 'ID', render: (val) => val?.slice(0, 8) },
    { key: 'created_at', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
    { key: 'entry_type', label: 'Type', render: (val) => <FinanceStatusPill status={val === 'MANUAL' ? 'draft' : 'success'} label={val} /> },
    { key: 'debit_account', label: 'Debit' },
    { key: 'credit_account', label: 'Credit' },
    { key: 'amount', label: 'Amount', render: (val) => `Rs ${parseFloat(val || 0).toLocaleString()}` },
    { key: 'remarks', label: 'Remarks', render: (val) => val || '—' },
    // ---- NEW: Navigate column ----
    {
      key: 'navigate',
      label: 'Navigate',
      render: (_, row) => {
        const route = getPrimarySourceRoute(row);
        return route ? (
          <span
            style={{ color: 'var(--accent-blue)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={(e) => {
              e.stopPropagation(); // prevent row click from opening drawer
              console.log('Navigate to', route);
              // Future: actual navigation (e.g., window.location.hash = route)
            }}
          >
            🔍 Source
          </span>
        ) : null;
      },
    },
  ];

  return (
    <FinanceDataTable
      columns={columns}
      rows={entries}
      loading={loading}
      emptyMessage="No journal entries found"
      onRowClick={onRowClick}
    />
  );
}