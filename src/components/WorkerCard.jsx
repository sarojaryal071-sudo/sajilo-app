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

  // Helpers
  const primaryProfession = worker.primary_skill || worker.role || 'General Service'
  const secondaryList = (worker.secondary_roles || []).filter(r => r !== primaryProfession)
  const allProfessions = [primaryProfession, ...secondaryList].join(', ')
  const priceRange = worker.hourly_rate
    ? `Rs ${worker.hourly_rate}/hr`
    : 'Rate not set'
  const isOnline = worker.is_online ?? false

  return (
    <div style={{
      background: cardStyle.background || 'var(--bg-surface)',
      border: cardStyle.border || '1px solid var(--border)',
      borderRadius: cardStyle.borderRadius || 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: 'pointer',
    }}>
      {/* Photo / Avatar */}
      <div style={{
        height: iconAreaStyle.height || cards.workerCard.iconArea.height,
        background: worker.bg || 'var(--accent-blue-light)',
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

      {/* Info section */}
      <div style={{ padding: infoStyle.padding || cards.workerCard.info.padding }}>
        {/* Name + online dot */}
        <div style={{
          fontSize: nameStyle.fontSize || cards.workerCard.info.nameSize,
          fontWeight: nameStyle.fontWeight || 600,
          color: 'var(--text-primary)',
          marginBottom: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {worker.name}
          {isOnline && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)' }} />
          )}
        </div>

        {/* Worker ID */}
        <div style={{
          fontSize: 'var(--font-body-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 2,
          fontWeight: 500,
        }}>
          {worker.client_id || ''}
        </div>

        {/* Professions */}
        <div style={{
          fontSize: roleStyle.fontSize || 'var(--font-body-sm)',
          color: roleStyle.color || 'var(--text-secondary)',
          marginBottom: 2,
        }}>
          {allProfessions}
        </div>

        {/* Location + Distance placeholder (GPS later) */}
        <div style={{
          fontSize: 'var(--font-body-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 6,
        }}>
          📍 {worker.service_area || '—'} · {worker.distance || '—'}
        </div>

        {/* Price & Rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: ratingStyle.fontSize || 'var(--font-body-sm)',
            fontWeight: ratingStyle.fontWeight || 600,
            color: 'var(--text-primary)',
          }}>
            ⭐ {worker.rating || '—'}
          </span>
          <span style={{
            fontSize: etaStyle.fontSize || cards.workerCard.info.etaBadge.fontSize,
            fontWeight: etaStyle.fontWeight || cards.workerCard.info.etaBadge.fontWeight,
            color: etaStyle.color || 'var(--accent-blue)',
            background: etaStyle.background || 'var(--accent-blue-light)',
            padding: etaStyle.padding || cards.workerCard.info.etaBadge.padding,
            borderRadius: etaStyle.borderRadius || cards.workerCard.info.etaBadge.borderRadius,
          }}>
            {priceRange}
          </span>
        </div>
      </div>
    </div>
  )
}