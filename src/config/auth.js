import { api, setToken, removeToken, getToken } from '../services/api.js'

export async function loginUser(email, password) {
  try {
    const result = await api.login({ email, password })
    setToken(result.data.token)
    return { success: true, user: result.data.user }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function registerUser(email, password, role, name) {
  try {
    const result = await api.register({ email, password, role, name })
    setToken(result.data.token)
    return { success: true, user: result.data.user }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export function logoutUser() {
  removeToken()
}

export function getCurrentUser() {
  const saved = localStorage.getItem('sajilo_user')
  return saved ? JSON.parse(saved) : null
}

export function restoreSession() {
  return getCurrentUser()
}

export function isAuthenticated() {
  return getToken() !== null
}

export function hasRole(role) {
  const user = getCurrentUser()
  return user !== null && user.role === role
}

export function canAccess(role, path) {
  const PERMISSIONS = {
    customer: ['/home', '/search', '/detail', '/tracking', '/bookings', '/pro', '/profile'],
    worker: ['/worker/dashboard'],
    admin: ['/admin/dashboard', '/home', '/search', '/detail', '/tracking', '/bookings', '/pro', '/profile'],
  }
  const allowed = PERMISSIONS[role] || []
  return allowed.some(p => path.startsWith(p))
}