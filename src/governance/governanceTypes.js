/**
 * @typedef {Object} UserNotification
 * @property {string} id
 * @property {string} icon
 * @property {string} text
 * @property {string} time
 */

/**
 * @typedef {Object} SystemNotice
 * @property {string} id
 * @property {boolean} enabled
 * @property {string} title
 * @property {string} message
 * @property {'info'|'warning'|'critical'} severity
 * @property {string[]} targetRoles
 * @property {boolean} persistent
 * @property {boolean} dismissible
 * @property {number} createdAt
 */

/**
 * @typedef {Object} UnifiedNotificationState
 * @property {UserNotification[]} userNotifications
 * @property {number} unreadCount
 * @property {SystemNotice[]} systemNotices
 * @property {number} totalCount
 * @property {function(string):void} dismissNotice
 */

export const MOCK_USER_NOTIFICATIONS = [
  { id: 'n1', icon: '📋', text: 'Your booking #42 has been confirmed', time: '2 min ago' },
  { id: 'n2', icon: '⭐', text: 'New review received from John', time: '1 hour ago' },
];

export const MOCK_SYSTEM_NOTICES = [
  {
    id: 'welcome_notice',
    enabled: true,
    title: 'Welcome to SAJILO',
    message: 'System governance communication is now active.',
    severity: 'info',
    targetRoles: ['customer', 'worker', 'admin'],
    persistent: false,
    dismissible: true,
    createdAt: Date.now(),
  },
];