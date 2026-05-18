// src/contexts/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api.js';
import { useSocket } from '../hooks/useSocket.js';
import { SOCKET_EVENTS } from '../config/socketEvents.js';

const NotificationContext = createContext();

const POLL_INTERVAL_MS = 60_000; // 60 seconds fallback

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { socket, connected } = useSocket();

  const refreshInProgress = useRef(false);

  const notificationsRef = useRef([]);

  // ── Centralized refresh ──
  const refreshNotifications = useCallback(async () => {
    if (refreshInProgress.current) return;
    refreshInProgress.current = true;
    try {
      const [notifRes, countRes] = await Promise.allSettled([
        api.getNotifications?.(),
        api.getUnreadCount?.(),
      ]);
      if (notifRes.status === 'fulfilled') {
        setNotifications(notifRes.value.notifications || []);
      }
      if (countRes.status === 'fulfilled') {
        setUnreadCount(countRes.value.count ?? 0);
      }
    } catch (err) {
      console.error('Failed to refresh notifications:', err);
    } finally {
      refreshInProgress.current = false;
      setLoading(false);
    }
  }, []);

  // ── Initial fetch on mount ──
  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    if (token) refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
  notificationsRef.current = notifications;
}, [notifications]);


  // ── Reconnect recovery ──
  useEffect(() => {
  if (!connected) return;

  // immediate sync on reconnect
  refreshNotifications();

  // safety sync after socket stabilizes
  const timeout = setTimeout(() => {
    refreshNotifications();
  }, 1500);

  return () => clearTimeout(timeout);
}, [connected, refreshNotifications]);

  // ── Lightweight fallback polling ──
  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    if (!token) return;

    let intervalId;
    let hidden = false;

    const handleVisibility = () => {
      hidden = document.visibilityState === 'hidden';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const startPolling = () => {
      intervalId = setInterval(() => {
        if (!hidden && localStorage.getItem('sajilo_token')) {
          refreshNotifications();
        }
      }, POLL_INTERVAL_MS);
    };

    startPolling();

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshNotifications]);

  // ── Real‑time socket listener ──
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (payload) => {
  if (!payload?.id) return;

  setNotifications(prev => {
    // prevent duplicates
    const exists = prev.some(n => n.id === payload.id);
    if (exists) return prev;

    return [payload, ...prev];
  });

  setUnreadCount(prev => {
    // safer increment only if NOT duplicate
    const exists = notificationsRef.current?.some?.(n => n.id === payload.id);
    if (exists) return prev;
    return prev + 1;
  });
};

    socket.on(SOCKET_EVENTS.NOTIFICATION_CREATED, handleNewNotification);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_CREATED, handleNewNotification);
    };
  }, [socket]);

  // ── Mark one as read ──
  const markRead = async (id) => {
    try {
      await api.markNotificationRead?.(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  // ── Mark all as read ──
  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead?.();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    refresh: refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

// compatibility alias for older imports
export const useNotification = useNotifications;

export { NotificationContext };