// Comprehensive fallback content registry.
// Every configurable text key with its default value.
const defaultContentRegistry = {
  home: {
    hero: {
      title: 'Find trusted local services',
      subtitle: 'Book verified workers instantly',
      cta: 'Get Started',
    },
    categories: {
      primary: 'Primary Services',
      secondary: 'More Services',
      all: 'View All',
    },
    nearbyWorkers: {
      title: 'Nearby Workers',
      empty: 'No workers available right now',
    },
    search: {
      placeholder: 'Search for a service...',
      locationLabel: 'Service Area',
    },
  },
  auth: {
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to continue',
    },
    register: {
      title: 'Create account',
      subtitle: 'Join Sajilo today',
    },
  },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    noData: 'No data available',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
  },
  emptyStates: {
    noBookings: 'No bookings yet',
    noNotifications: 'No notifications',
    noMessages: 'No messages',
  },
  banners: {
    emergency: 'Emergency services available 24/7',
    promo: 'Get 10% off your first booking',
  },
};

export default defaultContentRegistry;