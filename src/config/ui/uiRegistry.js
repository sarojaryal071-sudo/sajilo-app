const uiRegistry = {
  // ── SECTION VISIBILITY ──────────────────

  sections: {
    sidebar: {
      visible: true,
      mobileVisible: false,
    },
    rightPanel: {
      visible: true,
      mobileVisible: false,
    },
    navbar: {
      visible: true,
      mobileVisible: false,
    },
    mobileBottomNav: {
      visible: true,
    },
    mobileDrawer: {
      visible: true,
    },
  },

  // ── FEATURE FLAGS ───────────────────────

  features: {
    sosEmergency: {
      enabled: true,
    },
    bookings: {
      enabled: true,
    },
    tracking: {
      enabled: true,
    },
    proSubscription: {
      enabled: true,
    },
    workerApplication: {
      enabled: false,
    },
    adminDashboard: {
      enabled: true,
    },
  },

  // ── LAYOUT TOGGLES ──────────────────────

  layout: {
    desktopColumns: 3,
    mobileStack: true,
    showRightPanelOnMobile: false,
  },
}

export default uiRegistry