import { useContext } from 'react';
import { UnifiedNotificationContext, safeFallback } from './UnifiedNotificationProvider.jsx';

export function useUnifiedNotifications() {
  const ctx = useContext(UnifiedNotificationContext);
  if (ctx === undefined || ctx === null) {
    console.warn('[G2] UnifiedNotificationProvider missing – using fallback');
    return safeFallback;
  }
  return ctx;
}