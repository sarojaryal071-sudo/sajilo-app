import useWorkerUnifiedProfile from '../hooks/workers/useWorkerUnifiedProfile.js';

/**
 * WorkerPerformanceCard
 * Phase 15E — Migrated to unified worker profile.
 * 
 * Shows worker their own trust score, tier, badges, and metrics.
 * Data source: useWorkerUnifiedProfile() → worker.performance + worker.stats.
 */
export default function WorkerPerformanceCard() {
  const { worker, loading } = useWorkerUnifiedProfile();

  if (loading || !worker) return null;

  const { stats, performance } = worker;
  
  // Don't show card if no meaningful data
  if (!stats || stats.completedJobs === 0) return null;

  const trustScore = performance?.trustScore || 0;
  const trustTier = getTrustTier(trustScore);

  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      marginBottom: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      border: '1px solid var(--border)',
    }}>
      {/* Header Row: Trust Score + Tier */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
          📊 Your Performance
        </div>
        {performance?.reliabilityLabel && (
          <span style={{
            padding: '3px 10px',
            borderRadius: 12,
            background: `${trustTier.color}18`,
            color: trustTier.color,
            fontSize: 12,
            fontWeight: 700,
            border: `1px solid ${trustTier.color}40`,
          }}>
            {performance.reliabilityLabel}
          </span>
        )}
      </div>

      {/* Trust Score Bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
            Trust Score
          </span>
          <span style={{
            fontSize: 13,
            fontWeight: 800,
            color: trustTier.color,
          }}>
            {trustScore}/100
          </span>
        </div>
        <div style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          background: 'var(--bg-surface2)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${trustScore}%`,
            height: '100%',
            borderRadius: 3,
            background: trustTier.color,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        <MetricPill
          label="Completion"
          value={`${stats.completionRate}%`}
          color={stats.completionRate >= 90 ? '#059669' : stats.completionRate >= 70 ? '#D97706' : '#EF4444'}
        />
        <MetricPill
          label="Cancellation"
          value={`${stats.cancellationRate}%`}
          color={stats.cancellationRate <= 5 ? '#059669' : stats.cancellationRate <= 15 ? '#D97706' : '#EF4444'}
        />
        <MetricPill
          label="Rating"
          value={stats.reviewCount > 0 ? `⭐ ${stats.averageRating}` : '—'}
          color={parseFloat(stats.averageRating) >= 4.5 ? '#059669' : parseFloat(stats.averageRating) >= 3.5 ? '#D97706' : '#6B7280'}
        />
        <MetricPill
          label="Jobs Done"
          value={stats.completedJobs}
          color="#3B82F6"
        />
      </div>

      {/* Earned Badges */}
      {performance?.badges && performance.badges.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid var(--border)',
        }}>
          {performance.badges.map(badge => (
            <span key={badge.id} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 16,
              background: `${badge.color}15`,
              color: badge.color,
              border: `1px solid ${badge.color}35`,
              fontSize: 11,
              fontWeight: 600,
              lineHeight: '16px',
            }}>
              {badge.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Determine trust tier from score (matches registry) */
function getTrustTier(score) {
  if (score >= 85) return { color: '#10B981', label: 'Excellent' };
  if (score >= 70) return { color: '#3B82F6', label: 'Good' };
  if (score >= 50) return { color: '#F59E0B', label: 'Fair' };
  return { color: '#EF4444', label: 'Poor' };
}

/** Small metric pill for the stats row */
function MetricPill({ label, value, color }) {
  return (
    <div style={{
      flex: '1 1 auto',
      minWidth: 60,
      textAlign: 'center',
      padding: '6px 8px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-surface2)',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  );
}