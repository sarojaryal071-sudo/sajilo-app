import { BookingProvider } from '../contexts/BookingContext.jsx';
import { NotificationProvider } from '../contexts/NotificationContext.jsx';
import { ToastProvider } from '../contexts/ToastContext.jsx';
import { GovernanceProvider } from '../governance/GovernanceContext.jsx';
import { SystemNoticeProviderV2 } from '../governance/SystemNoticeProvider.jsx';
import { UnifiedNotificationProvider } from '../governance/UnifiedNotificationProvider.jsx';

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <GovernanceProvider>
        <SystemNoticeProviderV2>
          <NotificationProvider>
            <UnifiedNotificationProvider>
              <BookingProvider>
                {children}
              </BookingProvider>
            </UnifiedNotificationProvider>
          </NotificationProvider>
        </SystemNoticeProviderV2>
      </GovernanceProvider>
    </ToastProvider>
  );
}