const MOCK_USERS = {
  'admin@sajilo.com': { password: 'admin123', role: 'admin', name: 'Admin' },
  'worker@test.com': { password: 'worker123', role: 'worker', name: 'Test Worker' },
}

const PERMISSIONS = {
  customer: ['/home', '/search', '/detail', '/tracking', '/bookings', '/pro', '/profile'],
  worker: ['/worker/dashboard'],
  admin: ['/admin/dashboard', '/home', '/search', '/detail', '/tracking', '/bookings', '/pro', '/profile'],
}

export function loginUser(email, password) {
  const user = MOCK_USERS[email]
  
  if (user) {
    if (user.password !== password) {
      return { success: false, error: 'Invalid password' }
    }
    const session = { id: email, email, role: user.role, name: user.name }
    localStorage.setItem('sajilo_user', JSON.stringify(session))
    return { success: true, user: session }
  }
  
  const session = { id: email, email, role: 'customer', name: email.split('@')[0] }
  localStorage.setItem('sajilo_user', JSON.stringify(session))
  return { success: true, user: session }
}

export function logoutUser() {
  localStorage.removeItem('sajilo_user')
}

export function getCurrentUser() {
  const saved = localStorage.getItem('sajilo_user')
  return saved ? JSON.parse(saved) : null
}

export function restoreSession() {
  return getCurrentUser()
}

export function isAuthenticated() {
  return getCurrentUser() !== null
}

export function hasRole(role) {
  const user = getCurrentUser()
  return user !== null && user.role === role
}

export function canAccess(role, path) {
  const allowed = PERMISSIONS[role] || []
  return allowed.some(p => path.startsWith(p))
}