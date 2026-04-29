const adminNavigation = [
  // Overview
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard', section: 'Overview' },
  
  // People
  { id: 'customers', label: 'Customers', icon: '👥', path: '/admin/customers', section: 'People' },
  { id: 'workers', label: 'Workers', icon: '👷', path: '/admin/workers', section: 'People' },
  
  // Operations
  { id: 'bookings', label: 'Bookings', icon: '📋', path: '/admin/bookings', section: 'Operations' },
  { id: 'disputes', label: 'Disputes', icon: '⚠️', path: '/admin/disputes', section: 'Operations' },
  { id: 'approvals', label: 'Worker Approvals', icon: '✅', path: '/admin/approvals', section: 'Operations' },
  { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/admin/notifications', section: 'Operations' },
  
  // Platform
  { id: 'categories', label: 'Service Categories', icon: '🗂️', path: '/admin/categories', section: 'Platform' },
  { id: 'uicontrol', label: 'UI Control Panel', icon: '🎨', path: '/admin/ui-control', section: 'Platform' },
  
  // System
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings', section: 'System' },
  { id: 'audit', label: 'Audit Log', icon: '📜', path: '/admin/audit', section: 'System' },
]

export default adminNavigation