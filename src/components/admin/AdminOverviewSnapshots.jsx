import { useAdminAnalytics } from '../../contexts/AdminAnalyticsContext.jsx';
import { useState, useEffect } from 'react';
import { api, API_URL } from '../../services/api.js';

export default function AdminOverviewSnapshots() {
  const { analytics, loading } = useAdminAnalytics();

  if (loading || !analytics) return null;

  const {
    topEarningWorkers,
    topRatedWorkers,
    cancellationStats,
    recentLowRatings,
  } = analytics;

  return (
    <div>
      {/* Top Earning Workers */}
      {topEarningWorkers?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="Top Earning Workers" />
          {topEarningWorkers.map((w, i) => (
            <ListRow
              key={w.id}
              rank={i + 1}
              left={w.name}
              right={`Rs ${parseFloat(w.total_earned).toLocaleString()}`}
              sub={`${w.completed_jobs} jobs`}
            />
          ))}
        </div>
      )}

      {/* Top Rated Workers */}
      {topRatedWorkers?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="Top Rated Workers" />
          {topRatedWorkers.map((w, i) => (
            <ListRow
              key={w.id}
              rank={i + 1}
              left={w.name}
              right={`★ ${parseFloat(w.avg_rating).toFixed(1)}`}
              sub={`${w.review_count} reviews`}
            />
          ))}
        </div>
      )}

      {/* Recent Low Ratings */}
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

      {/* Cancellation Stats */}
      {cancellationStats?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="Cancellation Snapshot" />
          {cancellationStats.map((c, i) => (
            <ListRow
              key={i}
              left={c.cancelled_by_role === 'customer' ? 'By Customer' : 'By Worker'}
              right={c.count}
            />
          ))}
        </div>
      )}

      {/* Flagged Workers + Top Performers (Trust-Based) */}
      <PerformanceSections />
    </div>
  );
}

// ── Reusable helpers (duplicated to keep file self‑contained) ──
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

// ── Performance Sections (Flagged Workers + Top Performers) ──
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
        // Silent
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