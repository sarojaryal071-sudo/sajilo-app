const workerNavigation = [
  // ═══ PRIMARY — Bottom Bar (mobile) ═══
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    path: '/worker/dashboard',
    role: 'worker',
    mobileVisible: true,
    priority: 'primary',
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: '🔧',
    path: '/worker/jobs',
    role: 'worker',
    mobileVisible: true,
    priority: 'primary',
  },
  
  
  // ═══ SECONDARY — Drawer (More menu) ═══
  {
    id: 'earnings',
    label: 'Earnings',
    icon: '💰',
    path: '/worker/earnings',
    role: 'worker',
    mobileVisible: false,
    priority: 'secondary',
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: '📅',
    path: '/worker/schedule',
    role: 'worker',
    mobileVisible: false,
    priority: 'secondary',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    path: '/worker/profile',
    role: 'worker',
    mobileVisible: false,
    priority: 'secondary',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    path: '/worker/settings',
    role: 'worker',
    mobileVisible: false,
    priority: 'secondary',
  },
]

export default workerNavigation