// sajilo-app/src/screens/worker/WorkerEarnings.jsx

/**
 * WORKER EARNINGS SCREEN
 * -----------------------
 * Phase 9: Refactored to use ElementRenderer for all UI elements.
 * Keeps all original logic: earnings display, completed jobs list.
 *
 * Data source: useWorker() → earnings, bookings
 */

import { useWorker } from '../../contexts/WorkerContext.jsx';
import ElementRenderer from '../../components/ElementRenderer.jsx';

export default function WorkerEarnings() {
  const { earnings, bookings, loading } = useWorker();

  // ── Loading State (unchanged) ────────────────────────
  if (loading || !earnings) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    );
  }

  // ── Filter completed jobs (unchanged logic) ──────────
  const completedJobs = bookings.filter(b => b.status === 'completed');

  // ── Render ──────────────────────────────────────────
  return (
    <div>

      {/* 1. Screen Heading: "Earnings" */}
      <ElementRenderer
        elementId="earningsHeading"
        overrideData={{}}
      />

      {/* 2. Earnings Hero Card (gradient total earnings) */}
      <ElementRenderer
        elementId="earningsHeroCard"
        overrideData={{ earnings }}
      />

      {/* 3. Section Heading: "Job History" */}
      <ElementRenderer
        elementId="earningsHistoryHeading"
        overrideData={{}}
      />

      {/* 4. Completed Jobs List (or empty state) */}
      {completedJobs.length === 0 ? (
        <ElementRenderer
          elementId="earningsEmptyState"
          overrideData={{}}
        />
      ) : (
        <ElementRenderer
          elementId="earningsJobItem"
          overrideData={{ bookings: completedJobs }}
        />
      )}

    </div>
  );
}