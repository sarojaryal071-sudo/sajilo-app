// Centralised navigation actions for Settings.
// Each action returns a route path (string).
// Use with React Router's navigate() function.

export function getRouteForAction(action) {
  switch (action) {
    case 'myBookings':
      return '/bookings';
    case 'transactions':
      return '/transactions';
    case 'wallet':
      return '/wallet';
    case 'verification':
      return '/verification';
    case 'becomeWorker':
      return '/worker/apply';
    case 'workerSchedule':
      return '/worker/schedule';
    case 'locationChange':
      return '/worker/location-change';
    case 'switchToClient':
      return '/client';
    case 'privacyPolicy':
      return '/privacy-policy';
    case 'terms':
      return '/terms-and-conditions';
    default:
      return null;
  }
}