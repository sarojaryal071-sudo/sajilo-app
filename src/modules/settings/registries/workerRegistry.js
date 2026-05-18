// sajilo-app/src/modules/settings/registries/workerRegistry.js
import { sharedSections } from './shared.settings';
import { workerSections } from './worker.settings';

// Enforce strict visual order:
// Account → Banking & Payments → Notification → Security → Legal → About
export const workerRegistry = {
  account: workerSections.account,
  payment: workerSections.payment,
  notification: sharedSections.notification,
  security: sharedSections.security,
  legal: sharedSections.legal,
};