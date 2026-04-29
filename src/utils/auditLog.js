export function logAction(action, target, details = '') {
  const logs = JSON.parse(localStorage.getItem('sajilo_audit_logs') || '[]')
  logs.unshift({
    id: Date.now(),
    admin: 'Admin',
    action,
    target,
    details,
    timestamp: new Date().toLocaleString(),
  })
  localStorage.setItem('sajilo_audit_logs', JSON.stringify(logs.slice(0, 100)))
}

export function getAuditLogs() {
  return JSON.parse(localStorage.getItem('sajilo_audit_logs') || '[]')
}