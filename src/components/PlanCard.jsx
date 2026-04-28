export default function PlanCard({ plan }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: plan.popular ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      position: 'relative',
      cursor: 'pointer',
    }}>
      {plan.popular && (
        <div style={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--accent-blue)',
          color: '#fff',
          fontSize: 'var(--font-caption)',
          fontWeight: 700,
          padding: '3px 12px',
          borderRadius: 20,
          whiteSpace: 'nowrap',
        }}>
          Most Popular
        </div>
      )}
      <div style={{
        fontSize: 'var(--font-body-lg)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 4,
      }}>
        {plan.name}
      </div>
      <div style={{
        fontSize: 'var(--font-large)',
        fontWeight: 800,
        color: 'var(--text-primary)',
        marginBottom: 14,
      }}>
        {plan.price}
        <span style={{
          fontSize: 'var(--font-body)',
          fontWeight: 400,
          color: 'var(--text-secondary)',
        }}>
          /mo
        </span>
      </div>
      {plan.features.map((feature, i) => (
        <div key={i} style={{
          fontSize: 'var(--font-body-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>
          {feature}
        </div>
      ))}
    </div>
  )
}