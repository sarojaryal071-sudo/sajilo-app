import { UIConfigProvider } from '../contexts/UIConfigContext.jsx';
import { BookingProvider } from '../contexts/BookingContext.jsx';
import { NotificationProvider } from '../contexts/NotificationContext.jsx';
import { ToastProvider } from '../contexts/ToastContext.jsx';
import { GovernanceProvider } from '../governance/GovernanceContext.jsx';
import { SystemNoticeProvider } from '../governance/communication/SystemNoticeContext.jsx';

export default function AppProviders({ children }) {
  return (
    <UIConfigProvider>
      <SystemNoticeProvider>
        <GovernanceProvider>
          <BookingProvider>
            <NotificationProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </NotificationProvider>
          </BookingProvider>
        </GovernanceProvider>
      </SystemNoticeProvider>
    </UIConfigProvider>
  );
}