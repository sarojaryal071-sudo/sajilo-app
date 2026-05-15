import { AdminAnalyticsProvider } from '../../contexts/AdminAnalyticsContext.jsx';
import AdminAnalyticsDashboard from '../../components/admin/AdminAnalyticsDashboard.jsx';

export default function AdminAnalytics() {
  return (
    <AdminAnalyticsProvider>
      <AdminAnalyticsDashboard />
    </AdminAnalyticsProvider>
  );
}