const appFlow = {
  customer: {
    routes: ['/home', '/search', '/detail/:id', '/tracking/:id', '/bookings', '/pro', '/profile'],
    navigation: [
      { id: 'home', labelKey: 'navHome', icon: '🏠', route: '/home', priority: 'primary' },
      { id: 'search', labelKey: 'navSearch', icon: '🔍', route: '/search', priority: 'secondary' },
      { id: 'bookings', labelKey: 'navBookings', icon: '📋', route: '/bookings', priority: 'primary' },
      { id: 'tracking', labelKey: 'liveTracking', icon: '📍', route: '/tracking/1', priority: 'primary' },
      { id: 'pro', labelKey: 'navPro', icon: '⭐', route: '/pro', priority: 'secondary' },
      { id: 'profile', labelKey: 'navProfile', icon: '👤', route: '/profile', priority: 'secondary' },
    ],
    dashboard: '/home',
  },
  worker: {
    routes: ['/worker/dashboard', '/worker/jobs', '/worker/earnings'],
    navigation: [
      { id: 'dashboard', labelKey: 'Dashboard', icon: '📊', route: '/worker/dashboard' },
      { id: 'jobs', labelKey: 'Jobs', icon: '🔧', route: '/worker/jobs' },
      { id: 'earnings', labelKey: 'Earnings', icon: '💰', route: '/worker/earnings' },
    ],
    dashboard: '/worker/dashboard',
  },
  admin: {
    routes: ['/admin/dashboard', '/admin/users', '/admin/workers', '/admin/bookings', '/admin/stats'],
    navigation: [
      { id: 'dashboard', labelKey: 'Dashboard', icon: '📊', route: '/admin/dashboard' },
      { id: 'users', labelKey: 'Users', icon: '👥', route: '/admin/users' },
      { id: 'workers', labelKey: 'Workers', icon: '👷', route: '/admin/workers' },
      { id: 'bookings', labelKey: 'Bookings', icon: '📋', route: '/admin/bookings' },
      { id: 'stats', labelKey: 'Stats', icon: '📈', route: '/admin/stats' },
    ],
    dashboard: '/admin/dashboard',
  },
}

export function getRoleFlow(role) {
  return appFlow[role] || appFlow.customer
}

export function getRoleRoutes(role) {
  return getRoleFlow(role).routes
}

export function getRoleNavigation(role) {
  return getRoleFlow(role).navigation
}

export function getRoleDashboard(role) {
  return getRoleFlow(role).dashboard
}

export default appFlow