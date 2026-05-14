// src/components/admin/AdminAnalyticsDashboard.jsx
import { useAdminAnalytics } from '../../contexts/AdminAnalyticsContext.jsx';
import { useState, useEffect } from 'react';
import { api, API_URL } from '../../services/api.js';

export default function AdminAnalyticsDashboard() {
  const { analytics, loading } = useAdminAnalytics();

  if (loading || !analytics) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        Loading analytics...
      </div>
    );
  }

  const {
    totalRevenue,
    pendingRevenue,
    bookingCounts,
    paymentStatusBreakdown,
    paymentMethodDistribution,
    averageInvoiceValue,
    topEarningWorkers,
    topRatedWorkers,
    cancellationStats,
    recentLowRatings,
    workerActivityStats,
    bookingsTrend,
    revenueTrend,
  } = analytics;

  // Derived counts
  const totalBookings = Object.values(bookingCounts || {}).reduce((a, b) => a + b, 0);
  const completedBookings = bookingCounts?.completed || 0;
  const cancelledBookings = bookingCounts?.cancelled || 0;
  const pendingPayments = (paymentStatusBreakdown || []).filter(s => s.status === 'pending_cash' || s.status === 'unpaid').reduce((a, b) => a + b.count, 0);
  const activeWorkers = workerActivityStats?.online || 0;

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Top stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 20,
      }}>
        <StatCard label="Total Revenue" value={`Rs ${(totalRevenue || 0).toLocaleString()}`} />
        <StatCard label="Pending Revenue" value={`Rs ${(pendingRevenue || 0).toLocaleString()}`} />
        <StatCard label="Completed Jobs" value={completedBookings} />
        <StatCard label="Active Workers" value={activeWorkers} />
        <StatCard label="Cancelled" value={cancelledBookings} />
        <StatCard label="Total Bookings" value={totalBookings} />
      </div>

      {/* Ranked lists */}
      <div style={{ marginBottom: 20 }}>
        <SectionTitle title="Top Earning Workers" />
        {topEarningWorkers?.map((w, i) => (
          <ListRow
            key={w.id}
            rank={i + 1}
            left={w.name}
            right={`Rs ${parseFloat(w.total_earned).toLocaleString()}`}
            sub={`${w.completed_jobs} jobs`}
          />
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <SectionTitle title="Top Rated Workers" />
        {topRatedWorkers?.map((w, i) => (
          <ListRow
            key={w.id}
            rank={i + 1}
            left={w.name}
            right={`★ ${parseFloat(w.avg_rating).toFixed(1)}`}
            sub={`${w.review_count} reviews`}
          />
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <SectionTitle title="Recent Low Ratings" />
        {recentLowRatings?.length === 0 ? (
          <EmptyRow text="No low ratings" />
        ) : (
          recentLowRatings?.map(r => (
            <ListRow
              key={r.id}
              left={r.worker_name}
              sub={r.service_name}
              right={`★ ${r.rating}`}
            />
          ))
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <SectionTitle title="Cancellation Stats" />
        {cancellationStats?.map((c, i) => (
          <ListRow
            key={i}
            left={c.cancelled_by_role === 'customer' ? 'By Customer' : 'By Worker'}
            right={c.count}
          />
        ))}
      </div>

      {/* ── Financial Operations ── */}
      <FinancialSections />

      {/* ── Phase 14F: Worker Performance Intelligence ── */}
      <PerformanceSections />
    </div>
  );
}

// ── Reusable stat card ──
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

// ── Reusable dense row ──
function ListRow({ rank, left, sub, right }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        {rank && (
          <span style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'var(--accent-blue-light)',
            color: 'var(--accent-blue)',
            fontSize: 11, fontWeight: 700,
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

// ── Phase: Financial Operations ──

function FinancialSections() {
  const [overview, setOverview] = useState(null);
  const [workerDues, setWorkerDues] = useState(null);
const [settleModal, setSettleModal] = useState(null); // { workerId, workerName }
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
        // Silent – financial section is additive
      } finally {
        setLoading(false);
      }
    }
    fetchFinancials();
  }, []);

  if (loading) return null;
  if (!overview && !workerDues) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <SectionTitle title="💰 Financial" />

      {/* Overview Cards */}
      {overview && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 10,
          marginBottom: 16,
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
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: 'var(--font-body-sm)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            Worker Commission Dues
          </div>
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
              // Refresh data
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

    </div>
  );
}

// ── Phase 14F: Performance Intelligence Sections ──

function PerformanceSections() {
  const [flagged, setFlagged] = useState(null);
  const [topPerformers, setTopPerformers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const [flaggedRes, topRes] = await Promise.all([
          api.getFlaggedWorkers(),
          api.getTopPerformers(),
        ]);
        if (flaggedRes?.success) setFlagged(flaggedRes.data);
        if (topRes?.success) setTopPerformers(topRes.data);
      } catch (e) {
        // Silent — performance sections are additive
      } finally {
        setLoading(false);
      }
    }
    fetchPerformance();
  }, []);

  if (loading) return null;
  if (!flagged && !topPerformers) return null;

  const hasFlaggedData = flagged && (
    flagged.highCancellation?.length > 0 ||
    flagged.lowCompletion?.length > 0 ||
    flagged.lowRated?.length > 0 ||
    flagged.inactive?.length > 0
  );

  return (
    <>
      {hasFlaggedData && (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="⚠️ Flagged Workers" />

          {flagged.highCancellation?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 'var(--font-caption)', fontWeight: 700, color: 'var(--accent-red)', marginBottom: 4 }}>
                High Cancellation ({flagged.highCancellation.length})
              </div>
              {flagged.highCancellation.slice(0, 5).map((w, i) => (
                <ListRow
                  key={`hc-${i}`}
                  left={w.workerName || w.workerId}
                  right={`${w.cancellationRate.rate}%`}
                  sub={`${w.workerClientId || '#' + w.workerId} · ${w.completionRate.rate}% completion`}
                />
              ))}
            </div>
          )}

          {flagged.lowRated?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 'var(--font-caption)', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: 4 }}>
                Low Rated ({flagged.lowRated.length})
              </div>
              {flagged.lowRated.slice(0, 5).map((w, i) => (
                <ListRow
                  key={`lr-${i}`}
                  left={w.workerName || w.workerId}
                  right={`★ ${w.reviewAverage}`}
                  sub={`${w.workerClientId || '#' + w.workerId} · ${w.reviewCount} reviews`}
                />
              ))}
            </div>
          )}

          {flagged.inactive?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 'var(--font-caption)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Inactive ({flagged.inactive.length})
              </div>
              {flagged.inactive.slice(0, 5).map((w, i) => (
                <ListRow
                  key={`ia-${i}`}
                  left={w.workerName || w.workerId}
                  right={`${w.lastActivity.daysSinceLastActivity}d`}
                  sub={`${w.workerClientId || '#' + w.workerId} · Since last activity`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {topPerformers && topPerformers.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="🏆 Top Performers (Trust-Based)" />
                        {topPerformers.slice(0, 10).map((w, i) => (
                <ListRow
                  key={w.workerId}
                  rank={i + 1}
                  left={w.workerName || w.workerId}
                  right={`${w.completionRate.rate}% · ★ ${w.reviewAverage}`}
                  sub={`${w.workerClientId || '#' + w.workerId} · ${w.bookingVolume.totalCompleted} jobs`}
                />
              ))}
        </div>
      )}
    </>
  );
}