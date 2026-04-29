import cards from '../config/ui/cards.config.js'

export default function ServiceCard({ service, t }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: cards.serviceCard.padding,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
    }}>
      <div style={{
        width: cards.serviceCard.iconContainer.width,
        height: cards.serviceCard.iconContainer.height,
        borderRadius: cards.serviceCard.iconContainer.borderRadius, 
        background: service.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: cards.serviceCard.iconContainer.fontSize,
      }}>
        {service.icon}
      </div>
      <span style={{ fontSize: cards.serviceCard.label.fontSize,
fontWeight: cards.serviceCard.label.fontWeight, color: 'var(--text-primary)', textAlign: 'center' }}>
        {t[service.id] || service.name}
      </span>
    </div>
  )
}