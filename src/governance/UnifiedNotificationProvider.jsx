import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext.jsx';
import conversationState from '../services/chat/ConversationStateManager.js';
import { fetchSystemNotices, dismissSystemNotice } from '../api/governanceApi.js';
import { SystemNoticeProviderV2 } from './SystemNoticeProvider.jsx';
import { useSystemNoticesSafe } from './useSystemNoticesSafe.js';

export const UnifiedNotificationContext = createContext(null);

const safeFallback = {
  notifications: [],
  systemNotices: [],
  unreadCount: 0,
  convUnread: 0,
  totalCount: 0,
  dismissNotice: () => {},
};

function InnerProvider({ children }) {
    const { notifications = [], unreadCount: legacyUnreadCount = 0 } = useNotification();
  const [convUnread, setConvUnread] = useState(() => conversationState.getUnreadCount());
  const [systemNotices, setSystemNotices] = useState([]);

  // Listen to conversation unread changes
  useEffect(() => {
    const unsub = conversationState.onChange(count => setConvUnread(count));
    return unsub;
  }, []);

  // Fetch system notices (mock for now)
  useEffect(() => {
    fetchSystemNotices()
      .then(data => setSystemNotices(data || []))
      .catch(() => setSystemNotices([]));
  }, []);

  const dismissNotice = useCallback(async (id) => {
    try {
      await dismissSystemNotice(id);
      setSystemNotices(prev => prev.filter(n => n.id !== id));
    } catch {
      console.warn('[G2] Failed to dismiss notice', id);
    }
  }, []);

  const unreadCount = legacyUnreadCount + convUnread;
  const totalCount = unreadCount + systemNotices.length;

    console.log('[G2 Provider] notifications:', notifications.length, 'convUnread:', convUnread, 'unreadCount:', unreadCount, 'systemNotices:', systemNotices.length, 'totalCount:', totalCount);

  const value = useMemo(() => ({
    userNotifications: notifications,
    systemNotices,
    unreadCount,
    convUnread,
    totalCount,
    dismissNotice,
  }), [notifications, systemNotices, unreadCount, convUnread, totalCount, dismissNotice]);

  return (
    <UnifiedNotificationContext.Provider value={value}>
      {children}
    </UnifiedNotificationContext.Provider>
  );
}

export function UnifiedNotificationProvider({ children }) {
  return (
    <SystemNoticeProviderV2>
      <InnerProvider>
        {children}
      </InnerProvider>
    </SystemNoticeProviderV2>
  );
}

export { safeFallback };