// Client‑only settings sections
export const clientSections = {
  account: {
    label: 'Account',
    fields: [
      { key: 'fullName', type: 'text', label: 'Full Name' },
      { key: 'email', type: 'email', label: 'Email' },
      { key: 'phone', type: 'tel', label: 'Phone' },
    ],
  },
  bookingPreferences: {
    label: 'Booking Preferences',
    fields: [
      { key: 'autoHideCompleted', type: 'toggle', label: 'Auto-hide completed bookings' },
      { key: 'bookingHistoryVisibilityDays', type: 'number', label: 'Show bookings for (days)' },
    ],
  },
  payment: {
    label: 'Payment Methods',
    fields: [
      {
        key: 'methods',
        type: 'repeatable_group',
        label: 'Payment Methods',
        value: [],
      },
    ],
  },
};