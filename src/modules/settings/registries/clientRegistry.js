// sajilo-app/src/modules/settings/registries/clientRegistry.js
import { sharedSections } from './shared.settings';
import { clientSections } from './client.settings';

// Enforce strict visual order:
// Account → Payment → Booking → Notification → Security → Legal → About
export const clientRegistry = {
  account: clientSections.account,
  payment: clientSections.payment,            // correct key (plural)
  bookingPreferences: clientSections.bookingPreferences,
  notification: sharedSections.notification,
  security: sharedSections.security,
  legal: sharedSections.legal,
};