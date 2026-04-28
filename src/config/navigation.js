import { getRoleNavigation } from './appFlow.js'
import { getCurrentUser } from './auth.js'

export default function getNavigation() {
  const user = getCurrentUser()
  if (!user) return []
  return getRoleNavigation(user.role)
}