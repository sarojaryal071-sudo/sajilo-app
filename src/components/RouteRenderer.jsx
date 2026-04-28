import { Route } from 'react-router-dom'
import { RequireAuth, RequireRole } from './RequireAuth.jsx'

export default function RouteRenderer({ route, navigate, t, handleLogin }) {
  const Component = route.component
  const element = <Component navigate={navigate} t={t} onLogin={handleLogin} title={route.label} />

  if (route.public) {
    return <Route path={route.path} element={element} key={route.path} />
  }

  if (route.role === 'admin' || route.role === 'worker') {
    return (
      <Route path={route.path} element={
        <RequireRole role={route.role}>{element}</RequireRole>
      } key={route.path} />
    )
  }

  return (
    <Route path={route.path} element={
      <RequireAuth>{element}</RequireAuth>
    } key={route.path} />
  )
}