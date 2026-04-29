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

  { path: '/admin/dashboard', component: PlaceholderScreen, role: 'admin', label: 'Dashboard' },
  { path: '/admin/users', component: PlaceholderScreen, role: 'admin', label: 'Users' },
  { path: '/admin/workers', component: PlaceholderScreen, role: 'admin', label: 'Workers' },
  { path: '/admin/bookings', component: PlaceholderScreen, role: 'admin', label: 'Bookings' },
  { path: '/admin/stats', component: PlaceholderScreen, role: 'admin', label: 'Stats' },
]

export default routes