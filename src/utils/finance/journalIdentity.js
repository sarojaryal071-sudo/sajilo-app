// sajilo-app/src/utils/finance/journalIdentity.js

/**
 * Determine the source type of a journal entry.
 */
export function getSourceType(entry) {
  if (entry.ledger_entry_id) return 'ledger';
  if (entry.expense_id) return 'expense';
  if (entry.journal_id) return 'manual';
  if (entry.entry_type === 'AUTO_BACKFILL') return 'backfill';
  if (entry.entry_type === 'AUTO_EXPENSE') return 'expense';
  if (entry.entry_type === 'MANUAL') return 'manual';
  return 'unknown';
}

/**
 * Return a human-readable identifier like LEDGER-#41
 */
export function getJournalIdentity(entry) {
  const sourceType = entry.source || getSourceType(entry);
  const sourceId = entry.ledger_entry_id || entry.expense_id || entry.journal_id || entry.id;
  const prefixMap = {
    ledger: 'LEDGER',
    expense: 'EXP',
    manual: 'MANUAL',
    backfill: 'BACKFILL',
    unknown: 'UNKNOWN',
  };
  const prefix = prefixMap[sourceType] || 'UNKNOWN';
  const shortId = typeof sourceId === 'string' ? sourceId.slice(0, 8) : sourceId;
  return `${prefix}-#${shortId}`;
}

/**
 * Return a descriptive label for the source type.
 */
export function getJournalSourceLabel(entry) {
  const sourceType = entry.source || getSourceType(entry);
  const labels = {
    ledger: 'Ledger Entry',
    expense: 'Expense Entry',
    manual: 'Manual Journal',
    backfill: 'System Backfill',
    unknown: 'Unknown Source',
  };
  return labels[sourceType] || 'Unknown Source';
}

/**
 * Return a badge color variant for the source type (used by FinanceStatusPill).
 */
export function getJournalBadgeVariant(entry) {
  const sourceType = entry.source || getSourceType(entry);
  const variantMap = {
    ledger: 'active',
    expense: 'warning',
    manual: 'pending',
    backfill: 'inactive',
    unknown: 'failed',
  };
  return variantMap[sourceType] || 'failed';
}