import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import { SectionTitle, ListRow, EmptyRow } from '../FinanceComponents';
import { FinanceStatusPill, FinanceSectionCard } from '../../../../components/admin/finance/index.js';
import { JournalEntryDrawer, ReconciliationDetailDrawer } from '../../../../components/admin/finance/drilldown/index.js';
import { JournalExplorer } from '../journal/index.js';


export default function FinanceAccountingTab() {
  const token = localStorage.getItem('sajilo_token');
  const headers = { Authorization: `Bearer ${token}` };

  const [recon, setRecon] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState(null);
  const [selectedReconItem, setSelectedReconItem] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [reconRes, journalRes, ledgerRes] = await Promise.allSettled([
          fetch(`${API_URL}/admin/accounting/reconciliation/report`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/admin/accounting/journal?limit=10`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/ledger/timeline?limit=10`, { headers }).then(r => r.json()),
        ]);

        if (reconRes.status === 'fulfilled' && reconRes.value?.success) {
          setRecon(reconRes.value.data);
        }
        if (journalRes.status === 'fulfilled' && journalRes.value?.success) {
          setJournalEntries(journalRes.value.data || []);
        }
        if (ledgerRes.status === 'fulfilled' && ledgerRes.value?.success) {
          setLedgerEntries(ledgerRes.value.data || []);
        }
      } catch (e) {
        setError('Failed to load accounting data');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading accounting data...</div>;
  }

  return (
    <div>
      {error && (
        <div style={{ marginBottom: 16, padding: 12, background: 'var(--accent-red-light)', borderRadius: 6, color: 'var(--accent-red)', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* ── Reconciliation Health ── */}
      <SectionTitle title="Reconciliation Health" />
      {recon ? (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <FinanceSectionCard
              title="Missing Entries"
              subtitle={`${recon.missing?.length ?? 0} missing`}
            >
              <FinanceStatusPill
                status={recon.missing?.length === 0 ? 'healthy' : 'critical'}
                label={recon.missing?.length === 0 ? 'Clean' : 'Action needed'}
              />
            </FinanceSectionCard>
            <FinanceSectionCard
              title="Mismatched Entries"
              subtitle={`${recon.mismatched?.length ?? 0} mismatched`}
            >
              <FinanceStatusPill
                status={recon.mismatched?.length === 0 ? 'healthy' : 'critical'}
                label={recon.mismatched?.length === 0 ? 'Clean' : 'Action needed'}
              />
            </FinanceSectionCard>
          </div>

          {/* Detailed lists */}
          {recon.missing?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                Missing Accounting Entries
              </div>
              {recon.missing.slice(0, 10).map(item => (
                <div
                  key={`missing-${item.ledger_id}`}
                  onClick={() => setSelectedReconItem({ ...item, type: 'missing' })}
                  style={{ cursor: 'pointer', padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)' }}
                >
                  Ledger #{item.ledger_id} — {item.event_type} — Rs {parseFloat(item.amount).toLocaleString()}
                </div>
              ))}
            </div>
          )}

          {recon.mismatched?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                Mismatched Amounts
              </div>
              {recon.mismatched.slice(0, 10).map(item => (
                <div
                  key={`mismatch-${item.ledger_id}`}
                  onClick={() => setSelectedReconItem({ ...item, type: 'mismatched' })}
                  style={{ cursor: 'pointer', padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)' }}
                >
                  Ledger #{item.ledger_id} — Ledger: Rs {parseFloat(item.ledger_amount).toLocaleString()} / Accounting: Rs {parseFloat(item.accounting_amount).toLocaleString()}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmptyRow text="Reconciliation status unavailable." />
      )}

      {/* ── Recent Manual Journal Entries ── */}
      <SectionTitle title="Recent Manual Journal Entries" />
      {journalEntries.length > 0 ? (
        journalEntries.slice(0, 5).map(entry => (
          <div
            key={entry.id}
            onClick={() => setSelectedJournalEntry(entry)}
            style={{ cursor: 'pointer' }}
          >
            <ListRow
              left={`${entry.debit_account} → ${entry.credit_account}`}
              right={`Rs ${parseFloat(entry.amount).toLocaleString()}`}
              sub={entry.remarks || entry.reference_type}
            />
          </div>
        ))
      ) : (
        <EmptyRow text="No manual journal entries yet." />
      )}

            {/* ── Recent Ledger Activity ── */}
      <SectionTitle title="Recent Ledger Activity" />
      {ledgerEntries.length > 0 ? (
        ledgerEntries.slice(0, 5).map(entry => (
          <ListRow
            key={entry.id}
            left={`${entry.event_type} #${entry.id}`}
            right={`Rs ${parseFloat(entry.amount).toLocaleString()}`}
            sub={`Worker: ${entry.worker_name || 'N/A'} · ${new Date(entry.created_at).toLocaleDateString()}`}
          />
        ))
      ) : (
        <EmptyRow text="Ledger timeline not available or empty." />
      )}

      {/* ── Journal Entry Drawer ── */}
      <JournalEntryDrawer
        open={!!selectedJournalEntry}
        onClose={() => setSelectedJournalEntry(null)}
        entry={selectedJournalEntry}
      />

      {/* ── Reconciliation Detail Drawer ── */}
      <ReconciliationDetailDrawer
        open={!!selectedReconItem}
        onClose={() => setSelectedReconItem(null)}
        item={selectedReconItem}
      />

      {/* ── Full Journal Explorer ── */}
      <div style={{ marginTop: 24 }}>
        <JournalExplorer />
      </div>
    </div>
  );
}
