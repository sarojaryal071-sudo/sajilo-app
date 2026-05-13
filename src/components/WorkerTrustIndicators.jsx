import useWorkerUnifiedProfile from '../hooks/workers/useWorkerUnifiedProfile.js';

/**
 * WorkerTrustIndicators
 * Phase 15E — Migrated to unified worker profile.
 * 
 * Displays: completion rate, trust badges, review confidence.
 * Data source: useWorkerUnifiedProfile(workerId) → worker.stats + worker.performance.
 * Gracefully hides if no meaningful data.
 */
export default function WorkerTrustIndicators({ workerId }) {
  const { worker, loading } = useWorkerUnifiedProfile(workerId);

  if (loading || !worker || !worker.stats) return null;

  const { stats, performance } = worker;

  // Only render if there's meaningful data
  const hasCompletionRate = stats.completionRate !== undefined && stats.completedJobs >= 5;
  const hasBadges = performance?.badges && performance.badges.length > 0;
  const hasReviews = stats.reviewCount >= 3;

  if (!hasCompletionRate && !hasBadges && !hasReviews) return null;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8,
      marginBottom: 4,
    }}>
      {/* Completion Rate Pill */}
      {hasCompletionRate && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 12,
          background: stats.completionRate >= 90 ? '#ECFDF5' : '#FFFBEB',
          color: stats.completionRate >= 90 ? '#059669' : '#D97706',
          fontSize: 11,
          fontWeight: 600,
          lineHeight: '16px',
        }}>
          <span style={{ fontSize: 12 }}>{stats.completionRate >= 90 ? '✓' : '○'}</span>
          {stats.completionRate}% completion
        </span>
      )}

      {/* Review Confidence Pill */}
      {hasReviews && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 12,
          background: '#FFFBEB',
          color: '#D97706',
          fontSize: 11,
          fontWeight: 600,
          lineHeight: '16px',
        }}>
          ⭐ {stats.averageRating}
          <span style={{ fontWeight: 400, opacity: 0.8 }}>
            ({stats.reviewCount})
          </span>
        </span>
      )}

      {/* Trust Tier Badge */}
      {performance?.reliabilityLabel && stats.completedJobs >= 5 && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 12,
          background: `${getTierColor(performance.reliabilityLabel)}18`,
          color: getTierColor(performance.reliabilityLabel),
          border: `1px solid ${getTierColor(performance.reliabilityLabel)}40`,
          fontSize: 11,
          fontWeight: 600,
          lineHeight: '16px',
        }}>
          {performance.reliabilityLabel}
        </span>
      )}

      {/* Earned Badges (max 2 to keep compact) */}
      {hasBadges && performance.badges.slice(0, 2).map(badge => (
        <span key={badge.id} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          padding: '3px 8px',
          borderRadius: 12,
          background: `${badge.color}18`,
          color: badge.color,
          border: `1px solid ${badge.color}40`,
          fontSize: 10,
          fontWeight: 600,
          lineHeight: '16px',
        }}>
          {badge.label}
        </span>
      ))}
    </div>
  );
}

/** Map reliability label to color */
function getTierColor(label) {
  switch (label) {
    case 'Excellent': return '#10B981';
    case 'Good': return '#3B82F6';
    case 'Fair': return '#F59E0B';
    default: return '#EF4444';
  }
}