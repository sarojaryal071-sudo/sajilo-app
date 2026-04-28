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

  { path: '/worker/dashboard', component: PlaceholderScreen, role: 'worker', label: 'Dashboard' },
  { path: '/worker/jobs', component: PlaceholderScreen, role: 'worker', label: 'Jobs' },
  { path: '/worker/earnings', component: PlaceholderScreen, role: 'worker', label: 'Earnings' },

  { path: '/admin/dashboard', component: PlaceholderScreen, role: 'admin', label: 'Dashboard' },
  { path: '/admin/users', component: PlaceholderScreen, role: 'admin', label: 'Users' },
  { path: '/admin/workers', component: PlaceholderScreen, role: 'admin', label: 'Workers' },
  { path: '/admin/bookings', component: PlaceholderScreen, role: 'admin', label: 'Bookings' },
  { path: '/admin/stats', component: PlaceholderScreen, role: 'admin', label: 'Stats' },
]

export default routes