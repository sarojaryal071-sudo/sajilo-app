// Shared notification type filters — used by all panels
// Ensures chat and system notifications never mix

export function isSystemNotification(notif) {
  return notif?.type === 'system' || notif?.type === 'direct'
}

export function isChatNotification(notif) {
  return notif?.type === 'chat'
}
