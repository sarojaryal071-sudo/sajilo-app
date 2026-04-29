const adminNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    path: '/admin/dashboard',
    role: 'admin',
    mobileVisible: true,
  },
  {
    id: 'workers',
    label: 'Workers',
    icon: '👷',
    path: '/admin/workers',
    role: 'admin',
    mobileVisible: true,
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: '📋',
    path: '/admin/bookings',
    role: 'admin',
    mobileVisible: true,
  },
  {
    id: 'users',
    label: 'Users',
    icon: '👥',
    path: '/admin/users',
    role: 'admin',
    mobileVisible: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📈',
    path: '/admin/analytics',
    role: 'admin',
    mobileVisible: false,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    path: '/admin/settings',
    role: 'admin',
    mobileVisible: false,
  },
]

export default adminNavigation