const uiRegistry = {
  sections: {
    sidebar: { visible: true, mobileVisible: false },
    rightPanel: { visible: true, mobileVisible: false },
    navbar: { visible: true, mobileVisible: false },
    mobileBottomNav: { visible: true },
    mobileDrawer: { visible: true },
  },
  features: {
    sosEmergency: { enabled: true },
    bookings: { enabled: true },
    tracking: { enabled: true },
    proSubscription: { enabled: true },
    workerApplication: { enabled: false },
    adminDashboard: { enabled: true },
    liveTracking: { enabled: true },
    scheduledBookings: { enabled: true },
    priceAdjustment: { enabled: true },
    googleLogin: { enabled: false },
  },
  layout: {
    desktopColumns: 3,
    mobileStack: true,
    showRightPanelOnMobile: false,
  },
  theme: {
    primaryColor: '#1A6FD4',
    accentColor: '#E8720C',
  },
}

export default uiRegistry