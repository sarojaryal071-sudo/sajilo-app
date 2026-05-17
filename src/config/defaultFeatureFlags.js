// Default feature flags and navigation visibility – used when backend config is missing.
export const defaultFeatures = {
  finance: true,
  expenses: true,
  controlCenter: true,
  uiStudio: true,
  proSubscription: false,
  sosEmergency: true,
  googleLogin: false,
  appleLogin: false,
  forgotPassword: true,
  rememberMe: true,
  termsText: true,
  socialDivider: false,
  loginLogo: false,
};

export const defaultNavigation = {
  home: true,
  search: true,
  bookings: true,
  pro: true,
  profile: true,
  inbox: true,
};