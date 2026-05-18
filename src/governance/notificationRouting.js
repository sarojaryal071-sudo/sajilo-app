// Resolves a normalized notification + userRole to an existing app route.
// Falls back to /inbox if no matching route exists.

export function resolveNotificationRoute(notification, userRole = 'customer') {
  const { type, entityType, entityId, metadata } = notification;
  const id = entityId || metadata?.bookingId || metadata?.invoiceId || metadata?.applicationId || '';

  switch (type) {
    case 'booking':
      if (userRole === 'worker') {
        return `/worker/earnings?bookingId=${id}`;
      }
      return `/bookings?bookingId=${id}`;

    case 'payment':
      if (userRole === 'worker') {
        return `/worker/earnings?paymentId=${id}`;
      }
      return `/bookings?paymentId=${id}`;

    case 'onboarding':
      // Admin reviews worker applications in the approvals screen
      return `/admin/approvals?applicationId=${id}`;

    case 'admin':
      // Admin notifications – go to admin notifications page
      return '/admin/notifications';

    case 'moderation':
      // Moderation cases – admin disputes page
      return '/admin/disputes';

    case 'governance':
      // Governance alerts – admin policies or notifications
      return '/admin/policies';

    default:
      return '/inbox';
  }
}