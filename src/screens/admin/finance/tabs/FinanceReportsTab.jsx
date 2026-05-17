import { useState, useEffect } from 'react';
import { API_URL } from '../../../../services/api.js';
import { SectionTitle, EmptyRow } from '../FinanceComponents';
import { FinanceSubTabBar, FinanceDataTable, FinanceSectionCard } from '../../../../components/admin/finance/index.js';
import { JournalEntryDrawer } from '../../../../components/admin/finance/drilldown/index.js';

const REPORTS = [
  { key: 'trial-balance',    label: 'Trial Balance' },
  { key: 'profit-loss',      label: 'Profit & Loss' },
  { key: 'balance-sheet',    label: 'Balance Sheet' },
  { key: 'cash-flow',        label: 'Cash Flow' },
  { key: 'worker-earnings',  label: 'Worker Earnings' },
  { key: 'platform-revenue', label: 'Revenue' },
];

export default function FinanceReportsTab() {
  const [activeReport, setActiveReport] = useState('trial-balance');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReportEntry, setSelectedReportEntry] = useState(null);

  const token = localStorage.getItem('sajilo_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    setData(null);
    setError(null);
    setLoading(true);

    const endpointMap = {
      'trial-balance':    '/admin/finance/trial-balance',
      'profit-loss':      '/admin/finance/profit-loss',
      'balance-sheet':    '/admin/finance/balance-sheet',
      'cash-flow':        '/admin/finance/cash-flow?from=2025-01-01&to=2026-12-31',
      'worker-earnings':  '/admin/finance/worker-earnings',
      'platform-revenue': '/admin/finance/platform-revenue',
    };

    fetch(`${API_URL}${endpointMap[activeReport]}`, { headers })
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load report');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [activeReport]);

  return (
    <div>
      <SectionTitle title="Financial Reports" />

      {/* Report sub-tab bar */}
      <FinanceSubTabBar
        tabs={REPORTS}
        activeTab={activeReport}
        onChange={setActiveReport}
      />

      {/* Actions area (future: date pickers, export) */}
      <div style={{ marginBottom: 16, minHeight: 20 }}></div>

      {/* Report body */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-secondary)' }}>
          Loading report...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: 30, color: 'var(--accent-red)' }}>
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div>
          {activeReport === 'trial-balance' && (
            <TrialBalanceView
              data={data}
              onRowClick={(row) => {
                setSelectedReportEntry({
                  id: row.account_code,
                  debit_account: row.account_code,
                  credit_account: 'Various',
                  amount: row.balance,
                  entry_type: 'Trial Balance',
                  created_at: new Date().toISOString(),
                  reference_type: 'Trial Balance',
                  remarks: `Balance: ${row.balance} (Debit: ${row.debit_total}, Credit: ${row.credit_total})`,
                });
              }}
            />
          )}
          {activeReport === 'profit-loss' && <ProfitLossView data={data} />}
          {activeReport === 'balance-sheet' && <BalanceSheetView data={data} />}
          {activeReport === 'cash-flow' && <CashFlowView data={data} />}
          {activeReport === 'worker-earnings' && (
            <WorkerEarningsView
              data={data}
              onRowClick={(row) => {
                setSelectedReportEntry({
                  id: row.worker_id || row.worker_name,
                  debit_account: 'WORKER_PAYABLE',
                  credit_account: 'CASH',
                  amount: parseFloat(row.total_earned || 0),
                  entry_type: 'Worker Earnings',
                  created_at: new Date().toISOString(),
                  reference_type: 'Worker Earnings',
                  remarks: `Worker: ${row.worker_name || 'Unknown'} — Total Earned: Rs ${parseFloat(row.total_earned || 0).toLocaleString()}`,
                });
              }}
            />
          )}
          {activeReport === 'platform-revenue' && <RevenueView data={data} />}
        </div>
      )}

      {/* ── Report Drill‑Down Drawer ── */}
      <JournalEntryDrawer
        open={!!selectedReportEntry}
        onClose={() => setSelectedReportEntry(null)}
        entry={selectedReportEntry}
      />
    </div>
  );
}

// ── Report view components ──

