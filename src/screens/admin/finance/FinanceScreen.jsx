import { useState, useEffect } from 'react';
import { api, API_URL } from '../../../services/api.js';
import FinanceOverviewTab from './tabs/FinanceOverviewTab';
import FinanceAccountingTab from './tabs/FinanceAccountingTab';
import FinanceReportsTab from './tabs/FinanceReportsTab';
import FinanceSettlementsTab from './tabs/FinanceSettlementsTab';
import FinanceOperationsTab from './tabs/FinanceOperationsTab';
import ExpensesTab from './expenses/ExpensesTab';
import { FinanceControlCenterTab } from './controlCenter/index.js';
import { FinanceTabBar } from '../../../components/admin/finance/index.js';


const TABS = [
  { key: 'overview',     label: 'Overview' },
  { key: 'accounting',   label: 'Accounting' },
  { key: 'reports',      label: 'Reports' },
  { key: 'settlements',  label: 'Settlements' },
  { key: 'operations',   label: 'Operations' },
  { key: 'expenses',     label: 'Expenses' },
  { key: 'control',      label: 'Control Center' },
];

export default function FinanceScreen() {
  const [activeTab, setActiveTab] = useState('overview');

  // ── Data state (same as before) ──
  const [overview, setOverview] = useState(null);
  const [workerDues, setWorkerDues] = useState(null);
  const [providerBreakdown, setProviderBreakdown] = useState(null);
  const [operationalMetrics, setOperationalMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Settlement modal state ──
  const [settleModal, setSettleModal] = useState(null);
  const [settleForm, setSettleForm] = useState({ amount: '', method: 'cash', note: '' });
  const [settleMsg, setSettleMsg] = useState(null);

  // ── Fetch all data on mount ──
  useEffect(() => {
    async function fetchAll() {
      try {
        const [overviewRes, duesRes] = await Promise.all([
          api.getFinancialOverview(),
          api.getWorkerDueList(),
        ]);
        if (overviewRes?.success) setOverview(overviewRes.data);
        if (duesRes?.success) setWorkerDues(duesRes.data);
      } catch (e) {
        // silent
      }

      try {
        const [provRes, opsRes] = await Promise.all([
          fetch(`${API_URL}/ledger/analytics/provider-breakdown`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('sajilo_token')}` }
          }).then(r => r.json()),
          fetch(`${API_URL}/ledger/analytics/operational-metrics`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('sajilo_token')}` }
          }).then(r => r.json()),
        ]);
        if (provRes?.success) setProviderBreakdown(provRes.data);
        if (opsRes?.success) setOperationalMetrics(opsRes.data);
      } catch (e) {
        // silent
      }

      setLoading(false);
    }
    fetchAll();
  }, []);

  // ── Settlement handler ──
  const handleSettle = async () => {
    if (!settleForm.amount || parseFloat(settleForm.amount) <= 0) {
      return setSettleMsg({ type: 'error', text: 'Enter a valid amount' });
    }
    try {
      const token = localStorage.getItem('sajilo_token');
      const res = await fetch(`${API_URL}/ledger/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          workerId: settleModal.workerId,
          amount: settleForm.amount,
          method: settleForm.method,
          note: settleForm.note,
        }),
      }).then(r => r.json());

      if (res.success) {
        setSettleMsg({ type: 'success', text: 'Settlement recorded!' });
        setTimeout(() => {
          setSettleModal(null);
          setSettleForm({ amount: '', method: 'cash', note: '' });
          setSettleMsg(null);
        }, 1000);
        // Refresh data
        const [duesRes, overviewRes] = await Promise.all([
          api.getWorkerDueList(),
          api.getFinancialOverview(),
        ]);
        if (duesRes?.success) setWorkerDues(duesRes.data);
        if (overviewRes?.success) setOverview(overviewRes.data);
      } else {
        setSettleMsg({ type: 'error', text: res.message || 'Failed' });
      }
    } catch {
      setSettleMsg({ type: 'error', text: 'Network error' });
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        Loading financial data...
      </div>
    );
  }

  // ── Render ──
  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
        Finance
      </h2>

      {/* Tab bar */}
      <FinanceTabBar
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab content */}
      {activeTab === 'overview' && <FinanceOverviewTab overview={overview} />}
      {activeTab === 'accounting' && <FinanceAccountingTab />}
      {activeTab === 'reports' && <FinanceReportsTab />}
      {activeTab === 'settlements' && (
        <FinanceSettlementsTab
          workerDues={workerDues}
          onSettle={(data) => setSettleModal(data)}
        />
      )}
      {activeTab === 'operations' && (
        <FinanceOperationsTab
          providerBreakdown={providerBreakdown}
          operationalMetrics={operationalMetrics}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpensesTab />
      )}

      {activeTab === 'control' && (
        <FinanceControlCenterTab />
      )}

      {/* ── Settlement Modal ── */}
      {settleModal && (
        <>
          <div onClick={() => setSettleModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 9998 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 400, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 24, zIndex: 9999, boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Record Settlement — {settleModal.workerName}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Amount (Rs)</label>
                <input type="number" value={settleForm.amount} onChange={e => setSettleForm(f => ({ ...f, amount: e.target.value }))}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Method</label>
                <select value={settleForm.method} onChange={e => setSettleForm(f => ({ ...f, method: e.target.value }))}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13 }}>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="esewa">eSewa</option>
                  <option value="khalti">Khalti</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Note (optional)</label>
                <input value={settleForm.note} onChange={e => setSettleForm(f => ({ ...f, note: e.target.value }))}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface2)', color: 'var(--text-primary)', fontSize: 13 }} />
              </div>
            </div>
            {settleMsg && <div style={{ marginTop: 8, fontSize: 12, color: settleMsg.type === 'success' ? '#059669' : '#DC2626' }}>{settleMsg.text}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={handleSettle} style={{ flex: 1, padding: 10, borderRadius: 6, border: 'none', background: 'var(--accent-green)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Confirm Settlement
              </button>
              <button onClick={() => { setSettleModal(null); setSettleMsg(null); }} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}