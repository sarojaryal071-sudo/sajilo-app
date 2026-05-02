import { BrowserRouter } from 'react-router-dom'
import AppShell from './layouts/AppShell.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppShell />
      </NotificationProvider>
    </BrowserRouter>
  )
}