// SubscriptionManager — tracks panel subscriptions to prevent duplicates
// Each panel gets its own namespace — isolated from other panels

const panelSubscriptions = {}

// Subscribe a panel to an event — skips if already subscribed
export function subscribe(panelName, event, callback) {
  if (!panelSubscriptions[panelName]) {
    panelSubscriptions[panelName] = {}
  }
  if (!panelSubscriptions[panelName][event]) {
    panelSubscriptions[panelName][event] = callback
  }
  return panelSubscriptions[panelName][event]
}

// Unsubscribe a panel from an event
export function unsubscribe(panelName, event) {
  if (panelSubscriptions[panelName]) {
    delete panelSubscriptions[panelName][event]
  }
}

// Check if a panel is already subscribed to an event
export function isSubscribed(panelName, event) {
  return !!panelSubscriptions[panelName]?.[event]
}

// Unsubscribe all events for a panel — used on cleanup
export function cleanup(panelName) {
  delete panelSubscriptions[panelName]
}