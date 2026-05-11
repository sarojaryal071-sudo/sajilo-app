// src/contexts/AdminAnalyticsContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import { useSocket } from '../hooks/useSocket.js';

const AdminAnalyticsContext = createContext();

export function AdminAnalyticsProvider({ children }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const refreshAnalytics = useCallback(async () => {
    try {
      const res = await api.getAdminAnalytics();
      if (res?.data) setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    const token = localStorage.getItem('sajilo_token');
    if (token) refreshAnalytics();
  }, [refreshAnalytics]);

  // Real‑time updates
  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => refreshAnalytics();

    socket.on('payment.updated', handleRefresh);
    socket.on('booking.updated', handleRefresh);
    socket.on('booking.cancelled', handleRefresh);
    socket.on('review.created', handleRefresh);

    return () => {
      socket.off('payment.updated', handleRefresh);
      socket.off('booking.updated', handleRefresh);
      socket.off('booking.cancelled', handleRefresh);
      socket.off('review.created', handleRefresh);
    };
  }, [socket, refreshAnalytics]);

  const value = { analytics, loading, refreshAnalytics };

  return (
    <AdminAnalyticsContext.Provider value={value}>
      {children}
    </AdminAnalyticsContext.Provider>
  );
}

export function useAdminAnalytics() {
  return useContext(AdminAnalyticsContext);
}