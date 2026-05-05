import { BrowserRouter } from 'react-router-dom'
import AppShell from './layouts/AppShell.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import { BookingProvider } from './contexts/BookingContext.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <BookingProvider>
          <AppShell />
        </BookingProvider>
      </NotificationProvider>
    </BrowserRouter>
  )
}