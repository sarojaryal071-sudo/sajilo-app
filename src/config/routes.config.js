import WelcomeScreen from '../screens/WelcomeScreen.jsx'
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
import WorkerEarnings from '../screens/worker/WorkerEarnings.jsx'
import WorkerSchedule from '../screens/worker/WorkerSchedule.jsx'
import WorkerProfile from '../screens/worker/WorkerProfile.jsx'
import AdminMobileBlock from '../screens/admin/AdminMobileBlock.jsx'
import AdminDashboard from '../screens/admin/AdminDashboard.jsx'
import AdminUsers from '../screens/admin/AdminUsers.jsx'
import AdminWorkers from '../screens/admin/AdminWorkers.jsx'
import AdminBookings from '../screens/admin/AdminBookings.jsx'
import AdminAnalytics from '../screens/admin/AdminAnalytics.jsx'
import AdminProfessions from '../screens/admin/AdminProfessions.jsx'
import AdminSettings from '../screens/admin/AdminSettings.jsx'
import AdminApprovals from '../screens/admin/AdminApprovals.jsx'
import AdminNotifications from '../screens/admin/AdminNotifications.jsx'
import AdminCategories from '../screens/admin/AdminCategories.jsx'
import AdminDisputes from '../screens/admin/AdminDisputes.jsx'
import AdminUIControl from '../screens/admin/AdminUIControl.jsx'
import AdminAudit from '../screens/admin/AdminAudit.jsx'
import AdminCustomers from '../screens/admin/AdminCustomers.jsx'
import AdminFinancial from '../screens/admin/finance/FinanceScreen.jsx'
import WorkerPending from '../screens/worker/WorkerPending.jsx'
import WorkerVerificationReview from '../screens/worker/WorkerVerificationReview.jsx'
import WorkerApply from '../screens/worker/WorkerApply.jsx'
import AdminChat from '../screens/admin/AdminChat.jsx'
import AdminLiveOps from '../screens/admin/AdminLiveOps.jsx'
import AdminActivity from '../screens/admin/AdminActivity.jsx'
import AdminSearch from '../screens/admin/AdminSearch.jsx'
import AdminDeployment from '../screens/admin/AdminDeployment.jsx'
import AdminStaff from '../screens/admin/AdminStaff.jsx'
import AdminPolicies from '../screens/admin/AdminPolicies.jsx'
import AdminFeatureFlags from '../screens/admin/AdminFeatureFlags.jsx'
import AdminSimulate from '../screens/admin/AdminSimulate.jsx'
import InboxScreen from '../screens/InboxScreen.jsx'

const routes = [
  { path: '/inbox', component: InboxScreen, role: 'customer' },
  { path: '/inbox', component: InboxScreen, role: 'worker' },

  // Add as first route:
{ path: '/welcome', component: WelcomeScreen, public: true },

  { path: '/login', component: LoginScreen, public: true },
  { path: '/signup', component: SignupScreen, public: true },
  { path: '/worker/apply', component: WorkerApply, role: 'worker' },
  { path: '/worker/pending', component: WorkerPending, role: 'worker' },
  { path: '/worker/review', component: WorkerVerificationReview, role: 'worker' },


  { path: '/', component: HomeScreen, role: 'customer' },
  { path: '/home', component: HomeScreen, role: 'customer' },
  { path: '/search', component: SearchScreen, role: 'customer' },
  { path: '/detail/:workerId', component: DetailWrapper, role: 'customer' },
  { path: '/tracking/:workerId', component: TrackingWrapper, role: 'customer' },
  { path: '/bookings', component: BookingsScreen, role: 'customer' },
  { path: '/pro', component: ProScreen, role: 'customer' },
  { path: '/profile', component: ProfileScreen, role: 'customer' },

  { path: '/worker/dashboard', component: WorkerDashboard, role: 'worker' },
  { path: '/worker/earnings', component: WorkerEarnings, role: 'worker' },
  { path: '/worker/schedule', component: WorkerSchedule, role: 'worker' },
  { path: '/worker/profile', component: WorkerProfile, role: 'worker' },
  
  { path: '/admin/dashboard', component: AdminDashboard, role: 'admin' },
  { path: '/admin/users', component: AdminUsers, role: 'admin' },
  { path: '/admin/workers', component: AdminWorkers, role: 'admin' },
  { path: '/admin/financial', component: AdminFinancial, role: 'admin' },
  { path: '/admin/bookings', component: AdminBookings, role: 'admin' },
  { path: '/admin/analytics', component: AdminAnalytics, role: 'admin' },
  { path: '/admin/professions', component: AdminProfessions, role: 'admin' },
  { path: '/admin/settings', component: AdminSettings, role: 'admin' },
  { path: '/admin/approvals', component: AdminApprovals, role: 'admin' },
  { path: '/admin/notifications', component: AdminNotifications, role: 'admin' },
  { path: '/admin/disputes', component: AdminDisputes, role: 'admin' },
  { path: '/admin/categories', component: AdminCategories, role: 'admin' },
  { path: '/admin/ui-control', component: AdminUIControl, role: 'admin' },
  { path: '/admin/audit', component: AdminAudit, role: 'admin' },
  { path: '/admin/customers', component: AdminCustomers, role: 'admin' },
  { path: '/admin/home', component: PlaceholderScreen, role: 'admin', label: 'Home' },
  { path: '/admin/chat', component: AdminChat, role: 'admin' },
  { path: '/admin/live-operations', component: AdminLiveOps, role: 'admin' },
  { path: '/admin/activity', component: AdminActivity, role: 'admin' },
  { path: '/admin/search', component: AdminSearch, role: 'admin' },
  { path: '/admin/deployment', component: AdminDeployment, role: 'admin' },
  { path: '/admin/staff', component: AdminStaff, role: 'admin' },
  { path: '/admin/policies', component: AdminPolicies, role: 'admin' },
  { path: '/admin/feature-flags', component: AdminFeatureFlags, role: 'admin' },
  { path: '/admin/simulate', component: AdminSimulate, role: 'admin' },
]

export default routes