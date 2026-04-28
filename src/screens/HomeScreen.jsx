import { services, workers } from '../config/data.js'
import ServiceCard from '../components/ServiceCard.jsx'
import WorkerCard from '../components/WorkerCard.jsx'

export default function HomeScreen({ navigate }) {
  const approvedWorkers = workers.filter(w => w.approved)

  return (
    <div>
      <h2 style={{
        fontSize: 'var(--font-heading)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 6,
      }}>
        Welcome to Sajilo
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: 'var(--font-body)',
        marginBottom: 24,
      }}>
        Find trusted workers near you
      </p>

      <h3 style={{
        fontSize: 'var(--font-title)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 14,
      }}>
        Services
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        marginBottom: 28,
      }}>
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <h3 style={{
        fontSize: 'var(--font-title)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 14,
      }}>
        Nearby Workers
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
      }}>
        {approvedWorkers.map(worker => (
          <div
            key={worker.id}
            onClick={() => navigate('detail', worker.id)}
            style={{ cursor: 'pointer' }}
          >
            <WorkerCard worker={worker} />
          </div>
        ))}
      </div>
    </div>
  )
}