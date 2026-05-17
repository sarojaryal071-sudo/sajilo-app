import FinanceLoadingState from '../FinanceLoadingState';
import FinanceEmptyState from '../FinanceEmptyState';
import TimelineEvent from './TimelineEvent';

export default function FinanceTimeline({ events = [], loading = false }) {
  if (loading) return <FinanceLoadingState text="Loading timeline..." />;
  if (!events || events.length === 0) return <FinanceEmptyState icon="📅" title="No events" description="No timeline events to show." />;

  return (
    <div>
      {events.map(evt => (
        <TimelineEvent key={evt.id} {...evt} />
      ))}
    </div>
  );
}