// sajilo-app/src/governance/UnifiedNotificationProvider.jsx
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

const DISMISSED_STORAGE_KEY = 'sajilo_dismissed_system_notices';
const CLEARED_NOTIFS_KEY = 'sajilo_cleared_notification_ids';

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function InnerProvider({ children }) {
  const {
    notifications = [],
    unreadCount: legacyUnreadCount = 0,
    markRead,
    markAllRead,
  } = useNotification();

  const [convUnread, setConvUnread] = useState(() => conversationState.getUnreadCount());
  const [systemNotices, setSystemNotices] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => loadFromStorage(DISMISSED_STORAGE_KEY));
  const [clearedNotificationIds, setClearedNotificationIds] = useState(() => loadFromStorage(CLEARED_NOTIFS_KEY));

  // ── Conversation unread listener ──
  useEffect(() => {
    const unsub = conversationState.onChange(count => setConvUnread(count));
    return unsub;
  }, []);

  // ── Fetch system notices, excluding dismissed ──
  useEffect(() => {
    const dismissed = loadFromStorage(DISMISSED_STORAGE_KEY);
    fetchSystemNotices()
      .then(data => {
        const filtered = (data || []).filter(n => !dismissed.includes(n.id));
        setSystemNotices(filtered);
      })
      .catch(() => setSystemNotices([]));
  }, []);

  // ── Dismiss a single notice ──
  const dismissNotice = useCallback(async (id) => {
    try {
      await dismissSystemNotice(id);
      setSystemNotices(prev => prev.filter(n => n.id !== id));
      setDismissedIds(prev => {
        const next = [...prev, id];
        localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch {
      console.warn('[G2] Failed to dismiss notice', id);
    }
  }, []);

  // ── Normalization helpers ──
  function getNotificationIcon(type) {
    switch (type) {
      case 'booking':    return '📅';
      case 'payment':    return '💰';
      case 'review':     return '⭐';
      case 'system':     return '🔔';
      case 'onboarding': return '👤';
      case 'admin':      return '🛡️';
      case 'moderation': return '⚠️';
      case 'governance': return '🏛️';
      default:           return '🔔';
    }
  }

  function normalizeNotification(n) {
    return {
      id: n.id,
      type: n.type || 'default',
      title: n.title || 'Notification',
      message: n.message || '',
      time: n.created_at || n.time || '',
      read: !!n.is_read,
      icon: getNotificationIcon(n.type),
      entityType: n.entity_type || null,
      entityId: n.entity_id || null,
      metadata: n.metadata || null,
    };
  }

  const unreadCount = legacyUnreadCount + convUnread;          // legacy combined (backward compat)
  const notificationUnreadCount = legacyUnreadCount;
  const unreadChatCount = convUnread;

  // Normalized list with cleared IDs filtered out
  const unifiedNotifications = useMemo(() => {
    const normalized = notifications.map(normalizeNotification);
    return normalized.filter(n => !clearedNotificationIds.includes(n.id));
  }, [notifications, clearedNotificationIds]);

  // ── Bulk actions ──
  const markAllAsRead = useCallback(async () => {
    if (notificationUnreadCount === 0) return;
    await markAllRead();
  }, [notificationUnreadCount, markAllRead]);

  const clearSystemNotices = useCallback(() => {
    if (systemNotices.length === 0) return;
    const allIds = systemNotices.map(n => n.id);
    setDismissedIds(prev => {
      const merged = [...new Set([...prev, ...allIds])];
      localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
    setSystemNotices([]);
  }, [systemNotices]);

  // Clears all user notifications from the list (marks read + adds to cleared set)
  const clearAllNotifications = useCallback(async () => {
    const allIds = unifiedNotifications.map(n => n.id);
    if (allIds.length === 0) return;

    // Mark all as read so badge goes to 0
    if (notificationUnreadCount > 0) {
      await markAllRead();
    }

    setClearedNotificationIds(prev => {
      const merged = [...new Set([...prev, ...allIds])];
      localStorage.setItem(CLEARED_NOTIFS_KEY, JSON.stringify(merged));
      return merged;
    });
  }, [unifiedNotifications, notificationUnreadCount, markAllRead]);

  const totalCount = unreadCount + systemNotices.length;

  console.log(
    '[G2 Provider] raw:', notifications.length,
    'normalized:', unifiedNotifications.length,
    'convUnread:', convUnread,
    'unread:', unreadCount,
    'notifUnread:', notificationUnreadCount,
    'chatUnread:', unreadChatCount,
    'notices:', systemNotices.length,
    'total:', totalCount
  );

  const value = useMemo(() => ({
    userNotifications: notifications,       // legacy raw
    unifiedNotifications,                  // normalized (filtered)
    systemNotices,
    unreadCount,                            // legacy combined
    notificationUnreadCount,
    unreadChatCount,
    convUnread,
    totalCount,
    dismissNotice,
    markAsRead: markRead,
    markAllAsRead,
    clearSystemNotices,
    clearAllNotifications,                 // new
  }), [
    notifications, unifiedNotifications, systemNotices,
    unreadCount, notificationUnreadCount, unreadChatCount, convUnread,
    totalCount, dismissNotice, markRead, markAllAsRead,
    clearSystemNotices, clearAllNotifications,
  ]);

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