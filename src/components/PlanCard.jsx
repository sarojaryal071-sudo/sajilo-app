import cards from '../config/ui/cards.config.js'

export default function PlanCard({ plan, t }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: plan.popular ? cards.planCard.popularBorder : cards.planCard.normalBorder,
      borderRadius: cards.planCard.borderRadius,
      padding: cards.planCard.padding,
      position: 'relative',
      cursor: 'pointer',
    }}>
      {plan.popular && (
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--accent-blue)', color: '#fff',
          fontSize: cards.planCard.popularBadge.fontSize,
          fontWeight: cards.planCard.popularBadge.fontWeight,
          padding: cards.planCard.popularBadge.padding,
          borderRadius: cards.planCard.popularBadge.borderRadius,
          whiteSpace: 'nowrap',
        }}>
          {t.mostPopular}
        </div>
      )}
      <div style={{ fontSize: 'var(--font-body-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
        {plan.name}
      </div>
      <div style={{
        fontSize: cards.planCard.price.fontSize,
        fontWeight: cards.planCard.price.fontWeight,
        color: 'var(--text-primary)', marginBottom: 14,
      }}>
        {plan.price}<span style={{ fontSize: 'var(--font-body)', fontWeight: 400, color: 'var(--text-secondary)' }}>{t.perMonth}</span>
      </div>
      {plan.features.map((feature, i) => (
        <div key={i} style={{
          fontSize: cards.planCard.feature.fontSize, color: 'var(--text-secondary)',
          marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>
          {feature}
        </div>
      ))}
    </div>
  )
}