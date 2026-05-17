// sajilo-app/src/utils/finance/journalLinkResolver.js

/**
 * Map source types to a human-readable route label and a navigation target.
 * Actual navigation is handled by the consuming component.
 */
export function resolveJournalLinks(entry) {
  const links = [];

  if (entry.ledger_entry_id) {
    links.push({
      type: 'ledger',
      id: entry.ledger_entry_id,
      label: `Ledger Entry #${entry.ledger_entry_id}`,
    });
  }
  if (entry.expense_id) {
    links.push({
      type: 'expense',
      id: entry.expense_id,
      label: `Expense #${entry.expense_id.slice(0, 8)}`,
    });
  }
  if (entry.journal_id) {
    links.push({
      type: 'journal',
      id: entry.journal_id,
      label: `Manual Journal #${entry.journal_id.slice(0, 8)}`,
    });
  }
  if (entry.entry_type === 'AUTO_BACKFILL') {
    links.push({
      type: 'backfill',
      id: entry.id,
      label: `System Backfill #${entry.id.slice(0, 8)}`,
    });
  }

  // Accounting entries that reference this one (simplified – may be empty)
  links.push({
    type: 'accounting',
    id: entry.id,
    label: `Accounting Entry #${entry.id.slice(0, 8)}`,
  });

  return links;
}

export function getPrimarySourceRoute(entry) {
  if (entry.ledger_entry_id) return `/admin/finance?ledger=${entry.ledger_entry_id}`;
  if (entry.expense_id) return `/admin/finance?expense=${entry.expense_id}`;
  if (entry.journal_id) return `/admin/finance?journal=${entry.journal_id}`;
  return null;
}

export function getJournalGraphNode(entry) {
  return {
    id: entry.id,
    type: entry.entry_type,
    label: `Journal ${entry.id.slice(0, 8)}`,
    connections: resolveJournalLinks(entry),
  };
}