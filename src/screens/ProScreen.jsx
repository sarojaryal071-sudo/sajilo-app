import { plans } from '../config/data.js'
import PlanCard from '../components/PlanCard.jsx'

export default function ProScreen() {
  return (
    <div>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-blue), #2377D8)',
        borderRadius: 'var(--radius-lg)',
        padding: 28,
        textAlign: 'center',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>⭐</div>
        <div style={{
          fontSize: 'var(--font-large)',
          fontWeight: 800,
          color: '#fff',
          marginBottom: 8,
        }}>
          Sajilo Pro
        </div>
        <div style={{
          fontSize: 'var(--font-body)',
          color: 'rgba(255,255,255,0.7)',
        }}>
          Priority workers. Zero surge fees. Exclusive discounts every month.
        </div>
      </div>

      {/* Plan Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14,
        marginBottom: 20,
      }}>
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Subscribe Button */}
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
        Start Pro — Rs 999/mo →
      </button>
    </div>
  )
}