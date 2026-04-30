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
    proSubscription: { enabled: true },
    googleLogin: { enabled: false },
    appleLogin: { enabled: false },
    forgotPassword: { enabled: true },
    rememberMe: { enabled: true },
    termsText: { enabled: true },
    socialDivider: { enabled: false },
    loginLogo: { enabled: false },
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