import cards from '../config/ui/cards.config.js'
import { useStyle } from '../hooks/useStyle.js'

export default function WorkerCard({ worker }) {
  const cardStyle = useStyle('homeWorkerCard')
  const iconAreaStyle = useStyle('homeWorkerIconArea')
  const photoStyle = useStyle('homeWorkerPhoto')
  const infoStyle = useStyle('homeWorkerInfo')
  const nameStyle = useStyle('homeWorkerName')
  const roleStyle = useStyle('homeWorkerRole')
  const ratingStyle = useStyle('homeWorkerRating')
  const etaStyle = useStyle('homeWorkerEta')

  return (
    <div style={{
      background: cardStyle.background || 'var(--bg-surface)',
      border: cardStyle.border || '1px solid var(--border)',
      borderRadius: cardStyle.borderRadius || 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: 'pointer',
    }}>
      <div style={{
        height: iconAreaStyle.height || cards.workerCard.iconArea.height,
        background: worker.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {worker.photo ? (
          <img
            src={worker.photo}
            alt={worker.name}
            style={{
              width: photoStyle.width || cards.workerCard.iconArea.photoSize,
              height: photoStyle.height || cards.workerCard.iconArea.photoSize,
              borderRadius: photoStyle.borderRadius || '50%',
              objectFit: 'cover',
              border: photoStyle.border || '2px solid #fff',
            }}
          />
        ) : (
          <div style={{
            width: photoStyle.width || cards.workerCard.iconArea.photoSize,
            height: photoStyle.height || cards.workerCard.iconArea.photoSize,
            borderRadius: photoStyle.borderRadius || '50%',
            background: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: iconAreaStyle.fontSize || cards.workerCard.iconArea.fontSize,
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {worker.name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>

      <div style={{ padding: infoStyle.padding || cards.workerCard.info.padding }}>
        <div style={{
          fontSize: nameStyle.fontSize || cards.workerCard.info.nameSize,
          fontWeight: nameStyle.fontWeight || 600,
          color: 'var(--text-primary)',
          marginBottom: 2,
        }}>
          {worker.name}
        </div>
        <div style={{
          fontSize: roleStyle.fontSize || 'var(--font-body-sm)',
          color: roleStyle.color || 'var(--text-secondary)',
          marginBottom: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)' }} />
          {worker.role}
        </div>
        <div style={{
          fontSize: 'var(--font-body-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 6,
        }}>
          📍 {worker.location} · {worker.distance}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: ratingStyle.fontSize || 'var(--font-body-sm)',
            fontWeight: ratingStyle.fontWeight || 600,
            color: 'var(--text-primary)',
          }}>
            ★ {worker.rating}
          </span>
          <span style={{
            fontSize: etaStyle.fontSize || cards.workerCard.info.etaBadge.fontSize,
            fontWeight: etaStyle.fontWeight || cards.workerCard.info.etaBadge.fontWeight,
            color: etaStyle.color || 'var(--accent-blue)',
            background: etaStyle.background || 'var(--accent-blue-light)',
            padding: etaStyle.padding || cards.workerCard.info.etaBadge.padding,
            borderRadius: etaStyle.borderRadius || cards.workerCard.info.etaBadge.borderRadius,
          }}>
            {worker.eta}
          </span>
        </div>
      </div>
    </div>
  )
}