import { Navigate } from 'react-router-dom'
import { getCurrentUser, canAccess } from '../config/auth.js'

export function RequireAuth({ children }) {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function RequireRole({ children, role }) {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to="/login" replace />
  return children
}

export function AuthRoute({ children }) {
  const user = getCurrentUser()
  if (!user) return children
  if (!canAccess(user.role, window.location.pathname)) {
    return <Navigate to="/login" replace />
  }
  return children
}