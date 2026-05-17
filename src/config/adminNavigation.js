const adminNavigation = [
  // ── 🏠 OVERVIEW ──────────────────────────────────────
  { id: 'dashboard',     label: 'Dashboard',          icon: '🏠', path: '/admin/dashboard',     section: 'Overview' },

  // ── 📊 ANALYTICS ─────────────────────────────────────
  { id: 'analytics',     label: 'Analytics Dashboard', icon: '📊', path: '/admin/analytics',     section: 'Analytics' },

  // ── 📋 OPERATIONS ────────────────────────────────────
  { id: 'bookings',      label: 'Bookings',           icon: '📋', path: '/admin/bookings',      section: 'Operations' },
  { id: 'liveops',       label: 'Live Operations',    icon: '📡', path: '/admin/live-operations', section: 'Operations' },
  { id: 'activity',      label: 'Activity Timeline',  icon: '🕒', path: '/admin/activity',      section: 'Operations' },
  { id: 'search',        label: 'Global Search',      icon: '🔍', path: '/admin/search',        section: 'Operations' },

  // ── 👥 PEOPLE ────────────────────────────────────────
  { id: 'workers',       label: 'Workers Table',      icon: '👷', path: '/admin/workers',       section: 'People' },
  { id: 'customers',     label: 'Customers Table',    icon: '👥', path: '/admin/customers',     section: 'People' },

  // ── 💰 FINANCIAL ─────────────────────────────────────
  // TODO: Replace with dedicated financial overview page
  { id: 'financial',     label: 'Finance',            icon: '💰', path: '/admin/financial', section: 'Financial' },

  // ── 🛡️ TRUST & SAFETY ────────────────────────────────
  { id: 'verification',  label: 'Verification Queue', icon: '🆔', path: '/admin/approvals', section: 'Trust & Safety' },
  { id: 'disputes',      label: 'Disputes',           icon: '⚠️', path: '/admin/disputes',      section: 'Trust & Safety' },
  // { id: 'support',      label: 'Support Tickets',    icon: '🎫', path: '/admin/support',       section: 'Trust & Safety' },

  // ── 💬 COMMUNICATION ─────────────────────────────────
  { id: 'notifications', label: 'Notifications Manager', icon: '🔔', path: '/admin/notifications', section: 'Communication' },
  { id: 'chat',          label: 'Chat Monitor',       icon: '💬', path: '/admin/chat',          section: 'Communication' },

  // ── 🔧 PLATFORM ──────────────────────────────────────
  { id: 'uistudio',      label: 'UI Studio',          icon: '🎨', path: '/admin/ui-control',    section: 'Platform' },
  { id: 'categories',    label: 'Service Categories', icon: '🗂️', path: '/admin/categories',    section: 'Platform' },
  // Professions screen exists; route expected at /admin/professions
  { id: 'professions',   label: 'Professions',        icon: '📋', path: '/admin/professions',   section: 'Platform' },
  { id: 'featureflags',  label: 'Feature Flags',      icon: '🚩', path: '/admin/feature-flags', section: 'Platform' },
  { id: 'deployment',    label: 'Deployment',         icon: '🖥️', path: '/admin/deployment',    section: 'Platform' },
  { id: 'simulate',      label: 'Simulate',           icon: '🧪', path: '/admin/simulate',      section: 'Platform' },
  { id: 'policies',      label: 'Policies',           icon: '📜', path: '/admin/policies',      section: 'Platform' },

  // ── ⚙️ SYSTEM ───────────────────────────────────────
  { id: 'audit',         label: 'Audit Log',          icon: '📜', path: '/admin/audit',         section: 'System' },
  { id: 'staff',         label: 'Staff',              icon: '👤', path: '/admin/staff',         section: 'System' },
  { id: 'settings',      label: 'System Settings',    icon: '⚙️', path: '/admin/settings',      section: 'System' },
]

export default adminNavigation