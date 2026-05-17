import FinanceDetailDrawer from '../FinanceDetailDrawer';
import FinanceStatusPill from '../FinanceStatusPill';
import FinanceSectionCard from '../FinanceSectionCard';
import { getJournalIdentity } from "../../../../utils/finance/journalIdentity.js";

export default function ReconciliationDetailDrawer({ open, onClose, item }) {
  if (!item) return null;

  const isMissing = item.ledger_id && !item.accounting_entry_id;
  const isOrphan = item.accounting_entry_id && !item.ledger_id;
  const isMismatched = item.ledger_id && item.accounting_entry_id && item.ledger_amount !== undefined;

  let title = 'Reconciliation Detail';
  if (isMissing) title = 'Missing Accounting Entry';
  else if (isOrphan) title = 'Orphan Accounting Entry';
  else if (isMismatched) title = 'Amount Mismatch';

  return (
    <FinanceDetailDrawer open={open} onClose={onClose} title={title}>
      <FinanceSectionCard title="Details" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          {item.ledger_id && <div><strong>Ledger Entry:</strong> {getJournalIdentity({ ledger_entry_id: item.ledger_id })}</div>}
          {item.accounting_entry_id && <div><strong>Accounting Entry:</strong> {getJournalIdentity({ id: item.accounting_entry_id, source: 'ledger' })}</div>}
          {item.event_type && <div><strong>Event Type:</strong> {item.event_type}</div>}
          {item.ledger_amount !== undefined && <div><strong>Ledger Amount:</strong> Rs {parseFloat(item.ledger_amount).toLocaleString()}</div>}
          {item.accounting_amount !== undefined && <div><strong>Accounting Amount:</strong> Rs {parseFloat(item.accounting_amount).toLocaleString()}</div>}
          {item.entry_type && <div><strong>Entry Type:</strong> {item.entry_type}</div>}
        </div>
      </FinanceSectionCard>

      <FinanceSectionCard title="Status" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <FinanceStatusPill
            status={isMissing ? 'warning' : isOrphan ? 'critical' : isMismatched ? 'critical' : 'success'}
            label={isMissing ? 'Missing' : isOrphan ? 'Orphan' : isMismatched ? 'Mismatched' : 'Matched'}
          />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {isMissing ? 'This ledger entry has no matching accounting entry.' :
             isOrphan ? 'This accounting entry has no linked ledger entry.' :
             isMismatched ? 'The amounts between ledger and accounting entries do not match.' :
             'Entries are correctly matched.'}
          </span>
        </div>
      </FinanceSectionCard>
    </FinanceDetailDrawer>
  );
}