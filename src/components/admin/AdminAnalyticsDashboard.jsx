// src/components/admin/AdminAnalyticsDashboard.jsx
import { useAdminAnalytics } from '../../contexts/AdminAnalyticsContext.jsx';

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