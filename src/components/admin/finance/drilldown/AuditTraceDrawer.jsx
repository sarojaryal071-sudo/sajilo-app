import FinanceDetailDrawer from '../FinanceDetailDrawer';
import FinanceTimeline from './FinanceTimeline';
import FinanceSectionCard from '../FinanceSectionCard';

export default function AuditTraceDrawer({ open, onClose, trace }) {
  if (!trace) return null;

  // Build timeline from the trace chain
  const events = [];

  if (trace.accountingEntry) {
    events.push({
      id: 'accounting',
      timestamp: trace.accountingEntry.created_at,
      title: 'Accounting Entry',
      subtitle: `${trace.accountingEntry.debit_account} → ${trace.accountingEntry.credit_account}`,
      status: 'active',
      icon: '📒',
      metadata: {
        Amount: `Rs ${parseFloat(trace.accountingEntry.amount).toLocaleString()}`,
        Type: trace.accountingEntry.entry_type,
      },
    });
  }

  if (trace.linkedEntities?.ledgerEntry) {
    const le = trace.linkedEntities.ledgerEntry;
    events.push({
      id: 'ledger',
      timestamp: le.created_at,
      title: 'Ledger Entry',
      subtitle: le.event_type,
      status: 'success',
      icon: '📋',
      metadata: {
        ID: le.id,
        Amount: `Rs ${parseFloat(le.amount).toLocaleString()}`,
      },
    });
  }

  if (trace.linkedEntities?.expense) {
    const exp = trace.linkedEntities.expense;
    events.push({
      id: 'expense',
      timestamp: exp.created_at,
      title: 'Expense',
      subtitle: exp.title,
      status: exp.status,
      icon: '💰',
      metadata: {
        Status: exp.status,
        Amount: `Rs ${parseFloat(exp.amount).toLocaleString()}`,
      },
    });
  }

  if (trace.linkedEntities?.manualJournal) {
    events.push({
      id: 'journal',
      timestamp: trace.linkedEntities.manualJournal.createdAt,
      title: 'Manual Journal',
      subtitle: trace.linkedEntities.manualJournal.remarks || 'Manual correction',
      status: 'draft',
      icon: '📖',
    });
  }

  // Sort by date
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <FinanceDetailDrawer open={open} onClose={onClose} title="Audit Trace">
      <FinanceSectionCard title="Trace Chain">
        <FinanceTimeline events={events} />
      </FinanceSectionCard>
    </FinanceDetailDrawer>
  );
}