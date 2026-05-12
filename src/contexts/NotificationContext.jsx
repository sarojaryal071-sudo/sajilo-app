// src/contexts/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import { useSocket } from '../hooks/useSocket.js';
import { SOCKET_EVENTS } from '../config/socketEvents.js';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  // ── Fetch notifications and unread count ──
  const fetchNotifications = useCallback(async () => {
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
      console.error('Failed to fetch notifications:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    if (token) fetchNotifications();
  }, [fetchNotifications]);

  // ── Real‑time socket listener ──
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (payload) => {
      // Prepend the notification and increment unread count
      setNotifications(prev => [payload, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION_CREATED, handleNewNotification);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_CREATED, handleNewNotification);
    };
  }, [socket]);

  // ── Mark one notification as read ──
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
    refresh: fetchNotifications,
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
// compatibility alias for older imports using singular
export const useNotification = useNotifications;