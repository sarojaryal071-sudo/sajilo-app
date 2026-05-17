// Default control values – fallback when backend config is missing.
const controlDefaults = {
  ui: {
    theme: {
      primary: '#1A6FD4',
    },
  },
  finance: {
    expense: {
      approval: { enabled: true },
      recurring: { enabled: true },
    },
  },
  navigation: {
    sidebar: {
      reports: { visible: true },
    },
  },
  features: {
    recurringExpenses: { enabled: true },
    finance: { enabled: true },
    expenses: { enabled: true },
    controlCenter: { enabled: true },
    uiStudio: { enabled: true },
    proSubscription: { enabled: false },
    sosEmergency: { enabled: true },
    googleLogin: { enabled: false },
    appleLogin: { enabled: false },
    forgotPassword: { enabled: true },
    rememberMe: { enabled: true },
    termsText: { enabled: true },
    socialDivider: { enabled: false },
    loginLogo: { enabled: false },
  },
  system: {
    maintenance: false,
  },
};

export default controlDefaults;