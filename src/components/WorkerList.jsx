import { useContent } from '../hooks/useContent.js'
import WorkerCard from './WorkerCard.jsx'

export default function WorkerList({ workers, navigate }) {
  const noWorkers = useContent('home.noWorkers')

  if (!workers || workers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>👷</div>
        <p>{noWorkers}</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {workers.map(worker => (
        <div key={worker.id} onClick={() => navigate(`/detail/${worker.id}`)} style={{ cursor: 'pointer' }}>
          <WorkerCard worker={worker} />
        </div>
      ))}
    </div>
  )
}