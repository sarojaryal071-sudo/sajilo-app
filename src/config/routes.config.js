import HomeScreen from '../screens/HomeScreen.jsx'
import SearchScreen from '../screens/SearchScreen.jsx'
import BookingsScreen from '../screens/BookingsScreen.jsx'
import ProScreen from '../screens/ProScreen.jsx'
import ProfileScreen from '../screens/ProfileScreen.jsx'
import LoginScreen from '../screens/LoginScreen.jsx'
import SignupScreen from '../screens/SignupScreen.jsx'
import PlaceholderScreen from '../screens/PlaceholderScreen.jsx'
import DetailWrapper from '../components/DetailWrapper.jsx'
import TrackingWrapper from '../components/TrackingWrapper.jsx'
import WorkerDashboard from '../screens/worker/WorkerDashboard.jsx'
import WorkerJobs from '../screens/worker/WorkerJobs.jsx'
import WorkerEarnings from '../screens/worker/WorkerEarnings.jsx'
import WorkerSchedule from '../screens/worker/WorkerSchedule.jsx'
import WorkerProfile from '../screens/worker/WorkerProfile.jsx'
import AdminMobileBlock from '../screens/admin/AdminMobileBlock.jsx'
import AdminDashboard from '../screens/admin/AdminDashboard.jsx'
import AdminUsers from '../screens/admin/AdminUsers.jsx'
import AdminWorkers from '../screens/admin/AdminWorkers.jsx'
import AdminBookings from '../screens/admin/AdminBookings.jsx'
import AdminAnalytics from '../screens/admin/AdminAnalytics.jsx'
import AdminSettings from '../screens/admin/AdminSettings.jsx'
import AdminApprovals from '../screens/admin/AdminApprovals.jsx'
import AdminNotifications from '../screens/admin/AdminNotifications.jsx'
import AdminCategories from '../screens/admin/AdminCategories.jsx'
import AdminDisputes from '../screens/admin/AdminDisputes.jsx'
import AdminUIControl from '../screens/admin/AdminUIControl.jsx'
import AdminAudit from '../screens/admin/AdminAudit.jsx'

const routes = [
  { path: '/login', component: LoginScreen, public: true },
  { path: '/signup', component: SignupScreen, public: true },

  { path: '/', component: HomeScreen, role: 'customer' },
  { path: '/home', component: HomeScreen, role: 'customer' },
  { path: '/search', component: SearchScreen, role: 'customer' },
  { path: '/detail/:workerId', component: DetailWrapper, role: 'customer' },
  { path: '/tracking/:workerId', component: TrackingWrapper, role: 'customer' },
  { path: '/bookings', component: BookingsScreen, role: 'customer' },
  { path: '/pro', component: ProScreen, role: 'customer' },
  { path: '/profile', component: ProfileScreen, role: 'customer' },

{ path: '/worker/dashboard', component: WorkerDashboard, role: 'worker' },
{ path: '/worker/jobs', component: WorkerJobs, role: 'worker' },
{ path: '/worker/earnings', component: WorkerEarnings, role: 'worker' },
{ path: '/worker/schedule', component: WorkerSchedule, role: 'worker' },
{ path: '/worker/profile', component: WorkerProfile, role: 'worker' },

{ path: '/admin/dashboard', component: AdminDashboard, role: 'admin' },
{ path: '/admin/users', component: AdminUsers, role: 'admin' },
{ path: '/admin/workers', component: AdminWorkers, role: 'admin' },
{ path: '/admin/bookings', component: AdminBookings, role: 'admin' },
{ path: '/admin/analytics', component: AdminAnalytics, role: 'admin' },
{ path: '/admin/settings', component: AdminSettings, role: 'admin' },
{ path: '/admin/approvals', component: AdminApprovals, role: 'admin' },
{ path: '/admin/notifications', component: AdminNotifications, role: 'admin' },
{ path: '/admin/disputes', component: AdminDisputes, role: 'admin' },
{ path: '/admin/categories', component: AdminCategories, role: 'admin' },
{ path: '/admin/ui-control', component: AdminUIControl, role: 'admin' },
{ path: '/admin/audit', component: AdminAudit, role: 'admin' },
]

export default routes