import { plans } from '../config/data.js'
import PlanCard from '../components/PlanCard.jsx'
import { useFeatureFlag } from '../hooks/useFeatureFlag.js'

export default function ProScreen({ t }) {
  const proEnabled = useFeatureFlag('proSubscription')

  if (!proEnabled) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h3 style={{ fontSize: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 8 }}>
          Pro Subscription Unavailable
        </h3>
        <p style={{ fontSize: 'var(--font-body)' }}>
          This feature is currently disabled. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-blue), #2377D8)',
        borderRadius: 'var(--radius-lg)',
        padding: 28,
        textAlign: 'center',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>⭐</div>
        <div style={{ fontSize: 'var(--font-large)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          {t.sajiloPro}
        </div>
        <div style={{ fontSize: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}>
          {t.proSub}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14,
        marginBottom: 20,
      }}>
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} t={t} />
        ))}
      </div>

      <button style={{
        width: '100%',
        background: 'var(--accent-orange)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        padding: 14,
        fontSize: 'var(--font-title)',
        fontWeight: 700,
        cursor: 'pointer',
      }}>
        {t.startPro}
      </button>
    </div>
  )
}