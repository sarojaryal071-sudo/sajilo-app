// sajilo-app/src/config/socketEvents.js
// Phase 12F – Socket Event Standardization (Frontend)
// Mirrors the backend SOCKET_EVENT_REGISTRY to keep event names consistent.

export const SOCKET_EVENTS = {
  // Booking lifecycle
  BOOKING_CREATED:   'booking.created',
  BOOKING_ACCEPTED:  'booking.accepted',
  BOOKING_REJECTED:  'booking.rejected',
  BOOKING_ONWAY:     'booking.onway',
  BOOKING_WORKING:   'booking.working',
  BOOKING_COMPLETED: 'booking.completed',
  BOOKING_UPDATED:   'booking.updated',

  // Worker
  WORKER_STATUS_CHANGED: 'worker:statusChanged',

  // Payment
  PAYMENT_UPDATED: 'payment.updated',

  // Review
  REVIEW_CREATED: 'review.created',

  // Notifications
  NOTIFICATION_CREATED: 'notification.created',

  // Worker services & pricing
  WORKER_SERVICES_UPDATED: 'worker.services.updated',
};