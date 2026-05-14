import { lazy } from 'react';

export const screenRegistry = {
  worker: {
    screens: [
      { key: 'Dashboard', label: 'Dashboard', icon: '📊', component: lazy(() => import('../screens/worker/WorkerDashboard.jsx')) },
      { key: 'Jobs',      label: 'Jobs',      icon: '📋', component: lazy(() => import('../screens/worker/WorkerJobs.jsx')) },
      { key: 'Earnings',  label: 'Earnings',  icon: '💰', component: lazy(() => import('../screens/worker/WorkerEarnings.jsx')) },
      { key: 'Schedule',  label: 'Schedule',  icon: '📅', component: lazy(() => import('../screens/worker/WorkerSchedule.jsx')) },
      { key: 'Profile',   label: 'Profile',   icon: '👤', component: lazy(() => import('../screens/worker/WorkerProfile.jsx')) },
    ],
  },
  client: {
    screens: [
      { key: 'Feed',      label: 'Feed',      icon: '🏠', component: lazy(() => import('../screens/HomeScreen.jsx')) },
      { key: 'Search',    label: 'Search',    icon: '🔍', component: lazy(() => import('../screens/SearchScreen.jsx')) },
      { key: 'Bookings',  label: 'Bookings',  icon: '📋', component: lazy(() => import('../screens/BookingsScreen.jsx')) },
      { key: 'Tracking',  label: 'Tracking',  icon: '📍', component: lazy(() => import('../components/TrackingWrapper.jsx')) },
      { key: 'Pro',       label: 'Pro',       icon: '⭐', component: lazy(() => import('../screens/ProScreen.jsx')) },
      { key: 'Profile',   label: 'Profile',   icon: '👤', component: lazy(() => import('../screens/ProfileScreen.jsx')) },
    ],
  },
  auth: {
    screens: [
      { key: 'Login',     label: 'Login',     icon: '🔐', component: lazy(() => import('../screens/LoginScreen.jsx')) },
      { key: 'Signup',    label: 'Signup',    icon: '📝', component: lazy(() => import('../screens/SignupScreen.jsx')) },
    ],
  },
  chat: {
    screens: [
      { key: 'Inbox',     label: 'Inbox',     icon: '💬', component: lazy(() => import('../screens/InboxScreen.jsx')) },
    ],
  },
};

export function getScreensForPanel(panel) {
  return screenRegistry[panel]?.screens || [];
}

export function getScreenComponent(panel, screenKey) {
  const screens = screenRegistry[panel]?.screens || [];
  return screens.find(s => s.key === screenKey)?.component || null;
}