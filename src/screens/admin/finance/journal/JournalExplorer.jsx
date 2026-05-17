import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../../../services/api.js';
import JournalTypeTabs from './JournalTypeTabs';
import JournalFilters from './JournalFilters';
import JournalStatsBar from './JournalStatsBar';
import JournalTable from './JournalTable';
import JournalToolbar from './JournalToolbar';
import { JournalEntryDrawer, AuditTraceDrawer } from '../../../../components/admin/finance/drilldown/index.js';

const TABS = [
  { key: 'ALL',            label: 'All' },
  { key: 'AUTO',           label: 'Auto' },
  { key: 'MANUAL',         label: 'Manual' },
  { key: 'AUTO_EXPENSE',   label: 'Expense' },
  { key: 'AUTO_BACKFILL',  label: 'Backfill' },
];

export default function JournalExplorer() {
  const token = localStorage.getItem('sajilo_token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Data
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({});
  const [activeType, setActiveType] = useState('ALL');

  // Selected row → drawer
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [traceEntry, setTraceEntry] = useState(null);

  // Fetch journal data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [journalRes] = await Promise.allSettled([
        fetch(`${API_URL}/admin/accounting/journal?limit=200`, { headers }).then(r => r.json()),
      ]);
      if (journalRes.status === 'fulfilled' && journalRes.value?.success) {
        const entries = (journalRes.value.data || []).map(e => {
          let source = 'unknown';
          if (e.ledger_entry_id) source = 'ledger';
          else if (e.expense_id) source = 'expense';
          else if (e.journal_id) source = 'manual';
          else if (e.entry_type === 'AUTO_BACKFILL') source = 'backfill';
          return { ...e, source };
        });
        setAllEntries(entries);
      }
    } catch (err) {
      console.error('[JournalExplorer] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Compute stats
  const stats = useMemo(() => {
    const total = allEntries.length;
    const manual = allEntries.filter(e => e.entry_type === 'MANUAL').length;
    const expense = allEntries.filter(e => e.entry_type === 'AUTO_EXPENSE').length;
    const unmatched = allEntries.filter(e => !e.ledger_entry_id && !e.expense_id && !e.journal_id).length;
    return { total, manual, expense, unmatched };
  }, [allEntries]);

  // Apply filters
  const filteredEntries = useMemo(() => {
    let list = [...allEntries];

    // Type tab
    if (activeType !== 'ALL') {
      list = list.filter(e => e.entry_type === activeType);
    }

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(e =>
        e.id?.toLowerCase().includes(q) ||
        e.debit_account?.toLowerCase().includes(q) ||
        e.credit_account?.toLowerCase().includes(q) ||
        e.remarks?.toLowerCase().includes(q) ||
        e.entry_type?.toLowerCase().includes(q) ||
        (e.ledger_entry_id && String(e.ledger_entry_id).includes(q)) ||
        (e.expense_id && e.expense_id.toLowerCase().includes(q)) ||
        (e.journal_id && e.journal_id.toLowerCase().includes(q))
      );
    }

    // Date range
    if (filters.from) list = list.filter(e => new Date(e.created_at) >= new Date(filters.from));
    if (filters.to)   list = list.filter(e => new Date(e.created_at) <= new Date(filters.to));

    // Source type
    if (filters.sourceType) list = list.filter(e => e.source === filters.sourceType);

    // Amount range
    if (filters.amountMin) list = list.filter(e => parseFloat(e.amount) >= parseFloat(filters.amountMin));
    if (filters.amountMax) list = list.filter(e => parseFloat(e.amount) <= parseFloat(filters.amountMax));

    // Account
    if (filters.account) {
      const acc = filters.account.toLowerCase();
      list = list.filter(e =>
        e.debit_account?.toLowerCase().includes(acc) ||
        e.credit_account?.toLowerCase().includes(acc)
      );
    }

    // Reconciliation status
    if (filters.reconciled === 'yes') {
      list = list.filter(e => e.ledger_entry_id || e.expense_id || e.journal_id);
    } else if (filters.reconciled === 'no') {
      list = list.filter(e => !e.ledger_entry_id && !e.expense_id && !e.journal_id);
    }

    return list;
  }, [allEntries, activeType, filters]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach(t => {
      if (t.key === 'ALL') counts[t.key] = allEntries.length;
      else counts[t.key] = allEntries.filter(e => e.entry_type === t.key).length;
    });
    return counts;
  }, [allEntries]);

  const tabsWithCounts = TABS.map(t => ({ ...t, count: tabCounts[t.key] }));

  // Open audit trace
  const handleOpenTrace = (entry) => {
    setSelectedEntry(null);
    // Build trace object (simplified)
    setTraceEntry({
      accountingEntry: entry,
      linkedEntities: {},
      timeline: [{
        type: 'ACCOUNTING_ENTRY',
        id: entry.id,
        amount: parseFloat(entry.amount),
        createdAt: entry.created_at,
      }],
    });
  };

  return (
    <div>
      <JournalToolbar onRefresh={fetchData} />

      <JournalTypeTabs
        tabs={tabsWithCounts}
        active={activeType}
        onChange={setActiveType}
      />

      <JournalFilters filters={filters} onChange={setFilters} />

      <JournalStatsBar stats={stats} />

      <JournalTable
        entries={filteredEntries}
        loading={loading}
        onRowClick={(entry) => setSelectedEntry(entry)}
      />

      {/* Drawers */}
      <JournalEntryDrawer
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
        onOpenTrace={handleOpenTrace}
      />

      <AuditTraceDrawer
        open={!!traceEntry}
        onClose={() => setTraceEntry(null)}
        trace={traceEntry}
      />
    </div>
  );
}