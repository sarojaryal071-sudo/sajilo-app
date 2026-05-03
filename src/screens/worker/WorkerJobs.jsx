// sajilo-app/src/screens/worker/WorkerJobs.jsx

/**
 * WORKER JOBS SCREEN
 * -------------------
 * Phase 6: Refactored to use ElementRenderer for all UI elements.
 * Keeps all original functionality: accept, reject, status updates.
 *
 * Data source: useWorker() → bookings, acceptBooking, rejectBooking, updateBookingStatus
 */

import { useWorker } from '../../contexts/WorkerContext.jsx';
import ElementRenderer from '../../components/ElementRenderer.jsx';

export default function WorkerJobs() {
  const {
    bookings,
    loading,
    acceptBooking,
    rejectBooking,
    updateBookingStatus,
  } = useWorker();


  // ── Loading State (unchanged) ────────────────────────
  if (loading) {
    console.log('WorkerJobs - bookings:', bookings);
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    );
  }

  // ── Action handler (unchanged logic) ──────────────────
  const handleAction = async (id, action) => {
    if (action === 'accept') await acceptBooking(id);
    else if (action === 'reject') await rejectBooking(id);
    else await updateBookingStatus(id, action);
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div>

      {/* 1. Screen Heading */}
      <ElementRenderer
        elementId="jobsHeading"
        overrideData={{}}
      />

      {/* 2. Job Cards List (passes bookings + action handler) */}
      <ElementRenderer
        elementId="jobCard"
        overrideData={{
          bookings: bookings || [],
          onAction: handleAction,
        }}
      />

    </div>
  );
}