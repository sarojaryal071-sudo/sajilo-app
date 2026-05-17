import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.jsx'
import './styles/global.css'
import './styles/uiVariants.css'
import { UIConfigProvider } from './contexts/UIConfigContext.jsx'
import AppProviders from './providers/AppProviders.jsx'

// Sentry initialisation – silently skips if no DSN is provided
const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
      <UIConfigProvider>
        <AppProviders>
          <App />
        </AppProviders>
      </UIConfigProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)