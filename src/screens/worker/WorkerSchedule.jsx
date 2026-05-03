// sajilo-app/src/screens/worker/WorkerSchedule.jsx

/**
 * WORKER SCHEDULE SCREEN
 * -----------------------
 * Phase 12: Subtab system with Time Slots + Services.
 * All rendering via ElementRenderer.
 * Data from WorkerContext.
 */

import { useWorker } from '../../contexts/WorkerContext.jsx';
import ElementRenderer from '../../components/ElementRenderer.jsx';

export default function WorkerSchedule() {
  const { schedule, services, saveSchedule, saveServices } = useWorker();

  return (
    <div>
      {/* Subtab Container: renders tab bar + active subtab content */}
      <ElementRenderer
        elementId="scheduleSubtabs"
        overrideData={{
          schedule: schedule || [],
          services: services || [],
          onSaveSchedule: saveSchedule,
          onSaveServices: saveServices,
        }}
      />
    </div>
  );
}