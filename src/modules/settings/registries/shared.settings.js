// Sections shared by all roles
export const sharedSections = {
  notification: {
    label: 'Notifications',
    fields: [
      { key: 'emailNotifications', type: 'toggle', label: 'Email Notifications' },
      { key: 'pushNotifications', type: 'toggle', label: 'Push Notifications' },
      { key: 'smsNotifications', type: 'toggle', label: 'SMS Notifications' },
    ],
  },
  security: {
    label: 'Security',
    fields: [
      { key: 'passwordChange', type: 'password_change', label: 'Change Password' },
    ],
  },
  legal: {
    label: 'Legal',
    fields: [
      { key: 'privacyPolicy', type: 'action', label: 'Privacy Policy' },
      { key: 'terms', type: 'action', label: 'Terms & Conditions' },
    ],
  },
  appInfo: {
    label: 'About',
    fields: [
      { key: 'version', type: 'readonly', label: 'App Version' },
      { key: 'build', type: 'readonly', label: 'Build' },
      { key: 'developer', type: 'readonly', label: 'Developer' },
    ],
    editable: false,
  },
};