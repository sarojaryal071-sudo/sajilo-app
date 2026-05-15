import { useState, useEffect } from 'react';
import { api, API_URL } from '../../services/api.js';

export default function AdminFinancial() {
  const [overview, setOverview] = useState(null);
  const [workerDues, setWorkerDues] = useState(null);
  const [settleModal, setSettleModal] = useState(null);
  const [settleForm, setSettleForm] = useState({ amount: '', method: 'cash', note: '' });
  const [settleMsg, setSettleMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFinancials() {
      try {
        const [overviewRes, duesRes] = await Promise.all([
          api.getFinancialOverview(),
          api.getWorkerDueList(),
        ]);
        if (overviewRes?.success) setOverview(overviewRes.data);
        if (duesRes?.success) setWorkerDues(duesRes.data);
      } catch (e) {
        // Silent
      } finally {
        setLoading(false);
      }
    }
    fetchFinancials();
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
      Loading financial data...
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-heading)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
        Financial Operations
      </h2>

      {/* Overview Cards */}
      {overview && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 10,
          marginBottom: 20,
        }}>
          <StatCard label="Total Invoiced" value={`Rs ${(overview.totalInvoiced || 0).toLocaleString()}`} />
          <StatCard label="Total Collected" value={`Rs ${(overview.totalCollected || 0).toLocaleString()}`} />
          <StatCard label="Platform Commission" value={`Rs ${(overview.totalCommission || 0).toLocaleString()}`} />
          <StatCard label="Outstanding Dues" value={`Rs ${(overview.outstandingCommission || 0).toLocaleString()}`} />
          <StatCard label="Total Settled" value={`Rs ${(overview.totalSettled || 0).toLocaleString()}`} />
        </div>
      )}

      {/* Worker Due List */}
      {workerDues && workerDues.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="Worker Commission Dues" />
          {workerDues.slice(0, 10).map((w, i) => (
            <ListRow
              key={w.workerId}
              rank={i + 1}
              left={w.workerName || w.workerClientId}
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Rs {(w.balanceDue || 0).toLocaleString()} due</span>
                  {w.balanceDue > 0 && (
                    <button onClick={() => setSettleModal({ workerId: w.workerId, workerName: w.workerName || w.workerClientId })} style={{
                      padding: '2px 8px', borderRadius: 4, border: '1px solid var(--accent-green)',
                      background: 'transparent', color: 'var(--accent-green)', fontSize: 10, fontWeight: 600, cursor: 'pointer'
                    }}>Settle</button>
                  )}
                </div>
              }
              sub={`Gross: Rs ${(w.grossEarnings || 0).toLocaleString()} · Commission: Rs ${(w.commissionOwed || 0).toLocaleString()} · Paid: Rs ${(w.commissionPaid || 0).toLocaleString()}`}
            />
          ))}
        </div>
      )}

      {workerDues && workerDues.length === 0 && (
        <EmptyRow text="No commission dues recorded yet" />
      )}

      {/* Settlement Modal */}
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
              <button onClick={async () => {
                if (!settleForm.amount || parseFloat(settleForm.amount) <= 0) return setSettleMsg({ type: 'error', text: 'Enter a valid amount' });
                try {
                  const token = localStorage.getItem('sajilo_token');
                  const res = await fetch(`${API_URL}/ledger/settle`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ workerId: settleModal.workerId, amount: settleForm.amount, method: settleForm.method, note: settleForm.note }),
                  }).then(r => r.json());
                  if (res.success) {
                    setSettleMsg({ type: 'success', text: 'Settlement recorded!' });
                    setTimeout(() => { setSettleModal(null); setSettleForm({ amount: '', method: 'cash', note: '' }); setSettleMsg(null); }, 1000);
                    const duesRes = await api.getWorkerDueList();
                    if (duesRes?.success) setWorkerDues(duesRes.data);
                    const overviewRes = await api.getFinancialOverview();
                    if (overviewRes?.success) setOverview(overviewRes.data);
                  } else {
                    setSettleMsg({ type: 'error', text: res.message || 'Failed' });
                  }
                } catch { setSettleMsg({ type: 'error', text: 'Network error' }); }
              }} style={{ flex: 1, padding: 10, borderRadius: 6, border: 'none', background: 'var(--accent-green)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Confirm Settlement
              </button>
              <button onClick={() => { setSettleModal(null); setSettleMsg(null); }} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Payment Operations */}
      <PaymentOperations />
    </div>
  );
}

// ── Reusable components (self‑contained) ──
function StatCard({ label, value }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: 16,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--font-title)', fontWeight: 800, color: 'var(--accent-blue)' }}>
        {value}
      </div>
    </div>
  );
}

function ListRow({ rank, left, sub, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        {rank && (
          <span style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'var(--accent-blue-light)',
            color: 'var(--accent-blue)', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {rank}
          </span>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {left}
          </div>
          {sub && <div style={{ fontSize: 'var(--font-caption)', color: 'var(--text-secondary)' }}>{sub}</div>}
        </div>
      </div>
      <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)', marginLeft: 12, flexShrink: 0 }}>
        {right}
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3 style={{
      fontSize: 'var(--font-body)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: 8,
      borderBottom: '2px solid var(--accent-blue)',
      paddingBottom: 4,
    }}>
      {title}
    </h3>
  );
}

function EmptyRow({ text }) {
  return (
    <div style={{ padding: '10px 0', color: 'var(--text-secondary)', fontSize: 'var(--font-body-sm)' }}>
      {text}
    </div>
  );
}

// ── Payment Operations (subcomponent) ──
function PaymentOperations() {
  const [providerBreakdown, setProviderBreakdown] = useState(null);
  const [operational, setOperational] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/ledger/analytics/provider-breakdown`, { headers: { Authorization: `Bearer ${localStorage.getItem('sajilo_token')}` } }).then(r => r.json()),
      fetch(`${API_URL}/ledger/analytics/operational-metrics`, { headers: { Authorization: `Bearer ${localStorage.getItem('sajilo_token')}` } }).then(r => r.json()),
    ]).then(([prov, ops]) => {
      if (prov?.success) setProviderBreakdown(prov.data);
      if (ops?.success) setOperational(ops.data);
    }).catch(err => {
      console.error('Payment operations fetch error:', err);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!providerBreakdown && !operational) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <SectionTitle title="Payment Operations" />

      {/* Provider Breakdown */}
      {providerBreakdown && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {providerBreakdown.map(p => (
            <div key={p.provider} style={{
              flex: '1 1 90px', background: 'var(--bg-surface)', borderRadius: 6, padding: '8px 10px',
              border: '1px solid var(--border)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{p.provider}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-blue)' }}>{p.count}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Rs {parseInt(p.total).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Operational Metrics */}
      {operational && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 90px', background: 'var(--bg-surface)', borderRadius: 6, padding: '8px 10px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Pending</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-orange)' }}>{operational.pendingConfirmations}</div>
          </div>
          <div style={{ flex: '1 1 90px', background: 'var(--bg-surface)', borderRadius: 6, padding: '8px 10px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Overdue</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-red)' }}>{operational.overdueConfirmations}</div>
          </div>
        </div>
      )}
    </div>
  );
}