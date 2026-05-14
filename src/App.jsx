import { BrowserRouter } from 'react-router-dom'
import AppShell from './layouts/AppShell.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import { BookingProvider } from './contexts/BookingContext.jsx'
import { UIConfigProvider } from './contexts/UIConfigContext.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <UIConfigProvider>
        <NotificationProvider>
          <BookingProvider>
            <AppShell />
          </BookingProvider>
        </NotificationProvider>
      </UIConfigProvider>
    </BrowserRouter>
  )
}