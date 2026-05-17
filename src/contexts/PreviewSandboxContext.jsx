import React from 'react';
import { WorkerContext } from './WorkerContext.jsx';
import { BookingContext } from './BookingContext.jsx';
import { NotificationContext } from './NotificationContext.jsx';
import { ToastContext } from './ToastContext.jsx';

const mockWorker = {
  profile: {
    name: 'Preview Worker',
    rating: 4.8,
    completed_jobs: 12,
    is_online: true,
  },
  earnings: {
    today_jobs: 2,
    today_earnings: 350,
    total_earnings: 12500,
    completed_jobs: 25,
  },
  bookings: [],
  loadAll: () => {},
  toggleOnline: () => {},
};

const mockBooking = {
  activeBooking: null,
  bookings: [],
};

const mockNotification = {
  notifications: [],
  unreadCount: 0,
};

const mockToast = {
  addToast: () => {},
};

export function PreviewProvider({ children }) {
  return (
    <WorkerContext.Provider value={mockWorker}>
      <BookingContext.Provider value={mockBooking}>
        <NotificationContext.Provider value={mockNotification}>
          <ToastContext.Provider value={mockToast}>
            {children}
          </ToastContext.Provider>
        </NotificationContext.Provider>
      </BookingContext.Provider>
    </WorkerContext.Provider>
  );
}