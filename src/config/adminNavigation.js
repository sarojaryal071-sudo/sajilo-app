const adminNavigation = [
  // ── Marketplace Operations ────────────────────────────
  { id: 'dashboard',     label: 'Dashboard',          icon: '📊', path: '/admin/dashboard',     section: 'Overview',    domain: 'Marketplace Operations' },
  { id: 'bookings',      label: 'Bookings',           icon: '📋', path: '/admin/bookings',      section: 'Operations',  domain: 'Marketplace Operations' },
  { id: 'disputes',      label: 'Disputes',           icon: '⚠️', path: '/admin/disputes',      section: 'Operations',  domain: 'Marketplace Operations' },

  // ── Financial Operations ─────────────────────────────
  // (future pages will be added here; currently empty)

  // ── Workforce Operations ─────────────────────────────
  { id: 'workers',       label: 'Workers',            icon: '👷', path: '/admin/workers',       section: 'People',      domain: 'Workforce Operations' },
  { id: 'approvals',     label: 'Worker Approvals',   icon: '✅', path: '/admin/approvals',     section: 'Operations',  domain: 'Workforce Operations' },

  // ── Customer Operations ──────────────────────────────
  { id: 'customers',     label: 'Customers',          icon: '👥', path: '/admin/customers',     section: 'People',      domain: 'Customer Operations' },

  // ── Communication Operations ─────────────────────────
  { id: 'chat',          label: 'Live Chat',          icon: '💬', path: '/admin/chat',          section: 'Operations',  domain: 'Communication Operations' },
  { id: 'liveops',       label: 'Live Operations',    icon: '📡', path: '/admin/live-operations', section: 'Operations',  domain: 'Marketplace Operations' },
  { id: 'notifications', label: 'Notifications',      icon: '🔔', path: '/admin/notifications', section: 'Operations',  domain: 'Communication Operations' },

  // ── Platform Configuration ───────────────────────────
  { id: 'categories',    label: 'Service Categories', icon: '🗂️', path: '/admin/categories',    section: 'Platform',    domain: 'Platform Configuration' },
  { id: 'uicontrol',     label: 'UI Control Panel',   icon: '🎨', path: '/admin/ui-control',   section: 'Platform',    domain: 'Platform Configuration' },
  { id: 'settings',      label: 'Settings',           icon: '⚙️', path: '/admin/settings',      section: 'System',      domain: 'Platform Configuration' },
  { id: 'audit',         label: 'Audit Log',          icon: '📜', path: '/admin/audit',         section: 'System',      domain: 'Platform Configuration' },
]

export default adminNavigation