function TrialBalanceView({ data, onRowClick }) {
  const { accounts = [], totals = { debit: 0, credit: 0, balanced: false }, period = '—' } = data || {};

  const columns = [
    { key: 'account_code', label: 'Account' },
    { key: 'debit_total', label: 'Debit', render: (val) => val.toLocaleString() },
    { key: 'credit_total', label: 'Credit', render: (val) => val.toLocaleString() },
    {
      key: 'balance',
      label: 'Balance',
      render: (val, row) => (
        <span style={{ color: row.balance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {row.balance.toLocaleString()}
        </span>
      ),
    },
    // ---- NEW: Trace column ----
    {
      key: 'trace',
      label: '',
      render: (_, row) => (
        <span
          style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontSize: 12 }}
          onClick={(e) => {
            e.stopPropagation();
            // Future: navigate to journal explorer filtered by this account
            console.log('Trace account:', row.account_code);
          }}
        >
          🔍 Trace
        </span>
      ),
    },
  ];

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
        Period: {period} &nbsp;|&nbsp; Debits: Rs {totals.debit.toLocaleString()} &nbsp;|&nbsp; Credits: Rs {totals.credit.toLocaleString()} &nbsp;|&nbsp;
        <span style={{ color: totals.balanced ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
          {totals.balanced ? 'Balanced' : 'Unbalanced'}
        </span>
      </p>
      <FinanceDataTable
        columns={columns}
        rows={accounts}
        emptyMessage="No trial balance data"
        onRowClick={onRowClick}
      />
    </div>
  );
}

function ProfitLossView({ data }) {
  const { revenue = 0, expenses = 0, profit = 0 } = data || {};
  return (
    <FinanceSectionCard title="Profit & Loss Statement">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <StatBox label="Revenue" value={`Rs ${revenue.toLocaleString()}`} color="var(--accent-green)" />
        <StatBox label="Expenses" value={`Rs ${expenses.toLocaleString()}`} color="var(--accent-red)" />
        <StatBox label="Net Profit" value={`Rs ${profit.toLocaleString()}`} color={profit >= 0 ? 'var(--accent-blue)' : 'var(--accent-red)'} />
      </div>
    </FinanceSectionCard>
  );
}

function BalanceSheetView({ data }) {
  const { assets = [], liabilities = [], equity = [], totalAssets = 0, totalLiabilities = 0, totalEquity = 0, balanced = false, asOf = new Date().toISOString() } = data || {};
  return (
    <FinanceSectionCard title="Balance Sheet">
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>As of: {new Date(asOf).toLocaleString()}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <SectionTitle title="Assets" />
          {assets.map(a => <Row key={a.account_code} label={a.account_code} value={a.balance} />)}
          <Row label="Total Assets" value={totalAssets} bold />
        </div>
        <div>
          <SectionTitle title="Liabilities" />
          {liabilities.map(l => <Row key={l.account_code} label={l.account_code} value={l.balance} />)}
          <Row label="Total Liabilities" value={totalLiabilities} bold />
          <div style={{ marginTop: 12 }}>
            <SectionTitle title="Equity" />
            {equity.map(eq => <Row key={eq.account_code} label={eq.account_code} value={eq.balance} />)}
            <Row label="Total Equity" value={totalEquity} bold />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: balanced ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
            {balanced ? '✓ Balanced' : '⚠ Unbalanced'}
          </div>
        </div>
      </div>
    </FinanceSectionCard>
  );
}

function CashFlowView({ data }) {
  const { netIncome = 0, operatingCashFlow = 0, netCashFlow = 0, adjustments = { changeInReceivables: 0, changeInPayables: 0 }, period = '—' } = data || {};
  return (
    <FinanceSectionCard title="Cash Flow">
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>Period: {period}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatBox label="Net Income" value={`Rs ${netIncome.toLocaleString()}`} />
        <StatBox label="Operating Cash Flow" value={`Rs ${operatingCashFlow.toLocaleString()}`} color={operatingCashFlow >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'} />
        <StatBox label="Net Cash Flow" value={`Rs ${netCashFlow.toLocaleString()}`} color={netCashFlow >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        Adjustments: Change in Receivables Rs {adjustments.changeInReceivables.toLocaleString()} | Change in Payables Rs {adjustments.changeInPayables.toLocaleString()}
      </p>
    </FinanceSectionCard>
  );
}

function WorkerEarningsView({ data, onRowClick }) {
  const rows = Array.isArray(data) ? data : [];
  const columns = [
    { key: 'worker_name', label: 'Worker', render: (val) => val || 'Unknown' },
    { key: 'total_earned', label: 'Total Earned', render: (val) => `Rs ${parseFloat(val || 0).toLocaleString()}` },
  ];
  return (
    <FinanceDataTable
      columns={columns}
      rows={rows}
      emptyMessage="No worker earnings data yet."
      onRowClick={onRowClick}
    />
  );
}

function RevenueView({ data }) {
  const { totalRevenue = 0, commission = 0, refunds = 0, netIncome = 0 } = data || {};
  return (
    <FinanceSectionCard title="Platform Revenue">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatBox label="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} />
        <StatBox label="Commission" value={`Rs ${commission.toLocaleString()}`} />
        <StatBox label="Refunds" value={`Rs ${refunds.toLocaleString()}`} color="var(--accent-red)" />
        <StatBox label="Net Income" value={`Rs ${netIncome.toLocaleString()}`} color={netIncome >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'} />
      </div>
    </FinanceSectionCard>
  );
}

// ── Reusable tiny components ──

function StatBox({ label, value, color = 'var(--accent-blue)' }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 'var(--font-title)', fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function Row({ label, value = 0, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: bold ? 600 : 400 }}>{value.toLocaleString()}</span>
    </div>
  );
}