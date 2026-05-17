import FinanceDetailDrawer from '../FinanceDetailDrawer';
import FinanceStatusPill from '../FinanceStatusPill';
import FinanceTimeline from './FinanceTimeline';
import FinanceSectionCard from '../FinanceSectionCard';
import { getJournalIdentity } from "../../../../utils/finance/journalIdentity.js";
import { resolveJournalLinks } from '../../../../utils/finance/journalLinkResolver.js';


export default function ExpenseDetailDrawer({ open, onClose, expense }) {
  if (!expense) return null;

  const timelineEvents = [
    {
      id: 'created',
      timestamp: expense.created_at,
      title: 'Expense Created',
      subtitle: `Title: ${expense.title}`,
      status: 'draft',
      actor: expense.created_by || 'System',
      icon: '📝',
    },
  ];

  if (expense.status === 'pending' || expense.status === 'approved' || expense.status === 'paid' || expense.status === 'closed') {
    timelineEvents.push({
      id: 'submitted',
      timestamp: expense.updated_at,
      title: 'Submitted for Approval',
      subtitle: `Status changed to ${expense.status}`,
      status: 'pending',
      icon: '📤',
    });
  }

  if (expense.approved_by && (expense.status === 'approved' || expense.status === 'paid' || expense.status === 'closed')) {
    timelineEvents.push({
      id: 'approved',
      timestamp: expense.updated_at,
      title: 'Expense Approved',
      subtitle: `Approved by: ${expense.approved_by?.slice(0, 8) || 'Admin'}`,
      status: 'success',
      actor: expense.approved_by?.slice(0, 8),
      icon: '✅',
    });
  }

  if (expense.status === 'paid' || expense.status === 'closed') {
    timelineEvents.push({
      id: 'paid',
      timestamp: expense.updated_at,
      title: 'Payment Recorded',
      subtitle: `Amount: Rs ${parseFloat(expense.amount).toLocaleString()}`,
      status: 'active',
      icon: '💵',
    });
  }

  if (expense.status === 'closed') {
    timelineEvents.push({
      id: 'closed',
      timestamp: expense.updated_at,
      title: 'Expense Closed',
      subtitle: 'Lifecycle complete',
      status: 'inactive',
      icon: '🔒',
    });
  }

  return (
    <FinanceDetailDrawer open={open} onClose={onClose} title={`Expense · ${expense.title?.slice(0, 30)}`}>
      {/* Summary */}
      <FinanceSectionCard title="Summary" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div><strong>Title:</strong> {expense.title}</div>
          <div><strong>Amount:</strong> Rs {parseFloat(expense.amount).toLocaleString()}</div>
          <div><strong>Category:</strong> {expense.category_name || expense.category_id?.slice(0, 8) || '—'}</div>
          <div><strong>Vendor:</strong> {expense.vendor_name || expense.vendor_id?.slice(0, 8) || '—'}</div>
          <div><strong>Status:</strong> <FinanceStatusPill status={expense.status} /></div>
          <div><strong>Type:</strong> {expense.expense_type || '—'}</div>
          <div><strong>Cost Center:</strong> {expense.cost_center_code || '—'}</div>
          <div><strong>Date:</strong> {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString() : '—'}</div>
        </div>
      </FinanceSectionCard>

      {/* Approval Flow */}
      <FinanceSectionCard title="Approval Flow" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div><strong>Created By:</strong> {expense.created_by?.slice(0, 8) || '—'}</div>
          <div><strong>Approved By:</strong> {expense.approved_by?.slice(0, 8) || '—'}</div>
          <div><strong>Created At:</strong> {expense.created_at ? new Date(expense.created_at).toLocaleDateString() : '—'}</div>
          <div><strong>Updated At:</strong> {expense.updated_at ? new Date(expense.updated_at).toLocaleDateString() : '—'}</div>
        </div>
      </FinanceSectionCard>

      {/* Accounting Impact */}
      <FinanceSectionCard title="Accounting Impact" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13 }}>
          {expense.accounting_entry_id && (
            <div>
              <strong>Linked Entry:</strong> {getJournalIdentity({ id: expense.accounting_entry_id, source: 'expense' })}
            </div>
          )}
          {expense.debit_account && <div><strong>Debit:</strong> {expense.debit_account}</div>}
          {expense.credit_account && <div><strong>Credit:</strong> {expense.credit_account}</div>}
        </div>
      </FinanceSectionCard>

            {/* Related Journal Entries */}
      {expense.accounting_entry_id && (
        <FinanceSectionCard title="Related Journal Entries" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13 }}>
            {resolveJournalLinks({ id: expense.accounting_entry_id, expense_id: expense.id, entry_type: 'AUTO_EXPENSE' }).map((link, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{link.label}</span>
                <span style={{ color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={() => console.log('View', link.type, link.id)}>🔗 View</span>
              </div>
            ))}
          </div>
        </FinanceSectionCard>
      )}

      {/* Lifecycle Timeline */}
      <FinanceSectionCard title="Lifecycle Timeline" style={{ marginBottom: 16 }}>
        <FinanceTimeline events={timelineEvents} />
      </FinanceSectionCard>
    </FinanceDetailDrawer>
  );
}