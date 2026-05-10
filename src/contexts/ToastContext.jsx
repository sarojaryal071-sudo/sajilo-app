// src/contexts/ToastContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket.js';
import { getCurrentUser } from '../config/auth.js';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const { socket } = useSocket();

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Important notification types that should appear as in‑app banners
  const bannerTypes = ['booking_accepted', 'invoice_ready', 'payment_paid', 'booking_cancelled'];

  useEffect(() => {
    if (!socket) return;

    const user = getCurrentUser();

    // ── Notification banners ──
    const handleNotif = (payload) => {
      if (!bannerTypes.includes(payload.type)) return;
      let path = null;
      let title = '';
      if (payload.type === 'booking_accepted') {
        title = 'Worker accepted your booking';
        path = user?.role === 'customer' ? '/bookings' : null;
      } else if (payload.type === 'invoice_ready') {
        title = 'Invoice ready';
        path = user?.role === 'customer' ? '/bookings' : '/worker/earnings';
      } else if (payload.type === 'payment_paid') {
        title = 'Payment confirmed';
        path = user?.role === 'customer' ? '/bookings' : '/worker/earnings';
      } else if (payload.type === 'booking_cancelled') {
        title = 'Booking cancelled';
        path = user?.role === 'customer' ? '/bookings' : '/worker/earnings';
      }
      addToast({
        title,
        message: payload.message || '',
        navigatePath: path,
        duration: 5000,
      });
    };

    // ── New message banner ──
    const handleMessage = (msg) => {
      addToast({
        title: msg.sender_name || 'New message',
        message: (msg.text || '').slice(0, 80),
        navigatePath: `/inbox?bookingId=${msg.booking_id || ''}`,
        duration: 5000,
      });
    };

    socket.on('notification.created', handleNotif);
    socket.on('new_message', handleMessage);

    return () => {
      socket.off('notification.created', handleNotif);
      socket.off('new_message', handleMessage);
    };
  }, [socket, addToast]);

  const value = { toasts, addToast, dismissToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}