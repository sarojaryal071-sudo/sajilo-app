import FinanceDetailDrawer from '../FinanceDetailDrawer';
import FinanceStatusPill from '../FinanceStatusPill';
import FinanceTimeline from './FinanceTimeline';
import FinanceSectionCard from '../FinanceSectionCard';
import { getJournalIdentity, getJournalSourceLabel, getJournalBadgeVariant } from "../../../../utils/finance/journalIdentity.js";
import { resolveJournalLinks } from '../../../../utils/finance/journalLinkResolver.js';


export default function JournalEntryDrawer({ open, onClose, entry }) {
  if (!entry) return null;

  // Build a basic timeline from the entry data (mocked / computed from props)
  const timelineEvents = [
    {
      id: 'created',
      timestamp: entry.created_at,
      title: 'Entry Created',
      subtitle: `Type: ${entry.entry_type}`,
      status: 'success',
      actor: entry.created_by || 'System',
      icon: '📝',
    },
  ];

  if (entry.ledger_entry_id) {
    timelineEvents.push({
      id: 'ledger',
      timestamp: entry.created_at,
      title: 'Linked to Ledger',
      subtitle: `Ledger Entry #${entry.ledger_entry_id}`,
      status: 'active',
      icon: '📋',
    });
  }

  if (entry.expense_id) {
    timelineEvents.push({
      id: 'expense',
      timestamp: entry.created_at,
      title: 'Linked to Expense',
      subtitle: `Expense #${entry.expense_id.slice(0, 8)}`,
      status: 'active',
      icon: '💰',
    });
  }

  if (entry.journal_id) {
    timelineEvents.push({
      id: 'journal',
      timestamp: entry.created_at,
      title: 'Manual Journal',
      subtitle: `Journal ID: ${entry.journal_id.slice(0, 8)}`,
      status: 'active',
      icon: '📖',
    });
  }

  return (
    <FinanceDetailDrawer open={open} onClose={onClose} title={`Journal Entry · ${entry.id?.slice(0, 8)}`}>
      {/* Header */}
            {/* Source Identity Header */}
      <FinanceSectionCard title="Source Identity">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{getJournalIdentity(entry)}</span>
          <FinanceStatusPill status={getJournalBadgeVariant(entry)} label={getJournalSourceLabel(entry)} />
        </div>
      </FinanceSectionCard>
      <FinanceSectionCard title="Summary" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div><strong>ID:</strong> {entry.id?.slice(0, 8)}</div>
          <div><strong>Type:</strong> <FinanceStatusPill status={entry.entry_type === 'MANUAL' ? 'draft' : 'success'} label={entry.entry_type} /></div>
          <div><strong>Created:</strong> {new Date(entry.created_at).toLocaleDateString()}</div>
          <div><strong>Amount:</strong> Rs {parseFloat(entry.amount).toLocaleString()}</div>
          {entry.reference_type && <div><strong>Source:</strong> {entry.reference_type}</div>}
          {entry.reference_id && <div><strong>Ref ID:</strong> {entry.reference_id.slice(0, 8)}</div>}
        </div>
      </FinanceSectionCard>

      {/* Double Entry View */}
      <FinanceSectionCard title="Double Entry" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'space-around', marginBottom: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: 18 }}>DR</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{entry.debit_account}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-red)', fontSize: 18 }}>CR</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{entry.credit_account}</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          {entry.remarks || 'No remarks'}
        </div>
      </FinanceSectionCard>

      {/* Traceability */}
      <FinanceSectionCard title="Traceability" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div><strong>Ledger:</strong> {entry.ledger_entry_id ? `#${entry.ledger_entry_id}` : '—'}</div>
          <div><strong>Expense:</strong> {entry.expense_id ? entry.expense_id.slice(0, 8) : '—'}</div>
          <div><strong>Journal:</strong> {entry.journal_id ? entry.journal_id.slice(0, 8) : '—'}</div>
          <div><strong>Status:</strong> <FinanceStatusPill status={entry.entry_type === 'MANUAL' ? 'draft' : 'success'} label={entry.entry_type} /></div>
        </div>
      </FinanceSectionCard>

      {/* Audit Timeline */}
      <FinanceSectionCard title="Timeline" style={{ marginBottom: 16 }}>
        <FinanceTimeline events={timelineEvents} />
      </FinanceSectionCard>
            {/* Connected Entities */}
      <FinanceSectionCard title="Connected Entities">
        {resolveJournalLinks(entry).map((link, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
            <span style={{ color: 'var(--text-primary)' }}>{link.label}</span>
            <span style={{ color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={() => {
              if (link.type === 'ledger') {
                // for now just log; later can open a ledger viewer
                console.log('Navigate to ledger', link.id);
              } else if (link.type === 'expense') {
                console.log('Navigate to expense', link.id);
              } else if (link.type === 'journal') {
                console.log('Navigate to journal', link.id);
              }
            }}>
              🔗 View
            </span>
          </div>
        ))}
      </FinanceSectionCard>
    </FinanceDetailDrawer>
  );
}