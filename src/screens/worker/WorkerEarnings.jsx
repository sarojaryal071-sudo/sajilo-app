import { useWorker } from '../../contexts/WorkerContext.jsx'
import ElementRenderer from '../../components/ElementRenderer.jsx'
import { groupBookingsByCompletedDate } from '../../utils/dateGrouping.js'

export default function WorkerEarnings() {
  const { bookings, earnings, loading, paymentMap } = useWorker()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading...</div>
  }

  const completedJobs = (bookings || []).filter(b => b.status === 'completed')
  const grouped = groupBookingsByCompletedDate(completedJobs)
  
  return (
    <div style={{ padding: '0 16px' }}>
      <ElementRenderer elementId="earningsHeading" overrideData={{}} />
      <ElementRenderer elementId="earningsHeroCard" overrideData={{ earnings }} />
      <ElementRenderer elementId="earningsHistoryHeading" overrideData={{}} />
      <ElementRenderer elementId="earningsJobItem" overrideData={{ bookings: grouped, paymentMap }} />
    </div>
  )
}