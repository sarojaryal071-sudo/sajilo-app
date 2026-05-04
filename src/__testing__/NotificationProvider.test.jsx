// __testing__/NotificationProvider.test.jsx
// Tests if NotificationProvider wraps correctly without crashing

import React from 'react'
import { NotificationProvider, useNotification } from '../contexts/NotificationContext.jsx'

// Test component that calls useNotification
function TestConsumer() {
  const { unreadCount } = useNotification()
  console.log('✅ NotificationContext WORKING — unreadCount:', unreadCount)
  return <div>Notification test passed. Unread: {unreadCount}</div>
}

// Wrapper that mimics what AppShell should do
export default function TestNotificationProvider() {
  return (
    <NotificationProvider>
      <TestConsumer />
    </NotificationProvider>
  )
}
