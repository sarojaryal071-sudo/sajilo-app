// src/screens/worker/WorkerSchedule.jsx
import { useState, useEffect } from 'react';
import { useWorker } from '../../contexts/WorkerContext.jsx';
import ElementRenderer from '../../components/ElementRenderer.jsx';
import { api } from '../../services/api.js';

export default function WorkerSchedule() {
  const { schedule, services, saveSchedule, saveServices } = useWorker();
  const [workerServices, setWorkerServices] = useState([]);   // catalogue from GET /workers/me/services

  // Fetch the worker's service catalogue (admin-defined + custom)
  useEffect(() => {
    api.getMyServices()
      .then(res => setWorkerServices(res?.data?.professions || []))
      .catch(err => console.error('Failed to fetch worker services:', err));
  }, []);

  return (
    <div>
      <ElementRenderer
        elementId="scheduleSubtabs"
        overrideData={{
          schedule: schedule || [],
          services: services || [],
          onSaveSchedule: saveSchedule,
          onSaveServices: saveServices,
          workerServices,                // catalogue for the Services tab
        }}
      />
    </div>
  );
}