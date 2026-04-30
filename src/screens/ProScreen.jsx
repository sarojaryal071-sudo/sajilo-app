import { plans } from '../config/data.js'
import PlanCard from '../components/PlanCard.jsx'
import { useFeatureFlag } from '../hooks/useFeatureFlag.js'
import { useContent } from '../hooks/useContent.js'

export default function ProScreen() {
  const proEnabled = useFeatureFlag('proSubscription')

  const txt = {
    title: useContent('pro.title'),
    subtitle: useContent('pro.subtitle'),
    mostPopular: useContent('pro.mostPopular'),
    startPro: useContent('pro.startPro'),
  }

  if (!proEnabled) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h3 style={{ fontSize: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 8 }}>Pro Subscription Unavailable</h3>
        <p style={{ fontSize: 'var(--font-body)' }}>This feature is currently disabled.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--accent-blue), #2377D8)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>⭐</div>
        <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{txt.title}</div>
        <div style={{ fontSize: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}>{txt.subtitle}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} t={{ mostPopular: txt.mostPopular, perMonth: '/mo' }} />
        ))}
      </div>

      <button style={{ width: '100%', background: 'var(--accent-orange)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: 14, fontSize: 'var(--font-title)', fontWeight: 700, cursor: 'pointer' }}>
        {txt.startPro}
      </button>
    </div>
  )
}